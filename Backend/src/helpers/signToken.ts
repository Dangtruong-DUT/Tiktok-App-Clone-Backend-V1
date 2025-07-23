import { StringValue } from 'ms'
import { envConfig } from '~/config'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import { signToken } from '~/utils/jwt'

export function signTokenByType({
    userId,
    verify,
    type
}: {
    userId: string
    verify?: UserVerifyStatus
    type: TokenType
}) {
    const secret = {
        [TokenType.AccessToken]: envConfig.JWT_SECRET_ACCESS_TOKEN,
        [TokenType.RefreshToken]: envConfig.JWT_SECRET_REFRESH_TOKEN,
        [TokenType.EmailVerifyToken]: envConfig.JWT_SECRET_EMAIL_VERIFY_TOKEN,
        [TokenType.ForgotPasswordToken]: envConfig.JWT_SECRET_FORGOT_PASSWORD
    }[type] as string

    const expiresIn = {
        [TokenType.AccessToken]: envConfig.ACCESS_TOKEN_EXPIRE_IN,
        [TokenType.RefreshToken]: envConfig.REFRESH_TOKEN_EXPIRE_IN,
        [TokenType.EmailVerifyToken]: envConfig.EMAIL_VERIFY_TOKEN_EXPIRE_IN,
        [TokenType.ForgotPasswordToken]: envConfig.FORGOT_PASSWORD_TOKEN_EXPIRE_IN
    }[type] as StringValue | number

    const payload: Record<string, string | number> = {
        user_id: userId,
        token_type: type
    }

    if (verify !== undefined) payload.verify = verify

    return signToken({
        payload,
        privateKey: secret,
        options: { expiresIn }
    })
}

export function signAccessToken({ userId, verify }: { userId: string; verify: UserVerifyStatus }) {
    return signTokenByType({ userId, verify, type: TokenType.AccessToken })
}

export function signRefreshToken({ userId, verify }: { userId: string; verify: UserVerifyStatus }) {
    return signTokenByType({ userId, verify, type: TokenType.RefreshToken })
}

export function signAccessAndRefreshToken({ userId, verify }: { userId: string; verify: UserVerifyStatus }) {
    return Promise.all([signAccessToken({ userId, verify }), signRefreshToken({ userId, verify })])
}

export function signEmailVerifyToken(userId: string) {
    return signTokenByType({ userId, type: TokenType.EmailVerifyToken })
}

export function signForgotPasswordToken(userId: string) {
    return signTokenByType({ userId, type: TokenType.ForgotPasswordToken })
}
