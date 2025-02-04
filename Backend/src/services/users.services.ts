import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterRequestBody } from '~/models/requests/user.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enum'
import { StringValue } from 'ms'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import { ObjectId } from 'mongodb'

class UserService {
    private signAccessToken(userId: string) {
        return signToken({
            payload: {
                userId,
                token_type: TokenType.AccessToken
            },
            options: {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN as StringValue
            }
        })
    }
    private signRefreshToken(userId: string) {
        return signToken({
            payload: {
                userId,
                token_type: TokenType.RefreshToken
            },
            options: {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN as StringValue
            }
        })
    }
    private signAccessAndRefreshToken(userId: string) {
        return Promise.all([this.signAccessToken(userId), this.signRefreshToken(userId)])
    }
    async register(payload: RegisterRequestBody) {
        const result = await databaseService.users.insertOne(
            new User({
                ...payload,
                date_of_birth: new Date(payload.date_of_birth),
                password: hashPassword(payload.password)
            })
        )
        const user_id = result.insertedId.toString()
        const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(user_id)
        await databaseService.refreshToken.insertOne(
            new RefreshToken({ user_id: new ObjectId(user_id), token: refreshToken })
        )
        return {
            accessToken,
            refreshToken
        }
    }

    async login(user_id: string) {
        const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(user_id)
        await databaseService.refreshToken.insertOne(
            new RefreshToken({ user_id: new ObjectId(user_id), token: refreshToken })
        )
        return {
            accessToken,
            refreshToken
        }
    }
    async logout(refresh_token: string) {
        const deleteResult = await databaseService.refreshToken.deleteOne({ token: refresh_token })
        return deleteResult.deletedCount > 0
    }
    async checkEmailExist(email: string) {
        const user = await databaseService.users.findOne({ email })
        return !!user
    }
}

export default new UserService()
