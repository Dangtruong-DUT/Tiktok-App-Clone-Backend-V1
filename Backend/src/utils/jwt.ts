import jwt from 'jsonwebtoken'
import { TokenPayload } from '~/models/requests/user.requests'

/**
 * Generates a JSON Web Token (JWT) asynchronously using the provided payload, secret key, and signing options.
 *
 * This function wraps `jwt.sign` in a Promise, allowing the caller to use async/await or .then() syntax.
 * By default, it uses the secret from environment variable `JWT_SECRET` and the HS256 algorithm.
 *
 * @param params - An object containing:
 *  - `payload`: The data to encode into the token (string, Buffer, or object).
 *  - `privateKey`: (Optional) The secret key to sign the token. Defaults to `process.env.JWT_SECRET`.
 *  - `options`: (Optional) JWT signing options (e.g., algorithm, expiresIn).
 *
 * @returns A Promise that resolves to the signed JWT as a string.
 *
 * @example
 * const token = await signToken({ payload: { userId: 123 } });
 * console.log(token); // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 */

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
                throw reject(err)
            } else {
                resolve(token as string)
            }
        })
    })
}

/**
 * Verifies a JSON Web Token (JWT) asynchronously using the provided secret or public key.
 *
 * This function wraps `jwt.verify` in a Promise, allowing the caller to use async/await or .then() syntax.
 * By default, it uses the secret from environment variable `JWT_SECRET`.
 *
 * @param params - An object containing:
 *  - `token`: The JWT string to verify.
 *  - `secretOrPublicKey`: (Optional) The secret or public key to verify the token. Defaults to `process.env.JWT_SECRET`.
 *
 * @returns A Promise that resolves to the decoded token payload (casted as `TokenPayload`) if verification succeeds,
 * or rejects with an error if verification fails.
 *
 * @example
 * try {
 *   const payload = await verifyToken({ token: 'your.jwt.token' });
 *   console.log(payload); // decoded token payload
 * } catch (err) {
 *   console.error('Invalid token', err);
 * }
 */

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
