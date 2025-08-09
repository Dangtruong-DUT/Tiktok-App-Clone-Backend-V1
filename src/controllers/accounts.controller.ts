import { Request, Response } from 'express'
import { LoginRequestBody } from '~/models/requests/auth.requests'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpStatus'
import { ACCOUNT_MESSAGES } from '~/constants/messages/account'
import usersServices from '~/services/users.service'
import { GetEmployeesReqQuery } from '~/models/requests/account.request'
import { envConfig } from '~/config/envConfig'
import { Role } from '~/constants/enum'

export const initOwnerAccount = async () => {
    const isExit = await usersServices.isExitSuperAdmin()
    if (!isExit) {
        await usersServices.addNewEmployee({
            name: 'SUPER ADMIN',
            email: envConfig.INITIAL_EMAIL_OWNER,
            password: envConfig.INITIAL_PASSWORD_OWNER,
            role: Role.SUPER_ADMIN,
            date_of_birth: new Date('2004-01-28').toISOString()
        })
        const chalk = (await import('chalk')).default
        console.log(
            chalk.bgCyan(
                `Khởi tạo tài khoản super admin thành công: ${envConfig.INITIAL_EMAIL_OWNER}|${envConfig.INITIAL_PASSWORD_OWNER}`
            )
        )
    }
}

export const AddNewEmployeeController = async (req: Request<ParamsDictionary, LoginRequestBody>, res: Response) => {
    const employeeData = req.body
    await usersServices.addNewEmployee(employeeData)
    res.status(HTTP_STATUS.CREATED).json({
        message: ACCOUNT_MESSAGES.EMPLOYEE_ADDED_SUCCESSFULLY
    })
}

export const GetEmployeesController = async (req: Request, res: Response) => {
    const { page, limit } = req.query as GetEmployeesReqQuery
    const { total, employees } = await usersServices.getEmployees({ page, limit })
    const total_pages = Math.ceil(total / (Number(limit) || 10))
    res.status(HTTP_STATUS.OK).json({
        message: ACCOUNT_MESSAGES.EMPLOYEES_RETRIEVED_SUCCESSFULLY,
        data: employees,
        meta: {
            page,
            limit,
            total_pages
        }
    })
}
