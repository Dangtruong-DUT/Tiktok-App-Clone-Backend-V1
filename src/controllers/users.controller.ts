import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import usersServices from '~/services/users.service'
import {
    ChangePasswordRequestBody,
    followUserReqBody,
    GetProfileReqParams,
    unFollowUserReqParams,
    UpdateUserRequestBody
} from '~/models/requests/user.requests'

import { USER_MESSAGES } from '~/constants/messages/user'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/common.requests'
import HTTP_STATUS from '~/constants/httpStatus'

export const getMeProfileController = async (req: Request, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const user = await usersServices.getUserById({ user_id, viewer_id: user_id, isSensitiveHidden: true })
    if (!user) {
        throw new ErrorWithStatus({ message: USER_MESSAGES.USER_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
    }
    res.json({
        message: USER_MESSAGES.GET_USER_SUCCESS,
        data: user
    })
}

export const getUserController = async (req: Request<GetProfileReqParams>, res: Response) => {
    const { username } = req.params
    const user_id = req?.decoded_authorization?.user_id as string | undefined
    const user = await usersServices.getUserByUserName(username, user_id)
    if (!user) {
        throw new ErrorWithStatus({ message: USER_MESSAGES.USER_NOT_FOUND, status: 404 })
    }
    res.json({
        message: USER_MESSAGES.GET_USER_SUCCESS,
        data: user
    })
}

export const updateUserController = async (req: Request<ParamsDictionary, UpdateUserRequestBody>, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const body = req.body
    const user = await usersServices.updateUserById(user_id, body)

    res.json({
        message: USER_MESSAGES.UPDATE_USER_SUCCESS,
        data: user
    })
}

export const followUserController = async (req: Request<ParamsDictionary, followUserReqBody>, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { user_id: following_id } = req.body
    await usersServices.followUser({ user_id, followed_user_id: following_id })
    res.json({
        message: USER_MESSAGES.FOLLOW_USER_SUCCESS
    })
}
export const unFollowUserController = async (req: Request<unFollowUserReqParams>, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { user_id: followed_user_id } = req.params
    await usersServices.unfollowUser(user_id, followed_user_id)
    res.json({
        message: USER_MESSAGES.UNFOLLOW_USER_SUCCESS
    })
}

export const changePasswordController = async (
    req: Request<ParamsDictionary, ChangePasswordRequestBody>,
    res: Response
) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { password } = req.body
    await usersServices.changePassword(user_id, password)
    res.json({
        message: USER_MESSAGES.CHANGE_PASSWORD_SUCCESS
    })
}
