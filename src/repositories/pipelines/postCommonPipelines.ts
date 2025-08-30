export function lookupHashtags() {
    return {
        $lookup: {
            from: 'hashtags',
            localField: 'hashtags',
            foreignField: '_id',
            as: 'hashtags'
        }
    }
}

export function lookupMentions() {
    return {
        $lookup: {
            from: 'users',
            localField: 'mentions',
            foreignField: '_id',
            as: 'mentions'
        }
    }
}

export function addMentionsFields() {
    return {
        $addFields: {
            mentions: {
                $map: {
                    input: '$mentions',
                    as: 'mention',
                    in: {
                        _id: '$$mention._id',
                        name: '$$mention.name',
                        username: '$$mention.username',
                        email: '$$mention.email'
                    }
                }
            }
        }
    }
}

export function lookupLikes() {
    return {
        $lookup: {
            from: 'likes',
            localField: '_id',
            foreignField: 'post_id',
            as: 'likes'
        }
    }
}

export function lookupBookmarks() {
    return {
        $lookup: {
            from: 'bookmarks',
            localField: '_id',
            foreignField: 'post_id',
            as: 'bookmarks'
        }
    }
}

export function addStatsFields() {
    return {
        $addFields: {
            likes_count: { $size: '$likes' },
            bookmarks_count: { $size: '$bookmarks' }
        }
    }
}

export function lookupChildrenPosts() {
    return {
        $lookup: {
            from: 'tiktok_post',
            localField: '_id',
            foreignField: 'parent_id',
            as: 'children_posts'
        }
    }
}

export function addChildrenCounts() {
    return {
        $addFields: {
            comments_count: {
                $size: {
                    $filter: {
                        input: '$children_posts',
                        as: 'item',
                        cond: { $eq: ['$$item.type', 2] }
                    }
                }
            },
            reposts_count: {
                $size: {
                    $filter: {
                        input: '$children_posts',
                        as: 'item',
                        cond: { $eq: ['$$item.type', 1] }
                    }
                }
            },
            quotes_count: {
                $size: {
                    $filter: {
                        input: '$children_posts',
                        as: 'item',
                        cond: { $eq: ['$$item.type', 3] }
                    }
                }
            }
        }
    }
}
