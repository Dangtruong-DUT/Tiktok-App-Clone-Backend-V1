import { Collection, Db, MongoClient } from 'mongodb'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import Follower from '~/models/schemas/Follower.schemas'
import VideoStatus from '~/models/schemas/VideoStatus.schemas'
import TikTokPost from '~/models/schemas/TikTokPost.schemas'
import Hashtag from '~/models/schemas/Hashtag.schemas'
import Bookmarks from '~/models/schemas/Bookmarks.schemas'
import Likes from '~/models/schemas/Likes.schemas'
import { envConfig } from '~/config'

const uri = `mongodb+srv://${envConfig.DB_USERNAME}:${envConfig.DB_PASSWORD}@tiktok.dpv6i.mongodb.net/?retryWrites=true&w=majority&appName=Tiktok`
class DatabaseService {
    private client: MongoClient
    private db: Db
    private constructor() {
        this.client = new MongoClient(uri)
        this.db = this.client.db(envConfig.DB_NAME)
    }

    static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService()
        }
        return DatabaseService.instance
    }
    private static instance: DatabaseService

    async connect() {
        try {
            await this.client.connect()
            // Send a ping to confirm a successful connection
            await this.db.command({ ping: 1 })
            console.log('Pinged your deployment. You successfully connected to MongoDB!')
        } catch (err) {
            console.error('Failed to connect to MongoDB:', err)
        }
    }
    get users(): Collection<User> {
        return this.db.collection(envConfig.DB_USERS_COLLECTION as string)
    }
    get refreshToken(): Collection<RefreshToken> {
        return this.db.collection(envConfig.DB_REFRESH_TOKENS_COLLECTION as string)
    }
    get followers(): Collection<Follower> {
        return this.db.collection(envConfig.DB_FOLLOWERS_COLLECTION as string)
    }
    get videoStatus(): Collection<VideoStatus> {
        return this.db.collection(envConfig.DB_VIDEO_STATUS_COLLECTION as string)
    }
    get tiktokPost(): Collection<TikTokPost> {
        return this.db.collection(envConfig.DB_TIKTOK_POST_COLLECTION as string)
    }
    get hashtags(): Collection<Hashtag> {
        return this.db.collection(envConfig.DB_HASHTAGS_COLLECTION as string)
    }
    get bookmarks(): Collection<Bookmarks> {
        return this.db.collection(envConfig.DB_BOOKMARKS_COLLECTION as string)
    }
    get likes(): Collection<Likes> {
        return this.db.collection(envConfig.DB_LIKES_COLLECTION as string)
    }
    async indexHashtags() {
        const exists = await this.hashtags.indexExists('name_text')
        if (!exists) {
            await this.hashtags.createIndex({ name: 'text' })
        }
    }
    async indexPosts() {
        const exists = await this.tiktokPost.indexExists('content_text')
        if (!exists) {
            await this.tiktokPost.createIndex(
                { content: 'text' },
                {
                    default_language: 'none'
                }
            )
        }
    }
}

export default DatabaseService.getInstance()
