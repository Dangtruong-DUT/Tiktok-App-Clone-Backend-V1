import { IdReqParam, PostIdParam } from './common.requests'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface TiktokBookMarkReqBody extends PostIdParam {}

export type UnBookMarkReqParams = PostIdParam & Record<string, string>

export type UnBookMarkByIDReqParams = IdReqParam & Record<string, string>
