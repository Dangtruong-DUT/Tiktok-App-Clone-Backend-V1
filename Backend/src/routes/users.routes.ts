import { Router } from 'express'
import {
    verifyEmailController,
    loginController,
    logoutController,
    registerController,
    resendVerifyEmailController,
    forgotPasswordController,
    verifyForgotPasswordTokenController,
    resetPasswordController,
    getUserController,
    updateUserController,
    getMeProfileController,
    followUserController,
    unFollowUserController,
    changePasswordController,
    logoutAllController
} from '~/controllers/users.controllers'
import { filterReqBodyMiddleWare } from '~/middlewares/common.middlewares'
import {
    accessTokenValidator,
    changePasswordValidator,
    emailVerifyTokenValidator,
    followValidator,
    forgotPasswordValidator,
    loginValidator,
    refreshTokenValidate,
    registerValidator,
    resetPasswordValidator,
    unFollowValidator,
    updateUserValidator,
    verifiedUserValidator,
    verifyForgotPasswordTokenValidator
} from '~/middlewares/user.middlewares'
import { UpdateUserRequestBody } from '~/models/requests/user.requests'
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
 * Description: Logout from all devices
 * Path: /logout-all
 * Method: POST
 * Header: <Authorization: Bearer <access_token>>
 * Body: { }
 */

userRouter.post('/logout-all', accessTokenValidator, wrapRequestHandler(logoutAllController))

/**
 * Description. verify email when user client click on the link in email
 * Path: /verify-email
 * method: Post
 * Body:  {
 * email_verify_token: String
 * }
 */

userRouter.post('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

/**
 * Description. resend verify email when user client click on the link in email
 * Path: /verify-email
 * method: Post
 * Header: {Authorization: Bearer <access_token>}
 * Body:  {}
 */
userRouter.post('/resend-verify-email', accessTokenValidator, wrapRequestHandler(resendVerifyEmailController))

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
userRouter.post('/forgot-password', forgotPasswordValidator, wrapRequestHandler(forgotPasswordController))

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

userRouter.post(
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

userRouter.post(
    '/reset-password',
    verifyForgotPasswordTokenValidator,
    resetPasswordValidator,
    wrapRequestHandler(resetPasswordController)
)

/**
 * Description . Get my profile
 * Path: /me
 * method: GET
 * header: {
 * Authorization: Bearer <access_token>
 * }
 * body: {}
 *
 */

userRouter.get('/me', accessTokenValidator, wrapRequestHandler(getMeProfileController))

/**
 * Description . Update my profile
 * Path: /me
 * method: GET
 * header: {
 * Authorization: Bearer <access_token>
 * }
 * body: {
 *  UserSchema
 * }
 *
 */

userRouter.patch(
    '/me',
    accessTokenValidator,
    verifiedUserValidator,
    updateUserValidator,
    filterReqBodyMiddleWare<UpdateUserRequestBody>([
        'name',
        'date_of_birth',
        'bio',
        'location',
        'website',
        'username',
        'avatar',
        'cover_photo'
    ]),
    wrapRequestHandler(updateUserController)
)

/**
 * Description . Get user profile
 * method: GET
 * path: /:username
 */

userRouter.get('/:username', wrapRequestHandler(getUserController))

/**
 * Description . follow someone
 * method: Post
 * path: /follow
 *  header: {
 * Authorization: Bearer <access_token>
 * }
 * body: {
 * user_id: string
 * }
 */

userRouter.post(
    '/follow',
    accessTokenValidator,
    verifiedUserValidator,
    followValidator,
    wrapRequestHandler(followUserController)
)

/**
 * Description . unfollow someone
 * method: delete
 * path: /follow/:user_id
 *  header: {
 * Authorization: Bearer <access_token>
 * }
 */

userRouter.delete(
    '/follow/:user_id',
    accessTokenValidator,
    verifiedUserValidator,
    unFollowValidator,
    wrapRequestHandler(unFollowUserController)
)

/**
 * Description. Change password
 * Path: /change-password
 * Method: PUT
 * header: {Authorization: Bearer <access_token>}
 * body: {
 * current_password: string,
 * password: string,
 * confirm_password: string
 * }
 */

userRouter.put(
    '/change-password',
    accessTokenValidator,
    verifiedUserValidator,
    changePasswordValidator,
    wrapRequestHandler(changePasswordController)
)
export default userRouter
