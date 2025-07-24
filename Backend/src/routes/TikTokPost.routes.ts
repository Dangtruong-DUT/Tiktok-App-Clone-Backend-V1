import { Router } from 'express'
import {
    bookMarksTiktokPostController,
    createTikTokPostController,
    getPostDetailController,
    likesTiktokPostController,
    unBookMarksTiktokPostController,
    unLikesTiktokPostController
} from '~/controllers/TikTokPost.controllers'
import { authenticate, requireVerifiedUser } from '~/middlewares/auth.middlewares'
import { audienceValidator } from '~/middlewares/post.middlewares'
import { isUserLoginValidator } from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import {
    bookMarksTiktokPostValidator,
    createTiktokPostValidator,
    getPostDetailValidator,
    likeTiktokPostValidator,
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
