import { Router } from 'express'
import userRouter from './users.routes'
import mediasRouter from './medias.routes'
import staticRouter from './static.routes'
import tiktokPostRouter from './TikTokPost.routes'
import authRouter from '~/routes/auth.routes'
import searchRoutes from '~/routes/search.routes'
import * as express from 'express'
import { UPLOAD_VIDEO_DIR } from '~/constants/dir'
const apiRouter = Router()

apiRouter.use('/users', userRouter)
apiRouter.use('/search', searchRoutes)
apiRouter.use('/auth', authRouter)
apiRouter.use('/medias', mediasRouter)
apiRouter.use('/posts', tiktokPostRouter)

/**
 * @deprecated Static file serving is deprecated.
 * Use AWS S3 (or Cloud Storage) instead for public file access.
 * This route may be removed in future versions.
 */
console.warn('[DEPRECATED] Static file serving via /static is deprecated. Use AWS instead.')
apiRouter.use('/static', staticRouter)
apiRouter.use('/static', express.static(UPLOAD_VIDEO_DIR))

export default apiRouter
