import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import usersServices from '~/services/users.services'
import {
    ChangePasswordRequestBody,
    followUserReqBody,
    ForgotPasswordRequestBody,
    GetProfileReqParams,
    LoginRequestBody,
    LogoutRequestBody,
    RefreshTokenReqBody,
    RegisterRequestBody,
    ResetPasswordRequestBody,
    TokenPayload,
    unFollowUserReqParams,
    UpdateUserRequestBody,
    VerifyEmailRequestBody,
    VerifyForgotPasswordTokenRequestBody
} from '~/models/requests/user.requests'
import { ObjectId } from 'mongodb'
import { USER_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import databaseService from '~/services/database.services'
import { UserVerifyStatus } from '~/constants/enum'
import User from '~/models/schemas/User.schema'

export const loginController = async (req: Request<ParamsDictionary, any, LoginRequestBody>, res: Response) => {
    const user = req.user as User
    const user_id = user._id as ObjectId
    const result = await usersServices.login({ user_id: user_id.toString(), verify: user.verify })
    res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.LOGIN_SUCCESS, result })
}
export const registerController = async (
    req: Request<ParamsDictionary, any, RegisterRequestBody>,
    res: Response,
    next: NextFunction
) => {
    const result = await usersServices.register(req.body)
    res.status(HTTP_STATUS.OK).json({
        message: USER_MESSAGES.REGISTER_SUCCESS,
        result
    })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutRequestBody>, res: Response) => {
    const { refresh_token } = req.body
    const result = await usersServices.logout(refresh_token)
    if (result === false) {
        throw new Error(USER_MESSAGES.LOGOUT_FAILED)
    }
    res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.LOGOUT_SUCCESS })
}

export const logoutAllController = async (req: Request, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const result = await usersServices.logoutAll(user_id)
    if (result === false) {
        throw new Error(USER_MESSAGES.LOGOUT_FAILED)
    }
    res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.LOGOUT_SUCCESS })
}

export const refreshTokenController = async (
    req: Request<ParamsDictionary, any, RefreshTokenReqBody>,
    res: Response
) => {
    const { user_id, verify } = req.decoded_refresh_token as TokenPayload
    const { refresh_token } = req.body
    const result = await usersServices.refreshToken({ refresh_token, user_id, verify })
    res.status(HTTP_STATUS.OK).json({ message: USER_MESSAGES.REFRESH_TOKEN_SUCCESS, result })
}
export const verifyEmailController = async (
    req: Request<ParamsDictionary, any, VerifyEmailRequestBody>,
    res: Response,
    next: NextFunction
) => {
    const { user_id } = req.decoded_email_verify_token as TokenPayload
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    // if user is not found throw an error
    if (!user) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
            message: USER_MESSAGES.USER_NOT_FOUND
        })
        return
    }
    // if user found, update the verified field to true
    if (user.verify === UserVerifyStatus.Verified) {
        res.json({
            message: USER_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
        })
        return
    }

    const result = await usersServices.verifyEmail(user_id)
    res.json({
        message: USER_MESSAGES.EMAIL_VERIFIED_SUCCESSFULLY,
        result
    })
}

export const resendVerifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    // if user is not found throw an error
    if (user === null) {
        res.status(HTTP_STATUS.NOT_FOUND).json({
            message: USER_MESSAGES.USER_NOT_FOUND
        })
        return
    }
    // if user found, update the verified field to true
    if (user.verify === UserVerifyStatus.Verified) {
        res.json({
            message: USER_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
        })
        return
    }
    const result = await usersServices.resendVerifyEmail(user_id)
    res.json(result)
}

export const forgotPasswordController = async (
    req: Request<ParamsDictionary, any, ForgotPasswordRequestBody>,
    res: Response,
    next: NextFunction
) => {
    const { _id } = req.user as User
    const result = await usersServices.forgotPassword((_id as ObjectId).toString())
    res.json(result)
}

export const verifyForgotPasswordTokenController = async (
    req: Request<ParamsDictionary, any, VerifyForgotPasswordTokenRequestBody>,
    res: Response,
    next: NextFunction
) => {
    res.json({ message: USER_MESSAGES.VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS })
}

export const resetPasswordController = async (
    req: Request<ParamsDictionary, any, ResetPasswordRequestBody>,
    res: Response,
    next: NextFunction
) => {
    const { password } = req.body
    const { user_id } = req.decoded_forgot_password_token as TokenPayload
    const result = await usersServices.resetPassword(user_id, password)
    res.json(result)
}

export const getMeProfileController = async (req: Request, res: Response, next: NextFunction) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const user = await usersServices.getUserById(user_id)
    if (!user) {
        throw new Error(USER_MESSAGES.USER_NOT_FOUND)
    }
    res.json({
        message: USER_MESSAGES.GET_USER_SUCCESS,
        result: user
    })
}

export const getUserController = async (req: Request<GetProfileReqParams>, res: Response, next: NextFunction) => {
    const { username } = req.params
    const user = await usersServices.getUserByUserName(username)
    if (!user) {
        throw new Error(USER_MESSAGES.USER_NOT_FOUND)
    }
    res.json({
        message: USER_MESSAGES.GET_USER_SUCCESS,
        result: user
    })
}

export const updateUserController = async (
    req: Request<ParamsDictionary, any, UpdateUserRequestBody>,
    res: Response,
    next: NextFunction
) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const body = req.body
    const user = await usersServices.updateUserById(user_id, body)

    res.json({
        message: USER_MESSAGES.UPDATE_USER_SUCCESS,
        result: user
    })
}

export const followUserController = async (
    req: Request<ParamsDictionary, any, followUserReqBody>,
    res: Response,
    next: NextFunction
) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { user_id: followed_user_id } = req.body
    const result = await usersServices.followUser(user_id, followed_user_id)
    res.json(result)
}
export const unFollowUserController = async (
    req: Request<unFollowUserReqParams>,
    res: Response,
    next: NextFunction
) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { user_id: followed_user_id } = req.params
    const result = await usersServices.unfollowUser(user_id, followed_user_id)
    res.json(result)
}

export const changePasswordController = async (
    req: Request<ParamsDictionary, any, ChangePasswordRequestBody>,
    res: Response,
    next: NextFunction
) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { password } = req.body
    const result = await usersServices.changePassword(user_id, password)
    res.json(result)
}
