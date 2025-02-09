import { Audience, PosterType } from '~/constants/enum'
import { Media } from '../Common'

export interface TikTokPostBodyReq {
    type: PosterType
    audience: Audience
    content: string
    parent_id: string | null
    hashtags: string[]
    mentions: string[]
    guest_views: number
    user_views: number
    medias: Media[]
}
