import { Router } from 'express'
import userRouter from './users.routes'
import mediasRouter from './medias.routes'
import staticRouter from './static.routes'
import tiktokPostRouter from './TikTokPost.routes'
import express from 'express'
import { UPLOAD_VIDEO_DIR } from '~/constants/dir'
import likesRouter from './likes.routes'
import bookmarksRouter from './bookmarks.routes'
import authRouter from '~/routes/auth.routes'
const apiRouter = Router()

apiRouter.use('/users', userRouter)
apiRouter.use('/auth', authRouter)
apiRouter.use('/medias', mediasRouter)
apiRouter.use('/static', staticRouter)
apiRouter.use('/posts', tiktokPostRouter)
apiRouter.use('/likes', likesRouter)
apiRouter.use('/bookmarks', bookmarksRouter)
// Serve static files
apiRouter.use('/static/video', express.static(UPLOAD_VIDEO_DIR))

export default apiRouter
