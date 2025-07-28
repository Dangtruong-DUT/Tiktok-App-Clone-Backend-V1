import TikTokPost from '~/models/schemas/TikTokPost.schemas'
import { TokenPayload } from './models/requests/user.requests'
import User from './models/schemas/User.schema'

declare module 'express' {
    interface Request {
        user?: InstanceType<typeof User>
        post?: InstanceType<typeof TikTokPost>
        decoded_authorization?: TokenPayload
        decoded_refresh_token?: TokenPayload
        decoded_email_verify_token?: TokenPayload
        decoded_forgot_password_token?: TokenPayload
    }
}
