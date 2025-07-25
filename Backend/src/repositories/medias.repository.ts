import databaseService from '~/services/database.service'
import VideoStatus from '~/models/schemas/VideoStatus.schemas'
import { EncodingStatus } from '~/constants/enum'

class MediasRepository {
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
            updated_at?: Date
        }
    ) {
        const updateFields: any = { ...updateData }
        if (!updateFields.updated_at) {
            updateFields.updated_at = new Date()
        }

        return await databaseService.videoStatus.updateOne(
            { name },
            { $set: updateFields, $currentDate: { updated_at: true } }
        )
    }

    async deleteVideoStatus(name: string) {
        return await databaseService.videoStatus.deleteOne({ name })
    }

    async findVideoStatusesByStatus(status: EncodingStatus, page = 0, limit = 10) {
        return await databaseService.videoStatus
            .find({ status })
            .sort({ created_at: -1 })
            .skip(page * limit)
            .limit(limit)
            .toArray()
    }

    async countVideoStatusesByStatus(status: EncodingStatus) {
        return await databaseService.videoStatus.countDocuments({ status })
    }

    async findPendingVideoStatuses() {
        return await databaseService.videoStatus
            .find({ status: EncodingStatus.PENDING })
            .sort({ created_at: 1 })
            .toArray()
    }

    async findProcessingVideoStatuses() {
        return await databaseService.videoStatus
            .find({ status: EncodingStatus.PROCESSING })
            .sort({ created_at: 1 })
            .toArray()
    }
}

const mediasRepository = new MediasRepository()
export default mediasRepository
