import fs from 'fs'
import { Request } from 'express'
import formidable, { File } from 'formidable'
import path from 'path'
import { FILE_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'

/**
 * The `initFolder` function ensures that the temporary directories for storing uploaded images and videos are created if they do not exist.
 * If the directories are not already present, it will automatically create them.
 *
 * - `UPLOAD_IMAGE_TEMP_DIR`: The temporary directory for storing images uploaded by the user.
 * - `UPLOAD_VIDEO_TEMP_DIR`: The temporary directory for storing videos uploaded by the user.
 *
 * This ensures that the necessary directories for handling user-uploaded static data (images and videos) are ready for use on the server.
 */
export const initFolder = () => {
    if (!fs.existsSync(UPLOAD_IMAGE_TEMP_DIR)) {
        fs.mkdirSync(UPLOAD_IMAGE_TEMP_DIR, {
            recursive: true // Create a directory inside the parent folder.
        })
    }
    if (!fs.existsSync(UPLOAD_VIDEO_TEMP_DIR)) {
        fs.mkdirSync(UPLOAD_VIDEO_TEMP_DIR, {
            recursive: true
        })
    }
}

export const handleUploadImages = (req: Request) => {
    const form = formidable({
        uploadDir: UPLOAD_IMAGE_TEMP_DIR,
        maxFiles: 1,
        keepExtensions: true,
        maxFileSize: 4000 * 1024,
        maxTotalFileSize: 4000 * 1024 * 10,
        filter: ({ name, originalFilename, mimetype }) => {
            const valid = name === 'images' && Boolean(mimetype?.includes('image/'))
            if (!valid) {
                form.emit(
                    'error' as any,
                    new ErrorWithStatus({
                        message: FILE_MESSAGES.UPLOAD_INVALID_FORMAT,
                        status: HTTP_STATUS.BAD_REQUEST
                    }) as any
                )
            }
            return valid
        }
    })

    return new Promise<File[]>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err)
            }
            if (!files.image) {
                reject(
                    new ErrorWithStatus({
                        message: FILE_MESSAGES.UPLOAD_FILE_MUST_BE_NON_EMPTY,
                        status: HTTP_STATUS.NOT_FOUND
                    })
                )
            }
            resolve(files.image as File[])
        })
    })
}

export const handleUploadVideos = (req: Request) => {
    const form = formidable({
        uploadDir: UPLOAD_VIDEO_DIR,
        maxFiles: 1,
        maxFileSize: 200 * 1024 * 1024,
        filter: ({ name, mimetype }) => {
            const valid = name === 'video' && Boolean(mimetype?.startsWith('video/'))
            if (!valid) {
                form.emit(
                    'error' as any,
                    new ErrorWithStatus({
                        message: FILE_MESSAGES.UPLOAD_INVALID_FORMAT,
                        status: HTTP_STATUS.BAD_REQUEST
                    }) as any
                )
            }
            return valid
        }
    })

    return new Promise<File[]>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                reject(err)
            }
            if (!files.video) {
                reject(
                    new ErrorWithStatus({
                        message: FILE_MESSAGES.UPLOAD_FILE_MUST_BE_NON_EMPTY,
                        status: HTTP_STATUS.NOT_FOUND
                    })
                )
            }
            const videos = files.video as File[]
            videos.forEach((video) => {
                const ext = getExtensionFileName(video.originalFilename as string)
                const basePath = path.basename(video.filepath)
                const newPath = path.join(UPLOAD_VIDEO_DIR, basePath + '.' + ext)
                fs.renameSync(video.filepath, newPath)
                video.newFilename = basePath + '.' + ext
            })
            resolve(files.video as File[])
        })
    })
}

export const getFileNameWithoutExtension = (fullName: string) => {
    return fullName.substring(0, fullName.lastIndexOf('.')) || fullName
}

export const getExtensionFileName = (fileName: string) => {
    return fileName.substring(fileName.lastIndexOf('.') + 1) || ''
}
