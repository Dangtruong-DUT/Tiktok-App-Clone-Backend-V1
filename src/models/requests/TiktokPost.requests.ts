import { Audience, PosterType } from '~/constants/enum'
import { Media } from '../Common'
import { ParamsDictionary } from 'express-serve-static-core'

export interface CreateTikTokPostBodyReq {
    type: PosterType
    audience: Audience
    content: string
    parent_id: string | null
    hashtags: string[]
    mentions: string[]
    medias: Media[]
}

export interface GetPostDetailParamsReq extends ParamsDictionary {
    post_id: string
}

export interface GetChildrenPostsParamReq extends ParamsDictionary {
    post_id: string
}

export interface GetChildrenPostsQueryReq {
    page?: number
    limit?: number
    type: PosterType // 2: comments, 1: re·post, 3: quotes
}
