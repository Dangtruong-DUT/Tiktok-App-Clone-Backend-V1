import { UserType } from '~/models/types/User.types'
import { UserProfileResponse, SearchUserResponse, FollowListResponse } from '~/models/responses/user.responses'

export class UserResponseTransformer {
    /**
     * Transform user data từ database thành UserProfileResponse
     */
    static toUserProfile(user: UserType): UserProfileResponse {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            date_of_birth: user.date_of_birth,
            updated_at: user.updated_at,
            created_at: user.created_at,
            verify: user.verify,
            bio: user.bio,
            location: user.location,
            website: user.website,
            username: user.username,
            avatar: user.avatar,
            cover_photo: user.cover_photo,
            following_count: user.following_count,
            followers_count: user.followers_count,
            likes_count: user.likes_count,
            is_followed: user.is_followed,
            isOwner: user.isOwner,
            role: user.role
        }
    }

    /**
     * Transform user data thành MyProfileResponse (cho chính chủ account)
     */
    static toMyProfile(user: UserType): UserProfileResponse {
        return this.toUserProfile(user)
    }

    /**
     * Transform user data thành SearchUserResponse (ít thông tin hơn)
     */
    static toSearchUser(user: UserType): SearchUserResponse {
        return {
            _id: user._id,
            name: user.name,
            username: user.username,
            avatar: user.avatar,
            bio: user.bio,
            verify: user.verify,
            following_count: user.following_count,
            followers_count: user.followers_count,
            likes_count: user.likes_count,
            is_followed: user.is_followed,
            role: user.role
        }
    }

    /**
     * Transform user data thành FollowListResponse
     */
    static toFollowList(user: UserType): FollowListResponse {
        return {
            _id: user._id,
            name: user.name,
            username: user.username,
            avatar: user.avatar,
            bio: user.bio,
            verify: user.verify,
            following_count: user.following_count,
            followers_count: user.followers_count,
            likes_count: user.likes_count,
            is_followed: user.is_followed,
            role: user.role
        }
    }

    /**
     * Transform array of users cho search results
     */
    static toSearchUserList(users: UserType[]): SearchUserResponse[] {
        return users.map((user) => this.toSearchUser(user))
    }

    /**
     * Transform array of users cho follow list
     */
    static toFollowListUsers(users: UserType[]): FollowListResponse[] {
        return users.map((user) => this.toFollowList(user))
    }
}
