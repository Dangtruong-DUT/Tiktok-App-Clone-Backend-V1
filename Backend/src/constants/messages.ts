export const USER_MESSAGES = {
    LOGIN_SUCCESS: 'Login success',
    LOGIN_FAILED: 'Login failed',
    LOGOUT_SUCCESS: 'Logout success',
    REGISTER_SUCCESS: 'Register success',
    REGISTER_FAILED: 'Register failed',
    USER_ALREADY_EXISTS: 'User already exists',
    USER_NOT_FOUND: 'Email or password incorrect',
    VALIDATION_ERROR: 'Validation error',
    NAME_IS_REQUIRED: 'Name is required',
    NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Name must be from 1 to 100 characters',
    NAME_MUST_BE_A_STRING: 'Name must be a string',
    EMAIL_IS_REQUIRED: 'Email is required',
    EMAIL_IS_INVALID: 'Invalid email format',
    PASSWORD_IS_REQUIRED: 'Password is required',

    PASSWORD_MUST_BE_STRONG:
        'Password must be at least 6 characters long and contain at least one number and one symbol.',
    CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
    CONFIRM_PASSWORD_DOES_NOT_MATCH: 'Passwords do not match',
    CONFIRM_PASSWORD_MUST_BE_STRONG:
        'Password must be at least 6 characters long and contain at least one number and one symbol.',
    EMAIL_ALREADY_EXISTS: 'Email already exists',
    DATA_OF_BIRTH_IS_REQUIRED: 'Date of birth is required',
    DATA_OF_BIRTH_IS_INVALID_FORMAT: 'Date of birth must be a valid ISO 8601 date',
    DATE_OF_BIRTH_MUST_BE_IN_THE_PAST: 'Date of birth must be in the past'
} as const
