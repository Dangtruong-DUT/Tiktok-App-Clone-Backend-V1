import { ParamSchema } from 'express-validator'
import { PAGINATION_MESSAGES } from '~/constants/messages/common'

export const pageSchema: ParamSchema = {
    trim: true,
    isInt: {
        options: {
            min: 1
        },
        errorMessage: PAGINATION_MESSAGES.PAGE_NUMBER_MUST_BE_INTEGER
    },
    toInt: true,
    optional: true
}

export const limitSchema: ParamSchema = {
    trim: true,
    isInt: {
        options: {
            min: 1
        },
        errorMessage: PAGINATION_MESSAGES.LIMIT_MUST_BE_POSITIVE
    },
    toInt: true,
    optional: true
}
