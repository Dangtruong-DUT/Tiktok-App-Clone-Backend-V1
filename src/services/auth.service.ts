import { ObjectId } from 'mongodb'
import { RegisterRequestBody } from '~/models/requests/auth.requests'
import User from '~/models/schemas/User.schema'
import generateTimeBasedUsername from '~/utils/GenerateUserName'
import { signAccessAndRefreshToken, signEmailVerifyToken } from '~/helpers/signToken'
import { getOauthGoogleToken, getOauthGoogleUserInfo } from '~/helpers/oauth'
import usersRepository from '~/repositories/users.repository'
import { hashPassword } from '~/utils/crypto'
import { Role, UserVerifyStatus } from '~/constants/enum'
import sesEmailService from '~/services/aws/ses.email.service'
import { envConfig } from '~/config/envConfig'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages/user'

class AuthService {
    static instance: AuthService
    private constructor() {}
    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService()
        }
        return AuthService.instance
    }

    async register(payload: RegisterRequestBody) {
        const user_id = new ObjectId()
        const username = generateTimeBasedUsername()
        const email_verify_token = await signEmailVerifyToken(user_id.toString(), Role.USER)

        await usersRepository.insertUser(
            new User({
                ...payload,
                _id: user_id,
                email_verify_token,
                date_of_birth: new Date(payload.date_of_birth),
                password: hashPassword(payload.password),
                username
            })
        )

        const user = await usersRepository.findUserById({ user_id: user_id.toString() })

        await sesEmailService.sendVerifyEmail({
            toAddress: user.email,
            link: `${envConfig.FRONTEND_URL}/verify-email?token=${email_verify_token}`
        })

        const [access_token, refresh_token] = await signAccessAndRefreshToken({
            verify: UserVerifyStatus.UNVERIFIED,
            userId: user_id.toString(),
            role: Role.USER
        })

        await usersRepository.insertRefreshToken(new RefreshToken({ user_id: user_id, token: refresh_token }))

        if (!user) {
            throw new ErrorWithStatus({
                message: USER_MESSAGES.USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
            })
        }

        return {
            access_token,
            refresh_token,
            user: { ...user, isOwner: true }
        }
    }

    async login({ user_id, verify, role }: { user_id: string; verify: UserVerifyStatus; role: Role }) {
        const [access_token, refresh_token] = await signAccessAndRefreshToken({
            userId: user_id,
            verify,
            role
        })
        const user = await usersRepository.getUserProfileWithDetails({ target_user_id: user_id })

        if (!user) {
            throw new ErrorWithStatus({
                message: USER_MESSAGES.USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
            })
        }

        await usersRepository.insertRefreshToken(
            new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
        )

        return {
            access_token,
            refresh_token,
            user: {
                ...user,
                isOwner: true
            }
        }
    }

    async oauthGoogle(code: string) {
        const { id_token, access_token } = await getOauthGoogleToken(code)
        const userInfo = await getOauthGoogleUserInfo({ id_token, access_token })
        const isExists = await usersRepository.checkEmailExists(userInfo.email)
        console.log(userInfo)
        if (userInfo.email_verified === false) {
            throw new ErrorWithStatus({
                message: 'Email not verified',
                status: HTTP_STATUS.BAD_REQUEST
            })
        }

        if (isExists) {
            const user = await usersRepository.findUserByEmail({ email: userInfo.email })
            if (!user) {
                throw new ErrorWithStatus({
                    message: USER_MESSAGES.USER_NOT_FOUND,
                    status: HTTP_STATUS.NOT_FOUND
                })
            }
            const [access_token, refresh_token] = await signAccessAndRefreshToken({
                userId: user._id?.toString() as string,
                verify: user.verify,
                role: user.role
            })

            await usersRepository.insertRefreshToken(
                new RefreshToken({ user_id: new ObjectId(user._id), token: refresh_token })
            )

            return {
                access_token,
                refresh_token,
                user: { ...user, isOwner: true }
            }
        } else {
            const user_id = new ObjectId()
            const username = generateTimeBasedUsername()

            await usersRepository.insertUser(
                new User({
                    _id: user_id,
                    name: userInfo.name,
                    email: userInfo.email,
                    date_of_birth: new Date(),
                    password: '',
                    created_at: new Date(),
                    updated_at: new Date(),
                    email_verify_token: '',
                    forgot_password_token: '',
                    verify: UserVerifyStatus.VERIFIED,
                    bio: '',
                    location: '',
                    website: '',
                    username,
                    avatar: userInfo.picture,
                    cover_photo: ''
                })
            )

            const [[access_token, refresh_token], user] = await Promise.all([
                signAccessAndRefreshToken({
                    userId: user_id.toString(),
                    verify: UserVerifyStatus.VERIFIED,
                    role: Role.USER
                }),
                usersRepository.getUserProfileWithDetails({ target_user_id: user_id.toString() })
            ])

            await usersRepository.insertRefreshToken(new RefreshToken({ user_id: user_id, token: refresh_token }))

            return {
                access_token,
                refresh_token,
                user: { ...user, isOwner: true }
            }
        }
    }

    async logout(refresh_token: string) {
        const result = await usersRepository.deleteRefreshToken(refresh_token)
        return result.deletedCount > 0
    }

    async logoutAllDevices(user_id: string) {
        const result = await usersRepository.deleteAllRefreshTokensByUser(user_id)
        return result.deletedCount > 0
    }

    async refreshToken({
        refresh_token,
        user_id,
        verify,
        role
    }: {
        refresh_token: string
        user_id: string
        verify: UserVerifyStatus
        role: Role
    }) {
        const [access_token, new_refresh_token] = await signAccessAndRefreshToken({
            userId: user_id,
            verify,
            role
        })

        await Promise.all([
            usersRepository.deleteRefreshToken(refresh_token),
            usersRepository.insertRefreshToken(
                new RefreshToken({ user_id: new ObjectId(user_id), token: new_refresh_token })
            )
        ])

        return { access_token, refresh_token: new_refresh_token }
    }
}

const authService = AuthService.getInstance()

export default authService
