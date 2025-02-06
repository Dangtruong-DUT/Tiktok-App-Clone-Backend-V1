import { Router } from 'express'
import { serveImageController } from '~/controllers/medias.controllers'
import { wrapRequestHandler } from '~/utils/handlers'

const staticRouter = Router()
/**
 * Description. get the single image
 * method: get
 * path: /image/:name
 * body: {}
 */
staticRouter.get('/image/:name', wrapRequestHandler(serveImageController))
export default staticRouter
