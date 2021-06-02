
export interface GraphQLQuery {
    query: string
    variables?: Record<string, unknown>
}

export const userProfileQuery = (): GraphQLQuery => ({
    query: `{
        Viewer {
            id
            name
            mediaListOptions {
                scoreFormat
            }
            siteUrl
        }
    }`
})

export const searchMangaQuery = (page: number, search: string): GraphQLQuery => ({
    query:  `{
        Page(page: $page) {
            pageInfo {
                currentPage
                hasNextPage
            }
            media(type: MANGA, search: $search) {
                id
                title {
                    userPreferred
                }
                coverImage {
                    large
                }
            }
        }
    }`,
    variables: {
        page,
        search
    }
})