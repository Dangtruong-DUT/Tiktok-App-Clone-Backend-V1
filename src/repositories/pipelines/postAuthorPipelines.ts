export function lookupAuthor() {
    return {
        $lookup: {
            from: 'users',
            let: { authorId: '$user_id' },
            pipeline: [
                { $match: { $expr: { $eq: ['$_id', '$$authorId'] } } },
                // Lookup following count
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
                },
                // Lookup followers count
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
                },
                // Lookup all posts of this user
                {
                    $lookup: {
                        from: 'tiktok_post',
                        localField: '_id',
                        foreignField: 'user_id',
                        as: 'user_posts'
                    }
                },
                // Lookup all likes on those posts
                {
                    $lookup: {
                        from: 'likes',
                        let: { postIds: '$user_posts._id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $in: ['$post_id', '$$postIds'] }
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
                },
                {
                    $project: {
                        password: 0,
                        email_verify_token: 0,
                        forgot_password_token: 0,
                        user_posts: 0,
                        likes_on_posts: 0
                    }
                }
            ],
            as: 'author'
        }
    }
}

export function addAuthorField() {
    return { $addFields: { author: { $arrayElemAt: ['$author', 0] } } }
}
