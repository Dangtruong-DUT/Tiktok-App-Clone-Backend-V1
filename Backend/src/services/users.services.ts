import databaseService from './database.services'
import { RegisterRequestBody, UpdateUserRequestBody } from '~/models/requests/user.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import { StringValue } from 'ms'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/User.schema'
import generateTimeBasedUsername from '~/utils/GenerateUserName'
import Follower from '~/models/schemas/Follower.schemas'
import { USER_MESSAGES } from '~/constants/messages/user'
import { envConfig } from '~/config'
import _ from 'lodash'

class UserService {
    private signAccessToken({ verify, userId }: { userId: string; verify: UserVerifyStatus }) {
        return signToken({
            payload: {
                user_id: userId,
                token_type: TokenType.AccessToken,
                verify
            },
            privateKey: envConfig.JWT_SECRET_ACCESS_TOKEN as string,
            options: {
                expiresIn: envConfig.ACCESS_TOKEN_EXPIRE_IN as StringValue
            }
        })
    }
    private signRefreshToken({ verify, userId }: { userId: string; verify: UserVerifyStatus }) {
        return signToken({
            payload: {
                user_id: userId,
                token_type: TokenType.RefreshToken,
                verify
            },
            privateKey: envConfig.JWT_SECRET_REFRESH_TOKEN as string,
            options: {
                expiresIn: envConfig.REFRESH_TOKEN_EXPIRE_IN as StringValue
            }
        })
    }
    private signAccessAndRefreshToken({ verify, userId }: { userId: string; verify: UserVerifyStatus }) {
        return Promise.all([this.signAccessToken({ verify, userId }), this.signRefreshToken({ verify, userId })])
    }

    private signEmailVerifyToken(userId: string) {
        return signToken({
            payload: {
                user_id: userId,
                token_type: TokenType.EmailVerifyToken
            },
            privateKey: envConfig.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
            options: {
                expiresIn: envConfig.EMAIL_VERIFY_TOKEN_EXPIRE_IN as StringValue
            }
        })
    }

    private signForgotPasswordToken(userId: string) {
        return signToken({
            payload: {
                user_id: userId,
                token_type: TokenType.ForgotPasswordToken
            },
            privateKey: envConfig.JWT_SECRET_FORGOT_PASSWORD as string,
            options: {
                expiresIn: envConfig.FORGOT_PASSWORD_TOKEN_EXPIRE_IN as StringValue
            }
        })
    }

