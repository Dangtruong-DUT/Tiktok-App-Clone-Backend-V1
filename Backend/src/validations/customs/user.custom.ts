import { Request } from 'express'
import { CustomValidator } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages/user'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/user.requests'
import usersServices from '~/services/users.services'

// This validator checks if the target user ID is valid and exists in the database and is not the same as the logged-in user
export const validateTargetUserId: CustomValidator = async (value: string, { req }) => {
    if (!ObjectId.isValid(value)) {
        throw new Error(USER_MESSAGES.INVALID_USER_ID)
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
