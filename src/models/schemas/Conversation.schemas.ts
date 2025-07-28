import { ObjectId } from 'mongodb'

interface ConversationType {
    _id?: ObjectId
    sender_id: ObjectId
    receiver_id: ObjectId
    content: string
    created_at?: Date
    update_at?: Date
}

export default class Conversation {
    _id?: ObjectId
    sender_id: ObjectId
    content: string
    receiver_id: ObjectId
    created_at: Date
    update_at: Date
    constructor({ _id, sender_id, created_at, receiver_id, update_at, content }: ConversationType) {
        this._id = _id || new ObjectId()
        const date = new Date()
        this.sender_id = sender_id
        this.receiver_id = receiver_id
        this.content = content
        this.created_at = created_at || date
        this.update_at = update_at || date
    }
}
