import { Request } from 'express'
import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import usersServices from '~/services/users.services'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

export const registerValidator = validate(
    checkSchema(
        {
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
        },
        ['body']
    )
)

export const loginValidator = validate(
    checkSchema(
        {
            email: {
                notEmpty: {
                    errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED
                },
                isEmail: {
                    errorMessage: USER_MESSAGES.EMAIL_IS_INVALID
                },
                custom: {
                    options: async (value, { req }) => {
                        const user = await databaseService.users.findOne({ email: value })
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
        },
        ['body']
    )
)
export const accessTokenValidator = validate(
    checkSchema(
        {
            Authorization: {
                notEmpty: {
                    errorMessage: USER_MESSAGES.ACCESS_TOKEN_IS_REQUIRED
                },
                custom: {
                    options: async (value: string, { req }) => {
                        const token = value.split(' ')[1]
                        if (!token)
                            throw new ErrorWithStatus({
                                message: USER_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                                status: HTTP_STATUS.UNAUTHORIZED
                            })
                        try {
                            const decoded_authorization = await verifyToken({ token })
                            ;(req as Request).decoded_authorization = decoded_authorization
                        } catch (err) {
                            throw new ErrorWithStatus({
                                message: 'Access token is ' + (err as JsonWebTokenError).message,
                                status: HTTP_STATUS.UNAUTHORIZED
                            })
                        }

                        return true
                    }
                }
            }
        },
        ['headers']
    )
)
export const refreshTokenValidate = validate(
    checkSchema(
        {
            refresh_token: {
                notEmpty: {
                    errorMessage: USER_MESSAGES.REFRESH_TOKEN_IS_REQUIRED
                },
                custom: {
                    options: async (value: string, { req }) => {
                        const token = value
                        if (!token)
                            throw new ErrorWithStatus({
                                message: USER_MESSAGES.REFRESH_TOKEN_IS_REQUIRED,
                                status: HTTP_STATUS.UNAUTHORIZED
                            })
                        try {
                            const [decoded_refresh_token, refresh_token_object] = await Promise.all([
                                verifyToken({ token }),
                                databaseService.refreshToken.findOne({ token })
                            ])

                            if (refresh_token_object === null) {
                                throw new ErrorWithStatus({
                                    message: USER_MESSAGES.REFRESH_TOKEN_EXPIRED_OR_NOT_FOUND,
                                    status: HTTP_STATUS.UNAUTHORIZED
                                })
                            }
                            ;(req as Request).decoded_refresh_token = decoded_refresh_token
                        } catch (error) {
                            if (error instanceof JsonWebTokenError) {
                                throw new ErrorWithStatus({
                                    message: USER_MESSAGES.INVALID_REFRESH_TOKEN,
                                    status: HTTP_STATUS.UNAUTHORIZED
                                })
                            } else throw error
                        }

                        return true
                    }
                }
            }
        },
        ['body']
    )
)
