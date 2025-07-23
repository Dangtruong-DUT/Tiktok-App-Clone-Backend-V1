import HTTP_STATUS from '~/constants/httpStatus'
import databaseService from '~/services/database.services'
import { UserVerifyStatus } from '~/constants/enum'
import User from '~/models/schemas/User.schema'
import {
    ForgotPasswordRequestBody,
    LoginRequestBody,
    LogoutRequestBody,
    RefreshTokenReqBody,
    RegisterRequestBody,
    ResetPasswordRequestBody,
    TokenPayload,
    VerifyEmailRequestBody,
    VerifyForgotPasswordTokenRequestBody
} from '~/models/requests/user.requests'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import usersServices from '~/services/users.services'
import { Request, Response } from 'express'
import { AUTH_MESSAGES } from '~/constants/messages/auth'

export const loginController = async (req: Request<ParamsDictionary, LoginRequestBody>, res: Response) => {
    const userFromClient = req.user as User
    const user_id = userFromClient._id as ObjectId
    const { access_token, refresh_token, user } = await usersServices.login({
        user_id: user_id.toString(),
        verify: userFromClient.verify
    })

    if (!access_token || !refresh_token || !user) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: AUTH_MESSAGES.LOGIN_FAILED
        })
    }

    res.status(HTTP_STATUS.OK).json({
        message: AUTH_MESSAGES.LOGIN_SUCCESS,
        data: {
            access_token,
            refresh_token,
            user
        }
    })
}

export const registerController = async (req: Request<ParamsDictionary, RegisterRequestBody>, res: Response) => {
    const { access_token, refresh_token, user } = await usersServices.register(req.body)

    if (!access_token || !refresh_token || !user) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: AUTH_MESSAGES.REGISTER_FAILED
        })
    }

    res.status(HTTP_STATUS.OK).json({
        message: AUTH_MESSAGES.REGISTER_SUCCESS,
        data: {
            access_token,
            refresh_token,
            user
        }
    })
}

export const logoutController = async (req: Request<ParamsDictionary, LogoutRequestBody>, res: Response) => {
    const { refresh_token } = req.body
    const result = await usersServices.logout(refresh_token)
    if (result === false) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ message: AUTH_MESSAGES.LOGOUT_FAILED })
    } else {
        res.status(HTTP_STATUS.OK).json({ message: AUTH_MESSAGES.LOGOUT_SUCCESS })
    }
}

export const logoutAllDevicesController = async (req: Request, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const result = await usersServices.logoutAllDevices(user_id)
    if (result === false) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ message: AUTH_MESSAGES.LOGOUT_FAILED })
    }
    res.status(HTTP_STATUS.OK).json({ message: AUTH_MESSAGES.LOGOUT_SUCCESS })
}

export const refreshTokenController = async (req: Request<ParamsDictionary, RefreshTokenReqBody>, res: Response) => {
    const { user_id, verify } = req.decoded_refresh_token as TokenPayload
    const { refresh_token: old_refresh_token } = req.body
    const { access_token, refresh_token } = await usersServices.refreshToken({
        refresh_token: old_refresh_token,
        user_id,
        verify
    })
    res.status(HTTP_STATUS.OK).json({
        message: AUTH_MESSAGES.REFRESH_TOKEN_SUCCESS,
        data: { access_token, refresh_token }
    })
}

export const verifyEmailController = async (req: Request<ParamsDictionary, VerifyEmailRequestBody>, res: Response) => {
    const user = req.user as User

    // if user found, update the verified field to true
    if (user.verify === UserVerifyStatus.Verified) {
        res.status(HTTP_STATUS.OK).json({
            message: AUTH_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
        })
        return
    }
    const { access_token, refresh_token } = await usersServices.verifyEmail(user._id!.toString())
    res.json({
        message: AUTH_MESSAGES.EMAIL_VERIFIED_SUCCESSFULLY,
        data: { access_token, refresh_token }
    })
}

export const resendVerifyEmailController = async (req: Request, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    // if user is not found throw an error
    if (user === null) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
            message: AUTH_MESSAGES.USER_NOT_FOUND
        })
        return
    }
    // if user found, update the verified field to true
    if (user.verify === UserVerifyStatus.Verified) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            message: AUTH_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
        })
        return
    }
    await usersServices.resendVerifyEmail(user_id)
    res.json({
        message: AUTH_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS
    })
}

export const forgotPasswordController = async (
    req: Request<ParamsDictionary, ForgotPasswordRequestBody>,
    res: Response
) => {
    const { _id } = req.user as User
    await usersServices.forgotPassword((_id as ObjectId).toString())
    res.json({
        message: AUTH_MESSAGES.FORGOT_PASSWORD_REQUEST_SUCCESS
    })
}

export const verifyForgotPasswordTokenController = async (
    req: Request<ParamsDictionary, VerifyForgotPasswordTokenRequestBody>,
    res: Response
) => {
    res.json({ message: AUTH_MESSAGES.VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS })
}

export const resetPasswordController = async (
    req: Request<ParamsDictionary, ResetPasswordRequestBody>,
    res: Response
) => {
    const { password } = req.body
    const { user_id } = req.decoded_forgot_password_token as TokenPayload
    await usersServices.resetPassword(user_id, password)
    res.json({
        message: AUTH_MESSAGES.RESET_PASSWORD_SUCCESS
    })
}
