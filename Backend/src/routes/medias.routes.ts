import { Router } from 'express'
import {
    checkEncodingProgressController,
    uploadHLSVideosController,
    uploadImagesController,
    uploadVideosController
} from '~/controllers/medias.controllers'
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
mediasRouter.post(
    '/upload-video-hls',
    accessTokenValidator,
    verifiedUserValidator,
    wrapRequestHandler(uploadHLSVideosController)
)

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
    accessTokenValidator,
    verifiedUserValidator,
    wrapRequestHandler(checkEncodingProgressController)
)

export default mediasRouter
