// Các message validate input, format
export const VALIDATION_MESSAGES = {
    NAME_IS_REQUIRED: 'Name is required',
    NAME_MUST_BE_STRING: 'Name must be a string',
    NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Name must be from 1 to 100 characters',
    EMAIL_IS_REQUIRED: 'Email is required',
    EMAIL_IS_INVALID: 'Invalid email format',
    EMAIL_ALREADY_EXISTS: 'Email already exists',
    EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
    PASSWORD_IS_REQUIRED: 'Password is required',
    PASSWORD_MUST_BE_STRONG:
        'Password must be at least 6 characters long and contain at least one number and one symbol.',
    CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
    CONFIRM_PASSWORD_DOES_NOT_MATCH: 'Passwords do not match',
    FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
    DATA_OF_BIRTH_IS_REQUIRED: 'Date of birth is required',
    DATA_OF_BIRTH_IS_INVALID_FORMAT: 'Date of birth must be a valid ISO 8601 date',
    DATE_OF_BIRTH_MUST_BE_IN_THE_PAST: 'Date of birth must be in the past',
    VALIDATION_ERROR: 'Validation error'
} as const
