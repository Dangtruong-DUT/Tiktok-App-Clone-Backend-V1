import bookmarksRepository from '~/repositories/bookmarks.repository'

class BookMarkPostService {
    async bookMarkPost({ post_id, user_id }: { post_id: string; user_id: string }) {
        return await bookmarksRepository.createBookmark({ post_id, user_id })
    }

    async unBookMarkPost({ post_id, user_id }: { post_id: string; user_id: string }) {
        return await bookmarksRepository.deleteBookmark({ post_id, user_id })
    }

    async checkBookmarkExists({ post_id, user_id }: { post_id: string; user_id: string }) {
        const bookmark = await bookmarksRepository.findBookmark({ post_id, user_id })
        return !!bookmark
    }

    async getBookmarksByUser(user_id: string, page = 0, limit = 10) {
        return await bookmarksRepository.findBookmarksByUser(user_id, page, limit)
    }
}

const bookMarkPostService = new BookMarkPostService()
export default bookMarkPostService
