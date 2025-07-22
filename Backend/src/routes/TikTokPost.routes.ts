import { Router } from 'express'
import { createTikTokPostController } from '~/controllers/TikTokPost.controllers'
import { authenticate, requireVerifiedUser } from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import { createTiktokPostValidator } from '~/validations/post.validations'

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

export default tiktokPostRouter
