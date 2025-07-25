import likesRepository from '~/repositories/likes.repository'

class LikePostService {
    async LikePost({ post_id, user_id }: { post_id: string; user_id: string }) {
        return await likesRepository.createLike({ post_id, user_id })
    }

    async unLikePost({ post_id, user_id }: { post_id: string; user_id: string }) {
        return await likesRepository.deleteLike({ post_id, user_id })
    }

    async checkLikeExists({ post_id, user_id }: { post_id: string; user_id: string }) {
        const like = await likesRepository.findLike({ post_id, user_id })
        return !!like
    }

    async getLikesByUser(user_id: string, page = 0, limit = 10) {
        return await likesRepository.findLikesByUser(user_id, page, limit)
    }

    async getLikesByPost(post_id: string, page = 0, limit = 10) {
        return await likesRepository.findLikesByPost(post_id, page, limit)
    }
}

const likePostService = new LikePostService()
export default likePostService
