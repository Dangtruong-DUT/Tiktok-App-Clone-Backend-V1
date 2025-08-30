import statsRepository from '~/repositories/stats.repository'
import { IndicatorData, IndicatorsResponse } from '~/models/responses/stats.response'

export class StatsService {
    private static instance: StatsService
    private constructor() {}
    static getInstance(): StatsService {
        if (!StatsService.instance) {
            StatsService.instance = new StatsService()
        }
        return StatsService.instance
    }

    async getUserIndicators({
        fromDate,
        toDate,
        user_id
    }: {
        fromDate: Date
        toDate: Date
        user_id: string
    }): Promise<IndicatorsResponse> {
        const startDate = new Date(fromDate)
        startDate.setHours(0, 0, 0, 0)
        const endDate = new Date(toDate)
        endDate.setHours(23, 59, 59, 999)

        const dailyStats = await statsRepository.getUserIndicators({ startDate, endDate, user_id })

        const dateRange: IndicatorData[] = []
        const currentDate = new Date(startDate)

        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().slice(0, 10) // 'YYYY-MM-DD'
            const existingData = dailyStats.find((stat) => stat.date === dateStr)

            dateRange.push(
                existingData || {
                    date: dateStr,
                    likes_count: 0,
                    guests_view: 0,
                    users_view: 0,
                    comments_count: 0
                }
            )

            currentDate.setDate(currentDate.getDate() + 1)
        }

        const totals = dateRange.reduce(
            (acc, curr) => ({
                likes_count: acc.likes_count + (curr.likes_count || 0),
                guests_view: acc.guests_view + (curr.guests_view || 0),
                users_view: acc.users_view + (curr.users_view || 0),
                comments_count: acc.comments_count + (curr.comments_count || 0)
            }),
            {
                likes_count: 0,
                guests_view: 0,
                users_view: 0,
                comments_count: 0
            }
        )

        return {
            ...totals,
            Indicator: dateRange
        }
    }
}

const statsService = StatsService.getInstance()
export default statsService
