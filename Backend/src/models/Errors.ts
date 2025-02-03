import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'

type ErrorsType = Record<
    string,
    {
        msg: string
        [key: string]: any
    }
>
export class ErrorWithStatus {
    message: string
    status: number
    constructor({ message, status }: { message: string; status: number }) {
        this.message = message
        this.status = status
    }
}

//here the class is an instance of a validation error object
export class EntityError extends ErrorWithStatus {
    errors: ErrorsType
    constructor({ message = USER_MESSAGES.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorsType }) {
        super({ message, status: HTTP_STATUS.UNPROCESSABLE_ENTITY })
        this.errors = errors
    }
}
