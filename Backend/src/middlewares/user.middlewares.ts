import { checkSchema } from 'express-validator'
import { USER_MESSAGES } from '~/constants/messages'
import databaseService from '~/services/database.services'
import usersServices from '~/services/users.services'
import { hashPassword } from '~/utils/crypto'
import { validate } from '~/utils/validation'

export const registerValidator = validate(
    checkSchema({
        name: {
            notEmpty: {
                errorMessage: USER_MESSAGES.NAME_IS_REQUIRED
            },
            isString: {
                errorMessage: USER_MESSAGES.NAME_MUST_BE_A_STRING
            },
            isLength: {
                options: {
                    min: 1,
                    max: 100
                },
                errorMessage: USER_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
            },
            trim: true
        },
        email: {
            notEmpty: {
                errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED
            },
            isEmail: {
                errorMessage: USER_MESSAGES.EMAIL_IS_INVALID
            },
            trim: true,
            custom: {
                options: async (value) => {
                    const exists = await usersServices.checkEmailExist(value)
                    if (exists) throw new Error(USER_MESSAGES.EMAIL_ALREADY_EXISTS)
                    return true
                }
            }
        },
        password: {
            notEmpty: {
                errorMessage: USER_MESSAGES.PASSWORD_IS_REQUIRED
            },
            isLength: {
                options: {
                    min: 6,
                    max: 50
                },
                errorMessage: USER_MESSAGES.PASSWORD_MUST_BE_STRONG
            },
            isStrongPassword: {
                options: {
                    minLength: 6,
                    minNumbers: 1,
                    minSymbols: 1
                },
                errorMessage: USER_MESSAGES.PASSWORD_MUST_BE_STRONG
            },
            trim: true
        },
        confirm_password: {
            notEmpty: {
                errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
            },
            isLength: {
                options: {
                    min: 6,
                    max: 50
                },
                errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG
            },
            isStrongPassword: {
                options: {
                    minLength: 6,
                    minNumbers: 1,
                    minSymbols: 1
                },
                errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG
            },
            trim: true,
            custom: {
                options: (value: any, { req }) => value === req.body.password,
                errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_DOES_NOT_MATCH
            }
        },
        date_of_birth: {
            notEmpty: {
                errorMessage: USER_MESSAGES.DATA_OF_BIRTH_IS_REQUIRED
            },
            isISO8601: {
                options: {
                    strict: true
                },
                errorMessage: USER_MESSAGES.DATA_OF_BIRTH_IS_INVALID_FORMAT
            },
            custom: {
                options: (value: any) => new Date(value) <= new Date(),
                errorMessage: USER_MESSAGES.DATE_OF_BIRTH_MUST_BE_IN_THE_PAST
            }
        }
    })
)

export const loginValidator = validate(
    checkSchema({
        email: {
            notEmpty: {
                errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED
            },
            isEmail: {
                errorMessage: USER_MESSAGES.EMAIL_IS_INVALID
            },
            custom: {
                options: async (value, { req }) => {
                    const user = await databaseService.users.findOne({
                        email: value,
                        password: hashPassword(req.body.password)
                    })
                    if (user === null) throw new Error(USER_MESSAGES.USER_NOT_FOUND)
                    req.user = user
                    return true
                }
            },
            trim: true
        },
        password: {
            notEmpty: {
                errorMessage: USER_MESSAGES.PASSWORD_IS_REQUIRED
            },
            isLength: {
                options: {
                    min: 6,
                    max: 50
                },
                errorMessage: USER_MESSAGES.PASSWORD_MUST_BE_STRONG
            },
            isStrongPassword: {
                options: {
                    minLength: 6,
                    minNumbers: 1,
                    minSymbols: 1
                },
                errorMessage: USER_MESSAGES.PASSWORD_MUST_BE_STRONG
            },
            trim: true
        }
    })
)
