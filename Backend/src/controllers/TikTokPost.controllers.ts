import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TIKTOK_POST_MESSAGE } from '~/constants/messages'
import { TikTokPostBodyReq } from '~/models/requests/TiktokPost.requests'
import { TokenPayload } from '~/models/requests/user.requests'
import tikTokPostService from '~/services/TiktokPost.services'

export const createTikTokPostController = async (
    req: Request<ParamsDictionary, any, TikTokPostBodyReq>,
    res: Response,
    next: NextFunction
) => {
    const payload = req.body
    const { user_id } = req.decoded_authorization as TokenPayload
    const result = await tikTokPostService.createPost({ payload, user_id })
    res.json({
        message: TIKTOK_POST_MESSAGE.POST_SUCCESS,
        result
    })
}
