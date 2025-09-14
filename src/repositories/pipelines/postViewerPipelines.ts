import { ObjectId } from 'mongodb'
import { $ } from 'node_modules/@faker-js/faker/dist/airline-CLphikKp.cjs'
import { Audience } from '~/constants/enum'

export function lookupFriendship(viewerId: ObjectId | null) {
    return {
        $lookup: {
            from: 'followers',
            let: { postUserId: '$user_id' },
            pipeline: viewerId
                ? [
                      {
                          $match: {
                              $expr: {
                                  $and: [
                                      { $eq: ['$user_id', viewerId] },
                                      { $eq: ['$followed_user_id', '$$postUserId'] }
                                  ]
                              }
                          }
                      }
                  ]
                : [],
            as: 'friendship'
        }
    }
}

export function LookUpFollowing(viewerId: ObjectId | null) {
    return {
        $lookup: {
            from: 'followers',
            let: { postUserId: '$user_id' },
            pipeline: viewerId
                ? [
                      {
                          $match: {
                              $expr: {
                                  $and: [
                                      { $eq: ['$user_id', viewerId] },
                                      { $eq: ['$followed_user_id', '$$postUserId'] }
                                  ]
                              }
                          }
                      }
                  ]
                : [],
            as: 'following'
        }
    }
}

export function matchAudience(viewerId: ObjectId | null) {
    return [
        {
            $match: {
                $expr: {
                    $or: [
                        { $eq: ['$audience', Audience.PUBLIC] },
                        {
                            $and: [
                                { $eq: ['$audience', Audience.FRIENDS] },
                                { $gte: [{ $size: { $ifNull: ['$friendship', []] } }, 1] }
                            ]
                        },
                        {
                            $and: [{ $eq: ['$audience', Audience.PRIVATE] }, { $eq: ['$user_id', viewerId] }]
                        },
                        { $eq: ['$user_id', viewerId] }
                    ]
                }
            }
        },
        {
            $project: {
                friendship: 0
            }
        }
    ]
}

export function isMatchFollowing() {
    return [
        {
            $match: {
                $expr: { $gte: [{ $size: '$following' }, 1] }
            }
        },
        {
            $project: {
                following: 0
            }
        }
    ]
}

export function lookupViewerStats(viewerId: ObjectId | null) {
    if (!viewerId) {
        return [
            {
                $addFields: { is_liked: false, is_bookmarked: false }
            },
            {
                $project: { children_posts: 0, likes: 0, bookmarks: 0 }
            }
        ]
    }
    return [
        {
            $lookup: {
                from: 'likes',
                let: { postId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [{ $eq: ['$post_id', '$$postId'] }, { $eq: ['$user_id', viewerId] }]
                            }
                        }
                    }
                ],
                as: 'likes_by_viewer'
            }
        },
        {
            $lookup: {
                from: 'bookmarks',
                let: { postId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [{ $eq: ['$post_id', '$$postId'] }, { $eq: ['$user_id', viewerId] }]
                            }
                        }
                    }
                ],
                as: 'bookmarks_by_viewer'
            }
        },
        {
            $addFields: {
                is_liked: { $gt: [{ $size: '$likes_by_viewer' }, 0] },
                is_bookmarked: { $gt: [{ $size: '$bookmarks_by_viewer' }, 0] }
            }
        },
        {
            $project: {
                children_posts: 0,
                likes_by_viewer: 0,
                bookmarks_by_viewer: 0,
                likes: 0,
                bookmarks: 0
            }
        }
    ]
}
