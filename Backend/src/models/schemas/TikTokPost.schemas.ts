import { ObjectId } from 'mongodb'
import { Media } from '../Common'
import { PosterType, Audience } from '~/constants/enum'

interface TikTokPostType {
    _id?: ObjectId
    user_id: ObjectId
    type: PosterType
    audience: Audience
    content: string
    parent_id: string | null
    hashtags: ObjectId[]
    mentions: string[]
    guest_views?: number
    user_views?: number
    created_at?: Date
    updated_at?: Date
    medias: Media[]
}

export default class TikTokPost {
    _id?: ObjectId
    user_id: ObjectId
    type: PosterType
    audience: Audience
    content: string
    parent_id: ObjectId | null
    hashtags: ObjectId[]
    mentions: ObjectId[]
    guest_views?: number
    user_views?: number
    created_at: Date
    updated_at: Date
    medias: Media[]
    constructor({
        _id,
        user_id,
        type,
        audience,
        content,
        parent_id,
        hashtags,
        mentions,
        guest_views,
        user_views,
        created_at,
        updated_at,
        medias
    }: TikTokPostType) {
        const date = new Date()
        this._id = _id
        this.user_id = user_id
        this.type = type
        this.audience = audience
        this.content = content
        this.parent_id = parent_id ? new ObjectId(parent_id) : null
        this.hashtags = hashtags.map((item) => new ObjectId(item)) || []
        this.mentions = mentions.map((item) => new ObjectId(item)) || []
        this.guest_views = guest_views || 0
        this.user_views = user_views || 0

        this.created_at = created_at || date
        this.updated_at = updated_at || date
        this.medias = medias
    }
}
