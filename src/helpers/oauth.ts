import { envConfig } from '~/config/envConfig'

interface OauthGoogleTokenResponse {
    access_token: string
    refresh_token: string
    id_token: string
}
export const getOauthGoogleToken = async (code: string): Promise<OauthGoogleTokenResponse> => {
    const body = new URLSearchParams({
        code: code,
        client_id: envConfig.GOOGLE_CLIENT_ID,
        client_secret: envConfig.GOOGLE_CLIENT_SECRET,
        redirect_uri: envConfig.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code'
    })
    const response = await fetch(`https://oauth2.googleapis.com/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
    })

    return response.json()
}

interface GoogleUserInfoProps {
    access_token: string
    id_token: string
}

interface GoogleUserInfo {
    sub: string
    name: string
    given_name: string
    family_name: string
    picture: string
    email: string
    email_verified: boolean
}

export const getOauthGoogleUserInfo = async ({
    access_token,
    id_token
}: GoogleUserInfoProps): Promise<GoogleUserInfo> => {
    const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${encodeURIComponent(access_token)}&alt=json`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${id_token}`
            }
        }
    )

    return response.json()
}
