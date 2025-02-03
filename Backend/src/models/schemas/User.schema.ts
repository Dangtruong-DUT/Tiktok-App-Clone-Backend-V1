import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enum'

interface UserType {
    _id?: ObjectId
    name: string
    email: string
    password: string
    date_of_birth: Date
    updated_at?: Date
    created_at?: Date
    email_verify_token?: string
    forgot_password_token?: string
    verify?: UserVerifyStatus

    bio?: string
    location?: string
    website?: string
    username?: string
    avatar?: string
    cover_photo?: string
}

export default class User {
    _id?: ObjectId
    name: string
    email: string
    password: string
    date_of_birth: Date
    updated_at: Date
    created_at: Date
    email_verify_token: string
    forgot_password_token: string
    verify: UserVerifyStatus

    bio: string
    location: string
    website: string
    username: string
    avatar: string
    cover_photo: string

    constructor(data: UserType) {
        const date = new Date()
        this._id = data._id
        this.name = data.name || ''
        this.email = data.email
        this.password = data.password
        this.date_of_birth = data.date_of_birth || new Date()
        this.updated_at = data.updated_at || date
        this.created_at = data.created_at || date
        this.email_verify_token = data.email_verify_token || ''
        this.forgot_password_token = data.forgot_password_token || ''
        this.verify = data.verify || UserVerifyStatus.Unverified
        this.bio = data.bio || ''
        this.location = data.location || ''
        this.website = data.website || ''
        this.username = data.username || ''
        this.avatar = data.avatar || ''
        this.cover_photo = data.cover_photo || ''
    }
}
