import { CreateTikTokPostBodyReq } from '~/models/requests/TiktokPost.requests'
import databaseService from './database.services'
import TikTokPost from '~/models/schemas/TikTokPost.schemas'
import { ObjectId, WithId } from 'mongodb'
import Hashtag from '~/models/schemas/Hashtag.schemas'

class TikTokenService {
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
        const result = await databaseService.tiktokPost.findOne({ _id: new ObjectId(post_id) })
        const bookmarks_count = await databaseService.bookmarks.countDocuments({ post_id: new ObjectId(post_id) })
        const likes_count = await databaseService.likes.countDocuments({ post_id: new ObjectId(post_id) })
        return {
            ...result,
            bookmarks_count,
            likes_count
        }
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
            return null
        }
        return {
            ...post,
            is_liked,
            is_bookmarked
        }
    }
}

const tikTokPostService = new TikTokenService()
export default tikTokPostService
