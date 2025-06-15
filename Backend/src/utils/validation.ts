import express from 'express'
import { checkExact, ValidationChain, ValidationError, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import httpStatus from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/Errors'

/**
 * Middleware to execute validation chains on the request and handle validation errors.
 *
 * @param validation - One or more validation chains defined using express-validator.
 * @returns An Express middleware function that validates the request data.
 *
 * How it works:
 * - Executes the validation chains on the request.
 * - If no validation errors are found: calls next() to proceed to the next middleware or route handler.
 * - If validation errors are found:
 *   + If any error is an instance of ErrorWithStatus with a status other than 422 (Unprocessable Entity): passes that error to next() for further error handling.
 *   + Otherwise: collects validation errors into an EntityError and passes it to next() to return a structured error response to the client.
 */

export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        await validation.run(req)
        await checkExact([], {
            message: 'Too many fields specified'
        }).run(req)
        const errors = validationResult(req)
        const errorObject = errors.mapped()
        const entityError = new EntityError({ errors: {} })

        for (const error in errorObject) {
            entityError.errors[error] = { ...errorObject[error] }
            const { msg }: ValidationError = errorObject[error]
            if (msg instanceof ErrorWithStatus && msg.status !== httpStatus.UNPROCESSABLE_ENTITY) {
                next(msg)
                return
            }
        }
        if (errors.isEmpty()) {
            next()
        } else {
            next(entityError)
        }
    }
}
