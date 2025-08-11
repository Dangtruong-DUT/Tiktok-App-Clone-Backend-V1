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

// Response type cho search users
export interface SearchUserResponse {
    _id: string
    name: string
    username: string
    avatar: string
    bio: string
    verify: UserVerifyStatus
    following_count: number
    followers_count: number
    likes_count: number
    is_followed: boolean
    role: Role
}

// Response type cho followers/following list
export interface FollowListResponse {
    _id: string
    name: string
    username: string
    avatar: string
    bio: string
    verify: UserVerifyStatus
    following_count: number
    followers_count: number
    likes_count: number
    is_followed: boolean
    role: Role
}

// Response wrapper cho API responses
export interface UserApiResponse<T> {
    message: string
    data: T
}

export interface UserListApiResponse<T> {
    message: string
    data: {
        users: T[]
        meta: {
            page: number
            limit: number
            total_pages: number
            total: number
        }
    }
}
