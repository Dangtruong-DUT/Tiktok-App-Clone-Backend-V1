import { checkSchema, ParamSchema } from 'express-validator'
import { isEmpty } from 'lodash'
import { ObjectId } from 'mongodb'
import { Audience, MediaType, PosterType } from '~/constants/enum'
import HTTP_STATUS from '~/constants/httpStatus'
import { TIKTOK_POST_MESSAGE } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import tikTokPostService from '~/services/TiktokPost.services'
import usersServices from '~/services/users.services'
import { numberEnumToArray } from '~/utils/common'
import { validate } from '~/utils/validation'

const validatePostId: ParamSchema = {
    notEmpty: {
        errorMessage: TIKTOK_POST_MESSAGE.POST_ID_IS_REQUIRED
    },
    isString: {
        errorMessage: TIKTOK_POST_MESSAGE.POSt_ID_MUST_BE_STRING
    },
    custom: {
        options: async (value: string) => {
            if (!ObjectId.isValid(value)) {
                throw new ErrorWithStatus({
                    message: TIKTOK_POST_MESSAGE.INVALID_POST_ID,
                    status: HTTP_STATUS.NOT_FOUND
                })
            }

            const post = await tikTokPostService.getPostById(value)
            if (!post) {
                throw new ErrorWithStatus({
                    message: TIKTOK_POST_MESSAGE.POST_NOT_FOUND,
                    status: HTTP_STATUS.NOT_FOUND
                })
            }
            return true
        }
    },
    trim: true
}

export const createTiktokPostValidator = validate(
    checkSchema(
        {
            type: {
                isIn: {
                    options: [numberEnumToArray(PosterType)],
                    errorMessage: TIKTOK_POST_MESSAGE.INVALID_POST_TYPE
                }
            },
            audience: {
                isIn: {
                    options: [numberEnumToArray(Audience)],
                    errorMessage: TIKTOK_POST_MESSAGE.INVALID_AUDIENCE_TYPE
                }
            },
            content: {
                isString: true,
                isLength: {
                    options: { max: 500 },
                    errorMessage: TIKTOK_POST_MESSAGE.CONTENT_MAX_LENGTH
                },
                custom: {
                    options: (value: string, { req }) => {
                        const type = req.body.type
                        const medias = req.body.medias
                        const mentions = req.body.mentions

                        if (
                            !(typeof value === 'string' && value.trim()) &&
                            [PosterType.Comment, PosterType.quotePost].includes(type) &&
                            isEmpty(medias) &&
                            isEmpty(mentions)
                        ) {
                            throw new Error(TIKTOK_POST_MESSAGE.CONTENT_REQUIRED)
                        }
                        return true
                    }
                },
                trim: true
            },
            parent_id: {
                custom: {
                    options: (value: string, { req }) => {
                        const type = req.body.type
                        // If parent_id is provided different null, then type must be comment, reports, quotes
                        if (
                            !ObjectId.isValid(value) &&
                            [PosterType.Comment, PosterType.Reports, PosterType.quotePost].includes(type)
                        ) {
                            throw new Error(TIKTOK_POST_MESSAGE.INVALID_PARENT_ID)
                        }

                        // If parent_id is provided and type is posts, then it must be null
                        if (value != null && type === PosterType.post) {
                            throw new Error(TIKTOK_POST_MESSAGE.PARENT_ID_MUST_BE_NULL)
                        }
                        return true
                    }
                },
                trim: true
            },
            hashtags: {
                isArray: true,
                errorMessage: TIKTOK_POST_MESSAGE.HASHTAGS_MUST_BE_ARRAY,
                custom: {
                    options: (value: string[]) => {
                        if (!value.every((item) => typeof item === 'string')) {
                            throw new Error(TIKTOK_POST_MESSAGE.HASHTAG_MUST_BE_STRING)
                        }
                        return true
                    }
                }
            },
            mentions: {
                isArray: true,
                errorMessage: TIKTOK_POST_MESSAGE.MENTIONS_MUST_BE_ARRAY,
                custom: {
                    options: async (value: string[]) => {
                        const results = await Promise.all(
                            value.map(async (item) => {
                                const user = await usersServices.getUserById(item)
                                return user !== null
                            })
                        )
                        if (!results.every(Boolean)) {
                            throw new ErrorWithStatus({
                                message: TIKTOK_POST_MESSAGE.INVALID_MENTION,
                                status: HTTP_STATUS.NOT_FOUND
                            })
                        }
                        return true
                    }
                }
            },
            guest_views: {
                isInt: { options: { min: 0 } },
                toInt: true,
                optional: true,
                errorMessage: TIKTOK_POST_MESSAGE.GUEST_VIEWS_MUST_BE_INTEGER
            },
            user_views: {
                isInt: { options: { min: 0 } },
                toInt: true,
                optional: true,
                errorMessage: TIKTOK_POST_MESSAGE.USER_VIEWS_MUST_BE_INTEGER
            },
            medias: {
                isArray: true,
                errorMessage: TIKTOK_POST_MESSAGE.MEDIA_FILES_MUST_BE_ARRAY,
                notEmpty: {
                    errorMessage: TIKTOK_POST_MESSAGE.MEDIA_FILES_REQUIRED
                },
                custom: {
                    options: (value) => {
                        if (
                            !value.every((item: any) => {
                                return typeof item.url === 'string' && Object.values(MediaType).includes(item.type)
                            })
                        ) {
                            throw new Error(TIKTOK_POST_MESSAGE.INVALID_MEDIA_TYPE)
                        }
                        return true
                    }
                }
            }
        },
        ['body']
    )
)

