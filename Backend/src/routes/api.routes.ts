import { Router } from 'express'
import userRouter from './users.routes'
import mediasRouter from './medias.routes'
import staticRouter from './static.routes'
import tiktokPostRouter from './TikTokPost.routes'
import authRouter from '~/routes/auth.routes'
import searchRoutes from '~/routes/search.routes'
const apiRouter = Router()

apiRouter.use('/users', userRouter)
apiRouter.use('/search', searchRoutes)
apiRouter.use('/auth', authRouter)
apiRouter.use('/medias', mediasRouter)
apiRouter.use('/static', staticRouter)
apiRouter.use('/posts', tiktokPostRouter)
// Serve static files
//apiRouter.use('/static', express.static(UPLOAD_VIDEO_DIR))

export default apiRouter
