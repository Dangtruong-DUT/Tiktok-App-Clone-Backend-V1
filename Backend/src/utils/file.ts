import fs from 'fs'
import { Request } from 'express'
import formidable, { File } from 'formidable'
import path from 'path'
import { FILE_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { UPLOAD_FOLDER_DIR, UPLOAD_TEMP_DIR } from '~/constants/dir'
export const initFolder = () => {
    if (!fs.existsSync(UPLOAD_TEMP_DIR)) {
        fs.mkdirSync(UPLOAD_TEMP_DIR, {
            recursive: true // Create a directory inside the parent folder.
        })
    }
}

export const handleUploadImages = (req: Request) => {
    const form = formidable({
        uploadDir: UPLOAD_TEMP_DIR,
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

export const getFileNameWithoutExtension = (fullName: string) => {
    return fullName.substring(0, fullName.lastIndexOf('.')) || fullName
}