export const bookMarksTiktokPostValidator = validate(checkSchema({ post_id: validatePostId }, ['body']))

export const likeTiktokPostValidator = validate(checkSchema({ post_id: validatePostId }, ['body']))
export const unBookMarksTiktokValidator = validate(
    checkSchema(
        {
            post_id: validatePostId
        },
        ['params']
    )
)

export const unLikeTiktokPostValidator = validate(
    checkSchema(
        {
            post_id: validatePostId
        },
        ['params']
    )
)

export const verifiedLikedIdValidator = validate(
    checkSchema(
        {
            _id: {
                notEmpty: {
                    errorMessage: TIKTOK_POST_MESSAGE.LIKED_ID_IS_REQUIRED
                },
                isString: {
                    errorMessage: TIKTOK_POST_MESSAGE.LIKED_ID_MUST_BE_STRING
                },
                custom: {
                    options: async (value: string) => {
                        if (!ObjectId.isValid(value)) {
                            throw new ErrorWithStatus({
                                message: TIKTOK_POST_MESSAGE.INVALID_ID,
                                status: HTTP_STATUS.NOT_FOUND
                            })
                        }

                        const document = await databaseService.likes.findOne({
                            _id: new ObjectId(value)
                        })
                        if (!document) {
                            throw new ErrorWithStatus({
                                message: TIKTOK_POST_MESSAGE.THE_POST_HAS_NOT_BEEN_LIKED_OR_UNLIKED_PREVIOUSLY,
                                status: HTTP_STATUS.NOT_FOUND
                            })
                        }
                        return true
                    }
                },
                trim: true
            }
        },
        ['params']
    )
)
export const verifiedBookMarksValidator = validate(
    checkSchema(
        {
            bookmark_id: {
                notEmpty: {
                    errorMessage: TIKTOK_POST_MESSAGE.BOOKMARKS_ID_IS_REQUIRED
                },
                isString: {
                    errorMessage: TIKTOK_POST_MESSAGE.BOOKMARKS_ID_MUST_BE_A_STRING
                },
                custom: {
                    options: async (value: string) => {
                        if (!ObjectId.isValid(value)) {
                            throw new ErrorWithStatus({
                                message: TIKTOK_POST_MESSAGE.INVALID_ID,
                                status: HTTP_STATUS.NOT_FOUND
                            })
                        }

                        const document = await databaseService.bookmarks.findOne({
                            _id: new ObjectId(value)
                        })
                        if (!document) {
                            throw new ErrorWithStatus({
                                message: TIKTOK_POST_MESSAGE.THE_POST_HAS_NOT_BEEN_BOOKMARKS_OR_UNBOOKMARK_PREVIOUSLY,
                                status: HTTP_STATUS.NOT_FOUND
                            })
                        }
                        return true
                    }
                },
                trim: true
            }
        },
        ['params']
    )
)
