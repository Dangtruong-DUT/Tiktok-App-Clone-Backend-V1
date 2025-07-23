import { ParamsDictionary } from 'express-serve-static-core'

export interface GetProfileReqParams extends ParamsDictionary {
    username: string
}

export interface unFollowUserReqParams extends ParamsDictionary {
    user_id: string
}
export interface getImageReqParams extends ParamsDictionary {
    name: string
}
export interface getVideoReqParam extends ParamsDictionary {
    name: string
}

export interface getVideoHLSReqParam extends ParamsDictionary {
    id: string
    v: string
    segment: string
}
export interface followUserReqBody {
    user_id: string
}

export interface ChangePasswordRequestBody {
    current_password: string
    password: string
    confirm_password: string
}

export interface UpdateUserRequestBody {
    name?: string
    date_of_birth?: string
    bio?: string
    location?: string
    website?: string
    username?: string
    avatar?: string
    cover_photo?: string
}
