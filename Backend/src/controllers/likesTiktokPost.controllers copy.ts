import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/models/requests/user.requests'
import { TiktokLikeReqBody, UnLikeByIDReqParams, UnLikeReqParams } from '~/models/requests/likes.requests'
import likePostService from '~/services/likes.services'
import { POST_MESSAGES } from '~/constants/messages/post'

export const likesTiktokPostController = async (
    req: Request<ParamsDictionary, any, TiktokLikeReqBody>,
    res: Response,
    next: NextFunction
) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { post_id } = req.body
    const result = await likePostService.LikePost({ post_id, user_id })
    res.json({
        message: POST_MESSAGES.LIKE_POST_SUCCESS,
        result
    })
}

export const unLikesTiktokPostController = async (req: Request<UnLikeReqParams>, res: Response, next: NextFunction) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { post_id } = req.params
    await likePostService.unLikePost({ post_id, user_id })
    res.json({
        message: POST_MESSAGES.UNLIKE_POST_SUCCESS
    })
}

export const unLikesTiktokPostByIdController = async (
    req: Request<UnLikeByIDReqParams>,
    res: Response,
    next: NextFunction
) => {
    const { _id } = req.params
    await likePostService.unLikePostById(_id)
    res.json({
        message: POST_MESSAGES.UNLIKE_POST_SUCCESS
    })
}
