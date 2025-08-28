import { Router } from 'express'
import {
    bookMarksTiktokPostController,
    createTikTokPostController,
    deletePostController,
    getChildrenPostsController,
    getForYouPostsController,
    getFriendPostsController,
    getPostDetailController,
    getPostsNoFollowingController,
    getRelatedPostsController,
    likesTiktokPostController,
    unBookMarksTiktokPostController,
    unLikesTiktokPostController,
    updatePostController
} from '~/controllers/TikTokPost.controller'
import { authenticate, requireVerifiedUser } from '~/middlewares/auth.middlewares'
import { audienceValidator } from '~/middlewares/post.middlewares'
import { isUserLoginValidator } from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import { paginationValidator } from '~/validations/pagination.validation'
import {
    bookMarksTiktokPostValidator,
    createTiktokPostValidator,
    getChildrenPostsValidator,
    checkPostIsExistsValidator,
    likeTiktokPostValidator,
    unBookMarksTiktokValidator,
    unLikeTiktokPostValidator,
    updatePostValidator
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
 * }
 *
 */
tiktokPostRouter.get('/friend', authenticate, paginationValidator, wrapRequestHandler(getFriendPostsController))

/**
 * Get children of post
 * Path: /foryou
 * method: GET
 * query: {
 * page: number
 * limit: number
 * }
 *
 */
tiktokPostRouter.get(
    '/foryou',
    isUserLoginValidator(authenticate),
    paginationValidator,
    wrapRequestHandler(getForYouPostsController)
)

/**
 * Get liked posts of user
 * Path: /:user_id/liked
 * method: GET
 * query: {
 * page: number
 * limit: number
 * }
 *
 */

tiktokPostRouter.get(
    '/not-following',
    isUserLoginValidator(authenticate),
    paginationValidator,
    wrapRequestHandler(getPostsNoFollowingController)
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

/**
 * Description. Get related posts
 * Path: /:post_id/relations
 * method: GET
 * query: {
 *   page: number
 *   limit: number
 * }
 */
tiktokPostRouter.get(
    '/:post_id/relations',
    isUserLoginValidator(authenticate),
    paginationValidator,
    checkPostIsExistsValidator,
    wrapRequestHandler(getRelatedPostsController)
)

/**
 * Description. Get post detail
 * Path: /:post_id
 * method: GET
 * */

tiktokPostRouter.get(
    '/:post_id',
    isUserLoginValidator(authenticate),
    checkPostIsExistsValidator,
    wrapRequestHandler(audienceValidator),
    wrapRequestHandler(getPostDetailController)
)

tiktokPostRouter.delete(
    '/:post_id',
    authenticate,
    requireVerifiedUser,
    checkPostIsExistsValidator,
    wrapRequestHandler(deletePostController)
)

tiktokPostRouter.patch(
    '/:post_id',
    authenticate,
    requireVerifiedUser,
    checkPostIsExistsValidator,
    updatePostValidator,
    wrapRequestHandler(updatePostController)
)

export default tiktokPostRouter
