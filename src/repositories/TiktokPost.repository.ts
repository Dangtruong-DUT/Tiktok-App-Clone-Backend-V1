import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.service'
import TikTokPost from '~/models/schemas/TikTokPost.schemas'
import { PosterType } from '~/constants/enum'
import {
    lookupHashtags,
    lookupMentions,
    addMentionsFields,
    lookupLikes,
    lookupBookmarks,
    addStatsFields,
    lookupChildrenPosts,
    addChildrenCounts
} from './pipelines/postCommonPipelines'
import {
    lookupFriendship,
    matchAudience,
    lookupViewerStats,
    LookUpFollowing,
    isMatchFollowing
} from './pipelines/postViewerPipelines'
import { lookupAuthor, addAuthorField } from './pipelines/postAuthorPipelines'
import { TiktokPostResponseType } from '~/models/responses/post.response'

class TikTokPostRepository {
    private static instance: TikTokPostRepository
    static getInstance(): TikTokPostRepository {
        if (!TikTokPostRepository.instance) {
            TikTokPostRepository.instance = new TikTokPostRepository()
        }
        return TikTokPostRepository.instance
    }
    private constructor() {}

    async findRelatedPosts({
        post_id,
        page = 1,
        limit = 10,
        viewer_id
    }: {
        post_id: string
        page?: number
        limit?: number
        viewer_id?: string
    }) {
        const post = await databaseService.tiktokPost.findOne({ _id: new ObjectId(post_id) })
        if (!post) return []
        const hashtags = post.hashtags || []
        const content = post.content || ''
        const authorId = post.user_id
        const regexContent = content
            ? content
                  .replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1')
                  .split('')
                  .join('|')
            : ''
        const viewerId = viewer_id ? new ObjectId(viewer_id) : new ObjectId('000000000000000000000000')
        const matchStage = {
            $match: {
                type: PosterType.POST,
                _id: { $ne: new ObjectId(post_id) },
                $or: [
                    { user_id: authorId },
                    { hashtags: { $in: hashtags } },
                    ...(regexContent ? [{ content: { $regex: regexContent, $options: 'i' } }] : [])
                ]
            }
        }
        const skip = (page - 1) * limit
        const pipeline = [
            matchStage,
            lookupFriendship(viewerId),
            ...matchAudience(viewerId),
            lookupHashtags(),
            lookupMentions(),
            addMentionsFields(),
            lookupLikes(),
            lookupBookmarks(),
            addStatsFields(),
            lookupChildrenPosts(),
            addChildrenCounts(),
            ...lookupViewerStats(viewerId),
            { $sort: { created_at: -1 } },
            { $skip: skip },
            { $limit: limit },
            lookupAuthor(),
            addAuthorField()
        ]
        return await databaseService.tiktokPost.aggregate<TiktokPostResponseType>(pipeline).toArray()
    }

