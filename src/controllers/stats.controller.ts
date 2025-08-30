import { Request, Response } from 'express'
import { STATS_MESSAGES } from '~/constants/messages/stats'
import { TokenPayload } from '~/models/requests/common.requests'
import { GetIndicatorsRequest } from '~/models/requests/stats.request'
import statsService from '~/services/stats.service'

export const getUserIndicatorsController = async (req: Request, res: Response) => {
    const { user_id } = req.decoded_authorization as TokenPayload
    const { fromDate, toDate } = req.query as GetIndicatorsRequest

    const defaultFromDate = new Date()
    defaultFromDate.setDate(defaultFromDate.getDate() - 7) // Default 7 days ago

    const result = await statsService.getUserIndicators({
        user_id,
        fromDate: fromDate ? new Date(fromDate) : defaultFromDate,
        toDate: toDate ? new Date(toDate) : new Date()
    })

    return res.json({
        message: STATS_MESSAGES.GET_INDICATORS_SUCCESS,
        data: result
    })
}
