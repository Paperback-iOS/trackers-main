import {
    ContentRating,
    Form,
    PagedResults,
    SearchRequest,
    Section,
    SourceInfo,
    TrackedManga,
    Tracker,
    Request,
    Response
} from 'paperback-extensions-common'
import {
    getMangaQuery,
    searchMangaQuery,
    userProfileQuery
} from './models/graphql-queries'
import * as AnilistUser from './models/anilist-user'
import * as AnilistPage from './models/anilist-page'
import * as AnilistManga from './models/anilist-manga'
import { AnilistResult } from './models/anilist-result'

const ANILIST_GRAPHQL_ENDPOINT = 'https://graphql.anilist.co/'

export const AnilistInfo: SourceInfo = {
    name: 'Anilist',
    author: 'Faizan Durrani',
    contentRating: ContentRating.EVERYONE,
    icon: 'icon.png',
    version: '1.0.0',
    description: 'Anilist Tracker',
    authorWebsite: 'faizandurrani.github.io',
    websiteBaseURL: 'https://anilist.co'
}

export class Anilist extends Tracker {
    requestManager = createRequestManager({
        requestsPerSecond: 5,
        requestTimeout: 20000,
        interceptor: {
            // Authorization injector
            interceptRequest: async (request: Request): Promise<Request> => {
                const accessToken = await this.accessToken.get()
                request.headers = {
                    ...(request.headers ?? {}),
                    ...({
                        'content-type': 'application/json',
                        'accept': 'application/json',
                    }),
                    ...(accessToken != null ? {
                        'authorization': `Bearer ${accessToken}`
                    } : {})
                }
                
                return request
            },
            interceptResponse: async (response: Response): Promise<Response> => {
                return response
            }
        }
    })
    stateManager = createSourceStateManager({
    })

    accessToken = {
        get: async (): Promise<string | undefined> => {
            return this.stateManager.keychain.retrieve('access_token')
        },
        set: async (token: string | undefined): Promise<void> => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            await this.stateManager.keychain.store('access_token', token)
            await this.userInfo.refresh()
        },
        isValid: async (): Promise<boolean> => {
            return (await this.accessToken.get()) != null
        }
    }

    userInfo = {
        get: async (): Promise<AnilistUser.Viewer | undefined> => {
            return this.stateManager.retrieve('userInfo')
        },
        isLoggedIn: async (): Promise<boolean> => {
            return (await this.userInfo.get()) != null
        },
        refresh: async (): Promise<void> => {
            const accessToken = await this.accessToken.get()

            if(accessToken == null) { 
                return await this.stateManager.store('userInfo', null)
            }

            console.log('REQUESTING')
            const response = await this.requestManager.schedule(createRequestObject({
                url: ANILIST_GRAPHQL_ENDPOINT,
                method: 'POST',
                data: userProfileQuery()
            }), 0)

            console.log(response.data)
            const userInfo = AnilistResult<AnilistUser.Result>(response.data).data?.Viewer

            await this.stateManager.store('userInfo', userInfo)
        }
    }
    
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    async getSearchResults(query: SearchRequest, metadata: unknown): Promise<PagedResults> {
        const pageInfo = metadata as AnilistPage.PageInfo | undefined

        // If there are no more results, we dont want to make extra calls to Anilist
        if(pageInfo?.hasNextPage === false) { return createPagedResults({ results: [], metadata: pageInfo }) }

        const nextPage = (pageInfo?.currentPage ?? 0) + 1
        const response = await this.requestManager.schedule(createRequestObject({
            url: ANILIST_GRAPHQL_ENDPOINT,
            method: 'POST',
            data: searchMangaQuery(nextPage, query.title ?? '')
        }), 1)

        const anilistPage = AnilistResult<AnilistPage.Result>(response.data).data?.Page
        
        return createPagedResults({
            results: anilistPage?.media.map(manga => createMangaTile({
                id: manga.id.toString(),
                image: manga.coverImage.large ?? '',
                title: createIconText({
                    text: manga.title.userPreferred
                })
            })) ?? [],
            metadata: anilistPage?.pageInfo
        })
    }

    async getMangaForm(_mangaId: string): Promise<Form> {
        return createForm({
            sections: async () => [],
            onSubmit: async (_values) => { return },
            validate: async (_values) => true 
        })
    } 
    

    async getTrackedManga(mangaId: string): Promise<TrackedManga> {
        const response = await this.requestManager.schedule(createRequestObject({
            url: ANILIST_GRAPHQL_ENDPOINT,
            method: 'POST',
            data: getMangaQuery(parseInt(mangaId))
        }), 1)

        const anilistManga = AnilistResult<AnilistManga.Result>(response.data).data?.Media

        if(anilistManga == null) { return Promise.reject() }

        return createTrackedManga({
            id: mangaId,
            mangaInfo: createMangaInfo({
                image: anilistManga.coverImage.extraLarge,
                titles: [
                    anilistManga.title.romaji,
                    anilistManga.title.english,
                    anilistManga.title.native
                ].filter(x => x != null) as string[],
                artist: anilistManga.staff.edges.find(x => x.role.toLowerCase() == 'art')?.node.name.full ?? 'Unknown',
                author: anilistManga.staff.edges.find(x => x.role.toLowerCase() == 'story')?.node.name.full ?? 'Unknown',
                desc: anilistManga.description,
                hentai: anilistManga.isAdult,
                // The score is a percentage, we convert it into 5-star rating
                rating: (anilistManga.averageScore/100) * 5,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                status: anilistManga.status,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                banner: anilistManga.bannerImage
            })
        })
    }

    async getSourceMenu(): Promise<Section> {
        return createSection({
            id: 'sourceMenu',
            header: 'Source Menu',
            rows: async () => {
                const isLoggedIn = await this.userInfo.isLoggedIn()

                if (isLoggedIn) return [
                    createLabel({
                        id: 'userInfo',
                        label: 'Logged-in as',
                        value: (await this.userInfo.get())?.name ?? 'ERROR'
                    }),
                    createButton({
                        id: 'logout',
                        label: 'Logout',
                        value: undefined,
                        onTap: async () => {
                            this.accessToken.set(undefined)
                        }
                    })
                ]; else return [
                    createOAuthButton({
                        id: 'anilistLogin',
                        authorizeEndpoint: 'https://anilist.co/api/v2/oauth/authorize',
                        clientId: '5459',
                        redirectUri: 'paperback://oauth-callback',
                        label: 'Login with Anilist',
                        responseType: {
                            type: 'token'
                        },
                        value: undefined,
                        successHandler: async (token, _refreshToken) => {
                            try {
                                await this.accessToken.set(token)
                                console.log(token)
                            } catch(error) {
                                console.log(error)
                            }
                        }
                    })
                ]
            }
        })
    }
}
