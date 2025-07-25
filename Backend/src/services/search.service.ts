import { SearchQuery } from '~/models/requests/search.requests'
import tikTokPostRepository from '~/repositories/TiktokPost.repository'

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
        const posts = await tikTokPostRepository.searchPostsByQueryContent({
            query: q,
            limit,
            page,
            viewer_id: user_id
        })
    }
}

export default SearchService.getInstance()
