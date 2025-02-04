import jwt from 'jsonwebtoken'
import { TokenPayload } from '~/models/requests/user.requests'
export const signToken = ({
    payload,
    privateKey = process.env.JWT_SECRET as string,
    options = {
        algorithm: 'HS256'
    }
}: {
    payload: string | Buffer | object
    privateKey?: string
    options?: jwt.SignOptions
}) => {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(payload, privateKey, options, (err, token) => {
            if (err) {
                reject(err)
            } else {
                resolve(token as string)
            }
        })
    })
}

export const verifyToken = ({
    token,
    secretOrPublicKey = process.env.JWT_SECRET as string
}: {
    token: string
    secretOrPublicKey?: string
}) => {
    return new Promise<TokenPayload>((resolve, reject) => {
        jwt.verify(token, secretOrPublicKey, (err, decoded) => {
            if (err) {
                reject(err)
            } else {
                resolve(decoded as TokenPayload)
            }
        })
    })
}
