import express from 'express'
import databaseService from '~/services/database.service'
import defaultErrorHandler from './middlewares/error.middlewares'
import { initFolder } from './utils/file'
import apiRouter from './routes/api.routes'
import corsMiddleware from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import Conversation from '~/models/schemas/Conversation.schemas'
import { ObjectId } from 'mongodb'
import conversationService from '~/services/conversation.service'

databaseService.connect().then(async () => {
    await Promise.all([databaseService.indexPosts(), databaseService.indexHashtags()])
})

const app = express()
const httpServer = createServer(app)

const port = process.env.PORT || 3000

// create folder upload
initFolder()

app.use(express.json())
app.use(corsMiddleware())
app.use('/api', apiRouter)
app.use((req, res, next) => {
    res.status(404).send("Sorry, the page you're looking for was not found.")
})

// Error handling middleware
app.use(defaultErrorHandler)

const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
})

const socketMap = new Map<string, string>()
io.on('connection', (socket) => {
    const userId = socket.handshake.auth && socket.handshake.auth._id

    if (userId) {
        socketMap.set(userId, socket.id)
        console.log('User connected:', userId)
    } else {
        console.log('Missing auth._id, disconnecting socket...')
        socket.disconnect(true)
        return
    }
    socket.on('private_message', async (data) => {
        const { to, content } = data
        const targetSocketId = socketMap.get(to)
        if (targetSocketId) {
            socket.to(targetSocketId).emit('private_message', {
                from: userId,
                content
            })

            const conversation = new Conversation({
                sender_id: new ObjectId(userId as string),
                receiver_id: new ObjectId(to as string),
                content
            })
            await conversationService.createConversation(conversation)
        } else {
            console.log(`User ${to} is not connected.`)
        }
    })

    socket.on('disconnect', () => {
        socketMap.delete(userId)
        console.log('User disconnected:', userId)
    })
})
httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
