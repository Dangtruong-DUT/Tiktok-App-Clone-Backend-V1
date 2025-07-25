import { Request, Response } from 'express'
import { SearchQuery } from '~/models/requests/search.requests'
import searchService from '~/services/search.service'

export const searchController = async (req: Request, res: Response) => {
    const { q, page = 1, limit = 10 } = req.query as unknown as SearchQuery
    const query = decodeURIComponent(q)
    const posts = await searchService.search({ q: query, page: Number(page), limit: Number(limit) })
    return res.json({
        message: 'Search endpoint is not implemented yet',
        data: posts
    })
}
