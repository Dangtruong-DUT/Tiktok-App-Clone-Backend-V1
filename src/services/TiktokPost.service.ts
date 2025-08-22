import { CreateTikTokPostBodyReq } from '~/models/requests/TiktokPost.requests'
import TikTokPost from '~/models/schemas/TikTokPost.schemas'
import { ObjectId } from 'mongodb'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { POST_MESSAGES } from '~/constants/messages/post'
import { PosterType } from '~/constants/enum'
import tikTokPostRepository from '~/repositories/TiktokPost.repository'
import hashtagRepository from '~/repositories/hashtag.repository'

class TikTokPostService {
    async getUserPosts({
        user_id,
        viewer_id,
        page = 1,
        limit = 10
    }: {
        user_id: string
        viewer_id?: string
        page?: number
        limit?: number
    }) {
        // Implement fetching user posts with correct pipeline and meta
        // You may want to use a similar aggregation as in repository, but for now, call repository (to be refactored if needed)
        const [posts, total] = await Promise.all([
            tikTokPostRepository.findUserPosts({ user_id, viewer_id, page, limit }),
            tikTokPostRepository.countUserPosts({ user_id, viewer_id })
        ])
        return { posts, total }
    }

    async getUserBookmarks({
        user_id,
        viewer_id,
        page = 1,
        limit = 10
    }: {
        user_id: string
        viewer_id?: string
        page?: number
        limit?: number
    }) {
        return await tikTokPostRepository.findUserBookmarks({ user_id, viewer_id, page, limit })
    }

    async getUserLikedPosts({
        user_id,
        viewer_id,
        page = 1,
        limit = 10
    }: {
        user_id: string
        viewer_id?: string
        page?: number
        limit?: number
    }) {
        return await tikTokPostRepository.findUserLikedPosts({ user_id, viewer_id, page, limit })
    }
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
                user_views: 0,
                thumbnail_url: payload.thumbnail_url || ''
            })
        )
        const post = await this.getPostDetail({
            post_id: result.insertedId.toString(),
            user_id
        })

        return post
    }

    async getPostDetail({ post_id, user_id }: { post_id: string; user_id?: string }) {
        const post = await tikTokPostRepository.findPostById({ post_id, viewer_id: user_id })
        if (!post) {
            throw new ErrorWithStatus({
                message: POST_MESSAGES.POST_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
            })
        }
        return post
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

    async getRelatedPosts({
        post_id,
        page = 1,
        limit = 10,
        user_id
    }: {
        post_id: string
        page?: number
        limit?: number
        user_id?: string
    }) {
        const [posts, total] = await Promise.all([
            tikTokPostRepository.findRelatedPosts({ post_id, page, limit, viewer_id: user_id }),
            tikTokPostRepository.countRelatedPosts({ post_id, viewer_id: user_id })
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
    async getPostsNoFollowing({ page, limit, user_id }: { page?: number; limit?: number; user_id: string }) {
        const [posts, total] = await Promise.all([
            tikTokPostRepository.findPostsNoFollowing({ page, limit, user_id }),
            tikTokPostRepository.countPostsNoFollowing(user_id)
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
