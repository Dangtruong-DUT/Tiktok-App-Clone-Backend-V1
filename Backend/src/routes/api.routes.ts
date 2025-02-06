import { Router } from 'express'
import userRouter from './users.routes'
import mediasRouter from './medias.routes'
import staticRouter from './static.routes'
import express from 'express'
import { UPLOAD_VIDEO_DIR } from '~/constants/dir'
const apiRouter = Router()

apiRouter.use('/users', userRouter)
apiRouter.use('/medias', mediasRouter)
apiRouter.use('/static', staticRouter)
// Serve static files
apiRouter.use('/static/video', express.static(UPLOAD_VIDEO_DIR))

export default apiRouter
