import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enum'

export interface RegisterRequestBody {
    name: string
    email: string
    password: string
    confirm_password: string
    date_of_birth: string
}

export interface LogoutRequestBody {
    refresh_token: string
}

export interface TokenPayload extends JwtPayload {
    user_id: string
    token_Type: TokenType
}
