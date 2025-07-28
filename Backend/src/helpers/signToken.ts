import { StringValue } from 'ms'
import { envConfig } from '~/config/envConfig'
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
        [TokenType.ACCESS_TOKEN]: envConfig.JWT_SECRET_ACCESS_TOKEN,
        [TokenType.REFRESH_TOKEN]: envConfig.JWT_SECRET_REFRESH_TOKEN,
        [TokenType.EMAIL_VERIFY_TOKEN]: envConfig.JWT_SECRET_EMAIL_VERIFY_TOKEN,
        [TokenType.FORGOT_PASSWORD_TOKEN]: envConfig.JWT_SECRET_FORGOT_PASSWORD
    }[type] as string

    const expiresIn = {
        [TokenType.ACCESS_TOKEN]: envConfig.ACCESS_TOKEN_EXPIRE_IN,
        [TokenType.REFRESH_TOKEN]: envConfig.REFRESH_TOKEN_EXPIRE_IN,
        [TokenType.EMAIL_VERIFY_TOKEN]: envConfig.EMAIL_VERIFY_TOKEN_EXPIRE_IN,
        [TokenType.FORGOT_PASSWORD_TOKEN]: envConfig.FORGOT_PASSWORD_TOKEN_EXPIRE_IN
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
    return signTokenByType({ userId, verify, type: TokenType.ACCESS_TOKEN })
}

export function signRefreshToken({ userId, verify }: { userId: string; verify: UserVerifyStatus }) {
    return signTokenByType({ userId, verify, type: TokenType.REFRESH_TOKEN })
}

export function signAccessAndRefreshToken({ userId, verify }: { userId: string; verify: UserVerifyStatus }) {
    return Promise.all([signAccessToken({ userId, verify }), signRefreshToken({ userId, verify })])
}

export function signEmailVerifyToken(userId: string) {
    return signTokenByType({ userId, type: TokenType.EMAIL_VERIFY_TOKEN })
}

export function signForgotPasswordToken(userId: string) {
    return signTokenByType({ userId, type: TokenType.FORGOT_PASSWORD_TOKEN })
}
