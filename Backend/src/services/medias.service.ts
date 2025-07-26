import { Request } from 'express'
import { getFileNameWithoutExtension, handleUploadImages, handleUploadVideos } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import path from 'path'
import fs from 'fs/promises'
import { MediaType } from '~/constants/enum'
import { Media } from '~/models/Common'
import hlsVideoEncoder from './HLSVideoEncoder.service'
import { envConfig, isProduction } from '~/config'
import mediasRepository from '~/repositories/medias.repository'
import { s3Service } from '~/services/aws/s3.service'
import { ErrorWithStatus } from '~/models/Errors'
import { POST_MESSAGES } from '~/constants/messages/post'
import HTTP_STATUS from '~/constants/httpStatus'

class MediasService {
    private static instance: MediasService
    private constructor() {}

    static getInstance(): MediasService {
        if (!MediasService.instance) {
            MediasService.instance = new MediasService()
        }
        return MediasService.instance
    }

    async UploadImages(req: Request) {
        const files = await handleUploadImages(req)
        const urls = await Promise.all(
            files.map(async (file) => {
                const newFileName = getFileNameWithoutExtension(file.newFilename)
                const newFileNameWithExtension = `${newFileName}.jpg`
                const newPath = path.resolve(UPLOAD_IMAGE_DIR, newFileNameWithExtension)
                await sharp(file.filepath).jpeg().toFile(newPath)
                await s3Service.uploadImageToS3({
                    fileName: newFileNameWithExtension,
                    absoluteFilePath: newPath
                })

                // Clean up local files
                await Promise.all([fs.unlink(file.filepath), fs.unlink(newPath)])

                return {
                    url: isProduction
                        ? `${envConfig.HOST}/api/static/images/${newFileNameWithExtension}`
                        : `http://localhost:${envConfig.PORT}/api/static/images/${newFileNameWithExtension}`,
                    type: MediaType.IMAGE
                }
            })
        )
        return urls
    }
    async UploadVideos(req: Request) {
        const files = await handleUploadVideos(req)
        const urls: Media[] = await Promise.all(
            files.map(async (file) => {
                const newFilename = file.newFilename as string
                const idVideo = getFileNameWithoutExtension(newFilename)
                const result = await s3Service.uploadVideoToS3({
                    fileName: file.newFilename as string,
                    absoluteFilePath: file.filepath,
                    idVideo
                })
                // Clean up local files
                const dirPath = path.resolve(UPLOAD_VIDEO_DIR, idVideo)
                await fs.rm(dirPath, { recursive: true, force: true })

                return {
                    url: isProduction
                        ? `${envConfig.HOST}/api/static/videos/${newFilename}`
                        : `http://localhost:${envConfig.PORT}/api/static/videos/${newFilename}`,
                    type: MediaType.VIDEO
                }
            })
        )
        return urls
    }

    async UploadHLSVideos(req: Request) {
        const files = await handleUploadVideos(req)
        const urls: Media[] = await Promise.all(
            files.map(async (file) => {
                const newFilename = file.newFilename as string
                hlsVideoEncoder.enqueueVideo(file.filepath)
                const nameFileWithoutExtension = getFileNameWithoutExtension(newFilename)
                return {
                    url: isProduction
                        ? `${envConfig.HOST}/api/static/videos-hls/${nameFileWithoutExtension}/master.m3u8`
                        : `http://localhost:${envConfig.PORT}/api/static/videos-hls/${nameFileWithoutExtension}/master.m3u8`,
                    type: MediaType.HLS_VIDEO
                }
            })
        )
        return urls
    }
    async CheckEncodingProgress(name: string) {
        const videoStatus = await mediasRepository.findVideoStatusByName(name)
        if (!videoStatus) {
            throw new ErrorWithStatus({ message: POST_MESSAGES.VIDEO_NOT_FOUND, status: HTTP_STATUS.NOT_FOUND })
        }

        return await mediasRepository.findVideoStatusByName(name)
    }
}

export default MediasService.getInstance()
