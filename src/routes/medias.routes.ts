import { Router } from 'express'
import {
    checkEncodingProgressController,
    uploadHLSVideosController,
    uploadImagesController,
    uploadVideosController
} from '~/controllers/medias.controller'
import { authenticate, requireVerifiedUser } from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const mediasRouter = Router()

/**
 * Description. upload multiple image
 * Path: /upload-image
 * method: POST
 * headers: { authorization: bearer <access_token>}
 * body:  {
 *   form-data {
 *          file: file
 *   }
 * }
 *
 * */
mediasRouter.post('/upload-image', authenticate, requireVerifiedUser, wrapRequestHandler(uploadImagesController))

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
mediasRouter.post('/upload-video', authenticate, requireVerifiedUser, wrapRequestHandler(uploadVideosController))

/**
 * Description. upload single video
 * Path: /upload-video-hls
 * method: POST
 * headers: { authorization: bearer <access_token>}
 * body:  {
 *   form-data {
 *          videos: file
 *   }
 * }
 *
 * */
mediasRouter.post('/upload-video-hls', authenticate, requireVerifiedUser, wrapRequestHandler(uploadHLSVideosController))

/**
 *
 * Description. get status of video
 * Path: /upload-video-status/:id
 * method: get
 * headers: { authorization: bearer <access_token>}
 * body:  {
 * }
 *
 * */
mediasRouter.get(
    '/upload-hls-status/:id',
    authenticate,
    requireVerifiedUser,
    wrapRequestHandler(checkEncodingProgressController)
)

export default mediasRouter
