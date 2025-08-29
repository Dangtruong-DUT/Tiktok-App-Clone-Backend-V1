import { ObjectId } from 'mongodb'
import {
    lookupFollowersCountPipeline,
    lookupFollowingCountPipeline,
    lookupLikesCountPipeline,
    lookupFriendshipPipeline
} from './base.pipeline'

export const getUserProfilePipeline = (
    targetUserId: ObjectId,
    viewerId: ObjectId | null,
    isSensitiveHidden: boolean = true
) => {
    const pipeline = [
        {
            $match: {
                _id: targetUserId
            }
        },
        ...lookupFollowingCountPipeline(),
        ...lookupFollowersCountPipeline(),
        ...lookupLikesCountPipeline(),
        ...lookupFriendshipPipeline(viewerId),
        {
            $project: {
                friend_ship: 0,
                user_posts: 0,
                likes_on_posts: 0,
                ...(isSensitiveHidden && {
                    password: 0,
                    email_verify_token: 0,
                    forgot_password_token: 0
                })
            }
        }
    ]

    return pipeline
}

export const getUserFollowersPipeline = (
    userId: ObjectId,
    viewerId: ObjectId | null,
    page: number = 1,
    limit: number = 10
) => [
    {
        $match: { followed_user_id: userId }
    },
    {
        $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user'
        }
    },
    { $unwind: '$user' },
    {
        $lookup: {
            from: 'followers',
            localField: 'user._id',
            foreignField: 'user_id',
            as: 'user_following_count'
        }
    },
    {
        $addFields: {
            'user.following_count': { $size: '$user_following_count' }
        }
    },
    {
        $lookup: {
            from: 'followers',
            localField: 'user._id',
            foreignField: 'followed_user_id',
            as: 'user_followers_count'
        }
    },
    {
        $addFields: {
            'user.followers_count': { $size: '$user_followers_count' }
        }
    },
    ...lookupLikesCountPipeline(),
    ...(viewerId
        ? [
              {
                  $lookup: {
                      from: 'followers',
                      let: { userId: '$user._id' },
                      pipeline: [
                          {
                              $match: {
                                  user_id: viewerId,
                                  $expr: { $eq: ['$followed_user_id', '$$userId'] }
                              }
                          }
                      ],
                      as: 'friend_ship'
                  }
              },
              {
                  $addFields: {
                      'user.is_followed': { $gt: [{ $size: '$friend_ship' }, 0] }
                  }
              }
          ]
        : [
              {
                  $addFields: {
                      'user.is_followed': false
                  }
              }
          ]),
    {
        $project: {
            'user.password': 0,
            'user.email_verify_token': 0,
            'user.forgot_password_token': 0,
            user_following_count: 0,
            user_followers_count: 0,
            user_posts: 0,
            likes_on_posts: 0,
            friend_ship: 0
        }
    },
    { $sort: { created_at: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit }
]

export const getUserFollowingPipeline = (
    userId: ObjectId,
    viewerId: ObjectId | null,
    page: number = 1,
    limit: number = 10
) => [
    {
        $match: { user_id: userId }
    },
    {
        $lookup: {
            from: 'users',
            localField: 'followed_user_id',
            foreignField: '_id',
            as: 'followed_user'
        }
    },
    { $unwind: '$followed_user' },
    {
        $lookup: {
            from: 'followers',
            localField: 'followed_user._id',
            foreignField: 'user_id',
            as: 'user_following_count'
        }
    },
    {
        $addFields: {
            'followed_user.following_count': { $size: '$user_following_count' }
        }
    },
    {
        $lookup: {
            from: 'followers',
            localField: 'followed_user._id',
            foreignField: 'followed_user_id',
            as: 'user_followers_count'
        }
    },
    {
        $addFields: {
            'followed_user.followers_count': { $size: '$user_followers_count' }
        }
    },
    ...lookupLikesCountPipeline(),
    ...(viewerId
        ? [
              {
                  $lookup: {
                      from: 'followers',
                      let: { userId: '$followed_user._id' },
                      pipeline: [
                          {
                              $match: {
                                  user_id: viewerId,
                                  $expr: { $eq: ['$followed_user_id', '$$userId'] }
                              }
                          }
                      ],
                      as: 'friend_ship'
                  }
              },
              {
                  $addFields: {
                      'followed_user.is_followed': { $gt: [{ $size: '$friend_ship' }, 0] }
                  }
              }
          ]
        : [
              {
                  $addFields: {
                      'followed_user.is_followed': false
                  }
              }
          ]),
    {
        $project: {
            'followed_user.password': 0,
            'followed_user.email_verify_token': 0,
            'followed_user.forgot_password_token': 0,
            user_following_count: 0,
            user_followers_count: 0,
            user_posts: 0,
            likes_on_posts: 0,
            friend_ship: 0
        }
    },
    { $sort: { created_at: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit }
]
