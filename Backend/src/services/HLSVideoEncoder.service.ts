import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'
import fsPromise from 'fs/promises'
import path from 'path'
import VideoStatus from '~/models/schemas/VideoStatus.schemas'
import { EncodingStatus } from '~/constants/enum'
import { FILE_MESSAGES } from '~/constants/messages/file'
import mediasRepository from '~/repositories/medias.repository'
import { s3Service } from '~/services/aws/s3.service'
import { collectFilePathsFromDirectory } from '~/utils/file'
import { UPLOAD_VIDEO_DIR } from '~/constants/dir'
import mime from 'mime'

class HLSVideoEncoder {
    private static instance: HLSVideoEncoder
    static getInstance(): HLSVideoEncoder {
        if (!HLSVideoEncoder.instance) {
            HLSVideoEncoder.instance = new HLSVideoEncoder()
        }
        return HLSVideoEncoder.instance
    }

    private videoPaths: string[]
    private encoding: boolean

    private constructor() {
        this.videoPaths = []
        this.encoding = false
    }

    async enqueueVideo(videoPath: string) {
        const idVideo = path.basename(videoPath, path.extname(videoPath))
        this.videoPaths.push(videoPath)
        await mediasRepository.createVideoStatus(new VideoStatus({ name: idVideo, status: EncodingStatus.PENDING }))
        this.processEncode()
    }

    // Encode video from the queue sequentially
    private async processEncode() {
        if (this.encoding || this.videoPaths.length === 0) return

        this.encoding = true

        const videoPath = this.videoPaths.shift() as string
        const idVideo = path.basename(videoPath, path.extname(videoPath))
        await mediasRepository.updateVideoStatus(idVideo, {
            status: EncodingStatus.PROCESSING
        })
        try {
            await encodeHLSWithMultipleVideoStreams(videoPath)
            await fsPromise.unlink(videoPath)
            const files = collectFilePathsFromDirectory(path.resolve(UPLOAD_VIDEO_DIR, idVideo))
            await Promise.all(
                files.map((filePath) => {
                    const fileName = filePath.replace(path.resolve(UPLOAD_VIDEO_DIR), '').replaceAll('\\', '/')
                    return s3Service.uploadFile({
                        fileName: `videos-hls${fileName}`,
                        absoluteFilePath: filePath,
                        contentType: mime.getType(filePath) || 'application/octet-stream'
                    })
                })
            )

            // After uploading, remove the directory
            await Promise.all([
                fsPromise.rm(path.resolve(UPLOAD_VIDEO_DIR, idVideo), { recursive: true, force: true }),
                mediasRepository.updateVideoStatus(idVideo, {
                    status: EncodingStatus.COMPLETED
                })
            ])
        } catch (error) {
            console.error(`Error encoding video ${idVideo}:`, error)
            await mediasRepository.updateVideoStatus(idVideo, {
                status: EncodingStatus.FAILED,
                message: FILE_MESSAGES.UPLOAD_FAILED
            })
            await fsPromise.unlink(path.dirname(videoPath))
        }

        this.encoding = false
        this.processEncode()
    }
}

// Export the encoder instance
export default HLSVideoEncoder.getInstance()
