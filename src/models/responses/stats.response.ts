export interface IndicatorData {
    date: string
    likes_count: number
    guests_view: number
    users_view: number
    comments_count: number
}

export interface IndicatorsResponse {
    likes_count: number
    guests_view: number
    users_view: number
    comments_count: number
    Indicator: IndicatorData[]
}
