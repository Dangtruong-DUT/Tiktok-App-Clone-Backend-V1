import { checkSchema } from 'express-validator'
import { PAGINATION_MESSAGES } from '~/constants/messages/common'
import { SEARCH_MESSAGES } from '~/constants/messages/search'
import { validate } from '~/middlewares/validation.middlewares'

export const searchValidator = validate(
    checkSchema(
        {
            q: {
                isString: true,
                errorMessage: SEARCH_MESSAGES.QUERY_MUST_BE_STRING,
                trim: true,
                notEmpty: {
                    errorMessage: SEARCH_MESSAGES.DOEST_NOT_BE_EMPTY
                }
            },
            page: {
                isInt: {
                    options: { min: 1 },
                    errorMessage: PAGINATION_MESSAGES.PAGE_NUMBER_MUST_BE_POSITIVE
                },
                toInt: true,
                optional: true
            },
            limit: {
                isInt: {
                    options: { min: 1, max: 100 },
                    errorMessage: PAGINATION_MESSAGES.LIMIT_MUST_BE_BETWEEN_1_AND_100
                },
                toInt: true,
                optional: true
            }
        },
        ['query']
    )
)
