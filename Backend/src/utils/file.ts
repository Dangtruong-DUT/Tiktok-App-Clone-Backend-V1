import fs from 'fs'
import { Request } from 'express'
import formidable, { File } from 'formidable'
import path from 'path'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'
import { nanoid } from 'nanoid'
import { FILE_MESSAGES } from '~/constants/messages/file'

/**
 * Ensures the temporary directories for uploaded images and videos are created if they don't exist.
 * @note Creates `UPLOAD_IMAGE_TEMP_DIR` for images and `UPLOAD_VIDEO_TEMP_DIR` for videos.
 * This prepares the necessary directories for storing user-uploaded data on the server.
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

export const handleUploadSingleImage = (req: Request) => {
    const form = formidable({
        uploadDir: UPLOAD_IMAGE_TEMP_DIR,
        maxFiles: 1,
        allowEmptyFiles: false,
        keepExtensions: true,
        maxFileSize: 40 * 1024 * 1024, // 40MB
        maxTotalFileSize: 40 * 1024 * 1024, // 40MB
        filter: ({ name, mimetype }) => {
            const valid = name === 'file' && Boolean(mimetype?.includes('image'))
            if (!valid) {
                form.emit(
                    'error' as any,
                    new ErrorWithStatus({
                        message: FILE_MESSAGES.UPLOAD_INVALID_FORMAT,
                        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
                    }) as any
                )
                return false
            }
            return true
        }
    })

    return new Promise<File>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) return reject(err)

            if (!files?.file || !Array.isArray(files.file) || !files.file[0]) {
                return reject(
                    new ErrorWithStatus({
                        message: FILE_MESSAGES.UPLOAD_FILE_MUST_BE_NON_EMPTY,
                        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
                    })
                )
            }

            const file = files.file[0] as File
            resolve(file)
        })
    })
}

export const handleUploadVideos = (req: Request) => {
    const idName = nanoid()
    const folderPath = path.resolve(UPLOAD_VIDEO_DIR, idName)
    fs.mkdirSync(folderPath)
    const form = formidable({
        uploadDir: folderPath,
        maxFiles: 1,
        maxFileSize: 50 * 1024 * 1024, // 50MB
        filename: () => {
            return idName
        },
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
                const newPath = path.join(folderPath, basePath + '.' + ext)
                fs.renameSync(video.filepath, newPath)
                video.newFilename = video.newFilename + '.' + ext
                video.filepath = video.filepath + '.' + ext
            })
            resolve(files.video as File[])
        })
    })
}

export const getFileNameWithoutExtension = (fullName: string): string => {
    return fullName.substring(0, fullName.lastIndexOf('.'))
}

export const getExtensionFileName = (fileName: string): string => {
    return fileName.substring(fileName.lastIndexOf('.') + 1)
}
export const getFileNameWithExtension = (fileName: string, ext: string): string => {
    return `${getFileNameWithoutExtension(fileName)}.${ext}`
}
