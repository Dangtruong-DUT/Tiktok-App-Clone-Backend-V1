import { Server } from 'socket.io'
import { verifyAccessTokenAndEnsureUserVerified } from '~/utils/common'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { ObjectId } from 'mongodb'
import conversationService from '~/services/conversation.service'
import Conversation from '~/models/schemas/Conversation.schemas'

const socketMap = new Map<string, string>()

const UNAUTHORIZED_ERROR = {
    message: 'Unauthorized',
    name: 'UnauthorizedError',
    data: null
}

export const initSocket = (io: Server) => {
    io.use(async (socket, next) => {
        try {
            const Authorization = socket.handshake.auth.Authorization
            if (!Authorization) {
                throw new ErrorWithStatus({
                    message: 'Authorization header is required',
                    status: HTTP_STATUS.UNAUTHORIZED
                })
            }
            const access_token = Authorization.split(' ')[1]
            const decode_access_token = await verifyAccessTokenAndEnsureUserVerified(access_token)
            socket.handshake.auth.decode_access_token = decode_access_token
            socket.handshake.auth.access_token = access_token
            next()
        } catch (error) {
            return next({
                ...UNAUTHORIZED_ERROR,
                data: error
            })
        }
    })

    io.on('connection', (socket) => {
        const { user_id } = socket.handshake.auth.decode_access_token

        socket.use(async (packet, next) => {
            try {
                const access_token = socket.handshake.auth.access_token
                const { user_id } = await verifyAccessTokenAndEnsureUserVerified(access_token)
                if (!user_id) return next(UNAUTHORIZED_ERROR)
                next()
            } catch (error) {
                return next(UNAUTHORIZED_ERROR)
            }
        })

        if (user_id) {
            socketMap.set(user_id, socket.id)
        } else {
            socket.disconnect(true)
            return
        }

        socket.on('private_message', async ({ receiver_id, content, created_at }) => {
            const targetSocketId = socketMap.get(receiver_id)
            const payload = {
                sender_id: user_id,
                receiver_id,
                content,
                created_at
            }

            if (targetSocketId) {
                socket.to(targetSocketId).emit('private_message', payload)
            }

            const conversation = new Conversation({
                sender_id: new ObjectId(user_id as string),
                receiver_id: new ObjectId(receiver_id as string),
                content
            })
            await conversationService.createConversation(conversation)
        })

        socket.on('disconnect', () => {
            socketMap.delete(user_id)
        })

        socket.on('error', (error) => {
            if (error.message === 'Unauthorized') {
                socket.disconnect(true)
            }
        })
    })
}
