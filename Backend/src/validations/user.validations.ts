import { Request } from 'express'
import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages/user'
import { REGEX_USERNAME } from '~/constants/regex'
import { validate } from '~/middlewares/validation.middlewares'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/user.requests'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { validateTargetUserId } from '~/validations/customs/user.custom'
import { confirm_password_schema, passwordSchema } from '~/validations/schemas/auth.schema'
import {
    avatarSchema,
    bioSchema,
    coverPhotoSchema,
    dateOfBirthSchema,
    locationSchema,
    nameSchema,
    userIdSchema,
    usernameSchema,
    websiteSchema
} from '~/validations/schemas/user.schema'

export const updateUserValidator = validate(
    checkSchema(
        {
            name: nameSchema({ isRequired: false }),
            date_of_birth: dateOfBirthSchema({ isRequired: false }),
            bio: bioSchema,
            location: locationSchema,
            website: websiteSchema,
            username: {
                ...usernameSchema,
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
                }
            },
            avatar: avatarSchema,
            cover_photo: coverPhotoSchema
        },
        ['body']
    )
)

export const followValidator = validate(
    checkSchema(
        {
            user_id: {
                ...userIdSchema,
                custom: {
                    options: validateTargetUserId
                }
            }
        },
        ['body']
    )
)

export const unFollowValidator = validate(
    checkSchema(
        {
            user_id: {
                ...userIdSchema,
                custom: {
                    options: validateTargetUserId
                }
            }
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
            confirm_password: confirm_password_schema
        },
        ['body']
    )
)
