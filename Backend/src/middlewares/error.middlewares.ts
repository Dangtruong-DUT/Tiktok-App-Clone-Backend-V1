import { NextFunction, Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { SERVER_MESSAGES } from '~/constants/messages/server'
import { ErrorWithStatus } from '~/models/Errors'

/**
 * Express error-handling middleware that formats and sends error responses to the client.
 *
 * @param error - The error object that was passed to next().
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next function (not used here, but required by Express error-handling signature).
 *
 * How it works:
 * - If the error is an instance of ErrorWithStatus:
 *   + Sends a response with the specified status and the error details (excluding the status).
 * - Otherwise:
 *   + Ensures all error properties are enumerable so they can be serialized.
 *   + Removes the stack trace from the response.
 *   + Sends a 500 Internal Server Error response with the error message and additional error details.
 */

const defaultErrorHandler = (error: any, req: Request, res: Response, next: NextFunction): void => {
    try {
        const errorResponse = { ...error }
        const { status, ...errorDetails } = errorResponse
        if (error instanceof ErrorWithStatus) {
            res.status(status).json(errorDetails)
        } else {
            Object.getOwnPropertyNames(error).forEach((key) => {
                const descriptor = Object.getOwnPropertyDescriptor(error, key)
                if (descriptor?.configurable === false || descriptor?.writable === false) {
                    return
                }
                // Ensure all properties are enumerable so they can be serialized in the response
                Object.defineProperty(error, key, {
                    enumerable: true
                })
                errorDetails[key] = error[key]
            })

            delete errorDetails['stack']

            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                message: error.message,
                errors: errorDetails
            })
        }
    } catch (err) {
        console.error('Error in error handler:', err)
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            message: SERVER_MESSAGES.UNEXPECTED_ERROR
        })
    }
}

export default defaultErrorHandler
