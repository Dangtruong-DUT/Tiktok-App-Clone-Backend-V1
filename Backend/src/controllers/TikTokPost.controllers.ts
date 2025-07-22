import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { POST_MESSAGES } from '~/constants/messages/post'
import { TikTokPostBodyReq } from '~/models/requests/TiktokPost.requests'
import { TokenPayload } from '~/models/requests/user.requests'
import tikTokPostService from '~/services/TiktokPost.services'

export const createTikTokPostController = async (req: Request<ParamsDictionary, TikTokPostBodyReq>, res: Response) => {
    const payload = req.body
    const { user_id } = req.decoded_authorization as TokenPayload
    const result = await tikTokPostService.createPost({ payload, user_id })
    res.json({
        message: POST_MESSAGES.POST_SUCCESS,
        result
    })
}
