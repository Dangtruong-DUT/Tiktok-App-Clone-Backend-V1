export function lookupAuthor() {
    return {
        $lookup: {
            from: 'users',
            let: { authorId: '$user_id' },
            pipeline: [
                { $match: { $expr: { $eq: ['$_id', '$$authorId'] } } },
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
                {
                    $project: {
                        password: 0,
                        email_verify_token: 0,
                        forgot_password_token: 0
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
