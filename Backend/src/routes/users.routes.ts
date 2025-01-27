import { Router } from 'express'
import { loginController } from '~/controllers/users.controllers'
import { loginValidator } from '~/middlewares/user.middlewares'
const userRouter = Router()

userRouter.post('/login', loginValidator, loginController)

export default userRouter
