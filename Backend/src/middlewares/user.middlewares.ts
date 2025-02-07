import { Request } from 'express'
import express from 'express'
import { checkSchema, ParamSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enum'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import { REGEX_USERNAME } from '~/constants/regrex'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/user.requests'
import databaseService from '~/services/database.services'
import usersServices from '~/services/users.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import { validate } from '~/utils/validation'

const passwordSchema: ParamSchema = {
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

const confirm_passwordSchema: ParamSchema = {
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
}
const nameSchema = (isRequired: boolean) => ({
    optional: !isRequired,
    notEmpty: isRequired
        ? {
              errorMessage: USER_MESSAGES.NAME_IS_REQUIRED
          }
        : undefined,
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
})

const dateOfBirthSchema = (isRequired: boolean) => ({
    optional: !isRequired,
    notEmpty: isRequired
        ? {
              errorMessage: USER_MESSAGES.DATA_OF_BIRTH_IS_REQUIRED
          }
        : undefined,
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
})

const userIdSchema: ParamSchema = {
    notEmpty: {
        errorMessage: USER_MESSAGES.USER_ID_IS_REQUIRED
    },
    isString: {
        errorMessage: USER_MESSAGES.USER_ID_MUST_BE_STRING
    },
    custom: {
        options: async (value: string, { req }) => {
            if (!ObjectId.isValid(value)) {
                throw new ErrorWithStatus({
                    message: USER_MESSAGES.INVALID_USER_ID,
                    status: HTTP_STATUS.NOT_FOUND
                })
            }
            const user = await usersServices.getUserById(value)
            if (!user) {
                throw new ErrorWithStatus({
                    message: USER_MESSAGES.USER_NOT_FOUND,
                    status: HTTP_STATUS.NOT_FOUND
                })
            }
            const { user_id } = (req as Request).decoded_authorization as TokenPayload
            if (user._id.toString() === user_id) {
                throw new ErrorWithStatus({
                    message: USER_MESSAGES.CANNOT_UPDATE_YOURSELF,
                    status: HTTP_STATUS.FORBIDDEN
                })
            }
            return true
        }
    },
    trim: true
}
export const registerValidator = validate(
    checkSchema(
        {
            name: nameSchema(true),
            date_of_birth: dateOfBirthSchema(true),
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
            password: passwordSchema,
            confirm_password: confirm_passwordSchema
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
            password: passwordSchema
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
                            const decoded_authorization = await verifyToken({
                                token,
                                secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
                            })
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
                        try {
                            const [decoded_refresh_token, refresh_token_object] = await Promise.all([
                                verifyToken({
                                    token,
                                    secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string
                                }),
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

export const emailVerifyTokenValidator = validate(
    checkSchema(
        {
            email_verify_token: {
                notEmpty: {
                    errorMessage: USER_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED
                },
                custom: {
                    options: async (token: string, { req }) => {
                        try {
                            const [decoded_email_verify_token, user] = await Promise.all([
                                verifyToken({ token, secretOrPublicKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN }),
                                databaseService.users.findOne({ email_verify_token: token })
                            ])

                            if (!user) {
                                throw new ErrorWithStatus({
                                    message: USER_MESSAGES.EMAIL_VERIFY_TOKEN_EXPIRED_OR_NOT_FOUND,
                                    status: HTTP_STATUS.UNAUTHORIZED
                                })
                            }

                            ;(req as Request).decoded_email_verify_token = decoded_email_verify_token
                        } catch (error) {
                            if (error instanceof JsonWebTokenError) {
                                throw new ErrorWithStatus({
                                    message: USER_MESSAGES.INVALID_EMAIL_VERIFY_TOKEN,
                                    status: HTTP_STATUS.UNAUTHORIZED
                                })
                            }
                            throw error
                        }

                        return true
                    }
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
                notEmpty: {
                    errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED
                },
                isEmail: {
                    errorMessage: USER_MESSAGES.EMAIL_IS_INVALID
                },
                custom: {
                    options: async (value: string, { req }) => {
                        const user = await databaseService.users.findOne({ email: value })
                        if (user === null)
                            throw new ErrorWithStatus({
                                message: USER_MESSAGES.USER_NOT_FOUND,
                                status: HTTP_STATUS.NOT_FOUND
                            })
                        ;(req as Request).user = user
                        return true
                    }
                },
                trim: true
            }
        },
        ['body']
    )
)

export const verifyForgotPasswordTokenValidator = validate(
    checkSchema(
        {
            forgot_password_token: {
                notEmpty: {
                    errorMessage: USER_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED
                },
                custom: {
                    options: async (token: string, { req }) => {
                        try {
                            const [decoded_forgot_password_token, user] = await Promise.all([
                                verifyToken({
                                    token,
                                    secretOrPublicKey: process.env.JWT_SECRET_FORGOT_PASSWORD as string
                                }),
                                databaseService.users.findOne({ forgot_password_token: token })
                            ])

                            if (!user) {
                                throw new ErrorWithStatus({
                                    message: USER_MESSAGES.FORGOT_PASSWORD_TOKEN_EXPIRED_OR_NOT_FOUND,
                                    status: HTTP_STATUS.UNAUTHORIZED
                                })
                            }

                            ;(req as Request).decoded_forgot_password_token = decoded_forgot_password_token
                        } catch (error) {
                            if (error instanceof JsonWebTokenError) {
                                throw new ErrorWithStatus({
                                    message: USER_MESSAGES.INVALID_FORGOT_PASSWORD_TOKEN,
                                    status: HTTP_STATUS.UNAUTHORIZED
                                })
                            }
                            throw error
                        }

                        return true
                    }
                }
            }
        },
        ['body']
    )
)

export const resetPasswordValidator = validate(
    checkSchema(
        {
            password: passwordSchema,
            confirm_password: confirm_passwordSchema
        },
        ['body']
    )
)

export const verifiedUserValidator = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { verify } = req.decoded_authorization as TokenPayload
    if (verify !== UserVerifyStatus.Verified) {
        next(
            new ErrorWithStatus({
                message: USER_MESSAGES.USER_NOT_VERIFIED,
                status: HTTP_STATUS.FORBIDDEN
            })
        )
        return
    }
    next()
}

export const updateUserValidator = validate(
    checkSchema(
        {
            name: nameSchema(false),
            date_of_birth: dateOfBirthSchema(false),
            bio: {
                optional: true,
                isString: {
                    errorMessage: USER_MESSAGES.BIO_MUST_BE_A_STRING
                },
                isLength: {
                    options: {
                        max: 200
                    },
                    errorMessage: USER_MESSAGES.BIO_LENGTH_MUST_BE_FROM_0_TO_200
                },
                trim: true
            },
            location: {
                optional: true,
                isString: {
                    errorMessage: USER_MESSAGES.LOCATION_MUST_BE_A_STRING
                },
                isLength: {
                    options: {
                        max: 200
                    },
                    errorMessage: USER_MESSAGES.LOCATION_LENGTH_MUST_BE_FROM_0_TO_200
                },
                trim: true
            },
            website: {
                optional: true,
                isURL: {
                    errorMessage: USER_MESSAGES.WEBSITE_MUST_BE_A_VALID_URL
                },
                isLength: {
                    options: {
                        max: 200
                    },
                    errorMessage: USER_MESSAGES.WEBSITE_LENGTH_MUST_BE_FROM_0_TO_200
                },
                trim: true
            },
            username: {
                optional: true,
                isString: {
                    errorMessage: USER_MESSAGES.USERNAME_MUST_BE_A_STRING
                },
                isLength: {
                    options: {
                        min: 1,
                        max: 50
                    },
                    errorMessage: USER_MESSAGES.USERNAME_LENGTH_MUST_BE_FROM_1_TO_50
                },
                custom: {
                    options: async (value: string, { req }) => {
                        if (!REGEX_USERNAME.test(value)) {
                            throw new ErrorWithStatus({
                                message: USER_MESSAGES.USERNAME_INVALID,
                                status: HTTP_STATUS.UNPROCESSABLE_ENTITY
                            })
                        }

                        const decoded_authorization = (req as Request).decoded_authorization
                        const { user_id } = decoded_authorization as TokenPayload

                        const user = await databaseService.users.findOne({ username: value })
                        if (user && user._id.toString() !== user_id) {
                            throw new ErrorWithStatus({
                                message: USER_MESSAGES.USERNAME_ALREADY_EXISTS,
                                status: HTTP_STATUS.CONFLICT
                            })
                        }
                        return true
                    }
                },
                trim: true
            },
            avatar: {
                optional: true,
                isURL: {
                    errorMessage: USER_MESSAGES.AVATAR_MUST_BE_A_VALID_URL
                },
                isLength: {
                    options: {
                        max: 400
                    },
                    errorMessage: USER_MESSAGES.AVATAR_LENGTH_MUST_BE_FROM_0_TO_400
                },
                trim: true
            },
            cover_photo: {
                optional: true,
                isURL: {
                    errorMessage: USER_MESSAGES.COVER_PHOTO_MUST_BE_A_VALID_URL
                },
                isLength: {
                    options: {
                        max: 400
                    },
                    errorMessage: USER_MESSAGES.COVER_PHOTO_LENGTH_MUST_BE_FROM_0_TO_400
                },
                trim: true
            }
        },
        ['body']
    )
)

export const followValidator = validate(
    checkSchema(
        {
            user_id: userIdSchema
        },
        ['body']
    )
)

export const unFollowValidator = validate(
    checkSchema(
        {
            user_id: userIdSchema
        },
        ['params']
    )
)

export const changePasswordValidator = validate(
    checkSchema(
        {
            current_password: {
                ...passwordSchema,
                custom: {
                    options: async (value: string, { req }) => {
                        const decoded_authorization = (req as Request).decoded_authorization
                        const { user_id } = decoded_authorization as TokenPayload
                        const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
                        if (!user) {
                            throw new ErrorWithStatus({
                                message: USER_MESSAGES.USER_NOT_FOUND,
                                status: HTTP_STATUS.NOT_FOUND
                            })
                        }
                        const isMatch = hashPassword(value) === user.password
                        if (!isMatch) {
                            throw new ErrorWithStatus({
                                message: USER_MESSAGES.CURRENT_PASSWORD_IS_INCORRECT,
                                status: HTTP_STATUS.UNAUTHORIZED
                            })
                        }
                    }
                }
            },
            password: passwordSchema,
            confirm_password: confirm_passwordSchema
        },
        ['body']
    )
)
