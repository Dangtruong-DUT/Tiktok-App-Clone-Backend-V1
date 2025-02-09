import { Router } from 'express'
import {
    likesTiktokPostController,
    unLikesTiktokPostByIdController,
    unLikesTiktokPostController
} from '~/controllers/likesTiktokPost.controllers copy'
import {
    likeTiktokPostValidator,
    unLikeTiktokPostValidator,
    verifiedLikedIdValidator
} from '~/middlewares/TiktokPost.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

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
    accessTokenValidator,
    verifiedUserValidator,
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
    accessTokenValidator,
    verifiedUserValidator,
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
    accessTokenValidator,
    verifiedUserValidator,
    verifiedLikedIdValidator,
    wrapRequestHandler(unLikesTiktokPostByIdController)
)
export default likesRouter
