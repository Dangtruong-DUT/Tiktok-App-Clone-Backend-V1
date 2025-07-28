import { ObjectId } from 'mongodb'
import Conversation from '~/models/schemas/Conversation.schemas'
import databaseService from '~/services/database.service'

class ConversationRepository {
    static Instance: ConversationRepository
    private constructor() {}

    static getInstance() {
        if (!ConversationRepository.Instance) {
            ConversationRepository.Instance = new ConversationRepository()
        }
        return ConversationRepository.Instance
    }

    async createConversation(conversation: Conversation) {
        return await databaseService.conversations.insertOne(conversation)
    }
    async findConversationsBySenderAndReceiver({
        sender_id,
        receiver_id,
        page,
        limit
    }: {
        sender_id: string
        receiver_id: string
        page: number
        limit: number
    }) {
        const skip = page > 0 ? (page - 1) * limit : 0
        return await databaseService.conversations
            .find({
                $or: [
                    { sender_id: new ObjectId(sender_id), receiver_id: new ObjectId(receiver_id) },
                    { sender_id: new ObjectId(receiver_id), receiver_id: new ObjectId(sender_id) }
                ]
            })
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit)
            .toArray()
    }

    async countConversationsBySenderAndReceiver({
        sender_id,
        receiver_id
    }: {
        sender_id: string
        receiver_id: string
    }) {
        return await databaseService.conversations.countDocuments({
            $or: [
                { sender_id: new ObjectId(sender_id), receiver_id: new ObjectId(receiver_id) },
                { sender_id: new ObjectId(receiver_id), receiver_id: new ObjectId(sender_id) }
            ]
        })
    }
}

export default ConversationRepository.getInstance()
