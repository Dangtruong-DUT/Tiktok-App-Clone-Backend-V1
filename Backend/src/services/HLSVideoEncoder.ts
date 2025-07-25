import { encodeHLSWithMultipleVideoStreams } from '~/utils/video'
import fsPromise from 'fs/promises'
import path from 'path'
import databaseService from './database.services'
import VideoStatus from '~/models/schemas/VideoStatus.schemas'
import { EncodingStatus } from '~/constants/enum'
import { FILE_MESSAGES } from '~/constants/messages/file'

class HLSVideoEncoder {
    private videoPaths: string[]
    private encoding: boolean

    constructor() {
        this.videoPaths = []
        this.encoding = false
    }

    async enqueueVideo(videoPath: string) {
        const idVideo = path.basename(videoPath, path.extname(videoPath))
        this.videoPaths.push(videoPath)
        await databaseService.videoStatus.insertOne(new VideoStatus({ name: idVideo, status: EncodingStatus.PENDING }))
        this.processEncode()
    }

    // Encode video from the queue sequentially
    private async processEncode() {
        if (this.encoding || this.videoPaths.length === 0) return

        this.encoding = true

        const videoPath = this.videoPaths.shift() as string
        const idVideo = path.basename(videoPath, path.extname(videoPath))
        await databaseService.videoStatus
            .updateOne(
                { name: idVideo },
                { $set: { status: EncodingStatus.PROCESSING }, $currentDate: { updated_at: true } }
            )
            .catch(() => {
                console.error(`Error updating video status for ${idVideo}`)
            })
        try {
            await encodeHLSWithMultipleVideoStreams(videoPath)
            await fsPromise.unlink(videoPath)
            await databaseService.videoStatus.updateOne(
                { name: idVideo },
                { $set: { status: EncodingStatus.COMPLETED }, $currentDate: { updated_at: true } }
            )
        } catch (error) {
            console.error(`Error encoding video ${idVideo}:`, error)
            await databaseService.videoStatus
                .updateOne(
                    { name: idVideo },
                    {
                        $set: { status: EncodingStatus.FAILED, message: FILE_MESSAGES.UPLOAD_FAILED },
                        $currentDate: { updated_at: true }
                    }
                )
                .catch(() => {
                    console.error(`Error updating video status for ${idVideo}`)
                })
            await fsPromise.unlink(path.dirname(videoPath))
        }

        this.encoding = false
        this.processEncode()
    }
}

// Export the encoder instance
export const hlsVideoEncoder = new HLSVideoEncoder()
