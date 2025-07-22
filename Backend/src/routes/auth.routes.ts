import { Router } from 'express'
import {
    forgotPasswordController,
    loginController,
    logoutAllDevicesController,
    logoutController,
    refreshTokenController,
    registerController,
    resendVerifyEmailController,
    resetPasswordController,
    verifyEmailController,
    verifyForgotPasswordTokenController
} from '~/controllers/auth.controllers'
import { authenticate, authenticateRefreshToken } from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import {
    emailVerifyTokenValidator,
    forgotPasswordValidator,
    loginValidator,
    registerValidator,
    resetPasswordValidator,
    verifyForgotPasswordTokenValidator
} from '~/validations/auth.validations'

const authRouter = Router()

/**
 * Description. logs in a user
 * Path: /login
 * method: POST
 * body: {
 * email: string
 * password: string
 */

authRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

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

authRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 *Description. logout a user
 * Path: /logout
 * Method: POST
 * header: <Authorization: Bearer <access_token>
 * body: {
 * refresh_token: String
 * }
 */

authRouter.post('/logout', authenticate, authenticateRefreshToken, wrapRequestHandler(logoutController))

/**
 * Description. refresh token
 * Path: /refresh-token
 * method: POST
 * body: {
 * refresh_token: String
 * }
 */

authRouter.post('/refresh-token', authenticateRefreshToken, wrapRequestHandler(refreshTokenController))

/**
 * Description: Logout from all devices
 * Path: /logout-all
 * Method: POST
 * Header: <Authorization: Bearer <access_token>
 * Body: { }
 */

authRouter.post('/logout/all', authenticate, wrapRequestHandler(logoutAllDevicesController))

/**
 * Description. verify email when user client click on the link in email
 * Path: /verify-email
 * method: Post
 * Body:  {
 * email_verify_token: String
 * }
 */

authRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

/**
 * Description. resend verify email when user client click on the link in email
 * Path: /verify-email
 * method: Post
 * Header: {Authorization: Bearer <access_token>}
 * Body:  {}
 */
authRouter.post('/resend-verify-email', authenticate, wrapRequestHandler(resendVerifyEmailController))

/**
 * Description .  submit verify email when user client click on the link forgot password
 * Path: /forgot-password
 * method: post
 * body:
 *
 * {
 * email: string
 * }
 */
authRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

/**
 * Description . verify link in email when user client click on the link
 * Path: /verify-forgot-password
 * method: post
 * body:
 *
 * {
 * forgot-password-token: string
 * }
 */

authRouter.post(
    '/verify-forgot-password',
    verifyForgotPasswordTokenValidator,
    wrapRequestHandler(verifyForgotPasswordTokenController)
)

/**
 * Description . Reset password
 * Path: /reset-password
 * method: post
 * body: {
 * forgot-password-token: string,
 * password: string,
 * confirm_password: string
 * }
 */

authRouter.post('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

export default authRouter
