import { checkSchema } from 'express-validator'
import { CONVERSATION_MESSAGES } from '~/constants/messages/conversation'
import { validate } from '~/middlewares/validation.middlewares'
import { checkUserExistsById } from '~/validations/customs/user.custom'

export const receiverValidator = validate(
    checkSchema(
        {
            receiver_id: {
                trim: true,
                notEmpty: {
                    errorMessage: CONVERSATION_MESSAGES.RECEIVER_ID_REQUIRED
                },
                isMongoId: {
                    errorMessage: CONVERSATION_MESSAGES.RECEIVER_ID_INVALID_FORMAT
                },
                exists: {
                    errorMessage: CONVERSATION_MESSAGES.RECEIVER_ID_REQUIRED
                },
                custom: {
                    options: checkUserExistsById
                }
            }
        },
        ['params']
    )
)
