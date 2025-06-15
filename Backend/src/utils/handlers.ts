import { Request, Response, NextFunction } from 'express'

/**
 * Wraps an asynchronous request handler to catch errors and pass them to Express error handling middleware.
 *
 * @template P - The type of the request parameters.
 * @param func - The async request handler function that processes the request.
 * @returns An Express middleware function that executes the handler and forwards any thrown error to next().
 *
 * How it works:
 * - Executes the provided async handler function.
 * - If the handler throws an error or rejects: catches the error and passes it to next() for centralized error handling.
 */

export const wrapRequestHandler = <P>(func: (req: Request<P>, res: Response, next: NextFunction) => Promise<any>) => {
    return async (req: Request<P>, res: Response, next: NextFunction) => {
        try {
            await func(req, res, next)
        } catch (error) {
            next(error)
        }
    }
}
