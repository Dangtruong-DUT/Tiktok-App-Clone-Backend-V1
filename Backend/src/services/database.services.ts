import { Collection, Db, MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import Follower from '~/models/schemas/Follower.schemas'

dotenv.config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@tiktok.dpv6i.mongodb.net/?retryWrites=true&w=majority&appName=Tiktok`
class DatabaseService {
    private client: MongoClient
    private db: Db
    constructor() {
        this.client = new MongoClient(uri)
        this.db = this.client.db(process.env.DB_NAME)
    }
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
        return this.db.collection(process.env.DB_USERS_COLLECTION as string)
    }
    get refreshToken(): Collection<RefreshToken> {
        return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
    }
    get followers(): Collection<Follower> {
        return this.db.collection(process.env.DB_FOLLOWERS_COLLECTION as string)
    }
}

const databaseService = new DatabaseService()

export default databaseService
