import { Router } from 'express'
import { searchController, searchHashtagsController, searchUsersController } from '~/controllers/search.controller'
import { wrapRequestHandler } from '~/utils/handlers'
import { searchValidator } from '~/validations/search.validations'

const searchRoutes = Router()

/**
 * Description. Search posts by hashtags
 * Path: /hashtags
 * method: GET
 * query: {
 *  q: string
 *  page: number
 *  limit: number
 * }
 */

searchRoutes.get('/hashtags', searchValidator, wrapRequestHandler(searchHashtagsController))

/**
 * Description. Search  posts by content
 * Path: /
 * method: GET
 * query: {
 *  q: string
 *  page: number
 *  limit: number
 * }
 */

searchRoutes.get('/', searchValidator, wrapRequestHandler(searchController))

/**
 * Description. Search users by query
 * Path: /users
 * method: GET
 * query: {
 * q: string
 * page: number
 * limit: number
 * }
 * */

searchRoutes.get('/users', searchValidator, wrapRequestHandler(searchUsersController))

export default searchRoutes
