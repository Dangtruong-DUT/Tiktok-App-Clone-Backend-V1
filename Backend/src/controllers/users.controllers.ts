import { Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import usersServices from '~/services/users.services'
import { LogoutRequestBody, RegisterRequestBody } from '~/models/requests/user.requests'
import { ObjectId } from 'mongodb'
import { USER_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
export const loginController = async (req: Request, res: Response) => {
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
