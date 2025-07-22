import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import usersServices from '~/services/users.services'
import {
    ChangePasswordRequestBody,
    followUserReqBody,
    GetProfileReqParams,
    TokenPayload,
    unFollowUserReqParams,
    UpdateUserRequestBody
} from '~/models/requests/user.requests'

import { USER_MESSAGES } from '~/constants/messages/user'

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

export const followUserController = async (req: Request<ParamsDictionary, followUserReqBody>, res: Response) => {
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
