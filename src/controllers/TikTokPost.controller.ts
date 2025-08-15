import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { POST_MESSAGES } from '~/constants/messages/post'
import { TokenPayload } from '~/models/requests/common.requests'
import {
    CreateTikTokPostBodyReq,
    GetChildrenPostsParamReq,
    GetChildrenPostsQueryReq,
    GetPostDetailParamsReq
} from '~/models/requests/TiktokPost.requests'
import { TiktokLikeReqBody, UnLikeReqParams } from '~/models/requests/likes.requests'
import likePostService from '~/services/likes.service'
import tikTokPostService from '~/services/TiktokPost.service'
import { TiktokBookMarkReqBody, UnBookMarkReqParams } from '~/models/requests/bookmarks.requests'
import bookMarkPostService from '~/services/bookmarks.service'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'

export const createTikTokPostController = async (
    req: Request<ParamsDictionary, CreateTikTokPostBodyReq>,
    res: Response
) => {
    const payload = req.body
    const { user_id } = req.decoded_authorization as TokenPayload
    const data = await tikTokPostService.createPost({ payload, user_id })
    if (!data) {
        throw new ErrorWithStatus({
            message: POST_MESSAGES.POST_FAILED,
            status: HTTP_STATUS.INTERNAL_SERVER_ERROR
        })
    }

    res.json({
        message: POST_MESSAGES.POST_SUCCESS,
        data
    })
}

export const getPostDetailController = async (req: Request<GetPostDetailParamsReq>, res: Response) => {
    const post = req.post
    if (!post) {
        throw new ErrorWithStatus({
            message: POST_MESSAGES.POST_NOT_FOUND,
            status: HTTP_STATUS.NOT_FOUND
        })
    }

    const user_id = (req.decoded_authorization as TokenPayload)?.user_id
    if (!post._id) {
        throw new ErrorWithStatus({
            message: POST_MESSAGES.POST_NOT_FOUND,
            status: HTTP_STATUS.NOT_FOUND
        })
    }
    const mutateData = await tikTokPostService.increasePostViews({ post_id: post._id.toString(), user_id })

    const tiktokPost = {
        ...post,
        ...mutateData
    }

    return res.json({
        message: POST_MESSAGES.GET_POST_DETAIL_SUCCESS,
        data: tiktokPost
    })
}

export const likesTiktokPostController = async (req: Request<ParamsDictionary, TiktokLikeReqBody>, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { post_id } = req.body
    const data = await likePostService.LikePost({ post_id, user_id })
    res.json({
        message: POST_MESSAGES.LIKE_POST_SUCCESS,
        data
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
    const data = await bookMarkPostService.bookMarkPost({ post_id, user_id })
    res.json({
        message: POST_MESSAGES.BOOKMARKS_SUCCESS,
        data
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

export const getChildrenPostsController = async (req: Request, res: Response) => {
    const { post_id } = req.params as GetChildrenPostsParamReq
    const { page = 1, limit = 10, type } = req.query as unknown as GetChildrenPostsQueryReq
    const user_id = (req.decoded_authorization as TokenPayload)?.user_id
    const { posts, total } = await tikTokPostService.getChildrenPosts({
        post_id,
        page: Number(page),
        limit: Number(limit),
        type,
        user_id
    })
    const totalPage = Math.ceil(total / Number(limit))

    return res.json({
        message: POST_MESSAGES.GET_CHILDREN_POSTS_SUCCESS,
        data: {
            posts
        },
        meta: {
            page: Number(page),
            limit: Number(limit),
            total_pages: totalPage,
            type: Number(type)
        }
    })
}

export const getFriendPostsController = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query as unknown as GetChildrenPostsQueryReq
    const user_id = (req.decoded_authorization as TokenPayload)?.user_id
    const { posts, total } = await tikTokPostService.getFriendPosts({
        page: Number(page),
        limit: Number(limit),
        user_id
    })

    const totalPage = Math.ceil(total / Number(limit))

    return res.json({
        message: POST_MESSAGES.GET_FRIEND_POSTS_SUCCESS,
        data: {
            posts
        },
        meta: {
            page: Number(page),
            limit: Number(limit),
            total_pages: totalPage
        }
    })
}

export const getForYouPostsController = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query as unknown as GetChildrenPostsQueryReq
    const user_id = (req.decoded_authorization as TokenPayload)?.user_id
    const { posts, total } = await tikTokPostService.getForYouPosts({
        page: Number(page),
        limit: Number(limit),
        user_id
    })

    const totalPage = Math.ceil(total / Number(limit))

    return res.json({
        message: POST_MESSAGES.GET_FOR_YOU_POSTS_SUCCESS,
        data: {
            posts
        },
        meta: {
            page: Number(page),
            limit: Number(limit),
            total_pages: totalPage
        }
    })
}
