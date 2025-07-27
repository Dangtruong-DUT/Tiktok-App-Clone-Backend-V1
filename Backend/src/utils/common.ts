import { envConfig } from '~/config'
import { UserVerifyStatus } from '~/constants/enum'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { verifyToken } from '~/utils/jwt'

export const numberEnumToArray = (numberEnum: { [key: string]: number | string }): number[] => {
    return Object.values(numberEnum).filter((value) => typeof value === 'number') as number[]
}

export const verifyAccessTokenAndEnsureUserVerified = async (access_token: string) => {
    const decode_access_token = await verifyToken({
        token: access_token,
        secretOrPublicKey: envConfig.JWT_SECRET_ACCESS_TOKEN
    })

    if (decode_access_token.verify != UserVerifyStatus.VERIFIED)
        throw new ErrorWithStatus({ message: 'User not verified', status: HTTP_STATUS.UNAUTHORIZED })

    return decode_access_token
}
