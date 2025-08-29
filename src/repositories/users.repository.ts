import { ObjectId, ReturnDocument } from 'mongodb'
import databaseService from '~/services/database.service'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import Follower from '~/models/schemas/Follower.schemas'
import { UserType } from '~/models/types/User.types'
import { searchUsersPipeline, countUsersByQueryPipeline } from './pipelines/user/search.pipeline'
import {
    getUserProfilePipeline,
    getUserFollowersPipeline,
    getUserFollowingPipeline
} from './pipelines/user/profile.pipeline'
import { employeeMatchPipeline, superAdminMatchPipeline } from './pipelines/user/employee.pipeline'
import {
    createFollowerPipeline,
    deleteFollowerPipeline,
    checkFriendshipStatusPipeline
} from './pipelines/user/follower.pipeline'

class UsersRepository {
    private get safeUserProjection() {
        return {
            password: 0,
            email_verify_token: 0,
            forgot_password_token: 0
        }
    }

    async insertUser(user: User) {
        return await databaseService.users.insertOne(user)
    }

    async findUserById({
        user_id,
        viewer_id,
        isSensitiveHidden = true
    }: {
        user_id: string
        viewer_id?: string
        isSensitiveHidden?: boolean
    }) {
        return this.getUserProfileWithDetails({ target_user_id: user_id, viewer_id, isSensitiveHidden })
    }

    async findUserByEmail({
        email,
        viewer_id,
        isSensitiveHidden = true
    }: {
        email: string
        viewer_id?: string
        isSensitiveHidden?: boolean
    }) {
        const user = await databaseService.users.findOne({ email }, { projection: { _id: 1 } })
        if (!user) return null
        return this.getUserProfileWithDetails({ target_user_id: user._id.toString(), viewer_id, isSensitiveHidden })
    }

    async findUserObjectByEmail(email: string) {
        return await databaseService.users.findOne({ email })
    }

    async findUserByUsername(username: string, viewer_id?: string) {
        const user = await databaseService.users.findOne({ username }, { projection: { _id: 1 } })
        if (!user) return null
        return this.getUserProfileWithDetails({ target_user_id: user._id.toString(), viewer_id })
    }

    async findUserByForgotPasswordToken(token: string) {
        return await databaseService.users.findOne({ forgot_password_token: token })
    }

    async findUserByEmailVerifyToken(token: string) {
        return await databaseService.users.findOne({ email_verify_token: token })
    }

    async updateUser(user_id: string, updateData: object) {
        return await databaseService.users.updateOne({ _id: new ObjectId(user_id) }, updateData)
    }

    async checkEmailExists(email: string) {
        const user = await databaseService.users.findOne({ email })
        return !!user
    }

    async insertRefreshToken(refreshToken: RefreshToken) {
        return await databaseService.refreshToken.insertOne(refreshToken)
    }

    async deleteRefreshToken(token: string) {
        return await databaseService.refreshToken.deleteOne({ token })
    }

    async deleteAllRefreshTokensByUser(user_id: string) {
        return await databaseService.refreshToken.deleteMany({
            user_id: new ObjectId(user_id)
        })
    }

    async findRefreshToken(token: string) {
        return await databaseService.refreshToken.findOne({ token })
    }

    // Follower operations
    async createFollower(follower: Follower) {
        const { filter, update, options } = createFollowerPipeline(follower)
        // Ensure options.returnDocument uses the ReturnDocument enum
        const fixedOptions = {
            ...options,
            returnDocument: ReturnDocument.AFTER
        }
        return await databaseService.followers.findOneAndUpdate(filter, update, fixedOptions)
    }

    async deleteFollower(user_id: string, followed_user_id: string) {
        const query = deleteFollowerPipeline(new ObjectId(user_id), new ObjectId(followed_user_id))
        return await databaseService.followers.deleteOne(query)
    }

    async countFollowers(user_id: string) {
        return await databaseService.followers.countDocuments({
            followed_user_id: new ObjectId(user_id)
        })
    }

    async countFollowing(user_id: string) {
        return await databaseService.followers.countDocuments({
            user_id: new ObjectId(user_id)
        })
    }

    async checkFriendshipStatus(user_id: string, target_user_id: string) {
        const query = checkFriendshipStatusPipeline(new ObjectId(user_id), new ObjectId(target_user_id))
        const friendship = await databaseService.followers.findOne(query)
        return !!friendship
    }

    async searchUsers({
        query,
        page = 1,
        limit = 10,
        viewer_id
    }: {
        query: string
        page?: number
        limit?: number
        viewer_id?: string
    }) {
        const viewerId = viewer_id ? new ObjectId(viewer_id) : null
        const pipeline = searchUsersPipeline(query, viewerId, page, limit)
        return await databaseService.users.aggregate(pipeline).toArray()
    }
    async countUsersByQuery(query: string) {
        const pipeline = countUsersByQueryPipeline(query)
        const [result] = await databaseService.users.aggregate(pipeline).toArray()
        return result?.total || 0
    }

    async getUserFollowers(user_id: string, page = 0, limit = 10, viewer_id?: string) {
        const viewerId = viewer_id ? new ObjectId(viewer_id) : null
        const pipeline = getUserFollowersPipeline(new ObjectId(user_id), viewerId, page, limit)
        return await databaseService.followers.aggregate(pipeline).toArray()
    }

    async getUserFollowing(user_id: string, page = 0, limit = 10, viewer_id?: string) {
        const viewerId = viewer_id ? new ObjectId(viewer_id) : null
        const pipeline = getUserFollowingPipeline(new ObjectId(user_id), viewerId, page, limit)
        return await databaseService.followers.aggregate(pipeline).toArray()
    }

    async getUserProfileWithDetails({
        target_user_id,
        viewer_id,
        isSensitiveHidden = true
    }: {
        target_user_id: string
        viewer_id?: string
        isSensitiveHidden?: boolean
    }) {
        const viewerId = viewer_id ? new ObjectId(viewer_id) : null
        const targetUserId = new ObjectId(target_user_id)
        const pipeline = getUserProfilePipeline(targetUserId, viewerId, isSensitiveHidden)
        const [result] = await databaseService.users.aggregate<UserType>(pipeline).toArray()
        return result
    }

    async getEmployees({ page = 0, limit = 10 }: { page?: number; limit?: number } = {}) {
        const pipeline = employeeMatchPipeline()
        return await databaseService.users
            .find(pipeline[0].$match, { projection: this.safeUserProjection })
            .skip(page * limit)
            .limit(limit)
            .toArray()
    }

    async countEmployees() {
        const pipeline = employeeMatchPipeline()
        return await databaseService.users.countDocuments(pipeline[0].$match)
    }

    async isExitSuperAdmin() {
        const pipeline = superAdminMatchPipeline()
        return (await databaseService.users.countDocuments(pipeline[0].$match)) > 0
    }
}

const usersRepository = new UsersRepository()
export default usersRepository
