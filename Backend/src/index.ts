import express from 'express'
import userRouter from './routes/users.routes'
import databaseService from '~/services/database.services'
const app = express()
const port = 3000
app.use(express.json())
app.use('/users', userRouter)
databaseService.connect()


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
