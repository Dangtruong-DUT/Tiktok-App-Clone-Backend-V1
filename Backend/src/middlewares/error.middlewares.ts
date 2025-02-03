import { NextFunction, Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'

const errorHandler = (error: any, req: Request, res: Response, next: NextFunction): void => {
    const errorResponse = { ...error }
    const { status, ...errorDetails } = errorResponse
    res.status(status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(errorDetails)
}

export default errorHandler
