import { Router } from 'express'
import {
    bookMarksTiktokPostController,
    createTikTokPostController,
    getChildrenPostsController,
    getFriendPostsController,
    getPostDetailController,
    likesTiktokPostController,
    unBookMarksTiktokPostController,
    unLikesTiktokPostController
} from '~/controllers/TikTokPost.controller'
import { authenticate, requireVerifiedUser } from '~/middlewares/auth.middlewares'
import { audienceValidator } from '~/middlewares/post.middlewares'
import { isUserLoginValidator } from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import {
    bookMarksTiktokPostValidator,
    createTiktokPostValidator,
    getChildrenPostsValidator,
    getPostDetailValidator,
    likeTiktokPostValidator,
    PaginationValidator,
    unBookMarksTiktokValidator,
    unLikeTiktokPostValidator
} from '~/validations/post.validations'

const tiktokPostRouter = Router()

/**
 * Description.Create a new post
 * Path: /
 * method: POST
 * body:TikTokPostBodyReq
 *
 */

tiktokPostRouter.post(
    '/',
    authenticate,
    requireVerifiedUser,
    createTiktokPostValidator,
    wrapRequestHandler(createTikTokPostController)
)

/**
 * Get children of post
 * Path: /friend
 * method: GET
 * query: {
 * page: number
 * limit: number
 * type: number // 2: comments, 1: re·post, 3: quotes
 * }
 *
 */
tiktokPostRouter.get('/friend', authenticate, PaginationValidator, wrapRequestHandler(getFriendPostsController))

/**
 * Description. Get post detail
 * Path: /:post_id
 * method: GET
 * */

tiktokPostRouter.get(
    '/:post_id',
    isUserLoginValidator(authenticate),
    getPostDetailValidator,
    wrapRequestHandler(audienceValidator),
    wrapRequestHandler(getPostDetailController)
)

/**
 * Get children of post
 * Path: /:post_id/children
 * method: GET
 * query: {
 * page: number
 * limit: number
 * type: number // 2: comments, 1: re·post, 3: quotes
 * }
 *
 */
tiktokPostRouter.get(
    '/:post_id/children',
    isUserLoginValidator(authenticate),
    getChildrenPostsValidator,
    wrapRequestHandler(getChildrenPostsController)
)

/**
 * Description. Like post
 * Path: /
 * method: POST
 * body:{
 * post_id: string
 * }
 *
 */

tiktokPostRouter.post(
    '/likes',
    authenticate,
    requireVerifiedUser,
    likeTiktokPostValidator,
    wrapRequestHandler(likesTiktokPostController)
)

/**
 * Description. unLike post
 * Path: /post/:post_id
 * method: delete
 * body:{
 * post_id: string
 * }
 *
 */

tiktokPostRouter.delete(
    '/:post_id/likes',
    authenticate,
    requireVerifiedUser,
    unLikeTiktokPostValidator,
    wrapRequestHandler(unLikesTiktokPostController)
)

/**
 * Description. bookmarks post
 * Path: /
 * method: POST
 * body:{
 * post_id: string
 * }
 *
 */

tiktokPostRouter.post(
    '/bookmarks',
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

tiktokPostRouter.delete(
    '/:post_id/bookmarks',
    authenticate,
    requireVerifiedUser,
    unBookMarksTiktokValidator,
    wrapRequestHandler(unBookMarksTiktokPostController)
)

export default tiktokPostRouter
