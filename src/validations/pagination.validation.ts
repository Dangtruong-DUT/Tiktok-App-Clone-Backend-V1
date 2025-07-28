import { checkSchema } from 'express-validator'
import { validate } from '~/middlewares/validation.middlewares'
import { limitSchema, pageSchema } from '~/validations/schemas/pagination.schema'

export const paginationValidator = validate(
    checkSchema(
        {
            page: pageSchema,
            limit: limitSchema
        },
        ['query']
    )
)
