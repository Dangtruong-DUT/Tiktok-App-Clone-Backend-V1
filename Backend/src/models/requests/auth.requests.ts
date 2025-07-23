export interface OauthWithGoogleReqQuery {
    code: string
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
