import { Router } from 'express'
import { createTikTokPostController } from '~/controllers/TikTokPost.controllers'
import { createTiktokPostValidator } from '~/middlewares/TiktokPost.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

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
    accessTokenValidator,
    verifiedUserValidator,
    createTiktokPostValidator,
    wrapRequestHandler(createTikTokPostController)
)

export default tiktokPostRouter
