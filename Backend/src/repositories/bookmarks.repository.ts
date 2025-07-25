import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'
import Bookmarks from '~/models/schemas/Bookmarks.schemas'

class BookmarksRepository {
    async createBookmark({ post_id, user_id }: { post_id: string; user_id: string }) {
        const post_id_ObjectId = new ObjectId(post_id)
        const user_id_ObjectId = new ObjectId(user_id)

        return await databaseService.bookmarks.findOneAndUpdate(
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
    }

    async deleteBookmark({ post_id, user_id }: { post_id: string; user_id: string }) {
        const post_id_ObjectId = new ObjectId(post_id)
        const user_id_ObjectId = new ObjectId(user_id)

        return await databaseService.bookmarks.deleteOne({
            post_id: post_id_ObjectId,
            user_id: user_id_ObjectId
        })
    }

    async findBookmark({ post_id, user_id }: { post_id: string; user_id: string }) {
        const post_id_ObjectId = new ObjectId(post_id)
        const user_id_ObjectId = new ObjectId(user_id)

        return await databaseService.bookmarks.findOne({
            post_id: post_id_ObjectId,
            user_id: user_id_ObjectId
        })
    }

    async countBookmarksByPost(post_id: string) {
        return await databaseService.bookmarks.countDocuments({
            post_id: new ObjectId(post_id)
        })
    }

    async findBookmarksByUser(user_id: string, page = 0, limit = 10) {
        return await databaseService.bookmarks
            .find({ user_id: new ObjectId(user_id) })
            .sort({ created_at: -1 })
            .skip(page * limit)
            .limit(limit)
            .toArray()
    }
}

const bookmarksRepository = new BookmarksRepository()
export default bookmarksRepository
