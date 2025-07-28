import express from 'express'
import databaseService from '~/services/database.service'
import defaultErrorHandler from './middlewares/error.middlewares'
import { initFolder } from './utils/file'
import apiRouter from './routes/api.routes'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { initSocket } from '~/socket'
import swaggerUi from 'swagger-ui-express'
import helmet from 'helmet'
import cors from 'cors'
import { envConfig } from '~/config/envConfig'
import openapiSpecification from '~/config/swagger'

databaseService.connect().then(async () => {
    await Promise.all([databaseService.indexPosts(), databaseService.indexHashtags()])
})

const app = express()
const httpServer = createServer(app)
const port = envConfig.PORT || 3000

// create folder upload
initFolder()

app.use(helmet())
app.use(cors())

app.use(express.json())
app.use('/api/v1', apiRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))

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

initSocket(io)

httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
