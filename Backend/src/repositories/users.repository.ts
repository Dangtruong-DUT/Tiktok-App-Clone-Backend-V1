import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.service'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import Follower from '~/models/schemas/Follower.schemas'

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

    async findUserById(user_id: string, viewer_id?: string) {
        return this.getUserProfileWithDetails({ target_user_id: user_id, viewer_id })
    }

    async findUserByEmail(email: string, viewer_id?: string) {
        const user = await databaseService.users.findOne({ email }, { projection: { _id: 1 } })
        if (!user) return null
        return this.getUserProfileWithDetails({ target_user_id: user._id.toString(), viewer_id })
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

    async searchUsers({
        query,
        page = 0,
        limit = 10,
        viewer_id
    }: {
        query: string
        page?: number
        limit?: number
        viewer_id?: string
    }) {
        const viewerId = viewer_id ? new ObjectId(viewer_id) : null

        const pipeline: object[] = [
            {
                $match: {
                    $text: { $search: query }
                }
            },
            {
                $lookup: {
                    from: 'followers',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'following_count'
                }
            },
            {
                $addFields: {
                    following_count: { $size: '$following_count' }
                }
            },
            {
                $lookup: {
                    from: 'followers',
                    localField: '_id',
                    foreignField: 'followed_user_id',
                    as: 'followers_count'
                }
            },
            {
                $addFields: {
                    followers_count: { $size: '$followers_count' }
                }
            },
            {
                $lookup: viewerId
                    ? {
                          from: 'followers',
                          let: { user_id: '$_id' },
                          pipeline: [
                              {
                                  $match: {
                                      $expr: {
                                          $and: [
                                              { $eq: ['$user_id', viewerId] },
                                              { $eq: ['$followed_user_id', '$$user_id'] }
                                          ]
                                      }
                                  }
                              }
                          ],
                          as: 'friend_ship'
                      }
                    : {
                          from: 'followers',
                          pipeline: [],
                          as: 'friend_ship'
                      }
            },
            {
                $addFields: {
                    is_followed: viewerId ? { $gt: [{ $size: '$friend_ship' }, 0] } : false
                }
            },
            {
                $project: {
                    password: 0,
                    email_verify_token: 0,
                    forgot_password_token: 0,
                    friend_ship: 0
                }
            },
            { $skip: page * limit },
            { $limit: limit }
        ]

        return await databaseService.users.aggregate(pipeline).toArray()
    }
    async countUsersByQuery(query: string) {
        const pipeline = [
            {
                $match: {
                    $text: { $search: query }
                }
            },
            {
                $count: 'total'
            }
        ]

        const [result] = await databaseService.users.aggregate(pipeline).toArray()
        return result?.total || 0
    }

    async getUserFollowers(user_id: string, page = 0, limit = 10, viewer_id?: string) {
        const pipeline: object[] = [
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
            // Lookup following count cho mỗi user
            {
                $lookup: {
                    from: 'followers',
                    localField: 'user._id',
                    foreignField: 'user_id',
                    as: 'user_following_count'
                }
            },
            {
                $addFields: {
                    'user.following_count': { $size: '$user_following_count' }
                }
            },
            // Lookup followers count cho mỗi user
            {
                $lookup: {
                    from: 'followers',
                    localField: 'user._id',
                    foreignField: 'followed_user_id',
                    as: 'user_followers_count'
                }
            },
            {
                $addFields: {
                    'user.followers_count': { $size: '$user_followers_count' }
                }
            }
        ]

        // Nếu có viewer_id, kiểm tra relationship
        if (viewer_id) {
            pipeline.push(
                {
                    $lookup: {
                        from: 'followers',
                        let: { userId: '$user._id' },
                        pipeline: [
                            {
                                $match: {
                                    user_id: new ObjectId(viewer_id),
                                    $expr: { $eq: ['$followed_user_id', '$$userId'] }
                                }
                            }
                        ],
                        as: 'friend_ship'
                    }
                },
                {
                    $addFields: {
                        'user.is_followed': { $gt: [{ $size: '$friend_ship' }, 0] }
                    }
                }
            )
        } else {
            pipeline.push({
                $addFields: {
                    'user.is_followed': false
                }
            })
        }

        pipeline.push(
            {
                $project: {
                    'user.password': 0,
                    'user.email_verify_token': 0,
                    'user.forgot_password_token': 0,
                    user_following_count: 0,
                    user_followers_count: 0,
                    friend_ship: 0
                }
            },
            { $sort: { created_at: -1 } },
            { $skip: page * limit },
            { $limit: limit }
        )

        return await databaseService.followers.aggregate(pipeline).toArray()
    }

    async getUserFollowing(user_id: string, page = 0, limit = 10, viewer_id?: string) {
        const pipeline: object[] = [
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
            // Lookup following count
            {
                $lookup: {
                    from: 'followers',
                    localField: 'followed_user._id',
                    foreignField: 'user_id',
                    as: 'user_following_count'
                }
            },
            {
                $addFields: {
                    'followed_user.following_count': { $size: '$user_following_count' }
                }
            },
            // Lookup followers count
            {
                $lookup: {
                    from: 'followers',
                    localField: 'followed_user._id',
                    foreignField: 'followed_user_id',
                    as: 'user_followers_count'
                }
            },
            {
                $addFields: {
                    'followed_user.followers_count': { $size: '$user_followers_count' }
                }
            }
        ]

        // Nếu có viewer_id, kiểm tra relationship
        if (viewer_id) {
            pipeline.push(
                {
                    $lookup: {
                        from: 'followers',
                        let: { userId: '$followed_user._id' },
                        pipeline: [
                            {
                                $match: {
                                    user_id: new ObjectId(viewer_id),
                                    $expr: { $eq: ['$followed_user_id', '$$userId'] }
                                }
                            }
                        ],
                        as: 'friend_ship'
                    }
                },
                {
                    $addFields: {
                        'followed_user.is_followed': { $gt: [{ $size: '$friend_ship' }, 0] }
                    }
                }
            )
        } else {
            pipeline.push({
                $addFields: {
                    'followed_user.is_followed': false
                }
            })
        }

        pipeline.push(
            {
                $project: {
                    'followed_user.password': 0,
                    'followed_user.email_verify_token': 0,
                    'followed_user.forgot_password_token': 0,
                    user_following_count: 0,
                    user_followers_count: 0,
                    friend_ship: 0
                }
            },
            { $sort: { created_at: -1 } },
            { $skip: page * limit },
            { $limit: limit }
        )

        return await databaseService.followers.aggregate(pipeline).toArray()
    }

    async getUserProfileWithDetails({ target_user_id, viewer_id }: { target_user_id: string; viewer_id?: string }) {
        const viewerId = viewer_id ? new ObjectId(viewer_id) : null
        const targetUserId = new ObjectId(target_user_id)

        const pipeline: object[] = [
            {
                $match: {
                    _id: targetUserId
                }
            },
            // Lookup following count (số người mà user này đang follow)
            {
                $lookup: {
                    from: 'followers',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'following_count'
                }
            },
            {
                $addFields: {
                    following_count: {
                        $size: '$following_count'
                    }
                }
            },
            // Lookup followers count (số người follow user này)
            {
                $lookup: {
                    from: 'followers',
                    localField: '_id',
                    foreignField: 'followed_user_id',
                    as: 'followers_count'
                }
            },
            {
                $addFields: {
                    followers_count: {
                        $size: '$followers_count'
                    }
                }
            }
        ]

        // Nếu có viewer_id, kiểm tra relationship
        if (viewerId) {
            pipeline.push(
                {
                    $lookup: {
                        from: 'followers',
                        let: {
                            user_id: '$_id'
                        },
                        pipeline: [
                            {
                                $match: {
                                    user_id: viewerId,
                                    $expr: { $eq: ['$followed_user_id', '$$user_id'] }
                                }
                            }
                        ],
                        as: 'friend_ship'
                    }
                },
                {
                    $addFields: {
                        is_followed: {
                            $gt: [
                                {
                                    $size: '$friend_ship'
                                },
                                0
                            ]
                        }
                    }
                }
            )
        } else {
            // Nếu là guest, mặc định is_followed = false
            pipeline.push({
                $addFields: {
                    is_followed: false
                }
            })
        }

        // Project để ẩn các trường nhạy cảm
        pipeline.push({
            $project: {
                password: 0,
                email_verify_token: 0,
                forgot_password_token: 0,
                friend_ship: 0
            }
        })

        const [result] = await databaseService.users.aggregate<User>(pipeline).toArray()
        return result
    }
}

const usersRepository = new UsersRepository()
export default usersRepository
