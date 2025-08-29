import { ObjectId } from 'mongodb'

export const lookupFollowingCountPipeline = () => [
    {
        $lookup: {
            from: 'followers',
            localField: '_id',
            foreignField: 'user_id',
            as: 'following_count'
        }
    },
    {
        $addFields: {
            following_count: { $size: '$following_count' }
        }
    }
]

export const lookupFollowersCountPipeline = () => [
    {
        $lookup: {
            from: 'followers',
            localField: '_id',
            foreignField: 'followed_user_id',
            as: 'followers_count'
        }
    },
    {
        $addFields: {
            followers_count: { $size: '$followers_count' }
        }
    }
]

export const lookupLikesCountPipeline = () => [
    {
        $lookup: {
            from: 'tiktok_post',
            localField: '_id',
            foreignField: 'user_id',
            as: 'user_posts'
        }
    },
    {
        $lookup: {
            from: 'likes',
            let: { postIds: '$user_posts._id' },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $in: ['$post_id', '$$postIds']
                        }
                    }
                }
            ],
            as: 'likes_on_posts'
        }
    },
    {
        $addFields: {
            likes_count: { $size: '$likes_on_posts' }
        }
    }
]

export const lookupFriendshipPipeline = (viewerId: ObjectId | null) => {
    if (!viewerId) {
        return [
            {
                $addFields: {
                    is_followed: false
                }
            }
        ]
    }

    return [
        {
            $lookup: {
                from: 'followers',
                let: { user_id: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [{ $eq: ['$user_id', viewerId] }, { $eq: ['$followed_user_id', '$$user_id'] }]
                            }
                        }
                    }
                ],
                as: 'friend_ship'
            }
        },
        {
            $addFields: {
                is_followed: { $gt: [{ $size: '$friend_ship' }, 0] }
            }
        }
    ]
}
