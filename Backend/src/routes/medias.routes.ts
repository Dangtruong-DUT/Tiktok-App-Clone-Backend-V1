import { Router } from 'express'
import { uploadImagesController } from '~/controllers/medias.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const mediasRouter = Router()

/**
 * Description. upload single image
 * Path: /upload-image
 * method: POST
 * body:  {
 *   form-data {
 *          images: file
 *   }
 * }
 *
 * */
mediasRouter.post(
    '/upload-image',
    accessTokenValidator,
    verifiedUserValidator,
    wrapRequestHandler(uploadImagesController)
)

/**
 *
 *
 *
 */
export default mediasRouter
