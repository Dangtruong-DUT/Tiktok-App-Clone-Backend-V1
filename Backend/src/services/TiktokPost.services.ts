import { CreateTikTokPostBodyReq } from '~/models/requests/TiktokPost.requests'
import databaseService from './database.services'
import TikTokPost from '~/models/schemas/TikTokPost.schemas'
import { ObjectId, WithId } from 'mongodb'
import Hashtag from '~/models/schemas/Hashtag.schemas'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { POST_MESSAGES } from '~/constants/messages/post'
import { Audience, PosterType } from '~/constants/enum'

class TikTokPostService {
    async checkAndCreateHashtags(hashtags: string[]) {
        const hashtagDocument = await Promise.all(
            hashtags.map((hashtag: string) => {
                // Find and update hashtag if not exist
                return databaseService.hashtags.findOneAndUpdate(
                    {
                        name: hashtag
                    },
                    {
                        $setOnInsert: new Hashtag({ name: hashtag })
                    },
                    {
                        upsert: true,
                        returnDocument: 'after'
                    }
                )
            })
        )
        return hashtagDocument.map((item) => (item as WithId<Hashtag>)._id)
    }
    async createPost({ payload, user_id }: { payload: CreateTikTokPostBodyReq; user_id: string }) {
        const hashtags = await this.checkAndCreateHashtags(payload.hashtags)

        const result = await databaseService.tiktokPost.insertOne(
            new TikTokPost({
                user_id: new ObjectId(user_id),
                audience: payload.audience,
                content: payload.content,
                type: payload.type,
                guest_views: 0,
                hashtags: hashtags,
                mentions: payload.mentions,
                medias: payload.medias,
                parent_id: payload.parent_id,
                user_views: 0
            })
        )
        const post = await this.getPostDetail({
            post_id: result.insertedId.toString(),
            user_id
        })

        return post
    }
    async getPostById(post_id: string) {
        const [result] = await databaseService.tiktokPost
            .aggregate<TikTokPost>([
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
            ])
            .toArray()
        return result
    }

    async getPostDetail({ post_id, user_id }: { post_id: string; user_id?: string }) {
        let is_liked = false
        let is_bookmarked = false

        if (user_id) {
            const likedPost = await databaseService.likes.findOne({
                post_id: new ObjectId(post_id),
                user_id: new ObjectId(user_id)
            })
            is_liked = likedPost !== null

            const bookmarkedPost = await databaseService.bookmarks.findOne({
                post_id: new ObjectId(post_id),
                user_id: new ObjectId(user_id)
            })
            is_bookmarked = bookmarkedPost !== null
        }

        const post = await this.getPostById(post_id)
        if (!post) {
            throw new ErrorWithStatus({
                message: POST_MESSAGES.POST_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
            })
        }
        return {
            ...post,
            is_liked,
            is_bookmarked
        }
    }

    async increasePostViews({ post_id, user_id }: { post_id: string; user_id?: string }) {
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
            throw new ErrorWithStatus({
                message: POST_MESSAGES.POST_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
            })
        }

