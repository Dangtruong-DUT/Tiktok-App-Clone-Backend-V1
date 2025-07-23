import { Request } from 'express'
import { getFileNameWithoutExtension, handleUploadSingleImage, handleUploadVideos } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import path from 'path'
import fs from 'fs'
import { MediaType } from '~/constants/enum'
import { Media } from '~/models/Common'
import { hlsVideoEncoder } from './HLSVideoEncoder'
import databaseService from './database.services'
import { envConfig, isProduction } from '~/config'

class MediasService {
    async UploadSingleImage(req: Request) {
        const file = await handleUploadSingleImage(req)
        const newFileName = getFileNameWithoutExtension(file.newFilename)
        const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newFileName}.jpg`)
        await sharp(file.filepath).jpeg().toFile(newPath)
        fs.unlinkSync(file.filepath)
        return {
            url: isProduction
                ? `${process.env.HOST}/api/static/image/${newFileName}.jpg`
                : `http://localhost:${process.env.PORT}/api/static/image/${newFileName}.jpg`,
            type: MediaType.Image
        }
    }
    async UploadVideos(req: Request) {
        const files = await handleUploadVideos(req)
        const urls: Media[] = files.map((file) => {
            const newFilename = file.newFilename as string
            return {
                'url-stream': isProduction
                    ? `${envConfig.HOST}/api/static/video-stream/${newFilename}`
                    : `http://localhost:${envConfig.PORT}/api/static/video-stream/${newFilename}`,
                url: isProduction
                    ? `${envConfig.HOST}/api/static/video/${newFilename}`
                    : `http://localhost:${envConfig.PORT}/api/static/video/${newFilename}`,
                type: MediaType.Video
            }
        })
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
                        ? `${process.env.HOST}/api/static/video-hls/${nameFileWithoutExtension}/master.m3u8`
                        : `http://localhost:${process.env.PORT}/api/static/video-hls/${nameFileWithoutExtension}/master.m3u8`,
                    type: MediaType.HLSVideo
                }
            })
        )
        return urls
    }
    async CheckEncodingProgress(id: string) {
        const data = await databaseService.videoStatus.findOne({
            name: id
        })
        return data
    }
}

export default new MediasService()
