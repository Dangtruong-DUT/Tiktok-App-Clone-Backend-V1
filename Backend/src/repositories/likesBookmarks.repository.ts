import likesRepository from './likes.repository'
import bookmarksRepository from './bookmarks.repository'

class LikesBookmarksRepository {
    async checkIsLiked(post_id: string, user_id: string) {
        const like = await likesRepository.findLike({ post_id, user_id })
        return !!like
    }

    async checkIsBookmarked(post_id: string, user_id: string) {
        const bookmark = await bookmarksRepository.findBookmark({ post_id, user_id })
        return !!bookmark
    }
}

const likesBookmarksRepository = new LikesBookmarksRepository()
export default likesBookmarksRepository
