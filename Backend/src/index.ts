import express from 'express'
import userRouter from './routes/users.routes'
import databaseService from '~/services/database.services'
import { NextFunction, Request, Response } from 'express'
import errorHandler from './middlewares/error.middlewares'
databaseService.connect()
const app = express()
const port = 3000
app.use(express.json())
app.use('/users', userRouter)
app.use(errorHandler)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
