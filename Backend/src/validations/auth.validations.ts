import { checkSchema } from 'express-validator'
import { dateOfBirthSchema, emailSchema, nameSchema } from '~/validations/schemas/user.schema'
import { confirmPasswordSchema, passwordSchema } from '~/validations/schemas/auth.schema'
import { AUTH_MESSAGES } from '~/constants/messages/auth'
import {
    checkEmailExists,
    checkEmailAndPasswordNotExists,
    verifyEmailVerifyToken,
    verifyForgotPasswordToken,
    checkEmailNotExists
} from '~/validations/customs/auth.custom'
import { validate } from '~/middlewares/validation.middlewares'

export const registerValidator = validate(
    checkSchema(
        {
            name: nameSchema({ isRequired: true }),
            date_of_birth: dateOfBirthSchema({ isRequired: true }),
            email: {
                ...emailSchema({ isRequired: true }),
                custom: { options: checkEmailExists }
            },
            password: passwordSchema,
            confirm_password: confirmPasswordSchema
        },
        ['body']
    )
)

export const loginValidator = validate(
    checkSchema(
        {
            email: {
                ...emailSchema({ isRequired: true }),
                custom: {
                    options: checkEmailNotExists
                }
            },
            password: {
                ...passwordSchema,
                custom: {
                    options: checkEmailAndPasswordNotExists
                }
            }
        },
        ['body']
    )
)

export const resetPasswordValidator = validate(
    checkSchema(
        {
            forgot_password_token: {
                trim: true,
                notEmpty: {
                    errorMessage: AUTH_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED
                },
                custom: {
                    options: verifyForgotPasswordToken
                }
            },
            password: passwordSchema,
            confirm_password: confirmPasswordSchema
        },
        ['body']
    )
)

export const verifyForgotPasswordTokenValidator = validate(
    checkSchema(
        {
            forgot_password_token: {
                trim: true,
                notEmpty: {
                    errorMessage: AUTH_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED
                },
                custom: {
                    options: verifyForgotPasswordToken
                }
            }
        },
        ['body']
    )
)

export const emailVerifyTokenValidator = validate(
    checkSchema(
        {
            email_verify_token: {
                trim: true,
                notEmpty: {
                    errorMessage: AUTH_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED
                },
                custom: {
                    options: verifyEmailVerifyToken
                }
            }
        },
        ['body']
    )
)

export const forgotPasswordValidator = validate(
    checkSchema(
        {
            email: {
                ...emailSchema({ isRequired: true }),
                custom: {
                    options: checkEmailNotExists
                },
                trim: true
            }
        },
        ['body']
    )
)

export const oauthGoogleValidator = validate(
    checkSchema(
        {
            code: {
                trim: true,
                notEmpty: {
                    errorMessage: AUTH_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED
                },
                isString: {
                    errorMessage: AUTH_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED
                }
            }
        },
        ['query']
    )
)
