import { Role } from '~/constants/enum'

export interface AddNewEmployeeReqBody {
    name: string
    date_of_birth: string
    email: string
    password: string
    confirm_password: string
    role: Role
}

export interface GetEmployeesReqQuery {
    page?: number
    limit?: number
}
