import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.service'
import TikTokPost from '~/models/schemas/TikTokPost.schemas'
import { PosterType } from '~/constants/enum'

// --- Pipeline helpers ---
function lookupHashtags() {
    return {
        $lookup: {
            from: 'hashtags',
            localField: 'hashtags',
            foreignField: '_id',
            as: 'hashtags'
        }
    }
}

function lookupMentions() {
    return {
        $lookup: {
            from: 'users',
            localField: 'mentions',
            foreignField: '_id',
            as: 'mentions'
        }
    }
}

function addMentionsFields() {
    return {
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
    }
}

function lookupLikes() {
    return {
        $lookup: {
            from: 'likes',
            localField: '_id',
            foreignField: 'post_id',
            as: 'likes'
        }
    }
}

function lookupBookmarks() {
    return {
        $lookup: {
            from: 'bookmarks',
            localField: '_id',
            foreignField: 'post_id',
            as: 'bookmarks'
        }
    }
}

function addStatsFields() {
    return {
        $addFields: {
            likes_count: { $size: '$likes' },
            bookmarks_count: { $size: '$bookmarks' }
        }
    }
}

function lookupChildrenPosts() {
    return {
        $lookup: {
            from: 'tiktok_post',
            localField: '_id',
            foreignField: 'parent_id',
            as: 'children_posts'
        }
    }
}

