import { UpdateUserRequestBody } from '~/models/requests/user.requests'
import { hashPassword } from '~/utils/crypto'
import { Role, UserVerifyStatus } from '~/constants/enum'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import { ObjectId } from 'mongodb'
import { signAccessAndRefreshToken, signEmailVerifyToken, signForgotPasswordToken } from '~/helpers/signToken'
import Follower from '~/models/schemas/Follower.schemas'
import usersRepository from '~/repositories/users.repository'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages/user'
import { envConfig } from '~/config/envConfig'
import sesEmailService from '~/services/aws/ses.email.service'
import { AddNewEmployeeReqBody } from '~/models/requests/account.request'
import User from '~/models/schemas/User.schema'
import { UserType } from '~/models/types/User.types'
import { UserProfileResponse, SearchUserResponse, FollowListResponse } from '~/models/responses/user.responses'
import { UserResponseTransformer } from '~/utils/transformers/user.transformer'

class UserService {
    private static instance: UserService
    private constructor() {}
    static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService()
        }
        return UserService.instance
    }

    async verifyEmail(user_id: string) {
        const [tokens] = await Promise.all([
            signAccessAndRefreshToken({
                userId: user_id,
                verify: UserVerifyStatus.VERIFIED,
                role: Role.USER
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
        const [user, email_verify_token] = await Promise.all([
            usersRepository.findUserById(user_id),
            signEmailVerifyToken(user_id, Role.USER)
        ])
        await sesEmailService.sendVerifyEmail({
            toAddress: user.email,
            link: `${envConfig.FRONTEND_URL}/verify-email?token=${email_verify_token}`
        })

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
        const [forgot_password_token, user] = await Promise.all([
            signForgotPasswordToken(user_id, Role.USER),
            usersRepository.findUserById(user_id)
        ])
        await Promise.all([
            sesEmailService.sendForgotPasswordEmail({
                toAddress: user.email,
                link: `${envConfig.FRONTEND_URL}/reset-password?token=${forgot_password_token}`
            }),
            usersRepository.updateUser(user_id, [
                {
                    $set: {
                        forgot_password_token,
                        updated_at: '$$NOW'
                    }
                }
            ])
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

    async getUserById(user_id: string, viewer_id?: string): Promise<UserProfileResponse> {
        const user = await usersRepository.findUserById(user_id, viewer_id)
        if (!user) {
            throw new ErrorWithStatus({
                message: USER_MESSAGES.USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
            })
        }

        const isOwner = viewer_id === user._id?.toString()
        const userWithOwnership: UserType = {
            ...user,
            isOwner
        }

        return UserResponseTransformer.toUserProfile(userWithOwnership)
    }

    async getUserByEmail(email: string, viewer_id?: string) {
        const user = await usersRepository.findUserByEmail(email, viewer_id)
        if (!user) {
            throw new ErrorWithStatus({
                message: USER_MESSAGES.USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
            })
        }
        return user
    }

    async getUserObjectByEmail(email: string) {
        return await usersRepository.findUserObjectByEmail(email)
    }

    async getUserByForgotPasswordToken(token: string) {
        return await usersRepository.findUserByForgotPasswordToken(token)
    }

    async getUserByEmailVerifyToken(token: string) {
        return await usersRepository.findUserByEmailVerifyToken(token)
    }

    async getUserByUserName(username: string, viewerId?: string): Promise<UserProfileResponse> {
        const user = await usersRepository.findUserByUsername(username, viewerId)

        if (!user) {
            throw new ErrorWithStatus({
                message: USER_MESSAGES.USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
            })
        }

        const isOwner = viewerId === user._id?.toString()
        const userWithOwnership: UserType = {
            ...user,
            isOwner
        }

        return UserResponseTransformer.toUserProfile(userWithOwnership)
    }

    async updateUserById(user_id: string, payload: UpdateUserRequestBody): Promise<UserProfileResponse> {
        const result = await usersRepository.updateUser(user_id, {
            $set: {
                ...payload,
                updated_at: '$$NOW'
            }
        })

        if (result.modifiedCount === 0) {
            throw new ErrorWithStatus({
                message: USER_MESSAGES.USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
            })
        }
        const user = await usersRepository.getUserProfileWithDetails({ target_user_id: user_id })
        if (!user) {
            throw new ErrorWithStatus({
                message: USER_MESSAGES.USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
            })
        }
        const userWithOwnership: UserType = {
            ...user,
            isOwner: true
        }

        return UserResponseTransformer.toMyProfile(userWithOwnership)
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
                updated_at: '$$NOW'
            }
        })
    }

    async checkEmailExist(email: string) {
        return await usersRepository.checkEmailExists(email)
    }

    async checkFriendshipStatus({ user_id, target_user_id }: { user_id: string; target_user_id: string }) {
        return await usersRepository.checkFriendshipStatus(user_id, target_user_id)
    }

    async searchUsers(query: string, page = 0, limit = 10, viewer_id?: string): Promise<SearchUserResponse[]> {
        const users = (await usersRepository.searchUsers({ query, page, limit, viewer_id })) as UserType[]
        return UserResponseTransformer.toSearchUserList(users)
    }

    async getUserFollowers(user_id: string, page = 0, limit = 10, viewer_id?: string): Promise<FollowListResponse[]> {
        const followers = (await usersRepository.getUserFollowers(user_id, page, limit, viewer_id)) as {
            user: UserType
        }[]
        return followers.map((follower) => UserResponseTransformer.toFollowList(follower.user))
    }

    async getUserFollowing(user_id: string, page = 0, limit = 10, viewer_id?: string): Promise<FollowListResponse[]> {
        const following = (await usersRepository.getUserFollowing(user_id, page, limit, viewer_id)) as {
            followed_user: UserType
        }[]
        return following.map((follow) => UserResponseTransformer.toFollowList(follow.followed_user))
    }

    async getUserProfileWithDetails(target_user_id: string, viewer_id?: string): Promise<UserProfileResponse> {
        const user = await usersRepository.getUserProfileWithDetails({ target_user_id, viewer_id })
        if (!user) {
            throw new ErrorWithStatus({
                message: USER_MESSAGES.USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
            })
        }

        const isOwner = viewer_id === user._id?.toString()
        const userWithOwnership: UserType = {
            ...user,
            isOwner
        }

        return UserResponseTransformer.toUserProfile(userWithOwnership)
    }
    async addNewEmployee(data: Omit<AddNewEmployeeReqBody, 'confirm_password'>) {
        const newUser = new User({
            ...data,
            password: hashPassword(data.password),
            date_of_birth: new Date(data.date_of_birth)
        })
        await usersRepository.insertUser(newUser)
    }
    async getEmployees({ page = 0, limit = 10 }: { page?: number; limit?: number } = {}) {
        const [total, employees] = await Promise.all([
            usersRepository.countEmployees(),
            usersRepository.getEmployees({ page, limit })
        ])
        return {
            total,
            employees
        }
    }
    async isExitSuperAdmin() {
        return await usersRepository.isExitSuperAdmin()
    }
}

export default UserService.getInstance()
