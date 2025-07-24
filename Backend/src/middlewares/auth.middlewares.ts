import { NextFunction, Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { AUTH_MESSAGES } from '~/constants/messages/auth'
import { ErrorWithStatus } from '~/models/Errors'
import { envConfig } from '~/config'
import { verifyToken } from '~/utils/jwt'
import { JsonWebTokenError } from 'jsonwebtoken'

/**
 * Middleware verify access token
 * Gắn decoded_authorization vào req nếu hợp lệ
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization || ''
        const token = authHeader.split(' ')[1]

        if (!token) {
            throw new ErrorWithStatus({
                message: AUTH_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
            })
        }

        const decoded = await verifyToken({
            token,
            secretOrPublicKey: envConfig.JWT_SECRET_ACCESS_TOKEN as string
        })

        req.decoded_authorization = decoded
        next()
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            return next(
                new ErrorWithStatus({
                    message: AUTH_MESSAGES.INVALID_ACCESS_TOKEN,
                    status: HTTP_STATUS.UNAUTHORIZED
                })
            )
        }
        next(error)
    }
}

/**
 * Middleware verify refresh token
 * Gắn decoded_refresh_token vào req nếu hợp lệ
 */
export const authenticateRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refresh_token } = req.body

        if (!refresh_token) {
            throw new ErrorWithStatus({
                message: AUTH_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
            })
        }

        const decoded = await verifyToken({
            token: refresh_token,
            secretOrPublicKey: envConfig.JWT_SECRET_REFRESH_TOKEN as string
        })

        req.decoded_refresh_token = decoded
        next()
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            return next(
                new ErrorWithStatus({
                    message: _.capitalize(error.message),
                    status: HTTP_STATUS.UNAUTHORIZED
                })
            )
        }
        next(error)
    }
}

/**
 * Middleware kiểm tra user đã verify email chưa
 */
import { UserVerifyStatus } from '~/constants/enum'
import { USER_MESSAGES } from '~/constants/messages/user'
import _ from 'lodash'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'

export const requireVerifiedUser = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.decoded_authorization || {}
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })

    if (!user) {
        return next(
            new ErrorWithStatus({
                message: USER_MESSAGES.USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
            })
        )
    }

    if (user?.verify !== UserVerifyStatus.Verified) {
        return next(
            new ErrorWithStatus({
                message: USER_MESSAGES.USER_NOT_VERIFIED,
                status: HTTP_STATUS.FORBIDDEN
            })
        )
    }
    next()
}
