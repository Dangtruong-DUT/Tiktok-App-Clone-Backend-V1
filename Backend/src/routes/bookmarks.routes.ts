import { Router } from 'express'
import { bookMarksTiktokPostController, unBookMarksTiktokPostController } from '~/controllers/bookmarks.controllers'
import { authenticate, requireVerifiedUser } from '~/middlewares/auth.middlewares'

import { wrapRequestHandler } from '~/utils/handlers'
import { bookMarksTiktokPostValidator, unBookMarksTiktokValidator } from '~/validations/post.validations'

const bookmarksRouter = Router()
/**
 * Description. bookmarks post
 * Path: /
 * method: POST
 * body:{
 * post_id: string
 * }
 *
 */

bookmarksRouter.post(
    '/',
    authenticate,
    requireVerifiedUser,
    bookMarksTiktokPostValidator,
    wrapRequestHandler(bookMarksTiktokPostController)
)

/**
 * Description. unBookmarks post
 * Path: /post/:post_id
 * method: delete
 * body:{
 * post_id: string
 * }
 *
 */

bookmarksRouter.delete(
    '/post/:post_id',
    authenticate,
    requireVerifiedUser,
    unBookMarksTiktokValidator,
    wrapRequestHandler(unBookMarksTiktokPostController)
)

export default bookmarksRouter