    async countRelatedPosts({ post_id, viewer_id }: { post_id: string; viewer_id?: string }) {
        const post = await databaseService.tiktokPost.findOne({ _id: new ObjectId(post_id) })
        if (!post) return 0
        const hashtags = post.hashtags || []
        const content = post.content || ''
        const authorId = post.user_id
        const regexContent = content
            ? content
                  .replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1')
                  .split('')
                  .join('|')
            : ''
        const viewerId = viewer_id ? new ObjectId(viewer_id) : new ObjectId('000000000000000000000000')
        const matchStage = {
            $match: {
                type: PosterType.POST,
                _id: { $ne: new ObjectId(post_id) },
                $or: [
                    { user_id: authorId },
                    { hashtags: { $in: hashtags } },
                    ...(regexContent ? [{ content: { $regex: regexContent, $options: 'i' } }] : [])
                ]
            }
        }
        const pipeline = [matchStage, lookupFriendship(viewerId), ...matchAudience(viewerId), { $count: 'total' }]
        const [result] = await databaseService.tiktokPost.aggregate(pipeline).toArray()
        return result?.total || 0
    }
    async findUserPosts({
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
        const viewerId = viewer_id ? new ObjectId(viewer_id) : null
        const skip = (page - 1) * limit
        const match = { user_id: new ObjectId(user_id), type: 0 }
        const pipeline = [
            { $match: match },
            lookupFriendship(viewerId),
            ...matchAudience(viewerId),
            lookupHashtags(),
            lookupMentions(),
            addMentionsFields(),
            lookupLikes(),
            lookupBookmarks(),
            addStatsFields(),
            lookupChildrenPosts(),
            addChildrenCounts(),
            ...lookupViewerStats(viewerId),
            { $sort: { created_at: -1 } },
            { $skip: skip },
            { $limit: limit },
            lookupAuthor(),
            addAuthorField()
        ]
        return await databaseService.tiktokPost.aggregate(pipeline).toArray()
    }

    async countUserPosts({ user_id, viewer_id }: { user_id: string; viewer_id?: string }) {
        const viewerId = viewer_id ? new ObjectId(viewer_id) : null
        const match = { user_id: new ObjectId(user_id), type: 0 }
        const pipeline = [
            { $match: match },
            lookupFriendship(viewerId),
            ...matchAudience(viewerId),
            { $count: 'total' }
        ]
        const [result] = await databaseService.tiktokPost.aggregate(pipeline).toArray()
        return result?.total || 0
    }

    async findUserBookmarks({
        user_id,
        viewer_id,
        page = 1,
        limit = 10
    }: {
        user_id: string
        viewer_id?: string
        page?: number
        limit?: number
    }): Promise<{ posts: unknown[]; total: number }> {
        const viewerId = viewer_id ? new ObjectId(viewer_id) : null
        const skip = (page - 1) * limit
        const bookmarks = await databaseService.bookmarks.find({ user_id: new ObjectId(user_id) }).toArray()
        const postIds = bookmarks.map((b) => b.post_id)
        const match = { _id: { $in: postIds }, type: PosterType.POST }
        const pipeline = [
            { $match: match },
            lookupFriendship(viewerId),
            ...matchAudience(viewerId),
            lookupHashtags(),
            lookupMentions(),
            addMentionsFields(),
            lookupLikes(),
            lookupBookmarks(),
            addStatsFields(),
            lookupChildrenPosts(),
            addChildrenCounts(),
            ...lookupViewerStats(viewerId),
            { $sort: { created_at: -1 } },
            { $skip: skip },
            { $limit: limit },
            lookupAuthor(),
            addAuthorField()
        ]
        const posts = await databaseService.tiktokPost.aggregate(pipeline).toArray()
        const total = bookmarks.length
        return { posts, total }
    }

    async findUserLikedPosts({
        user_id,
        viewer_id,
        page = 1,
        limit = 10
    }: {
        user_id: string
        viewer_id?: string
        page?: number
        limit?: number
    }): Promise<{ posts: unknown[]; total: number }> {
        const viewerId = viewer_id ? new ObjectId(viewer_id) : null
        const skip = (page - 1) * limit
        const likes = await databaseService.likes.find({ user_id: new ObjectId(user_id) }).toArray()
        const postIds = likes.map((l) => l.post_id)
        const match = { _id: { $in: postIds }, type: PosterType.POST }
        const pipeline = [
            { $match: match },
            lookupFriendship(viewerId),
            ...matchAudience(viewerId),
            lookupHashtags(),
            lookupMentions(),
            addMentionsFields(),
            lookupLikes(),
            lookupBookmarks(),
            addStatsFields(),
            lookupChildrenPosts(),
            addChildrenCounts(),
            ...lookupViewerStats(viewerId),
            { $sort: { created_at: -1 } },
            { $skip: skip },
            { $limit: limit },
            lookupAuthor(),
            addAuthorField()
        ]
        const posts = await databaseService.tiktokPost.aggregate(pipeline).toArray()
        const total = likes.length
        return { posts, total }
    }

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
        const skip = page > 0 ? (page - 1) * limit : 0
        const pipeline = [
            { $match: { $text: { $search: query }, type: PosterType.POST } },
            lookupFriendship(viewerId),
            ...matchAudience(viewerId),
            lookupHashtags(),
            lookupMentions(),
            addMentionsFields(),
            lookupLikes(),
            lookupBookmarks(),
            addStatsFields(),
            lookupChildrenPosts(),
            addChildrenCounts(),
            ...lookupViewerStats(viewerId),
            lookupAuthor(),
            addAuthorField(),
            { $sort: { created_at: -1 } },
            { $skip: skip },
            { $limit: limit }
        ]
        return await databaseService.tiktokPost.aggregate(pipeline).toArray()
    }

