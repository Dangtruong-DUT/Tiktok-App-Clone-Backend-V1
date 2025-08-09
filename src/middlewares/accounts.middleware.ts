import { NextFunction, Request, Response } from 'express'
import { Role } from '~/constants/enum'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/common.requests'

export function RequiredRole(roles: Role[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { role } = req.decoded_authorization as TokenPayload
            if (!role || !roles.includes(role)) {
                throw new ErrorWithStatus({
                    message: 'You do not have permission to access this resource',
                    status: HTTP_STATUS.FORBIDDEN
                })
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}
