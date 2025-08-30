import { SearchQuery } from '~/models/requests/search.requests'
import tikTokPostRepository from '~/repositories/TiktokPost.repository'
import usersRepository from '~/repositories/users.repository'

class SearchService {
    private static instance: SearchService

    private constructor() {}

    public static getInstance(): SearchService {
        if (!SearchService.instance) {
            SearchService.instance = new SearchService()
        }
        return SearchService.instance
    }

    public async search({ q, limit = 10, page = 0, user_id }: SearchQuery & { user_id?: string }) {
        const [posts, total] = await Promise.all([
            tikTokPostRepository.searchPostsByQueryContent({
                query: q,
                limit,
                page,
                viewer_id: user_id
            }),
            tikTokPostRepository.countSearchPostsByQueryContent({
                query: q,
                viewer_id: user_id
            })
        ])
        return { posts, total }
    }
    public async searchHashtags({ q, limit = 10, page = 0, user_id }: SearchQuery & { user_id?: string }) {
        const [posts, total] = await Promise.all([
            tikTokPostRepository.searchPostsByHashtagName({
                query: q,
                limit,
                page,
                viewer_id: user_id
            }),
            tikTokPostRepository.countSearchPostsByHashtagName({
                query: q,
                viewer_id: user_id
            })
        ])
        return { posts, total }
    }
    public async searchUsers({ q, limit = 10, page = 0, user_id }: SearchQuery & { user_id?: string }) {
        const [users, total] = await Promise.all([
            usersRepository.searchUsers({
                query: q,
                limit,
                page,
                viewer_id: user_id
            }),
            usersRepository.countUsersByQuery(q)
        ])

        return { users, total }
    }
}

export default SearchService.getInstance()
