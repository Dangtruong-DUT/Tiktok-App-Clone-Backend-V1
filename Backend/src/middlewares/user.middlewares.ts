import { checkSchema } from 'express-validator'
import { Request, Response, NextFunction } from 'express'
import { validate } from '~/utils/validation'
import usersServices from '~/services/users.services'
export const loginValidator = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ error: 'Please provide both username and password.' })
    }
    next()
}

export const registerValidator = validate(
    checkSchema({
        name: {
            notEmpty: {
                errorMessage: 'Name is required.'
            },
            isString: {
                errorMessage: 'Name must be a string.'
            },
            isLength: {
                options: {
                    min: 1,
                    max: 100
                },
                errorMessage: 'Name must be between 1 and 100 characters long.'
            },
            trim: true
        },
        email: {
            notEmpty: {
                errorMessage: 'Email is required.'
            },
            isEmail: {
                errorMessage: 'Email must be valid.'
            },
            trim: true,
            custom: {
                options: async (value) => {
                    const exists = await usersServices.checkEmailExist(value)
                    if (exists) throw new Error('Email already exists.')
                    return true
                }
            }
        },
        password: {
            notEmpty: {
                errorMessage: 'Password is required.'
            },
            isLength: {
                options: {
                    min: 6,
                    max: 50
                },
                errorMessage: 'Password must be between 6 and 50 characters long.'
            },
            isStrongPassword: {
                options: {
                    minLength: 6,
                    minNumbers: 1,
                    minSymbols: 1
                },
                errorMessage:
                    'Password must be at least 6 characters long and contain at least one number and one symbol.'
            },
            trim: true
        },
        confirm_password: {
            notEmpty: {
                errorMessage: 'Confirm password is required.'
            },
            isLength: {
                options: {
                    min: 6,
                    max: 50
                },
                errorMessage: 'Confirm password must be between 6 and 50 characters long.'
            },
            isStrongPassword: {
                options: {
                    minLength: 6,
                    minNumbers: 1,
                    minSymbols: 1
                },
                errorMessage:
                    'Confirm password must be at least 6 characters long and contain at least one number and one symbol.'
            },
            trim: true,
            custom: {
                options: (value: any, { req }) => value === req.body.password,
                errorMessage: 'Passwords do not match.'
            }
        },
        date_of_birth: {
            notEmpty: {
                errorMessage: 'Date of birth is required.'
            },
            isISO8601: {
                options: {
                    strict: true
                },
                errorMessage: 'Date of birth must be a valid ISO 8601 date.'
            },
            custom: {
                options: (value: any) => new Date(value) <= new Date(),
                errorMessage: 'Date of birth must be in the past.'
            }
        }
    })
)
