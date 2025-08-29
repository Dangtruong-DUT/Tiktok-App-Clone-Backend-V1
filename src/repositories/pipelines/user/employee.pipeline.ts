import { Role } from '~/constants/enum'

export const employeeMatchPipeline = () => [
    {
        $match: {
            role: { $in: [Role.SUPER_ADMIN, Role.ADMIN] }
        }
    }
]

export const superAdminMatchPipeline = () => [
    {
        $match: {
            role: Role.SUPER_ADMIN
        }
    }
]
