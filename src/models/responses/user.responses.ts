import { Role, UserVerifyStatus } from '~/constants/enum'

// Response type cho public user profile (không chứa thông tin nhạy cảm)
export interface UserProfileResponse {
    _id: string
    name: string
    email: string
    date_of_birth: string
    updated_at: string
    created_at: string
    verify: UserVerifyStatus
    bio: string
    location: string
    website: string
    username: string
    avatar: string
    cover_photo: string
    following_count: number
    followers_count: number
    likes_count: number
    is_followed: boolean
    isOwner: boolean
    role: Role
}

export interface UserProfileWithSensitiveResponse extends UserProfileResponse {
    password: string
    email_verify_token: string
    forgot_password_token: string
}
