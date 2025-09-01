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

export const handleUploadImages = (req: Request) => {
    const form = formidable({
        uploadDir: UPLOAD_IMAGE_TEMP_DIR,
        maxFiles: 6,
        allowEmptyFiles: false,
        keepExtensions: true,
        maxFileSize: 40 * 1024 * 1024, // 40MB
        maxTotalFileSize: 6 * 40 * 1024 * 1024, // 240MB
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

    return new Promise<File[]>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) return reject(err)

            if (!files?.file || !Array.isArray(files.file) || files.file.length === 0) {
                return reject(
                    new ErrorWithStatus({
                        message: FILE_MESSAGES.UPLOAD_FILE_MUST_BE_NON_EMPTY,
                        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
                    })
                )
            }

            resolve(files.file as File[])
        })
    })
}

export const handleUploadVideos = (req: Request) => {
    const form = formidable({
        uploadDir: UPLOAD_VIDEO_TEMP_DIR,
        maxFiles: 1,
        maxFileSize: 1024 * 1024 * 1024, // 1GB
        filter: ({ name, mimetype }) => {
            const valid = name === 'file' && Boolean(mimetype?.startsWith('video/'))
            if (!valid) {
                form.emit(
                    'error' as any,
                    new ErrorWithStatus({
                        message: FILE_MESSAGES.UPLOAD_INVALID_FORMAT,
                        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
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
            if (!files?.file || !Array.isArray(files.file) || files.file.length === 0) {
                return reject(
                    new ErrorWithStatus({
                        message: FILE_MESSAGES.UPLOAD_FILE_MUST_BE_NON_EMPTY,
                        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
                    })
                )
            }
            const videos = files.file as File[]

            videos.forEach((video) => {
                const ext = getExtensionFileName(video.originalFilename as string)
                const videoName = nanoid()
                const uniqueFolder = path.resolve(UPLOAD_VIDEO_DIR, videoName)
                fs.mkdirSync(uniqueFolder)

                const newName = videoName + '.' + ext
                const newPath = path.join(uniqueFolder, newName)

                fs.renameSync(video.filepath, newPath)

                // Cập nhật lại metadata
                video.newFilename = newName
                video.filepath = newPath
            })

            resolve(videos)
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

/**
 * Đệ quy thu thập tất cả đường dẫn file trong một thư mục (bao gồm cả các thư mục con).
 * @param directory - Thư mục gốc cần quét.
 * @param fileList - Danh sách kết quả (nội bộ, không cần truyền).
 * @returns Mảng các đường dẫn file tuyệt đối.
 */

export function collectFilePathsFromDirectory(directory: string, fileList: string[] = []): string[] {
    const entries = fs.readdirSync(directory)

    for (const entry of entries) {
        const fullPath = path.join(directory, entry)
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory()) {
            collectFilePathsFromDirectory(fullPath, fileList)
        } else {
            fileList.push(fullPath)
        }
    }

    return fileList
}
