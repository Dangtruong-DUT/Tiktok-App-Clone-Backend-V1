import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { UPLOAD_FOLDER_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import { FILE_MESSAGES } from '~/constants/messages'
import { getImageReqParams } from '~/models/requests/user.requests'
import MediasService from '~/services/medias.services'

export const uploadImagesController = async (req: Request, res: Response, next: NextFunction) => {
    const url = await MediasService.handleUploadImages(req)
    res.json({
        message: FILE_MESSAGES.UPLOAD_SUCCESS,
        result: url
    })
}

export const serveImageController = async (req: Request<getImageReqParams>, res: Response, next: NextFunction) => {
    const { name } = req.params
    return res.sendFile(path.resolve(UPLOAD_FOLDER_DIR, name), (error) => {
        if (error) {
            res.status(HTTP_STATUS.NOT_FOUND).send(FILE_MESSAGES.FILE_NOT_FOUND)
        }
    })
}