    async register(payload: RegisterRequestBody) {
        const user_id = new ObjectId()
        const username = generateTimeBasedUsername()
        const email_verify_token = await this.signEmailVerifyToken(user_id.toString())
        await databaseService.users.insertOne(
            new User({
                ...payload,
                _id: user_id,
                email_verify_token,
                date_of_birth: new Date(payload.date_of_birth),
                password: hashPassword(payload.password),
                username
            })
        )
        const user = await databaseService.users.findOne(
            { _id: user_id },
            {
                projection: {
                    password: 0,
                    email_verify_token: 0,
                    forgot_password_token: 0
                }
            }
        )

        const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
            verify: UserVerifyStatus.Unverified,
            userId: user_id.toString()
        })
        await databaseService.refreshToken.insertOne(
            new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
        )

        // sent email width email_verify_token to user
        return {
            access_token,
            refresh_token,
            user
        }
    }

    async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
        const [[access_token, refresh_token], user] = await Promise.all([
            this.signAccessAndRefreshToken({ userId: user_id, verify }),
            databaseService.users.findOne(
                { _id: new ObjectId(user_id) },
                {
                    projection: {
                        password: 0,
                        email_verify_token: 0,
                        forgot_password_token: 0
                    }
                }
            )
        ])

        await databaseService.refreshToken.insertOne(
            new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
        )
        return {
            access_token,
            refresh_token,
            user
        }
    }

    async logout(refresh_token: string): Promise<boolean> {
        const deleteResult = await databaseService.refreshToken.deleteOne({ token: refresh_token })
        return deleteResult.deletedCount > 0
    }

    async refreshToken({
        refresh_token,
        user_id,
        verify
    }: {
        refresh_token: string
        user_id: string
        verify: UserVerifyStatus
    }) {
        const [access_token, new_refresh_token] = await this.signAccessAndRefreshToken({
            userId: user_id,
            verify
        })

        await Promise.all([
            databaseService.refreshToken.deleteOne({ token: refresh_token }),
            databaseService.refreshToken.insertOne(
                new RefreshToken({ user_id: new ObjectId(user_id), token: new_refresh_token })
            )
        ])

        return {
            access_token,
            refresh_token: new_refresh_token
        }
    }
    async logoutAllDevices(user_id: string): Promise<boolean> {
        const deleteResult = await databaseService.refreshToken.deleteMany({ user_id: new ObjectId(user_id) })
        return deleteResult.deletedCount > 0
    }
    async verifyEmail(user_id: string) {
        const [token] = await Promise.all([
            this.signAccessAndRefreshToken({ userId: user_id, verify: UserVerifyStatus.Verified }),
            databaseService.users.updateOne(
                {
                    _id: new ObjectId(user_id)
                },
                [
                    {
                        $set: {
                            email_verify_token: '',
                            verify: UserVerifyStatus.Verified,
                            updated_at: '$$NOW'
                        }
                    }
                ]
            )
        ])
        const [access_token, refresh_token] = token
        await databaseService.refreshToken.deleteMany({
            user_id: new ObjectId(user_id)
        })
        await databaseService.refreshToken.insertOne(
            new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
        )
        return {
            access_token,
            refresh_token
        }
    }
    async resendVerifyEmail(user_id: string) {
        const email_verify_token = await this.signEmailVerifyToken(user_id)
        //sent email with link to the user: https://taplamIT.tech/verify-email?token=token
        await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
            {
                $set: {
                    email_verify_token: email_verify_token,
                    updated_at: '$$NOW'
                }
            }
        ])
    }

    async forgotPassword(user_id: string) {
        const forgot_password_token = await this.signForgotPasswordToken(user_id)
        await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
            {
                $set: {
                    forgot_password_token: forgot_password_token,
                    updated_at: '$$NOW'
                }
            }
        ])
        //sent email with link to the user: https://taplamIT.tech/forgot-password?token=token use amazon sms
    }
    async resetPassword(user_id: string, password: string) {
        await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
            {
                $set: {
                    password: hashPassword(password),
                    forgot_password_token: '',
                    updated_at: '$$NOW'
                }
            }
        ])
    }

    async getUserById(user_id: string) {
        const user = await databaseService.users.findOne(
            { _id: new ObjectId(user_id) },
            {
                projection: {
                    password: 0,
                    email_verify_token: 0,
                    forgot_password_token: 0
                }
            }
        )
        return user
    }
    async getUserByUserName(username: string) {
        const user = await databaseService.users.findOne(
            { username },
            {
                projection: {
                    password: 0,
                    email_verify_token: 0,
                    forgot_password_token: 0
                }
            }
        )
        return user
    }
    async updateUserById(user_id: string, payload: UpdateUserRequestBody) {
        const _payload = payload.date_of_birth
            ? {
                  ...payload,
                  date_of_birth: new Date(payload.date_of_birth)
              }
            : payload
        const updateResult = await databaseService.users.findOneAndUpdate(
            { _id: new ObjectId(user_id) },
            [
                {
                    $set: {
                        ..._payload,
                        updated_at: '$$NOW'
                    }
                }
            ],
            {
                projection: {
                    password: 0,
                    email_verify_token: 0,
                    forgot_password_token: 0
                },
                returnDocument: 'after'
            }
        )
        return updateResult
    }
    async followUser(user_id: string, followed_user_id: string) {
        const followerCount = await databaseService.followers.countDocuments({
            user_id: new ObjectId(user_id),
            followed_user_id: new ObjectId(followed_user_id)
        })
        if (followerCount > 0) {
            return {
                message: USER_MESSAGES.FOLLOW_USER_ALREADY_FOLLOWED
            }
        }
        const result = await databaseService.followers.insertOne(
            new Follower({
                user_id: new ObjectId(user_id),
                followed_user_id: new ObjectId(followed_user_id)
            })
        )
        return {
            message: USER_MESSAGES.FOLLOW_USER_SUCCESS
        }
    }

    async unfollowUser(user_id: string, followed_user_id: string) {
        await databaseService.followers.deleteOne({
            user_id: new ObjectId(user_id),
            followed_user_id: new ObjectId(followed_user_id)
        })
        return {
            message: USER_MESSAGES.UNFOLLOW_USER_SUCCESS
        }
    }
    async changePassword(user_id: string, password: string) {
        await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
            {
                $set: {
                    password: hashPassword(password),
                    updated_at: '$$NOW'
                }
            }
        ])
        return {
            message: USER_MESSAGES.CHANGE_PASSWORD_SUCCESS
        }
    }
    async checkEmailExist(email: string) {
        const user = await databaseService.users.findOne({ email })
        return !!user
    }
}

export default new UserService()
