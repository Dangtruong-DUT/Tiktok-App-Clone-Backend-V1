import { NextFunction, Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'

const errorHandler = (error: any, req: Request, res: Response, next: NextFunction): void => {
    const errorResponse = { ...error }
    const { status, ...errorDetails } = errorResponse
    if (error instanceof ErrorWithStatus) {
        res.status(status).json(errorDetails)
    } else {
        Object.getOwnPropertyNames(error).forEach((key) => {
            Object.defineProperty(error, key, {
                enumerable: true
            })
            errorDetails[key] = error[key]
        })

        delete errorDetails['stack']

        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: error.message,
            errorInfo: errorDetails
        })
    }
}

export default errorHandler
