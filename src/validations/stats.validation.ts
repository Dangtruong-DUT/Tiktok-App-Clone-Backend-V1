import { checkSchema } from 'express-validator'
import { STATS_MESSAGES } from '~/constants/messages/stats'
import { validate } from '~/middlewares/validation.middlewares'

export const GetUserIndicatorsValidate = validate(
    checkSchema(
        {
            fromDate: {
                optional: true,
                trim: true,
                isISO8601: {
                    options: {
                        strict: true
                    },
                    errorMessage: STATS_MESSAGES.FROM_DATE_INVALID_FORMAT
                },
                custom: {
                    options: (value: string, { req }) => {
                        if (value && req.toDate) {
                            const fromDate = new Date(value)
                            const toDate = new Date(req.toDate)
                            if (fromDate > toDate) {
                                throw new Error(STATS_MESSAGES.FROM_DATE_MUST_BE_BEFORE_TO_DATE)
                            }
                        }
                        return true
                    }
                }
            },
            toDate: {
                optional: true,
                trim: true,
                isISO8601: {
                    options: {
                        strict: true
                    },
                    errorMessage: STATS_MESSAGES.TO_DATE_INVALID_FORMAT
                }
            }
        },
        ['query']
    )
)
