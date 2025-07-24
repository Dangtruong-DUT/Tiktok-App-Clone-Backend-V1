import { Audience, PosterType } from '~/constants/enum'
import { Media } from '../Common'

export interface CreateTikTokPostBodyReq {
    type: PosterType
    audience: Audience
    content: string
    parent_id: string | null
    hashtags: string[]
    mentions: string[]
    medias: Media[]
}
