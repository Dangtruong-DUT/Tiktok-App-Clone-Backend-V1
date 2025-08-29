import { ObjectId } from 'mongodb'

export const createFollowerPipeline = (follower: { user_id: ObjectId; followed_user_id: ObjectId }) => ({
    filter: {
        user_id: follower.user_id,
        followed_user_id: follower.followed_user_id
    },
    update: {
        $setOnInsert: follower
    },
    options: {
        upsert: true,
        returnDocument: 'after'
    }
})

export const deleteFollowerPipeline = (user_id: ObjectId, followed_user_id: ObjectId) => ({
    user_id,
    followed_user_id
})

export const checkFriendshipStatusPipeline = (user_id: ObjectId, target_user_id: ObjectId) => ({
    $or: [
        {
            user_id,
            followed_user_id: target_user_id
        },
        {
            user_id: target_user_id,
            followed_user_id: user_id
        }
    ]
})
