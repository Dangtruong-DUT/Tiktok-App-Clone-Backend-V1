import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '~/constants/enum'

export interface TokenPayload extends JwtPayload {
    user_id: string
    token_Type: TokenType
    verify: UserVerifyStatus
}

export interface PaginationQuery {
    page?: number
    limit?: number
}
