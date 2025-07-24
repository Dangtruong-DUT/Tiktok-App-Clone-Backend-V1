import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { POST_MESSAGES } from '~/constants/messages/post'
import { TokenPayload } from '~/models/requests/common.requests'
import { TikTokPostBodyReq } from '~/models/requests/TiktokPost.requests'
import { TiktokLikeReqBody, UnLikeReqParams } from '~/models/requests/likes.requests'
import likePostService from '~/services/likes.services'
import tikTokPostService from '~/services/TiktokPost.services'
import { TiktokBookMarkReqBody, UnBookMarkReqParams } from '~/models/requests/bookmarks.requests'
import bookMarkPostService from '~/services/bookmarks.services'

export const createTikTokPostController = async (req: Request<ParamsDictionary, TikTokPostBodyReq>, res: Response) => {
    const payload = req.body
    const { user_id } = req.decoded_authorization as TokenPayload
    const result = await tikTokPostService.createPost({ payload, user_id })
    res.json({
        message: POST_MESSAGES.POST_SUCCESS,
        result
    })
}

export const likesTiktokPostController = async (req: Request<ParamsDictionary, TiktokLikeReqBody>, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { post_id } = req.body
    const result = await likePostService.LikePost({ post_id, user_id })
    res.json({
        message: POST_MESSAGES.LIKE_POST_SUCCESS,
        result
    })
}

export const unLikesTiktokPostController = async (req: Request<UnLikeReqParams>, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { post_id } = req.params
    await likePostService.unLikePost({ post_id, user_id })
    res.json({
        message: POST_MESSAGES.UNLIKE_POST_SUCCESS
    })
}

export const bookMarksTiktokPostController = async (
    req: Request<ParamsDictionary, TiktokBookMarkReqBody>,
    res: Response
) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { post_id } = req.body
    const result = await bookMarkPostService.bookMarkPost({ post_id, user_id })
    res.json({
        message: POST_MESSAGES.BOOKMARKS_SUCCESS,
        result
    })
}

export const unBookMarksTiktokPostController = async (req: Request<UnBookMarkReqParams>, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { post_id } = req.params
    await bookMarkPostService.unBookMarkPost({ post_id, user_id })
    res.json({
        message: POST_MESSAGES.UNBOOKMARKS_SUCCESS
    })
}