function addChildrenCounts() {
    return {
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
}

class TikTokPostRepository {
    private static instance: TikTokPostRepository
    static getInstance(): TikTokPostRepository {
        if (!TikTokPostRepository.instance) {
            TikTokPostRepository.instance = new TikTokPostRepository()
        }
        return TikTokPostRepository.instance
    }
    private constructor() {}

    async insertPost(post: TikTokPost) {
        return await databaseService.tiktokPost.insertOne(post)
    }

    async searchPostsByQueryContent({
        query,
        limit,
        page,
        viewer_id
    }: {
        query: string
        limit: number
        page: number
        viewer_id?: string
    }) {
        const viewerId = viewer_id ? new ObjectId(viewer_id) : null

        const pipeline: any[] = [
            {
                $match: {
                    $text: { $search: query },
                    type: 0
                }
            },
            {
                $lookup: {
                    from: 'followers',
                    let: { postUserId: '$user_id' },
                    pipeline: viewerId
                        ? [
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
                          ]
                        : [],
                    as: 'friendship'
                }
            },
            {
                $match: {
                    $expr: {
                        $or: [
                            { $eq: ['$audience', 0] },
                            {
                                $and: [
                                    { $eq: ['$audience', 2] },
                                    viewerId ? { $gte: [{ $size: '$friendship' }, 2] } : { $eq: [1, 2] } // guest không thấy friends
                                ]
                            },
                            {
                                $and: [
                                    { $eq: ['$audience', 1] },
                                    viewerId ? { $eq: ['$user_id', viewerId] } : { $eq: [1, 2] } // guest không thấy private
                                ]
                            },

                            {
                                $eq: ['$audience', 0] // public
                            }
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: 'likes',
                    let: { postId: '$_id' },
                    pipeline: viewerId
                        ? [
                              {
                                  $match: {
                                      $expr: {
                                          $and: [{ $eq: ['$post_id', '$$postId'] }, { $eq: ['$user_id', viewerId] }]
                                      }
                                  }
                              }
                          ]
                        : [],
                    as: 'likes_by_viewer'
                }
            },
            {
                $lookup: {
                    from: 'bookmarks',
                    let: { postId: '$_id' },
                    pipeline: viewerId
                        ? [
                              {
                                  $match: {
                                      $expr: {
                                          $and: [{ $eq: ['$post_id', '$$postId'] }, { $eq: ['$user_id', viewerId] }]
                                      }
                                  }
                              }
                          ]
                        : [],
                    as: 'bookmarks_by_viewer'
                }
            },
            {
                $addFields: {
                    is_liked: viewerId ? { $gt: [{ $size: '$likes_by_viewer' }, 0] } : false,
                    is_bookmarked: viewerId ? { $gt: [{ $size: '$bookmarks_by_viewer' }, 0] } : false
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
                $project: {
                    children_posts: 0,
                    friendship: 0,
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

    async countSearchPostsByQueryContent({ query, viewer_id }: { query: string; viewer_id?: string }) {
        const viewerId = viewer_id ? new ObjectId(viewer_id) : null

        const pipeline: any[] = [
            {
                $match: {
                    $text: { $search: query },
                    type: 0
                }
            },
            {
                $lookup: {
                    from: 'followers',
                    let: { postUserId: '$user_id' },
                    pipeline: viewerId
                        ? [
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
                          ]
                        : [],
                    as: 'friendship'
                }
            },
            {
                $match: {
                    $expr: {
                        $or: [
                            { $eq: ['$audience', 0] },
                            {
                                $and: [
                                    { $eq: ['$audience', 2] },
                                    viewerId ? { $gte: [{ $size: '$friendship' }, 2] } : { $eq: [1, 2] }
                                ]
                            },
                            {
                                $and: [
                                    { $eq: ['$audience', 1] },
                                    viewerId ? { $eq: ['$user_id', viewerId] } : { $eq: [1, 2] }
                                ]
                            },
                            {
                                $eq: ['$audience', 0] // public
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

    async findPostById({ post_id, viewer_id }: { post_id: string; viewer_id?: string }) {
        const pipeline: any[] = [
            { $match: { _id: new ObjectId(post_id) } },
            lookupHashtags(),
            lookupMentions(),
            addMentionsFields(),
            lookupLikes(),
            lookupBookmarks(),
            addStatsFields(),
            lookupChildrenPosts(),
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
                                    $and: [{ $eq: ['$post_id', '$$postId'] }, { $eq: ['$user_id', viewer_id] }]
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
                                    $and: [{ $eq: ['$post_id', '$$postId'] }, { $eq: ['$user_id', viewer_id] }]
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
        ]

        pipeline.push({
            $lookup: {
                from: 'users',
                let: { authorId: '$user_id' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$authorId'] } } },

                    // Lookup following count
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

                    // Lookup followers count
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

                    // Lookup likes trên tất cả posts của user
                    {
                        $lookup: {
                            from: 'posts',
                            localField: '_id',
                            foreignField: 'user_id',
                            as: 'user_posts'
                        }
                    },
                    {
                        $lookup: {
                            from: 'likes',
                            let: { postIds: '$user_posts._id' },
                            pipeline: [{ $match: { $expr: { $in: ['$post_id', '$$postIds'] } } }],
                            as: 'likes_on_posts'
                        }
                    },
                    {
                        $addFields: {
                            likes_count: { $size: '$likes_on_posts' }
                        }
                    },

                    // Nếu có viewerId thì check quan hệ follow
                    ...(viewer_id
                        ? [
                              {
                                  $lookup: {
                                      from: 'followers',
                                      let: { authorId: '$_id' },
                                      pipeline: [
                                          {
                                              $match: {
                                                  user_id: viewer_id,
                                                  $expr: { $eq: ['$followed_user_id', '$$authorId'] }
                                              }
                                          }
                                      ],
                                      as: 'friend_ship'
                                  }
                              },
                              {
                                  $addFields: {
                                      is_followed: { $gt: [{ $size: '$friend_ship' }, 0] }
                                  }
                              }
                          ]
                        : [
                              {
                                  $addFields: {
                                      is_followed: false
                                  }
                              }
                          ]),

                    // Ẩn các trường nhạy cảm của author
                    {
                        $project: {
                            password: 0,
                            email_verify_token: 0,
                            forgot_password_token: 0,
                            user_posts: 0,
                            likes_on_posts: 0,
                            friend_ship: 0
                        }
                    }
                ],
                as: 'author'
            }
        })

        pipeline.push({
            $addFields: {
                author: { $arrayElemAt: ['$author', 0] }
            }
        })

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
                    type: 0 // Bài viết gốc
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
                                    $and: [
                                        { $eq: ['$user_id', viewerId] },
                                        { $eq: ['$followed_user_id', '$$postUserId'] }
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
                            {
                                $and: [{ $eq: ['$audience', 0] }, { $gte: [{ $size: '$friendship' }, 1] }]
                            },
                            {
                                $and: [{ $eq: ['$audience', 2] }, { $gte: [{ $size: '$friendship' }, 1] }]
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

    async searchPostsByHashtagName({
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

        const pipeline: any[] = [
            {
                $match: {
                    $text: { $search: query }
                }
            },
            {
                $lookup: {
                    from: 'tiktok_post',
                    localField: '_id',
                    foreignField: 'hashtags',
                    as: 'post'
                }
            },
            { $unwind: '$post' },
            { $replaceRoot: { newRoot: '$post' } },

            // Kiểm tra audience
            {
                $lookup: {
                    from: 'followers',
                    let: { postUserId: '$user_id' },
                    pipeline: viewerId
                        ? [
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
                          ]
                        : [],
                    as: 'friendship'
                }
            },
            {
                $match: {
                    $expr: {
                        $or: [
                            { $eq: ['$audience', 0] },
                            {
                                $and: [
                                    { $eq: ['$audience', 2] },
                                    viewerId ? { $gte: [{ $size: '$friendship' }, 2] } : { $eq: [1, 2] }
                                ]
                            },
                            {
                                $and: [
                                    { $eq: ['$audience', 1] },
                                    viewerId ? { $eq: ['$user_id', viewerId] } : { $eq: [1, 2] }
                                ]
                            }
                        ]
                    }
                }
            },

            // Hashtags & mentions
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
                            as: 'm',
                            in: {
                                _id: '$$m._id',
                                name: '$$m.name',
                                username: '$$m.username',
                                email: '$$m.email'
                            }
                        }
                    }
                }
            },

            // Likes & bookmarks count
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

            // Children posts: comments, reposts, quotes
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

            // Check liked, bookmarked
            {
                $lookup: {
                    from: 'likes',
                    let: { postId: '$_id' },
                    pipeline: viewerId
                        ? [
                              {
                                  $match: {
                                      $expr: {
                                          $and: [{ $eq: ['$post_id', '$$postId'] }, { $eq: ['$user_id', viewerId] }]
                                      }
                                  }
                              }
                          ]
                        : [],
                    as: 'likes_by_viewer'
                }
            },
            {
                $lookup: {
                    from: 'bookmarks',
                    let: { postId: '$_id' },
                    pipeline: viewerId
                        ? [
                              {
                                  $match: {
                                      $expr: {
                                          $and: [{ $eq: ['$post_id', '$$postId'] }, { $eq: ['$user_id', viewerId] }]
                                      }
                                  }
                              }
                          ]
                        : [],
                    as: 'bookmarks_by_viewer'
                }
            },
            {
                $addFields: {
                    is_liked: viewerId ? { $gt: [{ $size: '$likes_by_viewer' }, 0] } : false,
                    is_bookmarked: viewerId ? { $gt: [{ $size: '$bookmarks_by_viewer' }, 0] } : false
                }
            },

            {
                $project: {
                    likes: 0,
                    bookmarks: 0,
                    friendship: 0,
                    children_posts: 0,
                    likes_by_viewer: 0,
                    bookmarks_by_viewer: 0
                }
            },

            { $sort: { created_at: -1 } },
            { $skip: page > 0 ? (page - 1) * limit : 0 },
            { $limit: limit }
        ]

        return await databaseService.hashtags.aggregate(pipeline).toArray()
    }

    async countSearchPostsByHashtagName({ query, viewer_id }: { query: string; viewer_id?: string }) {
        const viewerId = viewer_id ? new ObjectId(viewer_id) : null

        const pipeline: any[] = [
            {
                $match: {
                    $text: { $search: query }
                }
            },
            {
                $lookup: {
                    from: 'tiktok_post',
                    localField: '_id',
                    foreignField: 'hashtags',
                    as: 'post'
                }
            },
            { $unwind: '$post' },
            { $replaceRoot: { newRoot: '$post' } },

            {
                $lookup: {
                    from: 'followers',
                    let: { postUserId: '$user_id' },
                    pipeline: viewerId
                        ? [
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
                          ]
                        : [],
                    as: 'friendship'
                }
            },
            {
                $match: {
                    $expr: {
                        $or: [
                            { $eq: ['$audience', 0] },
                            {
                                $and: [
                                    { $eq: ['$audience', 2] },
                                    viewerId ? { $gte: [{ $size: '$friendship' }, 2] } : { $eq: [1, 2] }
                                ]
                            },
                            {
                                $and: [
                                    { $eq: ['$audience', 1] },
                                    viewerId ? { $eq: ['$user_id', viewerId] } : { $eq: [1, 2] }
                                ]
                            }
                        ]
                    }
                }
            },

            { $count: 'total' }
        ]

        const [result] = await databaseService.hashtags.aggregate(pipeline).toArray()
        return result?.total || 0
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
                                    $and: [
                                        { $eq: ['$user_id', viewerId] },
                                        { $eq: ['$followed_user_id', '$$postUserId'] }
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
                            {
                                $and: [{ $eq: ['$audience', 0] }, { $gte: [{ $size: '$friendship' }, 1] }]
                            },
                            {
                                $and: [{ $eq: ['$audience', 2] }, { $gte: [{ $size: '$friendship' }, 1] }]
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
            // Lookup friendship nếu có viewerId
            ...(viewerId
                ? [
                      {
                          $lookup: {
                              from: 'followers',
                              let: { postOwnerId: '$user_id' },
                              pipeline: [
                                  {
                                      $match: {
                                          $expr: {
                                              $or: [
                                                  {
                                                      $and: [
                                                          { $eq: ['$user_id', viewerId] },
                                                          { $eq: ['$followed_user_id', '$$postOwnerId'] }
                                                      ]
                                                  },
                                                  {
                                                      $and: [
                                                          { $eq: ['$followed_user_id', viewerId] },
                                                          { $eq: ['$user_id', '$$postOwnerId'] }
                                                      ]
                                                  }
                                              ]
                                          }
                                      }
                                  }
                              ],
                              as: 'friendship'
                          }
                      }
                  ]
                : []),

            // Filter audience
            {
                $match: {
                    $expr: {
                        $or: [
                            { $eq: ['$audience', 0] }, // PUBLIC
                            {
                                $and: [
                                    { $eq: ['$audience', 2] }, // FRIENDS
                                    viewerId ? { $gte: [{ $size: '$friendship' }, 2] } : { $eq: [1, 2] } // Guest không pass
                                ]
                            },
                            {
                                $and: [
                                    { $eq: ['$audience', 1] }, // PRIVATE
                                    viewerId ? { $eq: ['$user_id', viewerId] } : { $eq: [1, 2] } // Guest không pass
                                ]
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
            }
        ]

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
                        bookmarks: 0,
                        friendship: 0
                    }
                }
            )
        } else {
            pipeline.push(
                {
                    $addFields: {
                        is_liked: false,
                        is_bookmarked: false
                    }
                },
                {
                    $project: {
                        children_posts: 0,
                        likes: 0,
                        bookmarks: 0,
                        friendship: 0
                    }
                }
            )
        }

        pipeline.push({ $sort: { created_at: -1 } }, { $skip: page > 0 ? (page - 1) * limit : 0 }, { $limit: limit })

        pipeline.push({
            $lookup: {
                from: 'users',
                let: { authorId: '$user_id' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$authorId'] } } },

                    // Lookup following count
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

                    // Lookup followers count
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

                    // Lookup likes trên tất cả posts của user
                    {
                        $lookup: {
                            from: 'posts',
                            localField: '_id',
                            foreignField: 'user_id',
                            as: 'user_posts'
                        }
                    },
                    {
                        $lookup: {
                            from: 'likes',
                            let: { postIds: '$user_posts._id' },
                            pipeline: [{ $match: { $expr: { $in: ['$post_id', '$$postIds'] } } }],
                            as: 'likes_on_posts'
                        }
                    },
                    {
                        $addFields: {
                            likes_count: { $size: '$likes_on_posts' }
                        }
                    },

                    // Nếu có viewerId thì check quan hệ follow
                    ...(user_id
                        ? [
                              {
                                  $lookup: {
                                      from: 'followers',
                                      let: { authorId: '$_id' },
                                      pipeline: [
                                          {
                                              $match: {
                                                  user_id: viewerId,
                                                  $expr: { $eq: ['$followed_user_id', '$$authorId'] }
                                              }
                                          }
                                      ],
                                      as: 'friend_ship'
                                  }
                              },
                              {
                                  $addFields: {
                                      is_followed: { $gt: [{ $size: '$friend_ship' }, 0] }
                                  }
                              }
                          ]
                        : [
                              {
                                  $addFields: {
                                      is_followed: false
                                  }
                              }
                          ]),

                    // Ẩn các trường nhạy cảm của author
                    {
                        $project: {
                            password: 0,
                            email_verify_token: 0,
                            forgot_password_token: 0,
                            user_posts: 0,
                            likes_on_posts: 0,
                            friend_ship: 0
                        }
                    }
                ],
                as: 'author'
            }
        })

        pipeline.push({
            $addFields: {
                author: { $arrayElemAt: ['$author', 0] }
            }
        })

        return await databaseService.tiktokPost.aggregate(pipeline).toArray()
    }

    async countChildrenPosts({
        post_id,
        type = PosterType.QUOTE_POST,
        user_id
    }: {
        post_id: string
        type: number
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

            ...(viewerId
                ? [
                      {
                          $lookup: {
                              from: 'followers',
                              let: { postOwnerId: '$user_id' },
                              pipeline: [
                                  {
                                      $match: {
                                          $expr: {
                                              $or: [
                                                  {
                                                      $and: [
                                                          { $eq: ['$user_id', viewerId] },
                                                          { $eq: ['$followed_user_id', '$$postOwnerId'] }
                                                      ]
                                                  },
                                                  {
                                                      $and: [
                                                          { $eq: ['$followed_user_id', viewerId] },
                                                          { $eq: ['$user_id', '$$postOwnerId'] }
                                                      ]
                                                  }
                                              ]
                                          }
                                      }
                                  }
                              ],
                              as: 'friendship'
                          }
                      }
                  ]
                : []),

            {
                $match: {
                    $expr: {
                        $or: [
                            { $eq: ['$audience', 0] },
                            {
                                $and: [
                                    { $eq: ['$audience', 2] },
                                    viewerId ? { $gte: [{ $size: '$friendship' }, 2] } : { $eq: [1, 2] }
                                ]
                            },
                            {
                                $and: [
                                    { $eq: ['$audience', 1] },
                                    viewerId ? { $eq: ['$user_id', viewerId] } : { $eq: [1, 2] }
                                ]
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

    async countSearchUsersByUsername({ query }: { query: string }) {
        const pipeline = [
            {
                $match: {
                    $text: { $search: query }
                }
            },
            { $count: 'total' }
        ]

        const [result] = await databaseService.users.aggregate(pipeline).toArray()
        return result?.total || 0
    }

    async findForYouPosts({ user_id, page = 0, limit = 10 }: { user_id?: string; page?: number; limit?: number }) {
        const viewerId = user_id ? new ObjectId(user_id) : new ObjectId('000000000000000000000000')

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
                                    $and: [
                                        { $eq: ['$user_id', viewerId] },
                                        { $eq: ['$followed_user_id', '$$postUserId'] }
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
                                $and: [{ $eq: ['$audience', 2] }, { $gte: [{ $size: '$friendship' }, 1] }]
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

        pipeline.push({
            $lookup: {
                from: 'users',
                let: { authorId: '$user_id' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$authorId'] } } },

                    // Lookup following count
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

                    // Lookup followers count
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

                    // Lookup likes trên tất cả posts của user
                    {
                        $lookup: {
                            from: 'posts',
                            localField: '_id',
                            foreignField: 'user_id',
                            as: 'user_posts'
                        }
                    },
                    {
                        $lookup: {
                            from: 'likes',
                            let: { postIds: '$user_posts._id' },
                            pipeline: [{ $match: { $expr: { $in: ['$post_id', '$$postIds'] } } }],
                            as: 'likes_on_posts'
                        }
                    },
                    {
                        $addFields: {
                            likes_count: { $size: '$likes_on_posts' }
                        }
                    },

                    // Nếu có viewerId thì check quan hệ follow
                    ...(user_id
                        ? [
                              {
                                  $lookup: {
                                      from: 'followers',
                                      let: { authorId: '$_id' },
                                      pipeline: [
                                          {
                                              $match: {
                                                  user_id: viewerId,
                                                  $expr: { $eq: ['$followed_user_id', '$$authorId'] }
                                              }
                                          }
                                      ],
                                      as: 'friend_ship'
                                  }
                              },
                              {
                                  $addFields: {
                                      is_followed: { $gt: [{ $size: '$friend_ship' }, 0] }
                                  }
                              }
                          ]
                        : [
                              {
                                  $addFields: {
                                      is_followed: false
                                  }
                              }
                          ]),

                    // Ẩn các trường nhạy cảm của author
                    {
                        $project: {
                            password: 0,
                            email_verify_token: 0,
                            forgot_password_token: 0,
                            user_posts: 0,
                            likes_on_posts: 0,
                            friend_ship: 0
                        }
                    }
                ],
                as: 'author'
            }
        })

        // Flatten author vì nó là array
        pipeline.push({
            $addFields: {
                author: { $arrayElemAt: ['$author', 0] }
            }
        })

        return await databaseService.tiktokPost.aggregate(pipeline).toArray()
    }

    async countForYouPosts(user_id?: string) {
        const viewerId = user_id ? new ObjectId(user_id) : new ObjectId('000000000000000000000000')

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
                                    $and: [
                                        { $eq: ['$user_id', viewerId] },
                                        { $eq: ['$followed_user_id', '$$postUserId'] }
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
                            {
                                $eq: ['$audience', 0]
                            },
                            {
                                $and: [{ $eq: ['$audience', 2] }, { $gte: [{ $size: '$friendship' }, 1] }]
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
}

export default TikTokPostRepository.getInstance()
