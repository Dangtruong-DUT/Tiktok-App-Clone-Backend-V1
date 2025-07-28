import { Request, Response } from 'express'
import { CONVERSATION_MESSAGES } from '~/constants/messages/conversation'
import { PaginationQuery, TokenPayload } from '~/models/requests/common.requests'
import { GetConversationsParams } from '~/models/requests/conversation.request'
import conversationService from '~/services/conversation.service'

export const getConversationByReceiverIdController = async (req: Request<GetConversationsParams>, res: Response) => {
    const { receiver_id } = req.params
    const { page = 1, limit = 10 } = req.query as PaginationQuery

    const sender_id = (req.decoded_authorization as TokenPayload).user_id
    const { conversations, total } = await conversationService.getConversations({
        receiver_id,
        sender_id,
        page: Number(page),
        limit: Number(limit)
    })
    const total_pages = Math.ceil(total / (Number(limit) || 10))
    res.json({
        message: CONVERSATION_MESSAGES.GET_CONVERSATION_SUCCESS,
        data: conversations,
        meta: {
            page: Number(page),
            limit: Number(limit),
            total_pages
        }
    })
}
