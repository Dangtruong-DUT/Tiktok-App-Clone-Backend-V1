import express from 'express'
import databaseService from '~/services/database.service'
import defaultErrorHandler from './middlewares/error.middlewares'
import { initFolder } from './utils/file'
import apiRouter from './routes/api.routes'
import corsMiddleware from 'cors'

databaseService.connect().then(async () => {
    await Promise.all([databaseService.indexPosts(), databaseService.indexHashtags()])
})
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
