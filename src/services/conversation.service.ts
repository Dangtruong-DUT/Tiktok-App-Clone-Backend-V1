import Conversation from '~/models/schemas/Conversation.schemas'
import conversationRepository from '~/repositories/conversation.repository'

class ConversationService {
    private static instance: ConversationService
    static getInstance(): ConversationService {
        if (!ConversationService.instance) {
            ConversationService.instance = new ConversationService()
        }
        return ConversationService.instance
    }
    private constructor() {}

    async createConversation(conversation: Conversation) {
        return await conversationRepository.createConversation(conversation)
    }

    async getConversations({
        receiver_id,
        sender_id,
        page = 1,
        limit = 10
    }: {
        receiver_id: string
        sender_id: string
        page?: number
        limit?: number
    }) {
        const [conversations, total] = await Promise.all([
            conversationRepository.findConversationsBySenderAndReceiver({
                receiver_id,
                sender_id,
                page,
                limit
            }),
            conversationRepository.countConversationsBySenderAndReceiver({ receiver_id, sender_id })
        ])
        return {
            conversations,
            total
        }
    }
}

export default ConversationService.getInstance()
