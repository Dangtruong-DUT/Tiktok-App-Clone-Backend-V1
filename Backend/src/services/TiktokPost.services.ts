import { TikTokPostBodyReq } from '~/models/requests/TiktokPost.requests'
import databaseService from './database.services'
import TikTokPost from '~/models/schemas/TikTokPost.schemas'
import { ObjectId, WithId } from 'mongodb'
import Hashtag from '~/models/schemas/Hashtag.schemas'
import Bookmarks from '~/models/schemas/Bookmarks.schemas'

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
    async createPost({ payload, user_id }: { payload: TikTokPostBodyReq; user_id: string }) {
        const hashtags = await this.checkAndCreateHashtags(payload.hashtags)

        const result = await databaseService.tiktokPost.insertOne(
            new TikTokPost({
                user_id: new ObjectId(user_id),
                audience: payload.audience,
                content: payload.content,
                type: payload.type,
                guest_views: payload.guest_views,
                hashtags: hashtags,
                mentions: payload.mentions,
                medias: payload.medias,
                parent_id: payload.parent_id,
                user_views: payload.user_views
            })
        )
        const post = await this.getPostById(result.insertedId.toString())
        return post
    }
    async getPostById(post_id: string) {
        const result = await databaseService.tiktokPost.findOne({ _id: new ObjectId(post_id) })
        return result
    }
}

const tikTokPostService = new TikTokenService()
export default tikTokPostService
