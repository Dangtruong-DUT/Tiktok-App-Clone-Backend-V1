import { Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import usersServices from '~/services/users.services'
import { RegisterRequestBody } from '~/models/requests/user.requests'
export const loginController = (req: Request, res: Response) => {
    return res.status(200).json({
        message: 'login successful'
    })
}
export const registerController = async (
    req: Request<ParamsDictionary, any, RegisterRequestBody>,
    res: Response,
    next: NextFunction
) => {
    const result = await usersServices.register(req.body)
    res.status(200).json(result)
}
