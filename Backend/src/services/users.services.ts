import databaseService from './database.services'
import { RegisterRequestBody, UpdateUserRequestBody } from '~/models/requests/user.requests'
import { hashPassword } from '~/utils/crypto'
import { UserVerifyStatus } from '~/constants/enum'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/User.schema'
import generateTimeBasedUsername from '~/utils/GenerateUserName'
import { signAccessAndRefreshToken, signEmailVerifyToken, signForgotPasswordToken } from '~/helpers/signToken'

class UserService {
    private get safeUserProjection() {
        return {
            password: 0,
            email_verify_token: 0,
            forgot_password_token: 0
        }
    }

    async register(payload: RegisterRequestBody) {
        const user_id = new ObjectId()
        const username = generateTimeBasedUsername()
        const email_verify_token = await signEmailVerifyToken(user_id.toString())

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

        const user = await databaseService.users.findOne({ _id: user_id }, { projection: this.safeUserProjection })

        const [access_token, refresh_token] = await signAccessAndRefreshToken({
            verify: UserVerifyStatus.Unverified,
            userId: user_id.toString()
        })

        await databaseService.refreshToken.insertOne(new RefreshToken({ user_id: user_id, token: refresh_token }))

        if (!user) {
            return { access_token: null, refresh_token: null, user: null }
        }

        return {
            access_token,
            refresh_token,
            user: { ...user, followers_count: 0 }
        }
    }

    async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
        const [[access_token, refresh_token], user] = await Promise.all([
            signAccessAndRefreshToken({ userId: user_id, verify }),
            databaseService.users.findOne({ _id: new ObjectId(user_id) }, { projection: this.safeUserProjection })
        ])

        if (!user) {
            return { access_token: null, refresh_token: null, user: null }
        }

        await databaseService.refreshToken.insertOne(
            new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
        )

        const followers_count = await databaseService.followers.countDocuments({
            followed_user_id: user._id
        })

        return {
            access_token,
            refresh_token,
            user: { ...user, followers_count }
        }
    }

    async logout(refresh_token: string) {
        const result = await databaseService.refreshToken.deleteOne({ token: refresh_token })
        return result.deletedCount > 0
    }

    async logoutAllDevices(user_id: string) {
        const result = await databaseService.refreshToken.deleteMany({
            user_id: new ObjectId(user_id)
        })
        return result.deletedCount > 0
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
        const [access_token, new_refresh_token] = await signAccessAndRefreshToken({
            userId: user_id,
            verify
        })

        await Promise.all([
            databaseService.refreshToken.deleteOne({ token: refresh_token }),
            databaseService.refreshToken.insertOne(
                new RefreshToken({ user_id: new ObjectId(user_id), token: new_refresh_token })
            )
        ])

        return { access_token, refresh_token: new_refresh_token }
    }

    async verifyEmail(user_id: string) {
        const [tokens] = await Promise.all([
            signAccessAndRefreshToken({
                userId: user_id,
                verify: UserVerifyStatus.Verified
            }),
            databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
                {
                    $set: {
                        email_verify_token: '',
                        verify: UserVerifyStatus.Verified,
                        updated_at: '$$NOW'
                    }
                }
            ])
        ])

        const [access_token, refresh_token] = tokens

        await databaseService.refreshToken.deleteMany({
            user_id: new ObjectId(user_id)
        })
        await databaseService.refreshToken.insertOne(
            new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
        )

        return { access_token, refresh_token }
    }

    async resendVerifyEmail(user_id: string) {
        const email_verify_token = await signEmailVerifyToken(user_id)

        await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
            {
                $set: {
                    email_verify_token,
                    updated_at: '$$NOW'
                }
            }
        ])
    }

    async forgotPassword(user_id: string) {
        const forgot_password_token = await signForgotPasswordToken(user_id)

        await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, [
            {
                $set: {
                    forgot_password_token,
                    updated_at: '$$NOW'
                }
            }
        ])
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
            { projection: this.safeUserProjection }
        )

        if (!user) return null

        const followers_count = await databaseService.followers.countDocuments({
            followed_user_id: user._id
        })

        return { ...user, followers_count }
    }

    async getUserByUserName(username: string, viewerId?: string) {
        const user = await databaseService.users.findOne({ username }, { projection: this.safeUserProjection })

        if (!user) return null

        const isOwner = viewerId === user._id.toString()

        const [followers_count, follower] = await Promise.all([
            databaseService.followers.countDocuments({ followed_user_id: user._id }),
            !viewerId || isOwner
                ? Promise.resolve(null)
                : databaseService.followers.findOne({
                      user_id: new ObjectId(viewerId),
                      followed_user_id: user._id
                  })
        ])

        return { ...user, followers_count, is_following: !!follower }
    }

    async updateUserById(user_id: string, payload: UpdateUserRequestBody) {
        const _payload = payload.date_of_birth
            ? { ...payload, date_of_birth: new Date(payload.date_of_birth) }
            : payload

        const result = await databaseService.users.findOneAndUpdate(
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
                projection: this.safeUserProjection,
                returnDocument: 'after'
            }
        )

        return result
    }

    async followUser(user_id: string, followed_user_id: string) {
        await databaseService.followers.updateOne(
            {
                user_id: new ObjectId(user_id),
                followed_user_id: new ObjectId(followed_user_id)
            },
            {
                $set: {
                    user_id: new ObjectId(user_id),
                    followed_user_id: new ObjectId(followed_user_id)
                }
            },
            { upsert: true }
        )
    }

    async unfollowUser(user_id: string, followed_user_id: string) {
        await databaseService.followers.deleteOne({
            user_id: new ObjectId(user_id),
            followed_user_id: new ObjectId(followed_user_id)
        })
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
    }

    async checkEmailExist(email: string) {
        const user = await databaseService.users.findOne({ email })
        return !!user
    }
}

export default new UserService()
