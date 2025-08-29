import { ObjectId } from 'mongodb'
import {
    lookupFollowersCountPipeline,
    lookupFollowingCountPipeline,
    lookupLikesCountPipeline,
    lookupFriendshipPipeline
} from './base.pipeline'

export const searchUsersPipeline = (query: string, viewerId: ObjectId | null, page: number = 1, limit: number = 10) => [
    {
        $match: {
            $text: { $search: query }
        }
    },
    ...lookupFollowingCountPipeline(),
    ...lookupFollowersCountPipeline(),
    ...lookupLikesCountPipeline(),
    ...lookupFriendshipPipeline(viewerId),
    {
        $project: {
            password: 0,
            email_verify_token: 0,
            forgot_password_token: 0,
            friend_ship: 0,
            user_posts: 0,
            likes_on_posts: 0
        }
    },
    { $skip: (page - 1) * limit },
    { $limit: limit }
]

export const countUsersByQueryPipeline = (query: string) => [
    {
        $match: {
            $text: { $search: query }
        }
    },
    {
        $count: 'total'
    }
]
