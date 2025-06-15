import express from 'express'
import databaseService from '~/services/database.services'
import defaultErrorHandler from './middlewares/error.middlewares'
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
app.use((req, res, next) => {
    res.status(404).send("Sorry, the page you're looking for was not found.")
})

// Error handling middleware
app.use(defaultErrorHandler)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
