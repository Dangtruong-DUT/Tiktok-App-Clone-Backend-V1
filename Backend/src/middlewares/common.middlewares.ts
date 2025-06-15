import express from 'express'
import _ from 'lodash'
type FilterKeys<T> = Array<keyof T>
export const filterReqBodyMiddleWare =
    <typeBodyReq>(filterKeys: FilterKeys<typeBodyReq>) =>
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        req.body = _.pick(req.body, filterKeys)
        next()
    }
