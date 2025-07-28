import { WithId } from 'mongodb'
import databaseService from '~/services/database.service'
import Hashtag from '~/models/schemas/Hashtag.schemas'

class HashtagRepository {
    private static instance: HashtagRepository
    static getInstance(): HashtagRepository {
        if (!HashtagRepository.instance) {
            HashtagRepository.instance = new HashtagRepository()
        }
        return HashtagRepository.instance
    }
    private constructor() {}

    async findAndCreateHashtag(hashtag: string) {
        return await databaseService.hashtags.findOneAndUpdate(
            {
                name: hashtag
            },
            {
                $setOnInsert: new Hashtag({ name: hashtag })
            },
            {
                upsert: true,
                returnDocument: 'after'
            }
        )
    }

    async findAndCreateHashtags(hashtags: string[]) {
        const hashtagDocuments = await Promise.all(
            hashtags.map((hashtag: string) => this.findAndCreateHashtag(hashtag))
        )
        return hashtagDocuments.map((item) => (item as WithId<Hashtag>)._id)
    }
}

export default HashtagRepository.getInstance()
