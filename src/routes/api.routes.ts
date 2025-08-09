import { Router } from 'express'
import userRouter from './users.routes'
import mediasRouter from './medias.routes'
import staticRouter from './static.routes'
import tiktokPostRouter from './TikTokPost.routes'
import authRouter from '~/routes/auth.routes'
import searchRoutes from '~/routes/search.routes'
import conversationRoutes from '~/routes/conversation.routes'
import AccountRouter from '~/routes/account.routes'
const apiRouter = Router()

apiRouter.use('/users', userRouter)
apiRouter.use('/search', searchRoutes)
apiRouter.use('/auth', authRouter)
apiRouter.use('/medias', mediasRouter)
apiRouter.use('/posts', tiktokPostRouter)
apiRouter.use('/conversations', conversationRoutes)
apiRouter.use('/accounts', AccountRouter)

apiRouter.use('/static', staticRouter)
//apiRouter.use('/static', express.static(UPLOAD_VIDEO_DIR))

export default apiRouter
