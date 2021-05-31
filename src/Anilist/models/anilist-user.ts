
export interface AnilistUser {
    id:               number;
    name:             string;
    mediaListOptions: MediaListOptions;
    siteUrl:          string;
}

export interface MediaListOptions {
    scoreFormat: string;
}
