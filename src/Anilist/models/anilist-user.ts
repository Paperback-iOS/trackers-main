export interface Result {
    Viewer: Viewer
}
export interface Viewer {
    id:               number;
    name:             string;
    mediaListOptions: MediaListOptions;
    siteUrl:          string;
}

export interface MediaListOptions {
    scoreFormat: string;
}
