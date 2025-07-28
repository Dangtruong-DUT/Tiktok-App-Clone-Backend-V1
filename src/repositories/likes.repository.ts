import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.service'
import Likes from '~/models/schemas/Likes.schemas'

class LikesRepository {
    private static instance: LikesRepository
    static getInstance(): LikesRepository {
        if (!LikesRepository.instance) {
            LikesRepository.instance = new LikesRepository()
        }
        return LikesRepository.instance
    }
    private constructor() {}

    async createLike({ post_id, user_id }: { post_id: string; user_id: string }) {
        const post_id_ObjectId = new ObjectId(post_id)
        const user_id_ObjectId = new ObjectId(user_id)

        return await databaseService.likes.findOneAndUpdate(
            {
                post_id: post_id_ObjectId,
                user_id: user_id_ObjectId
            },
            {
                $setOnInsert: new Likes({
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

    async deleteLike({ post_id, user_id }: { post_id: string; user_id: string }) {
        const post_id_ObjectId = new ObjectId(post_id)
        const user_id_ObjectId = new ObjectId(user_id)

        return await databaseService.likes.deleteOne({
            post_id: post_id_ObjectId,
            user_id: user_id_ObjectId
        })
    }

    async findLike({ post_id, user_id }: { post_id: string; user_id: string }) {
        const post_id_ObjectId = new ObjectId(post_id)
        const user_id_ObjectId = new ObjectId(user_id)

        return await databaseService.likes.findOne({
            post_id: post_id_ObjectId,
            user_id: user_id_ObjectId
        })
    }

    async countLikesByPost(post_id: string) {
        return await databaseService.likes.countDocuments({
            post_id: new ObjectId(post_id)
        })
    }

    async findLikesByUser(user_id: string, page = 0, limit = 10) {
        return await databaseService.likes
            .find({ user_id: new ObjectId(user_id) })
            .sort({ created_at: -1 })
            .skip(page * limit)
            .limit(limit)
            .toArray()
    }

    async findLikesByPost(post_id: string, page = 0, limit = 10) {
        return await databaseService.likes
            .find({ post_id: new ObjectId(post_id) })
            .sort({ created_at: -1 })
            .skip(page * limit)
            .limit(limit)
            .toArray()
    }
}

export default LikesRepository.getInstance()
