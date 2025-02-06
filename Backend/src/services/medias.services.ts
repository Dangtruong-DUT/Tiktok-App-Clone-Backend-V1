import { Request } from 'express'
import { getFileNameWithoutExtension, handleUploadImages } from '~/utils/file'
import sharp from 'sharp'
import { UPLOAD_FOLDER_DIR } from '~/constants/dir'
import path from 'path'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import { config } from 'dotenv'
import { MediaType } from '~/constants/enum'
import { Media } from '~/models/Other'

// Load environment variables from.env file
config()

class MediasService {
    async handleUploadImages(req: Request) {
        const files = await handleUploadImages(req)
        const urls: Media[] = await Promise.all(
            files.map(async (file) => {
                const newFileName = getFileNameWithoutExtension(file.newFilename)
                const newPath = path.resolve(UPLOAD_FOLDER_DIR, `${newFileName}.jpg`)
                await sharp(file.filepath).jpeg().toFile(newPath)
                fs.unlinkSync(file.filepath)
                return {
                    url: isProduction
                        ? `${process.env.HOST}/api/static/image/${newFileName}.jpg`
                        : `http://localhost:${process.env.PORT}/api/static/image/${newFileName}.jpg`,
                    type: MediaType.Image
                }
            })
        )
        return urls
    }
}

export default new MediasService()
