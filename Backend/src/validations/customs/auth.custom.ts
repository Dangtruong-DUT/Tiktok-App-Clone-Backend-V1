import { Request } from 'express'
import { CustomValidator } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { envConfig } from '~/config'
import HTTP_STATUS from '~/constants/httpStatus'
import { AUTH_MESSAGES } from '~/constants/messages/auth'
import { VALIDATION_MESSAGES } from '~/constants/messages/validation'
import { ErrorWithStatus } from '~/models/Errors'
import usersServices from '~/services/users.service'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'

// This validator checks if the email exists in the database
export const checkEmailExists: CustomValidator = async (value: string) => {
    const exists = await usersServices.checkEmailExist(value)
    if (exists) throw new Error(VALIDATION_MESSAGES.EMAIL_ALREADY_EXISTS)
    return true
}

export const checkEmailNotExists: CustomValidator = async (value: string, { req }) => {
    const user = await usersServices.getUserByEmail(value)
    if (!user) throw new Error(AUTH_MESSAGES.EMAIL_NOT_EXISTS)
    req.user = user
    return true
}

export const checkEmailAndPasswordNotExists: CustomValidator = async (value: string, { req }) => {
    const user = await usersServices.getUserByEmail(req.body.email)
    if (!user || hashPassword(req.body.password) !== user.password) {
        throw new Error(AUTH_MESSAGES.EMAIL_OR_PASSWORD_DOES_NOT_MATCH)
    }
    req.user = user
    return true
}

export const verifyForgotPasswordToken: CustomValidator = async (token: string, { req }) => {
    try {
        const [decoded_forgot_password_token, user] = await Promise.all([
            verifyToken({
                token,
                secretOrPublicKey: envConfig.JWT_SECRET_FORGOT_PASSWORD
            }),
            usersServices.getUserByForgotPasswordToken(token)
        ])

        if (!user) {
            throw new ErrorWithStatus({
                message: AUTH_MESSAGES.FORGOT_PASSWORD_TOKEN_EXPIRED_OR_NOT_FOUND,
                status: HTTP_STATUS.BAD_REQUEST
            })
        }

        if (user.forgot_password_token !== token) {
            throw new ErrorWithStatus({
                message: AUTH_MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN,
                status: HTTP_STATUS.BAD_REQUEST
            })
        }

        req.decoded_forgot_password_token = decoded_forgot_password_token
        req.user = user
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            throw new ErrorWithStatus({
                message: AUTH_MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN,
                status: HTTP_STATUS.BAD_REQUEST
            })
        }
        throw error
    }

    return true
}

export const verifyEmailVerifyToken: CustomValidator = async (token: string, { req }) => {
    try {
        const [decoded_email_verify_token, user] = await Promise.all([
            verifyToken({ token, secretOrPublicKey: envConfig.JWT_SECRET_EMAIL_VERIFY_TOKEN }),
            usersServices.getUserByEmailVerifyToken(token)
        ])

        if (!user) {
            throw new ErrorWithStatus({
                message: AUTH_MESSAGES.EMAIL_VERIFY_TOKEN_EXPIRED_OR_NOT_FOUND,
                status: HTTP_STATUS.BAD_REQUEST
            })
        }

        if (user.email_verify_token !== token) {
            throw new ErrorWithStatus({
                message: AUTH_MESSAGES.INVALID_EMAIL_VERIFY_TOKEN,
                status: HTTP_STATUS.BAD_REQUEST
            })
        }

        ;(req as Request).user = user
        ;(req as Request).decoded_email_verify_token = decoded_email_verify_token
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            throw new ErrorWithStatus({
                message: AUTH_MESSAGES.INVALID_EMAIL_VERIFY_TOKEN,
                status: HTTP_STATUS.BAD_REQUEST
            })
        }
        throw error
    }

    return true
}
