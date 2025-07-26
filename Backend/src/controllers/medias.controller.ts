import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { UPLOAD_VIDEO_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import { getImageReqParams, getVideoReqParam, getVideoHLSReqParam } from '~/models/requests/user.requests'
import MediasService from '~/services/medias.service'
import fs from 'fs'
import { FILE_MESSAGES } from '~/constants/messages/file'
import { s3Service } from '~/services/aws/s3.service'

export const uploadImagesController = async (req: Request, res: Response) => {
    const url = await MediasService.UploadImages(req)
    res.json({
        message: FILE_MESSAGES.UPLOAD_SUCCESS,
        data: url
    })
}

export const uploadVideosController = async (req: Request, res: Response) => {
    const url = await MediasService.UploadVideos(req)
    res.json({
        message: FILE_MESSAGES.UPLOAD_SUCCESS,
        data: url
    })
}

/**
 * Handles video upload and encoding in two stages:
 * 1. Upload: Resolves immediately upon successful upload.
 * 2. Encode: Provides an endpoint to check encoding progress.
 */

export const uploadHLSVideosController = async (req: Request, res: Response) => {
    const url = await MediasService.UploadHLSVideos(req)
    res.json({
        message: FILE_MESSAGES.UPLOAD_SUCCESS,
        data: url
    })
}

export const serveImageController = async (req: Request<getImageReqParams>, res: Response) => {
    const { name } = req.params
    await s3Service.sendFileFromS3(res, `images/${name}`)
}

export const serveVideoController = async (req: Request<getVideoReqParam>, res: Response) => {
    const { name } = req.params
    const nameWithoutExtension = path.basename(name, path.extname(name))
    res.setHeader('Content-Type', 'video/mp4')
    res.setHeader('Accept-Ranges', 'bytes')
    await s3Service.sendFileFromS3(res, `videos/${nameWithoutExtension}/${name}`)
}

export const serveM3u8HLSController = async (req: Request<getVideoHLSReqParam>, res: Response) => {
    const { id } = req.params
    await s3Service.sendFileFromS3(res, `videos-hls/${id}/master.m3u8`)
}

export const serveSegmentHLSController = async (req: Request<getVideoHLSReqParam>, res: Response) => {
    const { id, v, segment } = req.params
    await s3Service.sendFileFromS3(res, `videos-hls/${id}/${v}/${segment}`)
}

export const checkEncodingProgressController = async (req: Request, res: Response) => {
    const { id } = req.params as unknown as getVideoHLSReqParam
    const data = await MediasService.CheckEncodingProgress(id)
    res.json({
        message: FILE_MESSAGES.GET_VIDEO_HLS_STATUS_SUCCESS,
        data
    })
}

/**
 * @deprecated This controller is deprecated and replaced by serveVideoStreamController.
 *
 * */
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
