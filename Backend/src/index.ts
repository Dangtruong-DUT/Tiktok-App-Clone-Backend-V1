import express from 'express'
import databaseService from '~/services/database.services'
import errorHandler from './middlewares/error.middlewares'
import { initFolder } from './utils/file'
import { config } from 'dotenv'
import apiRouter from './routes/api.routes'
import corsMiddleware from 'cors'

config()
databaseService.connect()
const app = express()
const port = process.env.PORT || 3000

// create folder upload
initFolder()
app.use(express.json())
app.use(corsMiddleware())
app.use('/api', apiRouter)

// Error handling middleware
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
function customCors(): any {
    throw new Error('Function not implemented.')
}
