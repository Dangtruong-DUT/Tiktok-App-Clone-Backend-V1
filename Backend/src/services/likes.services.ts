import Bookmarks from '~/models/schemas/Bookmarks.schemas'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'

class LikePostService {
    async LikePost({ post_id, user_id }: { post_id: string; user_id: string }) {
        const post_id_ObjectId = new ObjectId(post_id)
        const user_id_ObjectId = new ObjectId(user_id)
        const result = await databaseService.likes.findOneAndUpdate(
            {
                post_id: post_id_ObjectId,
                user_id: user_id_ObjectId
            },
            {
                $setOnInsert: new Bookmarks({
                    post_id: post_id_ObjectId,
                    user_id: user_id_ObjectId
                })
            },
            {
                upsert: true,
                returnDocument: 'after'
            }
        )
        return result
    }
    async unLikePost({ post_id, user_id }: { post_id: string; user_id: string }) {
        const post_id_ObjectId = new ObjectId(post_id)
        const user_id_ObjectId = new ObjectId(user_id)
        const result = await databaseService.likes.deleteOne({
            post_id: post_id_ObjectId,
            user_id: user_id_ObjectId
        })
        return result
    }
}
const likePostService = new LikePostService()
export default likePostService
