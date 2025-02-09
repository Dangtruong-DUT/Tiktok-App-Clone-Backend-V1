import { IdReqParam, PostIdParam } from './common.requests'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TiktokLikeReqBody extends PostIdParam {}

export type UnLikeReqParams = PostIdParam & Record<string, string>

export type UnLikeByIDReqParams = IdReqParam & Record<string, string>
