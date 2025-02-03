import express from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import httpStatus from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/Errors'

// can be reused by many routes
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        await validation.run(req)
        const errors = validationResult(req) // Lấy kết quả của validation
        const errorObject = errors.mapped()
        const entityError = new EntityError({ errors: {} })

        for (const error in errorObject) {
            entityError.errors[error] = { ...errorObject[error] }
            const { msg } = errorObject[error]
            if (msg instanceof ErrorWithStatus && msg.status !== httpStatus.UNPROCESSABLE_ENTITY) {
                next(msg)
                return
            }
        }
        // If no error, proceed to the next middleware or route handler.
        if (errors.isEmpty()) {
            next()
        } else {
            next(entityError) // if
        }
    }
}
