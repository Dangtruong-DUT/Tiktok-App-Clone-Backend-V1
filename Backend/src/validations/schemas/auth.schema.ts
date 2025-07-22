import { ParamSchema } from 'express-validator'
import { VALIDATION_MESSAGES } from '~/constants/messages/validation'

export const passwordSchema: ParamSchema = {
    trim: true,
    notEmpty: {
        errorMessage: VALIDATION_MESSAGES.PASSWORD_IS_REQUIRED
    },
    isLength: {
        options: {
            min: 6,
            max: 50
        },
        errorMessage: VALIDATION_MESSAGES.PASSWORD_MUST_BE_STRONG
    },
    isStrongPassword: {
        options: {
            minLength: 6,
            minNumbers: 1,
            minSymbols: 1
        },
        errorMessage: VALIDATION_MESSAGES.PASSWORD_MUST_BE_STRONG
    }
}

export const confirm_password_schema: ParamSchema = {
    trim: true,
    notEmpty: {
        errorMessage: VALIDATION_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
    },
    isLength: {
        options: {
            min: 6,
            max: 50
        },
        errorMessage: VALIDATION_MESSAGES.PASSWORD_MUST_BE_STRONG
    },
    isStrongPassword: {
        options: {
            minLength: 6,
            minNumbers: 1,
            minSymbols: 1
        },
        errorMessage: VALIDATION_MESSAGES.PASSWORD_MUST_BE_STRONG
    },
    custom: {
        options: (value, { req }) => value === req.body.password,
        errorMessage: VALIDATION_MESSAGES.CONFIRM_PASSWORD_DOES_NOT_MATCH
    }
}

export const confirmPasswordSchema: ParamSchema = {
    trim: true,
    notEmpty: {
        errorMessage: VALIDATION_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
    },
    isLength: {
        options: { min: 6, max: 50 },
        errorMessage: VALIDATION_MESSAGES.PASSWORD_MUST_BE_STRONG
    },
    isStrongPassword: {
        options: { minLength: 6, minNumbers: 1, minSymbols: 1 },
        errorMessage: VALIDATION_MESSAGES.PASSWORD_MUST_BE_STRONG
    },
    custom: {
        options: (value, { req }) => value === req.body.password,
        errorMessage: VALIDATION_MESSAGES.CONFIRM_PASSWORD_DOES_NOT_MATCH
    }
}
