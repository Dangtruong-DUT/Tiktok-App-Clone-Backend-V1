import { Router } from 'express'
import {
    getUserController,
    updateUserController,
    getMeProfileController,
    followUserController,
    unFollowUserController,
    changePasswordController
} from '~/controllers/users.controllers'
import { filterReqBodyMiddleWare } from '~/middlewares/common.middlewares'
import {
    changePasswordValidator,
    followValidator,
    unFollowValidator,
    updateUserValidator
} from '~/validations/user.validations'
import { UpdateUserRequestBody } from '~/models/requests/user.requests'
import { wrapRequestHandler } from '~/utils/handlers'
import { authenticate, requireVerifiedUser } from '~/middlewares/auth.middlewares'
const userRouter = Router()

/**
 * Description. Get my profile
 * Path: /me
 * method: GET
 * header: {
 * Authorization: Bearer <access_token>
 * }
 * body: {}
 * Returns my profile
 */

userRouter.get('/me', authenticate, wrapRequestHandler(getMeProfileController))

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
    authenticate,
    requireVerifiedUser,
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

userRouter.post('/follow', authenticate, requireVerifiedUser, followValidator, wrapRequestHandler(followUserController))

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
    authenticate,
    requireVerifiedUser,
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
    authenticate,
    requireVerifiedUser,
    changePasswordValidator,
    wrapRequestHandler(changePasswordController)
)
export default userRouter
