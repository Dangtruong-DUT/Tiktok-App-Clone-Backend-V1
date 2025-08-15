import { CreateTikTokPostBodyReq } from '~/models/requests/TiktokPost.requests'
import TikTokPost from '~/models/schemas/TikTokPost.schemas'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { POST_MESSAGES } from '~/constants/messages/post'
import { PosterType } from '~/constants/enum'
import tikTokPostRepository from '~/repositories/TiktokPost.repository'
import hashtagRepository from '~/repositories/hashtag.repository'
import likesBookmarksRepository from '~/repositories/likesBookmarks.repository'

class TikTokPostService {
    private static instance: TikTokPostService
    private constructor() {}
    static getInstance(): TikTokPostService {
        if (!TikTokPostService.instance) {
            TikTokPostService.instance = new TikTokPostService()
        }
        return TikTokPostService.instance
    }

    async checkAndCreateHashtags(hashtags: string[]) {
        return await hashtagRepository.findAndCreateHashtags(hashtags)
    }

    async createPost({ payload, user_id }: { payload: CreateTikTokPostBodyReq; user_id: string }) {
        const hashtags = await this.checkAndCreateHashtags(payload.hashtags)

        const result = await tikTokPostRepository.insertPost(
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
        return await tikTokPostRepository.findPostById(post_id)
    }

    async getPostDetail({ post_id, user_id }: { post_id: string; user_id?: string }) {
        let is_liked = false
        let is_bookmarked = false

        if (user_id) {
            is_liked = await likesBookmarksRepository.checkIsLiked(post_id, user_id)
            is_bookmarked = await likesBookmarksRepository.checkIsBookmarked(post_id, user_id)
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
        const result = await tikTokPostRepository.updatePostViews(post_id, user_id)

        if (!result) {
            throw new ErrorWithStatus({
                message: POST_MESSAGES.POST_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
            })
        }

        return result
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
        const [posts, total] = await Promise.all([
            tikTokPostRepository.findChildrenPosts({
                post_id,
                type,
                page,
                limit,
                user_id
            }),
            tikTokPostRepository.countChildrenPosts({ post_id, type, user_id })
        ])

        const postsAfterIncreaseViews = await Promise.all(
            posts.map(async (post: { _id?: ObjectId; [key: string]: unknown }) => {
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

        return {
            posts: postsAfterIncreaseViews,
            total
        }
    }

    async getFriendPosts({ user_id, page = 0, limit = 10 }: { user_id: string; page?: number; limit?: number }) {
        const [posts, total] = await Promise.all([
            tikTokPostRepository.findFriendPosts({ user_id, page, limit }),
            tikTokPostRepository.countFriendPosts(user_id)
        ])

        const postsAfterIncreaseViews = await Promise.all(
            posts.map(async (post: { _id?: ObjectId; [key: string]: unknown }) => {
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

        return {
            posts: postsAfterIncreaseViews,
            total
        }
    }

    async getForYouPosts({ user_id, page = 0, limit = 10 }: { user_id?: string; page?: number; limit?: number }) {
        const [posts, total] = await Promise.all([
            tikTokPostRepository.findForYouPosts({ user_id, page, limit }),
            tikTokPostRepository.countForYouPosts(user_id)
        ])

        const postsAfterIncreaseViews = await Promise.all(
            posts.map(async (post: { _id?: ObjectId; [key: string]: unknown }) => {
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

        return {
            posts: postsAfterIncreaseViews,
            total
        }
    }
}

export default TikTokPostService.getInstance()
