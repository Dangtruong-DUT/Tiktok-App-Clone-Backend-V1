import { Router } from 'express'
import {
    likesTiktokPostController,
    unLikesTiktokPostByIdController,
    unLikesTiktokPostController
} from '~/controllers/likesTiktokPost.controllers copy'
import { authenticate, requireVerifiedUser } from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import {
    likeTiktokPostValidator,
    unLikeTiktokPostValidator,
    verifiedLikedIdValidator
} from '~/validations/post.validations'

const likesRouter = Router()
/**
 * Description. Like post
 * Path: /
 * method: POST
 * body:{
 * post_id: string
 * }
 *
 */

likesRouter.post(
    '/',
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

likesRouter.delete(
    '/post/:post_id',
    authenticate,
    requireVerifiedUser,
    unLikeTiktokPostValidator,
    wrapRequestHandler(unLikesTiktokPostController)
)

/**
 * Description. UnLike post
 * Path: /:_id
 * method: delete
 * body:{
 * post_id: string
 * }
 *
 */

likesRouter.delete(
    '/:_id',
    authenticate,
    requireVerifiedUser,
    verifiedLikedIdValidator,
    wrapRequestHandler(unLikesTiktokPostByIdController)
)
export default likesRouter
