import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@tiktok.dpv6i.mongodb.net/?retryWrites=true&w=majority&appName=Tiktok`
class DatabaseService {
    private client: MongoClient

    constructor() {
        this.client = new MongoClient(uri)
    }
    async connect() {
        try {
            await this.client.connect()
            // Send a ping to confirm a successful connection
            await this.client.db('admin').command({ ping: 1 })
            console.log('Pinged your deployment. You successfully connected to MongoDB!')
        } finally {
            await this.client.close()
        }
    }
}

const databaseService = new DatabaseService()

export default databaseService