import { ParamsDictionary } from 'express-serve-static-core'

export interface GetConversationsParams extends ParamsDictionary {
    receiver_id: string
}
