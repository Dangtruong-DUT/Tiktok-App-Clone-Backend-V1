import { NextFunction, Request, Response } from 'express'
import formidable from 'formidable'

export const uploadSingleImageController = async (req: Request, res: Response, next: NextFunction) => {
    const form = formidable({})

    res.json({
        message: 'Single image uploaded successfully'
    })
}
