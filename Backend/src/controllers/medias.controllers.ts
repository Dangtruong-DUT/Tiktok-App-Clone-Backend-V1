import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import { FILE_MESSAGES } from '~/constants/messages'
import { getImageReqParams, getVideoReqParam, getVideoHLSReqParam } from '~/models/requests/user.requests'
import MediasService from '~/services/medias.services'
import fs from 'fs'

export const uploadImagesController = async (req: Request, res: Response, next: NextFunction) => {
    const url = await MediasService.UploadImages(req)
    res.json({
        message: FILE_MESSAGES.UPLOAD_SUCCESS,
        result: url
    })
}

export const uploadVideosController = async (req: Request, res: Response, next: NextFunction) => {
    const url = await MediasService.UploadVideos(req)
    res.json({
        message: FILE_MESSAGES.UPLOAD_SUCCESS,
        result: url
    })
}

/**
 * Handles video upload and encoding in two stages:
 * 1. Upload: Resolves immediately upon successful upload.
 * 2. Encode: Provides an endpoint to check encoding progress.
 */

export const uploadHLSVideosController = async (req: Request, res: Response, next: NextFunction) => {
    const url = await MediasService.UploadHLSVideos(req)
    res.json({
        message: FILE_MESSAGES.UPLOAD_SUCCESS,
        result: url
    })
}

export const serveImageController = async (req: Request<getImageReqParams>, res: Response, next: NextFunction) => {
    const { name } = req.params
    return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (error) => {
        if (error) {
            res.status(HTTP_STATUS.NOT_FOUND).send(FILE_MESSAGES.FILE_NOT_FOUND)
        }
    })
}

export const serveVideoController = async (req: Request<getVideoReqParam>, res: Response, next: NextFunction) => {
    const { name } = req.params
    const id = path.basename(name, path.extname(name))

    const folderPath = path.resolve(UPLOAD_VIDEO_DIR, id)
    const videoPath = path.resolve(folderPath, name)

    return res.sendFile(videoPath, (error) => {
        if (error) {
            res.status(HTTP_STATUS.NOT_FOUND).send(FILE_MESSAGES.FILE_NOT_FOUND)
        }
    })
}

export const serveVideoStreamController = async (req: Request<getVideoReqParam>, res: Response, next: NextFunction) => {
    const range = req.headers.range
    if (!range) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send(FILE_MESSAGES.RANGE_ERROR)
    }

    const { name } = req.params
    const id = path.basename(name, path.extname(name))

    const folderPath = path.resolve(UPLOAD_VIDEO_DIR, id)
    const videoPath = path.resolve(folderPath, name)
    if (!fs.existsSync(videoPath)) {
        return res.status(HTTP_STATUS.NOT_FOUND).send(FILE_MESSAGES.FILE_NOT_FOUND)
    }

    const videoSize = fs.statSync(videoPath).size
    const chunkSize = 10 ** 6 // 1MB
    const matches = range.match(/bytes=(\d+)-?/)
    if (!matches) {
        return res.status(HTTP_STATUS.BAD_REQUEST).send(FILE_MESSAGES.RANGE_ERROR)
    }

    const start = Number(matches[1])
    if (isNaN(start) || start >= videoSize) {
        return res.status(HTTP_STATUS.RANGE_NOT_SATISFIABLE).send(FILE_MESSAGES.RANGE_ERROR)
    }

    const end = Math.min(start + chunkSize, videoSize - 1)
    const contentLength = end - start + 1
    const mime = (await import('mime')).default
    const contentType = mime.getType(videoPath) || 'video/*'

    const headers = {
        'Content-Type': contentType,
        'Content-Range': `bytes ${start}-${end}/${videoSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': contentLength
    }

    res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers)

    const videoStream = fs.createReadStream(videoPath, { start, end })
    videoStream.on('error', (err) => {
        next(err)
    })
    videoStream.pipe(res)
}

export const serveM3u8HLSController = async (req: Request<getVideoHLSReqParam>, res: Response, next: NextFunction) => {
    const { id } = req.params
    const folderPath = path.resolve(UPLOAD_VIDEO_DIR, id)
    res.sendFile(path.resolve(folderPath, 'master.m3u8'), (error) => {
        if (error) {
            res.status(HTTP_STATUS.NOT_FOUND).send(FILE_MESSAGES.FILE_NOT_FOUND)
        }
    })
}

export const serveSegmentHLSController = async (
    req: Request<getVideoHLSReqParam>,
    res: Response,
    next: NextFunction
) => {
    const { id, v, segment } = req.params

    const filePath = path.resolve(UPLOAD_VIDEO_DIR, id, v, segment)
    res.sendFile(path.resolve(filePath), (error) => {
        if (error) {
            res.status(HTTP_STATUS.NOT_FOUND).send(FILE_MESSAGES.FILE_NOT_FOUND)
        }
    })
}

export const checkEncodingProgressController = async (
    req: Request<getVideoHLSReqParam>,
    res: Response,
    next: NextFunction
) => {
    const { id } = req.params
    const result = await MediasService.CheckEncodingProgress(id)
    res.json({
        message: FILE_MESSAGES.GET_VIDEO_HLS_STATUS_SUCCESS,
        result
    })
}
