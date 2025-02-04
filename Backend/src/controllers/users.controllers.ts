import { Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import usersServices from '~/services/users.services'
import {
    LoginRequestBody,
    LogoutRequestBody,
    RegisterRequestBody,
    TokenPayload,
    VerifyEmailRequestBody
} from '~/models/requests/user.requests'
import { ObjectId } from 'mongodb'
import { USER_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import databaseService from '~/services/database.services'
import { UserVerifyStatus } from '~/constants/enum'
export const loginController = async (req: Request<ParamsDictionary, any, LoginRequestBody>, res: Response) => {
    const user = req.user as User
    const user_id = user._id as ObjectId
    const result = await usersServices.login(user_id.toString())
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
