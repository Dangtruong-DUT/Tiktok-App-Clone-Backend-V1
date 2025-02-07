import { Router } from 'express'
import {
    serveImageController,
    serveVideoController,
    serveVideoStreamController
} from '~/controllers/medias.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const staticRouter = Router()
/**
 * Description. get the single image
 * method: get
 * path: /image/:name
 * body: {}
 */
staticRouter.get('/image/:name', wrapRequestHandler(serveImageController))

/**
 * Description. get the single video
 * method: get
 * path: /video/:name
 * body: {}
 */
staticRouter.get('/video-stream/:name', wrapRequestHandler(serveVideoStreamController))

export default staticRouter
