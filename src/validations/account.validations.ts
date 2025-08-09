import { checkSchema } from 'express-validator'
import { AdminRole } from '~/constants/enum'
import { ACCOUNT_MESSAGES } from '~/constants/messages/account'
import { validate } from '~/middlewares/validation.middlewares'
import { numberEnumToArray } from '~/utils/common'
import { checkEmailExists } from '~/validations/customs/auth.custom'
import { confirmPasswordSchema, passwordSchema } from '~/validations/schemas/auth.schema'
import { dateOfBirthSchema, emailSchema, nameSchema } from '~/validations/schemas/user.schema'

export const AddNewEmployeeValidation = validate(
    checkSchema(
        {
            name: nameSchema({ isRequired: true }),
            date_of_birth: dateOfBirthSchema({ isRequired: true }),
            email: {
                ...emailSchema({ isRequired: true }),
                custom: { options: checkEmailExists }
            },
            password: passwordSchema,
            confirm_password: confirmPasswordSchema,
            role: {
                isIn: {
                    options: [numberEnumToArray(AdminRole)],
                    errorMessage: ACCOUNT_MESSAGES.INVALID_ROLE
                },
                errorMessage: ACCOUNT_MESSAGES.INVALID_ROLE
            }
        },
        ['body']
    )
)
