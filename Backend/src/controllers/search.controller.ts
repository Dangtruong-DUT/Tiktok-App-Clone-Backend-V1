import { Request, Response } from 'express'

export const searchController = async (req: Request, res: Response) => {
    return res.json({
        message: 'Search endpoint is not implemented yet'
    })
}
