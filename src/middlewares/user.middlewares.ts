import { Request, Response, NextFunction } from 'express'

export function isUserLoginValidator(
    authMiddleware: (req: Request, res: Response, next: NextFunction) => void | Promise<void>
) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.headers['authorization'] != undefined) {
            return authMiddleware(req, res, next)
        } else {
            return next()
        }
    }
}
