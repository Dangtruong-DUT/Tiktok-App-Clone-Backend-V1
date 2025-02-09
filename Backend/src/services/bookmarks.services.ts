import Bookmarks from '~/models/schemas/Bookmarks.schemas'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'

class BookMarkPostService {
    async bookMarkPost({ post_id, user_id }: { post_id: string; user_id: string }) {
        const post_id_ObjectId = new ObjectId(post_id)
        const user_id_ObjectId = new ObjectId(user_id)
        const result = await databaseService.bookmarks.findOneAndUpdate(
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
    async unBookMarkPost({ post_id, user_id }: { post_id: string; user_id: string }) {
        const post_id_ObjectId = new ObjectId(post_id)
        const user_id_ObjectId = new ObjectId(user_id)
        const result = await databaseService.bookmarks.deleteOne({
            post_id: post_id_ObjectId,
            user_id: user_id_ObjectId
        })
        return result
    }
    async unBookMarkPostByBookmarkId(bookmark_id: string) {
        const result = await databaseService.bookmarks.deleteOne({
            _id: new ObjectId(bookmark_id)
        })
        return result
    }
}
const bookMarkPostService = new BookMarkPostService()
export default bookMarkPostService
