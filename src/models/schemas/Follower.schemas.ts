import { ObjectId } from 'mongodb'

interface FollowerType {
    _id?: ObjectId
    followed_user_id: ObjectId
    user_id: ObjectId
    created_at?: Date
}

export default class Follower {
    _id?: ObjectId
    followed_user_id: ObjectId
    user_id: ObjectId
    created_at: Date
    constructor({ _id, created_at, followed_user_id, user_id }: FollowerType) {
        this._id = _id
        this.followed_user_id = followed_user_id
        this.user_id = user_id
        this.created_at = created_at || new Date()
    }
}
