import { Router } from 'express'
import {
    getUserController,
    updateUserController,
    getMeProfileController,
    followUserController,
    unFollowUserController,
    changePasswordController,
    getUserPostsController,
    getUserBookmarksController,
    getUserLikedPostsController
} from '~/controllers/users.controller'
import {
    changePasswordValidator,
    followValidator,
    unFollowValidator,
    updateUserValidator
} from '~/validations/user.validations'
import { wrapRequestHandler } from '~/utils/handlers'
import { authenticate, requireVerifiedUser } from '~/middlewares/auth.middlewares'
import { isUserLoginValidator } from '~/middlewares/user.middlewares'
import { paginationValidator } from '~/validations/pagination.validation'
import { getUserIndicatorsController } from '~/controllers/stats.controller'
import { GetUserIndicatorsValidate } from '~/validations/stats.validation'
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
    wrapRequestHandler(updateUserController)
)

/**
 * Description . Get user profile
 * method: GET
 * path: /:username
 */

userRouter.get('/:username', isUserLoginValidator(authenticate), wrapRequestHandler(getUserController))

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

/**
 * Get posts of user
 * Path: /:user_id/posts
 * method: GET
 * query: {
 * page: number
 * limit: number
 * }
 *
 */
userRouter.get(
    '/:user_id/posts',
    isUserLoginValidator(authenticate),
    paginationValidator,
    wrapRequestHandler(getUserPostsController)
)

/**
 * Get bookmarks of user
 * Path: /:user_id/bookmarks
 * method: GET
 * query: {
 * page: number
 * limit: number
 * }
 *
 */
userRouter.get(
    '/:user_id/bookmarks',
    isUserLoginValidator(authenticate),
    paginationValidator,
    wrapRequestHandler(getUserBookmarksController)
)

/**
 * Get liked posts of user
 * Path: /:user_id/liked
 * method: GET
 * query: {
 * page: number
 * limit: number
 * }
 *
 */
userRouter.get(
    '/:user_id/liked',
    isUserLoginValidator(authenticate),
    paginationValidator,
    wrapRequestHandler(getUserLikedPostsController)
)

userRouter.get(
    '/me/indicators',
    authenticate,
    GetUserIndicatorsValidate,
    wrapRequestHandler(getUserIndicatorsController)
)

export default userRouter
