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

export enum Audience {
    public,
    private,
    friends
}

export enum PosterType {
    post,
    Reports,
    Comment,
    quotePost
}
