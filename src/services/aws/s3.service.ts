import * as AWS from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { envConfig } from '~/config/envConfig'
import fs from 'fs'
import { Response } from 'express'

class S3Service {
    private static instance: S3Service
    private s3Client: AWS.S3
    private bucketName: string

    private constructor() {
        this.s3Client = new AWS.S3({
            region: envConfig.AWS_REGION,
            credentials: {
                accessKeyId: envConfig.AWS_ACCESS_KEY_ID,
                secretAccessKey: envConfig.AWS_SECRET_ACCESS_KEY
            }
        })

        this.bucketName = envConfig.AWS_S3_BUCKET_NAME
    }

    public static getInstance(): S3Service {
        if (!S3Service.instance) {
            S3Service.instance = new S3Service()
        }
        return S3Service.instance
    }

    public async uploadFile({
        fileName,
        absoluteFilePath,
        contentType
    }: {
        fileName: string
        absoluteFilePath: string
        contentType: string
    }) {
        try {
            const file = fs.readFileSync(absoluteFilePath)

            const upload = new Upload({
                client: this.s3Client,
                params: {
                    Bucket: this.bucketName,
                    Key: fileName,
                    Body: file,
                    ContentType: contentType
                },
                queueSize: 4,
                partSize: 5 * 1024 * 1024,
                leavePartsOnError: false
            })

            upload.on('httpUploadProgress', (progress) => {
                console.log(progress)
            })

            return await upload.done()
        } catch (error) {
            console.error('Error uploading file to S3:', error)
            throw error
        }
    }

    public async uploadImageToS3({ fileName, absoluteFilePath }: { fileName: string; absoluteFilePath: string }) {
        return this.uploadFile({
            fileName: `images/${fileName}`,
            absoluteFilePath,
            contentType: (await import('mime')).default.getType(absoluteFilePath) || 'image/jpeg'
        })
    }

    public async uploadVideoToS3({
        fileName,
        absoluteFilePath,
        idVideo
    }: {
        fileName: string
        absoluteFilePath: string
        idVideo: string
    }) {
        return this.uploadFile({
            fileName: `videos/${idVideo}/${fileName}`,
            absoluteFilePath,
            contentType: (await import('mime')).default.getType(absoluteFilePath) || 'video/mp4'
        })
    }

    public async sendFileFromS3(res: Response, filePath: string) {
        const data = await this.s3Client.getObject({
            Bucket: this.bucketName,
            Key: filePath
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(data.Body as any).pipe(res)
    }
}

export const s3Service = S3Service.getInstance()
