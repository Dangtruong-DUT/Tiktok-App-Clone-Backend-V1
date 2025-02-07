import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import { ParamsDictionary } from 'express-serve-static-core'

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

export interface LoginRequestBody {
    email: string
    password: string
}

export interface VerifyEmailRequestBody {
    email_verify_token: string
}

export interface VerifyForgotPasswordTokenRequestBody {
    forgot_password_token: string
}

export interface ResetPasswordRequestBody extends VerifyForgotPasswordTokenRequestBody {
    password: string
    confirm_password: string
}
export interface RegisterRequestBody {
    name: string
    email: string
    password: string
    confirm_password: string
    date_of_birth: string
}

export interface LogoutRequestBody {
    refresh_token: string
}
export interface RefreshTokenReqBody {
    refresh_token: string
}
export interface ForgotPasswordRequestBody {
    email: string
}

export interface TokenPayload extends JwtPayload {
    user_id: string
    token_Type: TokenType
    verify: UserVerifyStatus
}

export interface GetProfileReqParams extends ParamsDictionary {
    username: string
}

export interface unFollowUserReqParams extends ParamsDictionary {
    user_id: string
}
export interface getImageReqParams extends ParamsDictionary {
    name: string
}

export interface followUserReqBody {
    user_id: string
}

export interface ChangePasswordRequestBody {
    current_password: string
    password: string
    confirm_password: string
}
