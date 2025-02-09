import { Router } from 'express'
import {
    bookMarksTiktokPostController,
    unBookMarksTiktokPostByBookmarkIdController,
    unBookMarksTiktokPostController
} from '~/controllers/bookmarks.controllers'
import {
    bookMarksTiktokPostValidator,
    unBookMarksTiktokValidator,
    verifiedBookMarksValidator
} from '~/middlewares/TiktokPost.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

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
    accessTokenValidator,
    verifiedUserValidator,
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
    accessTokenValidator,
    verifiedUserValidator,
    unBookMarksTiktokValidator,
    wrapRequestHandler(unBookMarksTiktokPostController)
)

/**
 * Description. unBookmarks post
 * Path: /:bookmark_id
 * method: delete
 * body:{
 * post_id: string
 * }
 *
 */

bookmarksRouter.delete(
    '/:bookmark_id',
    accessTokenValidator,
    verifiedUserValidator,
    verifiedBookMarksValidator,
    wrapRequestHandler(unBookMarksTiktokPostByBookmarkIdController)
)
export default bookmarksRouter