    async countSearchPostsByQueryContent({ query, viewer_id }: { query: string; viewer_id?: string }) {
        const viewerId = viewer_id ? new ObjectId(viewer_id) : null
        const pipeline = [
            { $match: { $text: { $search: query }, type: PosterType.POST } },
            lookupFriendship(viewerId),
            ...matchAudience(viewerId),
            { $count: 'total' }
        ]
        const [result] = await databaseService.tiktokPost.aggregate(pipeline).toArray()
        return result?.total || 0
    }

    async findPostById({ post_id, viewer_id }: { post_id: string; viewer_id?: string }) {
        const viewerId = viewer_id ? new ObjectId(viewer_id) : null
        const pipeline = [
            { $match: { _id: new ObjectId(post_id) } },
            lookupHashtags(),
            lookupMentions(),
            addMentionsFields(),
            lookupLikes(),
            lookupBookmarks(),
            addStatsFields(),
            lookupChildrenPosts(),
            addChildrenCounts(),
            ...lookupViewerStats(viewerId),
            lookupAuthor(),
            addAuthorField()
        ]
        const [result] = await databaseService.tiktokPost.aggregate<TiktokPostResponseType>(pipeline).toArray()
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
        const skip = page > 0 ? (page - 1) * limit : 0
        const pipeline = [
            { $match: { type: PosterType.POST } },
            lookupFriendship(viewerId),
            ...matchAudience(viewerId),
            LookUpFollowing(viewerId),
            ...isMatchFollowing(),
            lookupHashtags(),
            lookupMentions(),
            addMentionsFields(),
            lookupLikes(),
            lookupBookmarks(),
            addStatsFields(),
            lookupChildrenPosts(),
            addChildrenCounts(),
            lookupAuthor(),
            addAuthorField(),
            ...lookupViewerStats(viewerId),
            { $sort: { created_at: -1 } },
            { $skip: skip },
            { $limit: limit }
        ]
        return await databaseService.tiktokPost.aggregate<TiktokPostResponseType>(pipeline).toArray()
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
        const skip = page > 0 ? (page - 1) * limit : 0
        const pipeline = [
            { $match: { $text: { $search: query }, type: PosterType.POST } },
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
            lookupFriendship(viewerId),
            ...matchAudience(viewerId),
            lookupHashtags(),
            lookupMentions(),
            addMentionsFields(),
            lookupLikes(),
            lookupBookmarks(),
            addStatsFields(),
            lookupChildrenPosts(),
            addChildrenCounts(),
            ...lookupViewerStats(viewerId),
            { $sort: { created_at: -1 } },
            { $skip: skip },
            { $limit: limit }
        ]
        return await databaseService.hashtags.aggregate<TiktokPostResponseType>(pipeline).toArray()
    }

    async countSearchPostsByHashtagName({ query, viewer_id }: { query: string; viewer_id?: string }) {
        const viewerId = viewer_id ? new ObjectId(viewer_id) : null
        const pipeline = [
            { $match: { $text: { $search: query } } },
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
            lookupFriendship(viewerId),
            ...matchAudience(viewerId),
            { $count: 'total' }
        ]
        const [result] = await databaseService.hashtags.aggregate(pipeline).toArray()
        return result?.total || 0
    }

