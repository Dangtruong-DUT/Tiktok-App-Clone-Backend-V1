import { Router } from 'express'
import { uploadSingleImageController } from '~/controllers/medias.controllers'
const mediasRouter = Router()

mediasRouter.post('/upload-image', uploadSingleImageController)

export default mediasRouter
