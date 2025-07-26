import databaseService from '~/services/database.service'
import VideoStatus from '~/models/schemas/VideoStatus.schemas'
import { EncodingStatus } from '~/constants/enum'

class MediasRepository {
    private static instance: MediasRepository
    static getInstance(): MediasRepository {
        if (!MediasRepository.instance) {
            MediasRepository.instance = new MediasRepository()
        }
        return MediasRepository.instance
    }
    private constructor() {}
    async createVideoStatus(videoStatus: VideoStatus) {
        return await databaseService.videoStatus.insertOne(videoStatus)
    }

    async findVideoStatusByName(name: string) {
        return await databaseService.videoStatus.findOne({ name })
    }

    async updateVideoStatus(
        name: string,
        updateData: {
            status?: EncodingStatus
            message?: string
        }
    ) {
        return await databaseService.videoStatus.updateOne(
            { name },
            { $set: updateData, $currentDate: { updated_at: true } }
        )
    }
}

export default MediasRepository.getInstance()