        return {
            guest_views: result.guest_views,
            user_views: result.user_views,
            updated_at: result.updated_at
        }
    }
    async getChildrenPosts({
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
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'post_owner'
                }
            },
            { $unwind: '$post_owner' },

            // Lookup friends nếu có viewerId
            ...(viewerId
                ? [
                      {
                          $lookup: {
                              from: 'followers',
                              let: { ownerId: '$user_id' },
                              pipeline: [
                                  {
                                      $match: {
                                          $expr: {
                                              $or: [
                                                  {
                                                      $and: [
                                                          { $eq: ['$user_id', viewerId] },
                                                          { $eq: ['$followed_user_id', '$$ownerId'] }
                                                      ]
                                                  },
                                                  {
                                                      $and: [
                                                          { $eq: ['$followed_user_id', viewerId] },
                                                          { $eq: ['$user_id', '$$ownerId'] }
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
                            { $eq: ['$audience', Audience.PUBLIC] },
                            {
                                $and: [
                                    { $eq: ['$audience', Audience.FRIENDS] },
                                    viewerId ? { $gte: [{ $size: '$friendship' }, 2] } : { $eq: [1, 2] }
                                ]
                            },
                            {
                                $and: [
                                    { $eq: ['$audience', Audience.PRIVATE] },
                                    viewerId ? { $eq: ['$user_id', viewerId] } : { $eq: [1, 2] }
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
                    likes_count: { $size: '$likes_count' },
                    bookmarks_count: { $size: '$bookmarks_count' }
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
                                cond: { $eq: ['$$item.type', PosterType.RE_POST] }
                            }
                        }
                    },
                    comment_count: {
                        $size: {
                            $filter: {
                                input: '$post_children',
                                as: 'item',
                                cond: { $eq: ['$$item.type', PosterType.COMMENT] }
                            }
                        }
                    },
                    quote_post_count: {
                        $size: {
                            $filter: {
                                input: '$post_children',
                                as: 'item',
                                cond: { $eq: ['$$item.type', PosterType.QUOTE_POST] }
                            }
                        }
                    }
                }
            },

            ...(viewerId
                ? [
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
                      }
                  ]
                : []),

            {
                $addFields: {
                    is_liked: viewerId ? { $gt: [{ $size: '$likes_by_viewer' }, 0] } : false,
                    is_bookmarked: viewerId ? { $gt: [{ $size: '$bookmarks_by_viewer' }, 0] } : false
                }
            },
            {
                $project: {
                    post_children: 0,
                    friendship: 0,
                    post_owner: 0,
                    likes_by_viewer: 0,
                    bookmarks_by_viewer: 0
                }
            },
            { $sort: { created_at: -1 } },
            { $skip: page > 0 ? (page - 1) * limit : 0 },
            { $limit: limit }
        ]

        const posts = await databaseService.tiktokPost.aggregate(pipeline).toArray()

        const postsAfterIncreaseViews = await Promise.all(
            posts.map(async (post) => {
                let mutateData = {}
                if (post && post._id) {
                    mutateData = await this.increasePostViews({
                        post_id: post._id.toString(),
                        user_id
                    })
                }
                return {
                    ...post,
                    ...mutateData
                }
            })
        )

        return postsAfterIncreaseViews
    }

    async getFriendPosts({ user_id, page = 0, limit = 10 }: { user_id: string; page?: number; limit?: number }) {
        console.log('getFriendPosts', { user_id, page, limit })

        const viewerId = new ObjectId(user_id)

        const pipeline: any[] = [
            {
                $match: {
                    type: 0 // Hoặc PosterType.POST nếu bạn dùng enum
                }
            },
            // Lookup follower để check friendship
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

            // Audience filter
            {
                $match: {
                    $expr: {
                        $or: [
                            { $eq: ['$audience', 0] }, // Public
                            {
                                $and: [
                                    { $eq: ['$audience', 2] }, // Friends
                                    { $gte: [{ $size: '$friendship' }, 2] }
                                ]
                            },
                            {
                                $and: [
                                    { $eq: ['$audience', 1] }, // Private
                                    { $eq: ['$user_id', viewerId] }
                                ]
                            }
                        ]
                    }
                }
            },

            // Join hashtags
            {
                $lookup: {
                    from: 'hashtags',
                    localField: 'hashtags',
                    foreignField: '_id',
                    as: 'hashtags'
                }
            },

            // Join mentions
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

            // Join likes/bookmarks count
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

            // Join con để đếm comment/repost/quote
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

            // Check is_liked / is_bookmarked
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

            // Bỏ trường thừa
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

        const posts = await databaseService.tiktokPost.aggregate(pipeline).toArray()

        const postsAfterIncreaseViews = await Promise.all(
            posts.map(async (post) => {
                let mutateData = {}
                if (post && post._id) {
                    mutateData = await this.increasePostViews({
                        post_id: post._id.toString(),
                        user_id
                    })
                }
                return {
                    ...post,
                    ...mutateData
                }
            })
        )

        return postsAfterIncreaseViews
    }

    async getNumberOfChildrenPosts({
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
            {
                $lookup: {
                    from: 'followers',
                    let: { ownerId: '$user_id' },
                    pipeline: viewerId
                        ? [
                              {
                                  $match: {
                                      $expr: {
                                          $or: [
                                              {
                                                  $and: [
                                                      { $eq: ['$user_id', viewerId] },
                                                      { $eq: ['$followed_user_id', '$$ownerId'] }
                                                  ]
                                              },
                                              {
                                                  $and: [
                                                      { $eq: ['$followed_user_id', viewerId] },
                                                      { $eq: ['$user_id', '$$ownerId'] }
                                                  ]
                                              }
                                          ]
                                      }
                                  }
                              }
                          ]
                        : [
                              // nếu không có viewer => không bao giờ match => friendship = []
                              { $match: { _id: { $exists: false } } }
                          ],
                    as: 'friendship'
                }
            },
            {
                $match: {
                    $expr: {
                        $or: [
                            { $eq: ['$audience', Audience.PUBLIC] },
                            {
                                $and: [
                                    { $eq: ['$audience', Audience.FRIENDS] },
                                    viewerId ? { $gte: [{ $size: '$friendship' }, 2] } : { $eq: [1, 2] } // vô hiệu nếu ko có viewer
                                ]
                            },
                            {
                                $and: [
                                    { $eq: ['$audience', Audience.PRIVATE] },
                                    viewerId ? { $eq: ['$user_id', viewerId] } : { $eq: [1, 2] }
                                ]
                            }
                        ]
                    }
                }
            },
            { $count: 'total' }
        ]

        const result = await databaseService.tiktokPost.aggregate(pipeline).toArray()
        return result[0]?.total || 0
    }

    async getFriendPostsTotal({ user_id }: { user_id: string }) {
        const viewerId = new ObjectId(user_id)

        const pipeline: any[] = [
            {
                $match: {
                    type: 0 // Hoặc PosterType.POST nếu có enum
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
                            { $eq: ['$audience', 0] }, // Public
                            {
                                $and: [
                                    { $eq: ['$audience', 2] }, // Friends
                                    { $gte: [{ $size: '$friendship' }, 2] }
                                ]
                            },
                            {
                                $and: [
                                    { $eq: ['$audience', 1] }, // Private
                                    { $eq: ['$user_id', viewerId] }
                                ]
                            }
                        ]
                    }
                }
            },
            {
                $count: 'total'
            }
        ]

        const result = await databaseService.tiktokPost.aggregate(pipeline).toArray()
        const total = result[0]?.total ?? 0
        return total
    }
}

const tikTokPostService = new TikTokPostService()
export default tikTokPostService
