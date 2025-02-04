import { Router, Request, Response } from 'express'
import { USER_MESSAGES } from '~/constants/messages'
import {
    verifyEmailController,
    loginController,
    logoutController,
    registerController,
    resendVerifyEmailController
} from '~/controllers/users.controllers'
import {
    accessTokenValidator,
    loginValidator,
    refreshTokenValidate,
    registerValidator
} from '~/middlewares/user.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const userRouter = Router()

/**
 * Description. logs in a user
 * Path: /login
 * method: POST
 * body: {
 * email: string
 * password: string
 */

userRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * Description. registers a new user
 * Path: /register
 * method: POST
 * body: {
 * name: String
 * email: String,
 * password: String,
 * data_of_birth: ISO8601
 * confirm_password: String
 * }
 */

userRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 *Description. logout a user
 * Path: /logout
 * Method: POST
 * header: <Authorization: Bearer <access_token>
 * body: {
 * refresh_token: String
 * }
 */

userRouter.post('/logout', accessTokenValidator, refreshTokenValidate, wrapRequestHandler(logoutController))

/**
 * Description. verify email when user client click on the link in email
 * Path: /verify-email
 * method: Post
 * Body:  {
 * email_verify_token: String
 * }
 */

//emailVerifyTokenValidator
userRouter.post('/verify-email', wrapRequestHandler(verifyEmailController))

/**
 * Description. resend verify email when user client click on the link in email
 * Path: /verify-email
 * method: Post
 * Header: {Authorization: Bearer <access_token>}
 * Body:  {}
 */
userRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

export default userRouter
