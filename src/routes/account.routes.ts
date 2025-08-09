import { Router } from 'express'
import { Role } from '~/constants/enum'
import { AddNewEmployeeController, GetEmployeesController } from '~/controllers/accounts.controller'
import { RequiredRole } from '~/middlewares/accounts.middleware'
import { authenticate } from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import { AddNewEmployeeValidation } from '~/validations/account.validations'
import { paginationValidator } from '~/validations/pagination.validation'

const AccountRouter = Router()

/**
 * Description. add a new employee
 * Path: /accounts/employees
 * method: post
 */

AccountRouter.post(
    '/employees',
    authenticate,
    RequiredRole([Role.SUPER_ADMIN]),
    AddNewEmployeeValidation,
    wrapRequestHandler(AddNewEmployeeController)
)

/**
 * Description. get list Employee
 * Path: /accounts/employees
 * method: get
 */

AccountRouter.get(
    '/employees',
    authenticate,
    RequiredRole([Role.SUPER_ADMIN, Role.ADMIN]),
    paginationValidator,
    wrapRequestHandler(GetEmployeesController)
)
export default AccountRouter
