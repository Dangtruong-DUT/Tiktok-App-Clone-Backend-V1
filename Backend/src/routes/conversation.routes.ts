import { Router } from 'express'
import { getConversationByReceiverIdController } from '~/controllers/conversation.controller'
import { authenticate, requireVerifiedUser } from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import { receiverValidator } from '~/validations/conversation.validations'
import { paginationValidator } from '~/validations/pagination.validation'

const conversationRoutes = Router()

/**
 * Conversation routes. get conversation by receiver_id
 * path: /api/conversations/receivers/:receiver_id
 * Method: GET
 * query: page, limit
 *
 */

conversationRoutes.get(
    '/receivers/:receiver_id',
    authenticate,
    requireVerifiedUser,
    receiverValidator,
    paginationValidator,
    wrapRequestHandler(getConversationByReceiverIdController)
)

export default conversationRoutes
