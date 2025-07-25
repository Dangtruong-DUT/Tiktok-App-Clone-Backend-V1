import { UpdateUserRequestBody } from '~/models/requests/user.requests'
import { hashPassword } from '~/utils/crypto'
import { UserVerifyStatus } from '~/constants/enum'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import { ObjectId } from 'mongodb'
import User from '~/models/schemas/User.schema'
import generateTimeBasedUsername from '~/utils/GenerateUserName'
import { signAccessAndRefreshToken, signEmailVerifyToken, signForgotPasswordToken } from '~/helpers/signToken'
import { getOauthGoogleToken, getOauthGoogleUserInfo } from '~/helpers/oauth'
import { RegisterRequestBody } from '~/models/requests/auth.requests'
import Follower from '~/models/schemas/Follower.schemas'
import usersRepository from '~/repositories/users.repository'

class UserService {
    async register(payload: RegisterRequestBody) {
        const user_id = new ObjectId()
        const username = generateTimeBasedUsername()
        const email_verify_token = await signEmailVerifyToken(user_id.toString())

        await usersRepository.insertUser(
            new User({
                ...payload,
                _id: user_id,
                email_verify_token,
                date_of_birth: new Date(payload.date_of_birth),
                password: hashPassword(payload.password),
                username
            })
        )

        const user = await usersRepository.findUserById(user_id.toString())

        const [access_token, refresh_token] = await signAccessAndRefreshToken({
            verify: UserVerifyStatus.UNVERIFIED,
            userId: user_id.toString()
        })

        await usersRepository.insertRefreshToken(new RefreshToken({ user_id: user_id, token: refresh_token }))

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
        const [access_token, refresh_token] = await signAccessAndRefreshToken({ userId: user_id, verify })
        const user = await usersRepository.findUserById(user_id)

        if (!user) {
            return { access_token: null, refresh_token: null, user: null }
        }

        await usersRepository.insertRefreshToken(
            new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
        )

        const followers_count = await usersRepository.countFollowers(user_id)

        return {
            access_token,
            refresh_token,
            user: { ...user, followers_count }
        }
    }

    async oauthGoogle(code: string) {
        const { id_token, access_token } = await getOauthGoogleToken(code)
        const userInfo = await getOauthGoogleUserInfo({ id_token, access_token })
        const user = await usersRepository.findUserByEmail(userInfo.email)

        if (user) {
            const [access_token, refresh_token] = await signAccessAndRefreshToken({
                userId: user._id.toString(),
                verify: user.verify
            })
            const followers_count = await usersRepository.countFollowers(user._id.toString())

            await usersRepository.insertRefreshToken(new RefreshToken({ user_id: user._id, token: refresh_token }))

            return {
                access_token,
                refresh_token,
                user: { ...user, followers_count }
            }
        } else {
            const user_id = new ObjectId()
            const username = generateTimeBasedUsername()

            await usersRepository.insertUser(
                new User({
                    _id: user_id,
                    name: userInfo.name,
                    email: userInfo.email,
                    date_of_birth: new Date(),
                    password: '',
                    created_at: new Date(),
                    updated_at: new Date(),
                    email_verify_token: '',
                    forgot_password_token: '',
                    verify: UserVerifyStatus.VERIFIED,
                    bio: '',
                    location: '',
                    website: '',
                    username,
                    avatar: userInfo.picture,
                    cover_photo: ''
                })
            )

            const [access_token, refresh_token] = await signAccessAndRefreshToken({
                userId: user_id.toString(),
                verify: UserVerifyStatus.VERIFIED
            })

            await usersRepository.insertRefreshToken(new RefreshToken({ user_id: user_id, token: refresh_token }))

            const newUser = await usersRepository.findUserById(user_id.toString())

            return {
                access_token,
                refresh_token,
                user: { ...newUser, followers_count: 0 }
            }
        }
    }

    async logout(refresh_token: string) {
        const result = await usersRepository.deleteRefreshToken(refresh_token)
        return result.deletedCount > 0
    }

    async logoutAllDevices(user_id: string) {
        const result = await usersRepository.deleteAllRefreshTokensByUser(user_id)
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
            usersRepository.deleteRefreshToken(refresh_token),
            usersRepository.insertRefreshToken(
                new RefreshToken({ user_id: new ObjectId(user_id), token: new_refresh_token })
            )
        ])

        return { access_token, refresh_token: new_refresh_token }
    }

    async verifyEmail(user_id: string) {
        const [tokens] = await Promise.all([
            signAccessAndRefreshToken({
                userId: user_id,
                verify: UserVerifyStatus.VERIFIED
            }),
            usersRepository.updateUser(user_id, [
                {
                    $set: {
                        email_verify_token: '',
                        verify: UserVerifyStatus.VERIFIED,
                        updated_at: '$$NOW'
                    }
                }
            ])
        ])

        const [access_token, refresh_token] = tokens

        await usersRepository.deleteAllRefreshTokensByUser(user_id)
        await usersRepository.insertRefreshToken(
            new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
        )

        return { access_token, refresh_token }
    }

    async resendVerifyEmail(user_id: string) {
        const email_verify_token = await signEmailVerifyToken(user_id)

        await usersRepository.updateUser(user_id, [
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

        await usersRepository.updateUser(user_id, [
            {
                $set: {
                    forgot_password_token,
                    updated_at: '$$NOW'
                }
            }
        ])
    }

    async resetPassword(user_id: string, password: string) {
        await usersRepository.updateUser(user_id, [
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
        return await usersRepository.findUserWithFollowersCount(user_id)
    }

    async getUserByUserName(username: string, viewerId?: string) {
        const user = await usersRepository.findUserByUsernameWithFollowersCount(username)

        if (!user) {
            return null
        }

        const isOwner = viewerId === user._id.toString()

        // Add additional user info like following status, etc.
        return {
            ...user,
            isOwner
        }
    }

    async updateUserById(user_id: string, payload: UpdateUserRequestBody) {
        const result = await usersRepository.updateUser(user_id, {
            $set: {
                ...payload,
                updated_at: new Date()
            }
        })

        if (result.modifiedCount === 0) {
            return null
        }

        return await usersRepository.findUserWithFollowersCount(user_id)
    }

    async followUser({ user_id, followed_user_id }: { user_id: string; followed_user_id: string }) {
        return await usersRepository.createFollower(
            new Follower({
                user_id: new ObjectId(user_id),
                followed_user_id: new ObjectId(followed_user_id)
            })
        )
    }

    async unfollowUser(user_id: string, followed_user_id: string) {
        return await usersRepository.deleteFollower(user_id, followed_user_id)
    }

    async changePassword(user_id: string, password: string) {
        return await usersRepository.updateUser(user_id, {
            $set: {
                password: hashPassword(password),
                updated_at: new Date()
            }
        })
    }

    async checkEmailExist(email: string) {
        return await usersRepository.checkEmailExists(email)
    }

    async checkFriendshipStatus({ user_id, target_user_id }: { user_id: string; target_user_id: string }) {
        return await usersRepository.checkFriendshipStatus(user_id, target_user_id)
    }

    async searchUsers(query: string, page = 0, limit = 10) {
        return await usersRepository.searchUsers(query, page, limit)
    }

    async getUserFollowers(user_id: string, page = 0, limit = 10) {
        return await usersRepository.getUserFollowers(user_id, page, limit)
    }

    async getUserFollowing(user_id: string, page = 0, limit = 10) {
        return await usersRepository.getUserFollowing(user_id, page, limit)
    }
}

export default new UserService()
