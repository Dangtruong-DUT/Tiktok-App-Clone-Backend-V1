// Các message chung cho HTTP status, lỗi hệ thống
export const COMMON_MESSAGES = {
    INTERNAL_SERVER_ERROR: 'Internal server error',
    NOT_FOUND: 'Not found',
    BAD_REQUEST: 'Bad request',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    OK: 'OK',
    CREATED: 'Created',
    NO_CONTENT: 'No content',
    CONFLICT: 'Conflict',
    SERVICE_UNAVAILABLE: 'Service unavailable'
} as const

export const PAGINATION_MESSAGES = {
    PAGE_NUMBER_MUST_BE_INTEGER: 'Page number must be an integer',
    PAGE_NUMBER_MUST_BE_POSITIVE: 'Page number must be a positive integer',
    LIMIT_MUST_BE_POSITIVE: 'Limit must be a positive integer'
}
