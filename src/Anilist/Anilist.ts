/* eslint-disable @typescript-eslint/ban-ts-comment */
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
    deleteMangaProgressMutation,
    getMangaProgressQuery,
    getMangaQuery,
    GraphQLQuery,
    saveMangaProgressMutation,
    searchMangaQuery,
    userProfileQuery
} from './models/graphql-queries'
import * as AnilistUser from './models/anilist-user'
import * as AnilistPage from './models/anilist-page'
import * as AnilistManga from './models/anilist-manga'
import { AnilistResult } from './models/anilist-result'

const ANILIST_GRAPHQL_ENDPOINT = 'https://graphql.anilist.co/'
const FALLBACK_IMAGE = 'https://via.placeholder.com/100x150'

export const AnilistInfo: SourceInfo = {
    name: 'Anilist',
    author: 'Faizan Durrani',
    contentRating: ContentRating.EVERYONE,
    icon: 'icon.png',
    version: '1.0.4',
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

    stateManager = createSourceStateManager({})

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
                return this.stateManager.store('userInfo', undefined)
            }

            const response = await this.requestManager.schedule(createRequestObject({
                url: ANILIST_GRAPHQL_ENDPOINT,
                method: 'POST',
                data: userProfileQuery()
            }), 0)

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

        console.log(JSON.stringify(anilistPage, null, 2))
        
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

    // @ts-ignore
    getMangaForm(mangaId: string): Form {
        return createForm({
            sections: async () => {
                const responseTask = this.requestManager.schedule(createRequestObject({
                    url: ANILIST_GRAPHQL_ENDPOINT,
                    method: 'POST',
                    data: getMangaProgressQuery(parseInt(mangaId))
                }), 1)
                // Make sure the user settings are up to date
                const refreshTask = this.userInfo.refresh()
                const response = (await Promise.all([responseTask, refreshTask]))[0]

                const anilistManga = AnilistResult<AnilistManga.Result>(response.data).data?.Media

                const user = await this.userInfo.get()
                if(user == null) {
                    return [
                        createSection({
                            id: 'notLoggedInSection',
                            rows: async () => [
                                createLabel({
                                    id: 'notLoggedIn',
                                    label: 'Not Logged In',
                                    value: undefined
                                })
                            ]
                        })
                    ]
                }

                if(anilistManga == null) { return Promise.reject() }

                return [
                    createSection({
                        id: 'userInfo',
                        rows: async () => [
                            createHeader({
                                id: 'header',
                                imageUrl: user.avatar?.large ?? FALLBACK_IMAGE,
                                title: user.name ?? 'NOT LOGGED IN',
                                subtitle: '',
                                value: undefined
                            })
                        ]
                    }),

                    createSection({
                        id: 'information',
                        header: 'Information',
                        rows: async () => [
                            // This allows us to get the id when the form is submitted
                            ...(anilistManga.mediaListEntry != null ? [createLabel({
                                id: 'id',
                                label: 'Entry ID',
                                value: anilistManga.mediaListEntry?.id?.toString()
                            })] : []),
                            createLabel({
                                id: 'mediaId',
                                label: 'Manga ID',
                                value: anilistManga.id?.toString(),
                            }),
                            
                            createLabel({
                                id: 'mangaTitle',
                                label: 'Title',
                                value: anilistManga.title?.userPreferred ?? 'N/A',
                            }),
                            createLabel({
                                id: 'mangaPopularity',
                                value: anilistManga.popularity?.toString() ?? 'N/A',
                                label: 'Popularity'
                            }),
                            createLabel({
                                id: 'mangaRating',
                                value: anilistManga.averageScore?.toString() ?? 'N/A',
                                label: 'Rating'
                            }),
                            createLabel({
                                id: 'mangaStatus',
                                value: anilistManga.status ?? 'N/A',
                                label: 'Status'
                            }),
                            createLabel({
                                id: 'mangaIsAdult',
                                value: anilistManga.isAdult?.toString() ?? 'N/A',
                                label: 'Is Adult'
                            })
                        ]
                    }),

                    createSection({
                        id: 'trackStatus',
                        header: 'Manga Status',
                        footer: 'Warning: Setting this to NONE will delete the listing from Anilist',
                        rows: async () => [
                            createSelect({
                                id: 'status',
                                value: [anilistManga.mediaListEntry?.status ?? 'NONE'],
                                allowsMultiselect: false,
                                label: 'Status',
                                displayLabel: (value) => {
                                    switch (value) {
                                        case 'CURRENT': return 'Reading'
                                        case 'PLANNING': return 'Planned'
                                        case 'COMPLETED': return 'Completed'
                                        case 'DROPPED': return 'Dropped'
                                        case 'PAUSED': return 'On-Hold'
                                        case 'REPEATING': return 'Re-Reading'
                                        default: return 'None'
                                    }
                                },
                                options: [
                                    'NONE',
                                    'CURRENT',
                                    'PLANNING',
                                    'COMPLETED',
                                    'DROPPED',
                                    'PAUSED',
                                    'REPEATING'
                                ]
                            })
                        ]
                    }),


                    createSection({
                        id: 'manage',
                        header: 'Progress',
                        rows: async () => [
                            //@ts-ignore
                            createStepper({
                                id: 'progress',
                                label: 'Chapter',
                                value: anilistManga.mediaListEntry?.progress ?? 0,
                                min: 0,
                                step: 1
                            }),
                            //@ts-ignore
                            createStepper({
                                id: 'progressVolumes',
                                label: 'Volume',
                                value: anilistManga.mediaListEntry?.progressVolumes ?? 0,
                                min: 0,
                                step: 1
                            })
                        ]
                    }),

                    createSection({
                        id: 'rateSection',
                        header: 'Rating',
                        footer: 'This uses your rating preference set on AniList',
                        rows: async () => [
                            //@ts-ignore
                            createStepper({
                                id: 'score',
                                label: 'Score',
                                value: anilistManga.mediaListEntry?.score,
                                min: 0,
                                max: this.scoreFormatLimit(user.mediaListOptions?.scoreFormat ?? 'POINT_10'),
                                step: user.mediaListOptions?.scoreFormat?.includes('DECIMAL') === true ? 0.1 : 1
                            })
                        ]
                    }),

                    createSection({
                        id: 'mangaNotes',
                        header: 'Notes',
                        rows: async () => [
                            createInputField({
                                id: 'notes',
                                // @ts-ignore
                                label: undefined,
                                placeholder: 'Notes',
                                value: anilistManga.mediaListEntry?.notes ?? '',
                                maskInput: false
                            })
                        ]
                    })
                ]
            },
            onSubmit: async (values) => {
                let mutation: GraphQLQuery
                const status = values['status']?.[0] ?? ''
                const id = values['id'] != null ? Number(values['id']) : undefined

                if(status == 'NONE' && id != null) {
                    mutation = deleteMangaProgressMutation(id)
                } else {
                    mutation = saveMangaProgressMutation({
                        id: id,
                        mediaId: Number(values['mediaId']),
                        status: status,
                        notes: values['notes'],
                        progress: Number(values['progress']),
                        progressVolumes: Number(values['progressVolumes']),
                        score: Number(values['score'])
                    })
                }

                console.log(JSON.stringify(mutation, null, 2))

                await this.requestManager.schedule(createRequestObject({
                    url: ANILIST_GRAPHQL_ENDPOINT,
                    method: 'POST',
                    data: mutation
                }), 1)
            },
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
                image: anilistManga.coverImage?.extraLarge ?? '',
                titles: [
                    anilistManga.title?.romaji,
                    anilistManga.title?.english,
                    anilistManga.title?.native
                ].filter(x => x != null) as string[],
                artist: anilistManga.staff?.edges?.find(x => x?.role?.toLowerCase() == 'art')?.node?.name?.full ?? 'Unknown',
                author: anilistManga.staff?.edges?.find(x => x?.role?.toLowerCase() == 'story')?.node?.name?.full ?? 'Unknown',
                desc: anilistManga.description,
                hentai: anilistManga.isAdult,
                
                rating: anilistManga.averageScore,
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
                            await this.accessToken.set(undefined)
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
                            await this.accessToken.set(token)
                        }
                    })
                ]
            }
        })
    }

    // @ts-ignore
    async processActionQueue(actionQueue: TrackedMangaChapterReadAction): Promise<void> {
        const chapterReadActions = await actionQueue.queuedChapterReadActions()

        for(const readAction of chapterReadActions) {
            try {
                const response = await this.requestManager.schedule(createRequestObject({
                    url: ANILIST_GRAPHQL_ENDPOINT,
                    method: 'POST',
                    data: saveMangaProgressMutation({
                        mediaId: readAction.mangaId,
                        progress: readAction.chapterNumber,
                        progressVolumes: readAction.volumeNumber
                    })
                }), 0)

                if(response.status < 400) {
                    await actionQueue.discardChapterReadAction(readAction)
                } else {
                    await actionQueue.retryChapterReadAction(readAction)
                }
            } catch(error) {
                console.log(error)
                await actionQueue.retryChapterReadAction(readAction)
            }
        }
    }


    scoreFormatLimit(format: AnilistUser.ScoreFormat): number | undefined {
        const extracted = /\d+/gi.exec(format)?.[0]
        return extracted != null ? Number(extracted) : undefined
    }
}

