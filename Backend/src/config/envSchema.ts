import * as z from 'zod'

export const envSchema = z.object({
    HOST: z.string().url(),
    PORT: z.string().regex(/^\d+$/).transform(Number),
    DB_NAME: z.string().min(1),
    DB_USERNAME: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_USERS_COLLECTION: z.string().min(1),
    DB_REFRESH_TOKENS_COLLECTION: z.string().min(1),
    DB_FOLLOWERS_COLLECTION: z.string().min(1),
    DB_VIDEO_STATUS_COLLECTION: z.string().min(1),
    DB_TIKTOK_POST_COLLECTION: z.string().min(1),
    DB_HASHTAGS_COLLECTION: z.string().min(1),
    DB_BOOKMARKS_COLLECTION: z.string().min(1),
    DB_LIKES_COLLECTION: z.string().min(1),

    PASSWORD_SECRET: z.string().min(1),
    JWT_SECRET: z.string().min(1),
    JWT_SECRET_ACCESS_TOKEN: z.string().min(1),
    JWT_SECRET_REFRESH_TOKEN: z.string().min(1),
    JWT_SECRET_EMAIL_VERIFY_TOKEN: z.string().min(1),
    JWT_SECRET_FORGOT_PASSWORD: z.string().min(1),

    EMAIL_VERIFY_TOKEN_EXPIRE_IN: z.string().regex(/^\d+[smhd]$/, 'Must be duration string like 24h, 15m'),
    FORGOT_PASSWORD_TOKEN_EXPIRE_IN: z.string().regex(/^\d+[smhd]$/, 'Must be duration string like 24h, 15m'),
    ACCESS_TOKEN_EXPIRE_IN: z.string().regex(/^\d+[smhd]$/, 'Must be duration string like 15m'),
    REFRESH_TOKEN_EXPIRE_IN: z.string().regex(/^\d+[smhd]$/, 'Must be duration string like 30d')
})
