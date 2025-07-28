import express from 'express'
import databaseService from '~/services/database.service'
import defaultErrorHandler from './middlewares/error.middlewares'
import { initFolder } from './utils/file'
import apiRouter from './routes/api.routes'
import corsMiddleware from 'cors'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { initSocket } from '~/socket'
import YAML from 'yaml'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'

databaseService.connect().then(async () => {
    await Promise.all([databaseService.indexPosts(), databaseService.indexHashtags()])
})
const file = fs.readFileSync(path.resolve('src/swagger/Tiktok-clone.swagger.yaml'), 'utf8')
const swaggerDocument = YAML.parse(file)

const app = express()
const httpServer = createServer(app)

const port = process.env.PORT || 3000

// create folder upload
initFolder()

app.use(express.json())
app.use(corsMiddleware())
app.use('/api', apiRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

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

// Initialize socket.io
initSocket(io)

httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
