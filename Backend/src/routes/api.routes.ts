import { Router } from 'express'
import userRouter from './users.routes'
import mediasRouter from './medias.routes'
import staticRouter from './static.routes'
const apiRouter = Router()

apiRouter.use('/users', userRouter)
apiRouter.use('/medias', mediasRouter)
apiRouter.use('/static', staticRouter)

export default apiRouter
