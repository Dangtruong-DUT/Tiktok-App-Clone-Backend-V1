import { Router } from 'express'
import { searchController } from '~/controllers/search.controller'
import { wrapRequestHandler } from '~/utils/handlers'

const searchRoutes = Router()

/**
 * Description. Search users, posts, hashtags
 * Path: /
 * method: GET
 * query: {
 *  q: string
 *  page: number
 *  limit: number
 * }
 */

searchRoutes.get('/', wrapRequestHandler(searchController))

export default searchRoutes
