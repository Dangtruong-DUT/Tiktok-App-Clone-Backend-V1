import { Request, Response } from 'express'
import { SEARCH_MESSAGES } from '~/constants/messages/search'
import { TokenPayload } from '~/models/requests/common.requests'
import { SearchQuery } from '~/models/requests/search.requests'
import searchService from '~/services/search.service'

export const searchController = async (req: Request, res: Response) => {
    const { q, page = 1, limit = 10 } = req.query as unknown as SearchQuery
    const query = decodeURIComponent(q)
    const user_id = (req.decoded_authorization as TokenPayload)?.user_id
    const { posts, total } = await searchService.search({ q: query, page: Number(page), limit: Number(limit), user_id })
    const total_Pages = Math.ceil(total / Number(limit))
    return res.json({
        message: SEARCH_MESSAGES.SEARCH_SUCCESS,
        data: posts,
        meta: {
            total_Pages,
            page: Number(page),
            limit: Number(limit)
        }
    })
}

export const searchHashtagsController = async (req: Request, res: Response) => {
    const { q, page = 1, limit = 10 } = req.query as unknown as SearchQuery
    const query = decodeURIComponent(q)
    const user_id = (req.decoded_authorization as TokenPayload)?.user_id
    const { posts, total } = await searchService.searchHashtags({
        q: query,
        page: Number(page),
        limit: Number(limit),
        user_id
    })
    const total_Pages = Math.ceil(total / Number(limit))
    return res.json({
        message: SEARCH_MESSAGES.SEARCH_HASHTAGS_SUCCESS,
        data: posts,
        meta: {
            total_Pages,
            page: Number(page),
            limit: Number(limit)
        }
    })
}

export const searchUsersController = async (req: Request, res: Response) => {
    const { q, page = 1, limit = 10 } = req.query as unknown as SearchQuery
    const query = decodeURIComponent(q)
    const { user_id } = req.decoded_authorization || {}
    const { users, total } = await searchService.searchUsers({
        q: query,
        page: Number(page),
        limit: Number(limit),
        user_id
    })
    const total_Pages = Math.ceil(total / Number(limit))
    return res.json({
        message: SEARCH_MESSAGES.SEARCH_SUCCESS,
        data: users,
        meta: {
            total_Pages,
            page: Number(page),
            limit: Number(limit)
        }
    })
}
