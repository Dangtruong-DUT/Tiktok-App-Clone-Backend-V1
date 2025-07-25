import { ObjectId } from 'mongodb'
import { faker } from '@faker-js/faker'
import { RegisterRequestBody } from '~/models/requests/auth.requests'
import { CreateTikTokPostBodyReq } from '~/models/requests/TiktokPost.requests'
import { Audience, PosterType, UserVerifyStatus } from '~/constants/enum'
import usersServices from '~/services/users.service'
import User from '~/models/schemas/User.schema'
import { hashPassword } from '~/utils/crypto'
import tikTokPostService from '~/services/TiktokPost.service'
import usersRepository from '~/repositories/users.repository'

// password for faker users
const PASSWORD = 'defaultPassword123'

const MY_ID = new ObjectId('687f386db502bb3a2300a80e')

// number of faker users and a faker user posts a post
const numberOfUsers = 100

export function createRandomUser() {
    const user: RegisterRequestBody = {
        confirm_password: PASSWORD,
        date_of_birth: faker.date.past().toISOString(),
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: PASSWORD
    }
    return user
}

export function createRandomPost() {
    const post: CreateTikTokPostBodyReq = {
        audience: Audience.PUBLIC,
        content: faker.lorem.paragraph({
            min: 10,
            max: 100
        }),
        hashtags: [],
        mentions: [],
        medias: [],
        parent_id: null,
        type: PosterType.POST
    }
    return post
}

const users: RegisterRequestBody[] = faker.helpers.multiple(createRandomUser, {
    count: numberOfUsers
})

const insertUsers = async (users: RegisterRequestBody[]) => {
    const userIds: ObjectId[] = await Promise.all(
        users.map(async (user) => {
            const user_id = new ObjectId()
            await usersRepository.insertUser(
                new User({
                    ...user,
                    _id: user_id,
                    email: user.email,
                    name: user.name,
                    password: hashPassword(PASSWORD),
                    date_of_birth: new Date(user.date_of_birth),
                    verify: UserVerifyStatus.VERIFIED
                })
            )
            return user_id
        })
    )
    return userIds
}

const followMultipleUsers = async (user_id: ObjectId, user_ids: ObjectId[]) => {
    await Promise.all(
        user_ids.map(async (followed_user_id) => {
            await usersServices.followUser({
                user_id: user_id.toString(),
                followed_user_id: followed_user_id.toString()
            })
        })
    )
}

const insertMultiplePosts = async (ids: ObjectId[]) => {
    console.log('Inserting multiple posts for users...')
    let count = 0
    const result = await Promise.all(
        ids.map(async (user_id) => {
            await Promise.all([
                tikTokPostService.createPost({
                    payload: createRandomPost(),
                    user_id: user_id.toString()
                }),
                tikTokPostService.createPost({
                    payload: createRandomPost(),
                    user_id: user_id.toString()
                })
            ])
            count += 2
            if (count % 10 === 0) {
                console.log(`Inserted ${count} posts so far...`)
            }
        })
    )
    return result
}

insertUsers(users).then((userIds) => {
    followMultipleUsers(MY_ID, userIds)
    insertMultiplePosts(userIds)
})
