import { ParamSchema } from 'express-validator'
import { USER_MESSAGES } from '~/constants/messages/user'
import { VALIDATION_MESSAGES } from '~/constants/messages/validation'

export const nameSchema = ({ isRequired = true }: { isRequired: boolean }) => ({
    trim: true,
    optional: !isRequired,
    notEmpty: isRequired
        ? {
              errorMessage: VALIDATION_MESSAGES.NAME_IS_REQUIRED
          }
        : undefined,
    isString: {
        errorMessage: VALIDATION_MESSAGES.NAME_MUST_BE_STRING
    },
    isLength: {
        options: {
            min: 1,
            max: 100
        },
        errorMessage: VALIDATION_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
    }
})

export const dateOfBirthSchema = ({ isRequired = true }: { isRequired: boolean }): ParamSchema => ({
    optional: !isRequired,
    notEmpty: isRequired
        ? {
              errorMessage: VALIDATION_MESSAGES.DATA_OF_BIRTH_IS_REQUIRED
          }
        : undefined,
    isISO8601: {
        options: {
            strict: true
        },
        errorMessage: VALIDATION_MESSAGES.DATA_OF_BIRTH_IS_INVALID_FORMAT
    },
    custom: {
        options: (value) => new Date(value) <= new Date(),
        errorMessage: VALIDATION_MESSAGES.DATE_OF_BIRTH_MUST_BE_IN_THE_PAST
    }
})

export const userIdSchema: ParamSchema = {
    trim: true,
    notEmpty: {
        errorMessage: USER_MESSAGES.USER_ID_IS_REQUIRED
    },
    isString: {
        errorMessage: USER_MESSAGES.USER_ID_MUST_BE_STRING
    }
}

export const emailSchema = ({ isRequired = true }: { isRequired: boolean }): ParamSchema => ({
    trim: true,
    optional: !isRequired,
    notEmpty: isRequired ? { errorMessage: VALIDATION_MESSAGES.EMAIL_IS_REQUIRED } : undefined,
    isEmail: { errorMessage: VALIDATION_MESSAGES.EMAIL_IS_INVALID }
})

export const bioSchema: ParamSchema = {
    optional: true,
    isString: {
        errorMessage: USER_MESSAGES.BIO_MUST_BE_A_STRING
    },
    isLength: {
        options: {
            max: 200
        },
        errorMessage: USER_MESSAGES.BIO_LENGTH_MUST_BE_FROM_0_TO_200
    },
    trim: true
}

export const locationSchema: ParamSchema = {
    optional: true,
    isString: {
        errorMessage: USER_MESSAGES.LOCATION_MUST_BE_A_STRING
    },
    isLength: {
        options: {
            max: 200
        },
        errorMessage: USER_MESSAGES.LOCATION_LENGTH_MUST_BE_FROM_0_TO_200
    },
    trim: true
}

export const websiteSchema: ParamSchema = {
    trim: true,
    optional: true,
    isURL: {
        errorMessage: USER_MESSAGES.WEBSITE_MUST_BE_A_VALID_URL
    },
    isLength: {
        options: {
            max: 200
        },
        errorMessage: USER_MESSAGES.WEBSITE_LENGTH_MUST_BE_FROM_0_TO_200
    }
}

export const usernameSchema: ParamSchema = {
    trim: true,
    optional: true,
    isString: {
        errorMessage: USER_MESSAGES.USERNAME_MUST_BE_A_STRING
    },
    isLength: {
        options: {
            min: 1,
            max: 50
        },
        errorMessage: USER_MESSAGES.USERNAME_LENGTH_MUST_BE_FROM_1_TO_50
    }
}

export const avatarSchema: ParamSchema = {
    optional: true,
    trim: true,
    isLength: {
        options: {
            max: 400
        },
        errorMessage: USER_MESSAGES.AVATAR_LENGTH_MUST_BE_FROM_0_TO_400
    }
}

export const coverPhotoSchema: ParamSchema = {
    optional: true,
    isLength: {
        options: {
            max: 400
        },
        errorMessage: USER_MESSAGES.COVER_PHOTO_LENGTH_MUST_BE_FROM_0_TO_400
    },
    trim: true
}
