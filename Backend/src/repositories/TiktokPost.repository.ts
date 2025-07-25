import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'
import TikTokPost from '~/models/schemas/TikTokPost.schemas'
import { PosterType } from '~/constants/enum'

class TikTokPostRepository {
    async insertPost(post: TikTokPost) {
        return await databaseService.tiktokPost.insertOne(post)
    }

    async findPostById(post_id: string) {
        const pipeline = [
            {
                $match: {
                    _id: new ObjectId(post_id)
                }
            },
            {
                $lookup: {
                    from: 'hashtags',
                    localField: 'hashtags',
                    foreignField: '_id',
                    as: 'hashtags'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'mentions',
                    foreignField: '_id',
                    as: 'mentions'
                }
            },
            {
                $addFields: {
                    mentions: {
                        $map: {
                            input: '$mentions',
                            as: 'mention',
                            in: {
                                _id: '$$mention._id',
                                name: '$$mention.name',
                                ussername: '$$mention.username',
                                email: '$$mention.email'
                            }
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'post_id',
                    as: 'likes_count'
                }
            },
            {
                $lookup: {
                    from: 'bookmarks',
                    localField: '_id',
                    foreignField: 'post_id',
                    as: 'bookmarks_count'
                }
            },
            {
                $addFields: {
                    bookmarks_count: {
                        $size: '$bookmarks_count'
                    },
                    likes_count: {
                        $size: '$likes_count'
                    }
                }
            },
            {
                $lookup: {
                    from: 'tiktok_post',
                    localField: '_id',
                    foreignField: 'parent_id',
                    as: 'post_children'
                }
            },
            {
                $addFields: {
                    repost_count: {
                        $size: {
                            $filter: {
                                input: '$post_children',
                                as: 'item',
                                cond: {
                                    $eq: ['$$item.type', 1]
                                }
                            }
                        }
                    },
                    comment_count: {
                        $size: {
                            $filter: {
                                input: '$post_children',
                                as: 'item',
                                cond: {
                                    $eq: ['$$item.type', 2]
                                }
                            }
                        }
                    },
                    quote_post_count: {
                        $size: {
                            $filter: {
                                input: '$post_children',
                                as: 'item',
                                cond: {
                                    $eq: ['$$item.type', 3]
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    post_children: 0,
                    guest_views: 0,
                    user_views: 0
                }
            }
        ]

        const [result] = await databaseService.tiktokPost.aggregate<TikTokPost>(pipeline).toArray()
        return result
    }

    async updatePostViews(post_id: string, user_id?: string) {
        const result = await databaseService.tiktokPost.findOneAndUpdate(
            {
                _id: new ObjectId(post_id)
            },
            {
                $inc: user_id ? { user_views: 1 } : { guest_views: 1 },
                $currentDate: {
                    updated_at: true
                }
            },
            {
                returnDocument: 'after',
                projection: {
                    guest_views: 1,
                    user_views: 1,
                    updated_at: 1
                }
            }
        )
        if (!result) {
            return null
        }

        return {
            guest_views: result?.guest_views,
            user_views: result?.user_views,
            updated_at: result?.updated_at
        }
    }

    async findFriendPosts({ user_id, page = 0, limit = 10 }: { user_id: string; page?: number; limit?: number }) {
        const viewerId = new ObjectId(user_id)

        const pipeline: any[] = [
            {
                $match: {
                    type: 0
                }
            },
            {
                $lookup: {
                    from: 'followers',
                    let: { postUserId: '$user_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        {
                                            $and: [
                                                { $eq: ['$user_id', viewerId] },
                                                { $eq: ['$followed_user_id', '$$postUserId'] }
                                            ]
                                        },
                                        {
                                            $and: [
                                                { $eq: ['$followed_user_id', viewerId] },
                                                { $eq: ['$user_id', '$$postUserId'] }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'friendship'
                }
            },
            {
                $match: {
                    $expr: {
                        $or: [
                            { $eq: ['$audience', 0] },
                            {
                                $and: [{ $eq: ['$audience', 2] }, { $gte: [{ $size: '$friendship' }, 2] }]
                            },
                            {
                                $and: [{ $eq: ['$audience', 1] }, { $eq: ['$user_id', viewerId] }]
                            }
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: 'hashtags',
                    localField: 'hashtags',
                    foreignField: '_id',
                    as: 'hashtags'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'mentions',
                    foreignField: '_id',
                    as: 'mentions'
                }
            },
            {
                $addFields: {
                    mentions: {
                        $map: {
                            input: '$mentions',
                            as: 'mention',
                            in: {
                                _id: '$$mention._id',
                                name: '$$mention.name',
                                username: '$$mention.username',
                                email: '$$mention.email'
                            }
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'post_id',
                    as: 'likes'
                }
            },
            {
                $lookup: {
                    from: 'bookmarks',
                    localField: '_id',
                    foreignField: 'post_id',
                    as: 'bookmarks'
                }
            },
            {
                $addFields: {
                    likes_count: { $size: '$likes' },
                    bookmarks_count: { $size: '$bookmarks' }
                }
            },
            {
                $lookup: {
                    from: 'tiktok_post',
                    localField: '_id',
                    foreignField: 'parent_id',
                    as: 'children_posts'
                }
            },
            {
                $addFields: {
                    comments_count: {
                        $size: {
                            $filter: {
                                input: '$children_posts',
                                as: 'item',
                                cond: { $eq: ['$$item.type', 2] }
                            }
                        }
                    },
                    reposts_count: {
                        $size: {
                            $filter: {
                                input: '$children_posts',
                                as: 'item',
                                cond: { $eq: ['$$item.type', 1] }
                            }
                        }
                    },
                    quotes_count: {
                        $size: {
                            $filter: {
                                input: '$children_posts',
                                as: 'item',
                                cond: { $eq: ['$$item.type', 3] }
                            }
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'likes',
                    let: { postId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [{ $eq: ['$post_id', '$$postId'] }, { $eq: ['$user_id', viewerId] }]
                                }
                            }
                        }
                    ],
                    as: 'likes_by_viewer'
                }
            },
            {
                $lookup: {
                    from: 'bookmarks',
                    let: { postId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [{ $eq: ['$post_id', '$$postId'] }, { $eq: ['$user_id', viewerId] }]
                                }
                            }
                        }
                    ],
                    as: 'bookmarks_by_viewer'
                }
            },
            {
                $addFields: {
                    is_liked: { $gt: [{ $size: '$likes_by_viewer' }, 0] },
                    is_bookmarked: { $gt: [{ $size: '$bookmarks_by_viewer' }, 0] }
                }
            },
            {
                $project: {
                    friendship: 0,
                    children_posts: 0,
                    likes_by_viewer: 0,
                    bookmarks_by_viewer: 0,
                    likes: 0,
                    bookmarks: 0
                }
            },
            { $sort: { created_at: -1 } },
            { $skip: page > 0 ? (page - 1) * limit : 0 },
            { $limit: limit }
        ]

        return await databaseService.tiktokPost.aggregate(pipeline).toArray()
    }

    async countFriendPosts(user_id: string) {
        const viewerId = new ObjectId(user_id)

        const pipeline = [
            {
                $match: {
                    type: 0
                }
            },
            {
                $lookup: {
                    from: 'followers',
                    let: { postUserId: '$user_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $or: [
                                        {
                                            $and: [
                                                { $eq: ['$user_id', viewerId] },
                                                { $eq: ['$followed_user_id', '$$postUserId'] }
                                            ]
                                        },
                                        {
                                            $and: [
                                                { $eq: ['$followed_user_id', viewerId] },
                                                { $eq: ['$user_id', '$$postUserId'] }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'friendship'
                }
            },
            {
                $match: {
                    $expr: {
                        $or: [
                            { $eq: ['$audience', 0] },
                            {
                                $and: [{ $eq: ['$audience', 2] }, { $gte: [{ $size: '$friendship' }, 2] }]
                            },
                            {
                                $and: [{ $eq: ['$audience', 1] }, { $eq: ['$user_id', viewerId] }]
                            }
                        ]
                    }
                }
            },
            { $count: 'total' }
        ]

        const [result] = await databaseService.tiktokPost.aggregate(pipeline).toArray()
        return result?.total || 0
    }

    async findChildrenPosts({
        post_id,
        type = PosterType.QUOTE_POST,
        page = 0,
        limit = 10,
        user_id
    }: {
        post_id: string
        type: number
        page: number
        limit: number
        user_id?: string
    }) {
        const viewerId = user_id ? new ObjectId(user_id) : null

        const pipeline: any[] = [
            {
                $match: {
                    parent_id: new ObjectId(post_id),
                    type: Number(type)
                }
            },
            {
                $lookup: {
                    from: 'hashtags',
                    localField: 'hashtags',
                    foreignField: '_id',
                    as: 'hashtags'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'mentions',
                    foreignField: '_id',
                    as: 'mentions'
                }
            },
            {
                $addFields: {
                    mentions: {
                        $map: {
                            input: '$mentions',
                            as: 'mention',
                            in: {
                                _id: '$$mention._id',
                                name: '$$mention.name',
                                username: '$$mention.username',
                                email: '$$mention.email'
                            }
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'post_id',
                    as: 'likes'
                }
            },
            {
                $lookup: {
                    from: 'bookmarks',
                    localField: '_id',
                    foreignField: 'post_id',
                    as: 'bookmarks'
                }
            },
            {
                $addFields: {
                    likes_count: { $size: '$likes' },
                    bookmarks_count: { $size: '$bookmarks' }
                }
            },
            {
                $lookup: {
                    from: 'tiktok_post',
                    localField: '_id',
                    foreignField: 'parent_id',
                    as: 'children_posts'
                }
            },
            {
                $addFields: {
                    comments_count: {
                        $size: {
                            $filter: {
                                input: '$children_posts',
                                as: 'item',
                                cond: { $eq: ['$$item.type', 2] }
                            }
                        }
                    },
                    reposts_count: {
                        $size: {
                            $filter: {
                                input: '$children_posts',
                                as: 'item',
                                cond: { $eq: ['$$item.type', 1] }
                            }
                        }
                    },
                    quotes_count: {
                        $size: {
                            $filter: {
                                input: '$children_posts',
                                as: 'item',
                                cond: { $eq: ['$$item.type', 3] }
                            }
                        }
                    }
                }
            }
        ]

        // Add viewer-specific data if user_id is provided
        if (viewerId) {
            pipeline.push(
                {
                    $lookup: {
                        from: 'likes',
                        let: { postId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [{ $eq: ['$post_id', '$$postId'] }, { $eq: ['$user_id', viewerId] }]
                                    }
                                }
                            }
                        ],
                        as: 'likes_by_viewer'
                    }
                },
                {
                    $lookup: {
                        from: 'bookmarks',
                        let: { postId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [{ $eq: ['$post_id', '$$postId'] }, { $eq: ['$user_id', viewerId] }]
                                    }
                                }
                            }
                        ],
                        as: 'bookmarks_by_viewer'
                    }
                },
                {
                    $addFields: {
                        is_liked: { $gt: [{ $size: '$likes_by_viewer' }, 0] },
                        is_bookmarked: { $gt: [{ $size: '$bookmarks_by_viewer' }, 0] }
                    }
                },
                {
                    $project: {
                        children_posts: 0,
                        likes_by_viewer: 0,
                        bookmarks_by_viewer: 0,
                        likes: 0,
                        bookmarks: 0
                    }
                }
            )
        } else {
            pipeline.push({
                $project: {
                    children_posts: 0,
                    likes: 0,
                    bookmarks: 0
                }
            })
        }

        pipeline.push({ $sort: { created_at: -1 } }, { $skip: page > 0 ? (page - 1) * limit : 0 }, { $limit: limit })

        return await databaseService.tiktokPost.aggregate(pipeline).toArray()
    }

    async countChildrenPosts({ post_id, type = PosterType.QUOTE_POST }: { post_id: string; type: number }) {
        const pipeline = [
            {
                $match: {
                    parent_id: new ObjectId(post_id),
                    type: Number(type)
                }
            },
            {
                $count: 'total'
            }
        ]

        const [result] = await databaseService.tiktokPost.aggregate(pipeline).toArray()
        return result?.total || 0
    }
}

const tikTokPostRepository = new TikTokPostRepository()
export default tikTokPostRepository
