import { Router } from 'express'
import { uploadImagesController, uploadVideosController } from '~/controllers/medias.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const mediasRouter = Router()

/**
 * Description. upload multiple image
 * Path: /upload-image
 * method: POST
 * headers: { authorization: bearer <access_token>}
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
 * Description. upload single video
 * Path: /upload-video
 * method: POST
 * headers: { authorization: bearer <access_token>}
 * body:  {
 *   form-data {
 *          videos: file
 *   }
 * }
 *
 * */
mediasRouter.post(
    '/upload-video',
    accessTokenValidator,
    verifiedUserValidator,
    wrapRequestHandler(uploadVideosController)
)

export default mediasRouter