    async countFriendPosts(user_id: string) {
        const viewerId = new ObjectId(user_id)
        const pipeline = [
            { $match: { type: 0 } },
            lookupFriendship(viewerId),
            ...matchAudience(viewerId),
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
        const skip = page > 0 ? (page - 1) * limit : 0
        const pipeline = [
            { $match: { parent_id: new ObjectId(post_id), type: Number(type) } },
            lookupFriendship(viewerId),
            ...matchAudience(viewerId),
            lookupHashtags(),
            lookupMentions(),
            addMentionsFields(),
            lookupLikes(),
            lookupBookmarks(),
            addStatsFields(),
            lookupChildrenPosts(),
            addChildrenCounts(),
            ...lookupViewerStats(viewerId),
            { $sort: { created_at: -1 } },
            { $skip: skip },
            { $limit: limit },
            lookupAuthor(),
            addAuthorField()
        ]
        return await databaseService.tiktokPost.aggregate<TiktokPostResponseType>(pipeline).toArray()
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
            lookupFriendship(viewerId),
            ...matchAudience(viewerId),
            { $count: 'total' }
        ]
        const [result] = await databaseService.tiktokPost.aggregate(pipeline).toArray()
        return result?.total || 0
    }

    async countSearchUser({ query }: { query: string }) {
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
        const skip = page > 0 ? (page - 1) * limit : 0
        const pipeline = [
            { $match: { type: PosterType.POST } },
            lookupFriendship(viewerId),
            ...matchAudience(viewerId),
            lookupHashtags(),
            lookupMentions(),
            addMentionsFields(),
            lookupLikes(),
            lookupBookmarks(),
            addStatsFields(),
            lookupChildrenPosts(),
            addChildrenCounts(),
            ...lookupViewerStats(viewerId),
            { $sort: { created_at: -1 } },
            { $skip: skip },
            { $limit: limit },
            lookupAuthor(),
            addAuthorField()
        ]
        return await databaseService.tiktokPost.aggregate<TiktokPostResponseType>(pipeline).toArray()
    }

    async countForYouPosts(user_id?: string) {
        const viewerId = user_id ? new ObjectId(user_id) : new ObjectId('000000000000000000000000')
        const pipeline = [
            { $match: { type: PosterType.POST } },
            lookupFriendship(viewerId),
            ...matchAudience(viewerId),
            { $count: 'total' }
        ]
        const [result] = await databaseService.tiktokPost.aggregate(pipeline).toArray()
        return result?.total || 0
    }

    async findPostsNoFollowing({ page = 0, limit = 10, user_id }: { page?: number; limit?: number; user_id?: string }) {
        const viewerId = user_id ? new ObjectId(user_id) : null
        const skip = page > 0 ? (page - 1) * limit : 0
        const pipeline = [
            { $match: { user_id: { $ne: viewerId } } },
            { $match: { type: PosterType.POST } },
            lookupFriendship(viewerId),
            ...matchAudience(viewerId),
            lookupHashtags(),
            lookupMentions(),
            addMentionsFields(),
            lookupLikes(),
            lookupBookmarks(),
            addStatsFields(),
            lookupChildrenPosts(),
            addChildrenCounts(),
            ...lookupViewerStats(viewerId),
            { $sort: { created_at: -1 } },
            lookupAuthor(),
            addAuthorField(),
            {
                $group: {
                    _id: '$user_id',
                    latestPost: { $first: '$$ROOT' }
                }
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: '$latestPost' } }
            },
            { $skip: skip },
            { $limit: limit }
        ]
        return await databaseService.tiktokPost.aggregate<TiktokPostResponseType>(pipeline).toArray()
    }
    async countPostsNoFollowing(user_id?: string) {
        const viewerId = user_id ? new ObjectId(user_id) : null
        const pipeline = [
            { $match: { user_id: { $ne: viewerId } } },
            { $match: { type: PosterType.POST } },
            lookupFriendship(viewerId),
            ...matchAudience(viewerId),
            {
                $group: {
                    _id: '$user_id',
                    latestPost: { $first: '$$ROOT' }
                }
            },
            { $count: 'total' }
        ]
        const [result] = await databaseService.tiktokPost.aggregate(pipeline).toArray()
        return result?.total || 0
    }

    async delete(post_id: string) {
        await databaseService.tiktokPost.deleteOne({ _id: new ObjectId(post_id) })
    }

    async update(post_id: string, updateFields: object) {
        await databaseService.tiktokPost.updateOne({ _id: new ObjectId(post_id) }, updateFields)
    }
}

export default TikTokPostRepository.getInstance()
