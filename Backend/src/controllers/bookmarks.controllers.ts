import { NextFunction, Request, Response } from 'express'
import { TIKTOK_POST_MESSAGE } from '~/constants/messages'
import bookMarkPostService from '~/services/bookmarks.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { TokenPayload } from '~/models/requests/user.requests'
import {
    TiktokBookMarkReqBody,
    UnBookMarkByIDReqParams,
    UnBookMarkReqParams
} from '~/models/requests/bookmarks.requests'

export const bookMarksTiktokPostController = async (
    req: Request<ParamsDictionary, any, TiktokBookMarkReqBody>,
    res: Response,
    next: NextFunction
) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { post_id } = req.body
    const result = await bookMarkPostService.bookMarkPost({ post_id, user_id })
    res.json({
        message: TIKTOK_POST_MESSAGE.BOOKMARKS_SUCCESS,
        result
    })
}

export const unBookMarksTiktokPostController = async (
    req: Request<UnBookMarkReqParams>,
    res: Response,
    next: NextFunction
) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { post_id } = req.params
    await bookMarkPostService.unBookMarkPost({ post_id, user_id })
    res.json({
        message: TIKTOK_POST_MESSAGE.UNBOOKMARKS_SUCCESS
    })
}

export const unBookMarksTiktokPostByBookmarkIdController = async (
    req: Request<UnBookMarkByIDReqParams>,
    res: Response,
    next: NextFunction
) => {
    const { bookmark_id } = req.params
    await bookMarkPostService.unBookMarkPostByBookmarkId(bookmark_id)
    res.json({
        message: TIKTOK_POST_MESSAGE.UNBOOKMARKS_SUCCESS
    })
}
