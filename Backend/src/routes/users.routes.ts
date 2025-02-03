import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/user.middlewares'
import { wrapAsync } from '~/utils/handlers'
const userRouter = Router()

/**
 * Description. logs in a user
 * Path: /login
 * method: POST
 * body: {
 * email: string
 * password: string
 */

userRouter.post('/login', loginValidator, wrapAsync(loginController))

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

userRouter.post('/register', registerValidator, wrapAsync(registerController))

export default userRouter
