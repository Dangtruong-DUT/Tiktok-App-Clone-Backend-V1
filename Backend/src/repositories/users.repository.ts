import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import Follower from '~/models/schemas/Follower.schemas'
import { UserVerifyStatus } from '~/constants/enum'

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

    async findUserById(user_id: string, includePrivateFields = false) {
        const projection = includePrivateFields ? {} : this.safeUserProjection
        return await databaseService.users.findOne({ _id: new ObjectId(user_id) }, { projection })
    }

    async findUserByEmail(email: string, includePrivateFields = false) {
        const projection = includePrivateFields ? {} : this.safeUserProjection
        return await databaseService.users.findOne({ email }, { projection })
    }

    async findUserByUsername(username: string, includePrivateFields = false) {
        const projection = includePrivateFields ? {} : this.safeUserProjection
        return await databaseService.users.findOne({ username }, { projection })
    }

    async updateUser(user_id: string, updateData: any) {
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
        return await databaseService.followers.findOneAndUpdate(
            {
                user_id: follower.user_id,
                followed_user_id: follower.followed_user_id
            },
            {
                $setOnInsert: follower
            },
            {
                upsert: true,
                returnDocument: 'after'
            }
        )
    }

    async deleteFollower(user_id: string, followed_user_id: string) {
        return await databaseService.followers.deleteOne({
            user_id: new ObjectId(user_id),
            followed_user_id: new ObjectId(followed_user_id)
        })
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
        const friendship = await databaseService.followers.findOne({
            $or: [
                {
                    user_id: new ObjectId(user_id),
                    followed_user_id: new ObjectId(target_user_id)
                },
                {
                    user_id: new ObjectId(target_user_id),
                    followed_user_id: new ObjectId(user_id)
                }
            ]
        })
        return !!friendship
    }

    async findUserWithFollowersCount(user_id: string, includePrivateFields = false) {
        const user = await this.findUserById(user_id, includePrivateFields)
        if (!user) return null

        const followers_count = await this.countFollowers(user_id)
        return { ...user, followers_count }
    }

    async findUserByUsernameWithFollowersCount(username: string, includePrivateFields = false) {
        const user = await this.findUserByUsername(username, includePrivateFields)
        if (!user) return null

        const followers_count = await this.countFollowers(user._id.toString())
        return { ...user, followers_count }
    }

    async searchUsers(query: string, page = 0, limit = 10) {
        return await databaseService.users
            .find(
                {
                    $or: [{ username: { $regex: query, $options: 'i' } }, { name: { $regex: query, $options: 'i' } }]
                },
                { projection: this.safeUserProjection }
            )
            .skip(page * limit)
            .limit(limit)
            .toArray()
    }

    async getUserFollowers(user_id: string, page = 0, limit = 10) {
        return await databaseService.followers
            .aggregate([
                {
                    $match: { followed_user_id: new ObjectId(user_id) }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                { $unwind: '$user' },
                {
                    $project: {
                        'user.password': 0,
                        'user.email_verify_token': 0,
                        'user.forgot_password_token': 0
                    }
                },
                { $sort: { created_at: -1 } },
                { $skip: page * limit },
                { $limit: limit }
            ])
            .toArray()
    }

    async getUserFollowing(user_id: string, page = 0, limit = 10) {
        return await databaseService.followers
            .aggregate([
                {
                    $match: { user_id: new ObjectId(user_id) }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'followed_user_id',
                        foreignField: '_id',
                        as: 'followed_user'
                    }
                },
                { $unwind: '$followed_user' },
                {
                    $project: {
                        'followed_user.password': 0,
                        'followed_user.email_verify_token': 0,
                        'followed_user.forgot_password_token': 0
                    }
                },
                { $sort: { created_at: -1 } },
                { $skip: page * limit },
                { $limit: limit }
            ])
            .toArray()
    }
}

const usersRepository = new UsersRepository()
export default usersRepository
