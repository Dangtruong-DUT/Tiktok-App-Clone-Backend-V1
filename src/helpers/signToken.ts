import { StringValue } from 'ms'
import { envConfig } from '~/config/envConfig'
import { Role, TokenType, UserVerifyStatus } from '~/constants/enum'
import { signToken } from '~/utils/jwt'

export function signTokenByType({
    userId,
    verify,
    type,
    role
}: {
    userId: string
    verify?: UserVerifyStatus
    type: TokenType
    role: Role
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
        token_type: type,
        role
    }

    if (verify !== undefined) payload.verify = verify

    return signToken({
        payload,
        privateKey: secret,
        options: { expiresIn }
    })
}

export function signAccessToken({ userId, verify, role }: { userId: string; verify: UserVerifyStatus; role: Role }) {
    return signTokenByType({ userId, verify, type: TokenType.ACCESS_TOKEN, role })
}

export function signRefreshToken({ userId, verify, role }: { userId: string; verify: UserVerifyStatus; role: Role }) {
    return signTokenByType({ userId, verify, type: TokenType.REFRESH_TOKEN, role })
}

export function signAccessAndRefreshToken({
    userId,
    verify,
    role
}: {
    userId: string
    verify: UserVerifyStatus
    role: Role
}) {
    return Promise.all([signAccessToken({ userId, verify, role }), signRefreshToken({ userId, verify, role })])
}

export function signEmailVerifyToken(userId: string, role: Role) {
    return signTokenByType({ userId, type: TokenType.EMAIL_VERIFY_TOKEN, role })
}

export function signForgotPasswordToken(userId: string, role: Role) {
    return signTokenByType({ userId, type: TokenType.FORGOT_PASSWORD_TOKEN, role })
}
