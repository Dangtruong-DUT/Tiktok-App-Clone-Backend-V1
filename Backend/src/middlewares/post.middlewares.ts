import { Request, Response, NextFunction } from 'express'
import { Audience } from '~/constants/enum'
import HTTP_STATUS from '~/constants/httpStatus'
import { POST_MESSAGES } from '~/constants/messages/post'
import { USER_MESSAGES } from '~/constants/messages/user'
import { ErrorWithStatus } from '~/models/Errors'
import TikTokPost from '~/models/schemas/TikTokPost.schemas'
import usersServices from '~/services/users.services'

export async function audienceValidator(req: Request, res: Response, next: NextFunction): Promise<void> {
    const post = req.post as TikTokPost
    const user_id = req.decoded_authorization?.user_id
    const owner_id = post.user_id.toString()

    if (post.audience === Audience.public) return next()

    if (!user_id) {
        throw new ErrorWithStatus({
            message: USER_MESSAGES.REQUIRED_lOGIN,
            status: HTTP_STATUS.UNAUTHORIZED
        })
    }

    if (user_id === owner_id) return next()

    if (post.audience === Audience.private) {
        throw new ErrorWithStatus({
            message: POST_MESSAGES.YOU_DO_NOT_HAVE_PERMISSION_TO_VIEW_THIS_POST,
            status: HTTP_STATUS.FORBIDDEN
        })
    }

    if (post.audience === Audience.friends) {
        const [isFriend1, isFriend2] = await Promise.all([
            usersServices.checkFriendshipStatus({
                user_id,
                target_user_id: owner_id
            }),
            usersServices.checkFriendshipStatus({
                user_id: owner_id,
                target_user_id: user_id
            })
        ])

        if (isFriend1 && isFriend2) return next()

        throw new ErrorWithStatus({
            message: POST_MESSAGES.YOU_DO_NOT_HAVE_PERMISSION_TO_VIEW_THIS_POST,
            status: HTTP_STATUS.FORBIDDEN
        })
    }

    throw new ErrorWithStatus({
        message: POST_MESSAGES.YOU_DO_NOT_HAVE_PERMISSION_TO_VIEW_THIS_POST,
        status: HTTP_STATUS.FORBIDDEN
    })
}
