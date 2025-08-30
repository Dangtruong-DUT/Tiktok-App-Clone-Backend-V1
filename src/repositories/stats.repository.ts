import { ObjectId } from 'mongodb'
import { IndicatorData } from '~/models/responses/stats.response'
import databaseService from '~/services/database.service'

class StatsRepository {
    private constructor() {}
    private static instance: StatsRepository

    static getInstance() {
        if (!StatsRepository.instance) {
            StatsRepository.instance = new StatsRepository()
        }
        return StatsRepository.instance
    }

    async getUserIndicators({ startDate, endDate, user_id }: { startDate: Date; endDate: Date; user_id: string }) {
        const pipeline = [
            {
                $match: {
                    created_at: {
                        $gte: startDate,
                        $lte: endDate
                    },
                    user_id: new ObjectId(user_id)
                }
            },
            {
                $lookup: {
                    from: 'likes',
                    localField: '_id',
                    foreignField: 'post_id',
                    as: 'likes'
                }
            },
            {
                $lookup: {
                    from: 'tiktok_post',
                    localField: '_id',
                    foreignField: 'parent_id',
                    as: 'children_posts'
                }
            },
            {
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
                    likes_count_each: { $size: '$likes' }
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } }
                    },
                    likes_count: { $sum: '$likes_count_each' },
                    guests_view: { $sum: { $ifNull: ['$guest_views', 0] } },
                    users_view: { $sum: { $ifNull: ['$user_views', 0] } },
                    comments_count: { $sum: '$comments_count' }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id.date',
                    likes_count: { $ifNull: ['$likes_count', 0] },
                    guests_view: { $ifNull: ['$guests_view', 0] },
                    users_view: { $ifNull: ['$users_view', 0] },
                    comments_count: { $ifNull: ['$comments_count', 0] }
                }
            },
            {
                $sort: { date: 1 }
            }
        ]

        return await databaseService.tiktokPost.aggregate<IndicatorData>(pipeline).toArray()
    }
}

const statsRepository = StatsRepository.getInstance()
export default statsRepository
