import { Router } from 'express'
import {
    serveImageController,
    serveVideoController,
    serveVideoStreamController,
    serveM3u8HLSController,
    serveSegmentHLSController
} from '~/controllers/medias.controller'
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
 * Description. get single video
 * method: get
 * path: /video/:id
 * body: {}
 */
staticRouter.get('/video/:name', wrapRequestHandler(serveVideoController))

/**
 * Description. streaming video
 * method: get
 * path: /video/:id
 * body: {}
 */
staticRouter.get('/video-stream/:name', wrapRequestHandler(serveVideoStreamController))

/**
 * Streams video in HLS format M3u8.
 * @method GET
 * @path /video-hls/:id
 * @param {string} id - The video ID.
 * @returns {master.m3u8} - The HLS playlist URL for the video.
 */

staticRouter.get('/video-hls/:id/master.m3u8', wrapRequestHandler(serveM3u8HLSController))

/**
 * Streams video in HLS format segment.
 * @method GET
 * @path /video-hls/:id/:v/:segment
 */

staticRouter.get('/video-hls/:id/:v/:segment', wrapRequestHandler(serveSegmentHLSController))
export default staticRouter
