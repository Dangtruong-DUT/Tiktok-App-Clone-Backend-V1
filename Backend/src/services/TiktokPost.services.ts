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
                    $addFields: {
                        views_count: {
                            $add: ['$guest_views', '$user_views']
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
        type = 3,
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
        const posts = await databaseService.tiktokPost
            .aggregate<TikTokPost>([
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
                                        $eq: ['$$item.type', PosterType.Reports]
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
                                        $eq: ['$$item.type', PosterType.Comment]
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
                                        $eq: ['$$item.type', PosterType.quotePost]
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $project: {
                        post_children: 0
                    }
                },
                {
                    $skip: page > 0 ? (page - 1) * limit : 0
                },
                {
                    $limit: limit
                }
            ])
            .toArray()

        const postsAfterIncreaseViews = await Promise.all(
            posts.map(async (post) => {
                let mutateData = {}
                if (post && post._id) {
                    mutateData = await this.increasePostViews({ post_id: post._id.toString(), user_id })
                }
                return {
                    ...post,
                    ...mutateData
                }
            })
        )

        return postsAfterIncreaseViews
    }

    async getTotalChildrenPosts({ post_id, type = 3 }: { post_id: string; type: number }) {
        const count = await databaseService.tiktokPost.countDocuments({
            parent_id: new ObjectId(post_id),
            type: Number(type)
        })
        return count
    }
}

const tikTokPostService = new TikTokPostService()
export default tikTokPostService
