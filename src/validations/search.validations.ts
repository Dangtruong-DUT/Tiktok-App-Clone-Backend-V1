import { checkSchema } from 'express-validator'
import { SEARCH_MESSAGES } from '~/constants/messages/search'
import { validate } from '~/middlewares/validation.middlewares'
import { limitSchema, pageSchema } from '~/validations/schemas/pagination.schema'

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
            page: pageSchema,
            limit: limitSchema
        },
        ['query']
    )
)
