import { Request, Response, NextFunction } from 'express'

export const wrapRequestHandler = <P>(func: (req: Request<P>, res: Response, next: NextFunction) => Promise<any>) => {
    return async (req: Request<P>, res: Response, next: NextFunction) => {
        try {
            await func(req, res, next)
        } catch (error) {
            next(error)
        }
    }
}
