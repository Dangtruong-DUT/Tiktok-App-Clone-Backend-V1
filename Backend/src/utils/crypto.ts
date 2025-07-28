import { createHash } from 'node:crypto'
import { envConfig } from '~/config/envConfig'

/**
 * Returns a SHA256 hash using SHA-3 for the given `content`.
 *
 * @see https://en.wikipedia.org/wiki/SHA-3
 *
 * @param {String} content
 *
 * @returns {String}
 */

export function sha256(content: string) {
    return createHash('sha3-256').update(content).digest('hex')
}

/**
 * Hash
 * password using SHA256 with a secret key.
 * This is used to securely store passwords.
 */

export function hashPassword(password: string) {
    return sha256(password + envConfig.PASSWORD_SECRET)
}
