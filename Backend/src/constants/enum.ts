export enum UserVerifyStatus {
    Unverified,
    Verified,
    Banned
}

export enum TokenType {
    AccessToken,
    RefreshToken,
    ForgotPasswordToken,
    EmailVerifyToken
}

export enum MediaType {
    Image,
    Video,
    HLSVideo
}

export enum EncodingStatus {
    Pending,
    Processing,
    Completed,
    Failed
}
