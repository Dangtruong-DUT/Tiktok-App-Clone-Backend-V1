import { Request, Response } from 'express'
import bookMarkPostService from '~/services/bookmarks.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { TiktokBookMarkReqBody, UnBookMarkReqParams } from '~/models/requests/bookmarks.requests'
import { POST_MESSAGES } from '~/constants/messages/post'
import { TokenPayload } from '~/models/requests/common.requests'

export const bookMarksTiktokPostController = async (
    req: Request<ParamsDictionary, any, TiktokBookMarkReqBody>,
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
