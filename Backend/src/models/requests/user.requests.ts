import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enum'

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

export interface ForgotPasswordRequestBody {
    email: string
}

export interface TokenPayload extends JwtPayload {
    user_id: string
    token_Type: TokenType
}

export interface GetProfileReqParams {
    username: string
}

export interface followUserReqBody {
    user_id: string
}
