import * as AWS from '@aws-sdk/client-s3'
import { envConfig } from '~/config'
import { Upload } from '@aws-sdk/lib-storage'
import path from 'path'
import fs from 'fs'

const s3ClientInstance = new AWS.S3({
    region: envConfig.AWS_REGION,
    credentials: {
        accessKeyId: envConfig.AWS_ACCESS_KEY_ID,
        secretAccessKey: envConfig.AWS_SECRET_ACCESS_KEY
    }
})

export async function uploadFileToS3({
    fileName,
    relativeFilePath,
    contentType
}: {
    fileName: string
    relativeFilePath: string
    contentType: string
}) {
    try {
        const absoluteFilePath = path.resolve(relativeFilePath)
        const file = fs.readFileSync(absoluteFilePath)
        const parallelUploads3 = new Upload({
            client: s3ClientInstance,
            params: { Bucket: envConfig.AWS_S3_BUCKET_NAME, Key: fileName, Body: file, ContentType: contentType },

            // optional tags
            tags: [
                /*...*/
            ],

            // additional optional fields show default values below:

            // (optional) concurrency configuration
            queueSize: 4,

            // (optional) size of each part, in bytes, at least 5MB
            partSize: 1024 * 1024 * 5,

            // (optional) when true, do not automatically call AbortMultipartUpload when
            // a multipart upload fails to complete. You should then manually handle
            // the leftover parts.
            leavePartsOnError: false
        })

        parallelUploads3.on('httpUploadProgress', (progress) => {
            console.log(progress)
        })

        await parallelUploads3.done()
    } catch (e) {
        console.log(e)
    }
}
