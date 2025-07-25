import { Request, Response } from 'express'
import { SearchQuery } from '~/models/requests/search.requests'

export const searchController = async (req: Request, res: Response) => {
    const { q, page = 1, limit = 10 } = req.query as unknown as SearchQuery
    return res.json({
        message: 'Search endpoint is not implemented yet'
    })
}
