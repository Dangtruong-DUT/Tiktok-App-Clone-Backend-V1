import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterRequestBody } from '~/models/requests/user.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import { StringValue } from 'ms'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import { ObjectId } from 'mongodb'
import { USER_MESSAGES } from '~/constants/messages'

class UserService {
    private signAccessToken(userId: string) {
        return signToken({
            payload: {
                user_id: userId,
                token_type: TokenType.AccessToken
            },
            options: {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN as StringValue
            }
        })
    }
    private signRefreshToken(userId: string) {
        return signToken({
            payload: {
                user_id: userId,
                token_type: TokenType.RefreshToken
            },
            options: {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN as StringValue
            }
        })
    }
    private signAccessAndRefreshToken(userId: string) {
        return Promise.all([this.signAccessToken(userId), this.signRefreshToken(userId)])
    }

    private signEmailVerifyToken(userId: string) {
        return signToken({
            payload: {
                user_id: userId,
                token_type: TokenType.EmailVerifyToken
            },
            privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
            options: {
                expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRE_IN as StringValue
            }
        })
    }
    async register(payload: RegisterRequestBody) {
        const result = await databaseService.users.insertOne(
            new User({
                ...payload,
                date_of_birth: new Date(payload.date_of_birth),
                password: hashPassword(payload.password)
            })
        )
        const user_id = result.insertedId.toString()
        const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(user_id)
        await databaseService.refreshToken.insertOne(
            new RefreshToken({ user_id: new ObjectId(user_id), token: refreshToken })
        )
        return {
            accessToken,
            refreshToken
        }
    }

    async login(user_id: string) {
        const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(user_id)
        await databaseService.refreshToken.insertOne(
            new RefreshToken({ user_id: new ObjectId(user_id), token: refreshToken })
        )
        return {
            accessToken,
            refreshToken
        }
    }
    async logout(refresh_token: string) {
        const deleteResult = await databaseService.refreshToken.deleteOne({ token: refresh_token })
        return deleteResult.deletedCount > 0
    }
    async verifyEmail(user_id: string) {
        const [token] = await Promise.all([
            this.signAccessAndRefreshToken(user_id),
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
        return {
            access_token,
            refresh_token
        }
    }
    async resendVerifyEmail(user_id: string) {
        const email_verify_token = await this.signEmailVerifyToken(user_id)
        await databaseService.users.updateOne(
            { _id: new ObjectId(user_id) },
            {
                $set: {
                    email_verify_token: email_verify_token
                },
                $currentDate: {
                    updated_at: true
                }
            }
        )
        return {
            message: USER_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS
        }
    }

    async checkEmailExist(email: string) {
        const user = await databaseService.users.findOne({ email })
        return !!user
    }
}

export default new UserService()
