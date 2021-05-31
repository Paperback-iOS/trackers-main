
export const GQL_GET_USER_PROFILE = `{
    Viewer {
        id
        name
        mediaListOptions {
            scoreFormat
        }
        siteUrl
    }
}`