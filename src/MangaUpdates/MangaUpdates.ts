import {
    ContentRating,
    SourceInfo,
    Tracker,
    TrackedManga,
    Form,
    Section,
    SearchRequest,
    PagedResults,
    TrackerActionQueue,
    Cookie,
} from 'paperback-extensions-common'

import * as sessionUtils from './utils/mu-session'
import * as searchUtils from './utils/mu-search'
import * as mangaUtils from './utils/mu-manga'
import * as listUtils from './utils/mu-lists'

interface MangaFormValues {
    mangaId: string;
    mangaTitle: string;
    mangaRating: string;
    mangaStatus: string;
    mangaIsAdult: string;

    listId: [string];

    chapterProgress: number;
    volumeProgress: number;
}


export const MangaUpdatesInfo: SourceInfo = {
    name: 'MangaUpdates',
    author: 'IntermittentlyRupert',
    contentRating: ContentRating.EVERYONE,
    icon: 'icon.png',
    version: '1.0.0',
    description: 'MangaUpdates Tracker',
    websiteBaseURL: 'https://www.mangaupdates.com',
}

export class MangaUpdates extends Tracker {
    stateManager = createSourceStateManager({});
    requestManager = createRequestManager({
        requestsPerSecond: 2.5,
        requestTimeout: 20000,
        interceptor: {
            interceptRequest: async (request) => {
                request.cookies = await sessionUtils.getCookies(this.stateManager)
                return request
            },
            interceptResponse: async (response) => {
                // NOTE: depends on Paperback 0.7-r36 (currently still in dev)
                // TODO: clean this up once new paperback-extensions-common is released
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const cookies: Cookie[] = (this.requestManager as any).cookieStore.getAllCookies()
                await sessionUtils.addCookies(this.stateManager, cookies)
                return response
            },
        },
    });

    ////////////////////
    // Public API
    ////////////////////

    async getTrackedManga(mangaId: string): Promise<TrackedManga> {
        const logPrefix = '[getTrackedManga]'
        console.log(`${logPrefix} starts`)
        try {
            console.log(`${logPrefix} loading id=${mangaId}`)
            const html = await this.loadMangaPage(mangaId)
            const info = mangaUtils.getMangaInfo(this.cheerio, html, mangaId)
            console.log(`${logPrefix} complete`)
            return createTrackedManga({ id: mangaId, mangaInfo: createMangaInfo(info) })
        } catch (e) {
            console.log(`${logPrefix} error`)
            console.log(e)
            throw e
        }
    }

    getMangaForm(mangaId: string): Form {
        return createForm({
            sections: async () => {
                const username = (await sessionUtils.getUserCredentials(this.stateManager))?.username
                if (!username) {
                    return [
                        createSection({
                            id: 'notLoggedInSection',
                            rows: () => Promise.resolve([
                                createLabel({
                                    id: 'notLoggedIn',
                                    label: 'Not Logged In',
                                    value: undefined
                                })
                            ])
                        })
                    ]
                }

                const [avatarUrl, lists, mangaPage] = await Promise.all([
                    this.getLoggedInUserAvatarUrl(),
                    this.getLists(),
                    this.loadMangaPage(mangaId),

                ])
                const info = mangaUtils.getMangaInfo(this.cheerio, mangaPage, mangaId)
                const status = listUtils.getListInfo(this.cheerio, mangaPage, mangaId)

                const listId = lists.find(list => list.listName === status.listName)?.listId
                if (!listId) {
                    console.log(`[getMangaForm] unable to find list: ${JSON.stringify({ info, status, lists })}}`)
                    throw new Error('Unknown manga list!')
                }

                const listNamesById = Object.fromEntries(
                    lists.map(list => [list.listId, list.listName])
                )

                return [
                    createSection({
                        id: 'userInfo',
                        rows: () => Promise.resolve([
                            createHeader({
                                id: 'header',
                                imageUrl: avatarUrl,
                                title: username,
                                subtitle: '',
                                value: undefined
                            })
                        ])
                    }),
                    createSection({
                        id: 'information',
                        header: 'Information',
                        rows: () => Promise.resolve([
                            createLabel({
                                id: 'mangaId',
                                label: 'Manga ID',
                                value: mangaId,
                            }),

                            createLabel({
                                id: 'mangaTitle',
                                label: 'Title',
                                value: info.titles[0],
                            }),
                            createLabel({
                                id: 'mangaRating',
                                value: info.rating?.toString() ?? 'N/A',
                                label: 'Rating'
                            }),
                            createLabel({
                                id: 'mangaStatus',
                                value: info.status.toString(),
                                label: 'Status'
                            }),
                            createLabel({
                                id: 'mangaIsAdult',
                                value: info.hentai?.toString() ?? 'N/A',
                                label: 'Is Adult'
                            })
                        ])
                    }),
                    createSection({
                        id: 'trackList',
                        header: 'Manga List',
                        footer: 'Warning: Setting this to "None" will delete the listing from MangaUpdates',
                        rows: () => Promise.resolve([
                            createSelect({
                                id: 'listId',
                                value: [listId],
                                allowsMultiselect: false,
                                label: 'List',
                                displayLabel: (value) => listNamesById[value] || '<unknown list>',
                                options: lists.map(list => list.listId)
                            })
                        ])
                    }),
                    createSection({
                        id: 'manage',
                        header: 'Progress',
                        rows: () => Promise.resolve([
                            createStepper({
                                id: 'chapterProgress',
                                label: 'Chapter',
                                value: status.chapterProgress,
                                min: 0,
                                step: 1
                            }),
                            createStepper({
                                id: 'volumeProgress',
                                label: 'Volume',
                                value: status.volumeProgress,
                                min: 0,
                                step: 1
                            })
                        ])
                    }),
                ]
            },
            onSubmit: (values) => this.handleMangaFormChanges(values),
            validate: () => Promise.resolve(true)
        })
    }

    async getSourceMenu(): Promise<Section> {
        return createSection({
            id: 'sourceMenu',
            header: 'Source Menu',
            rows: async () => {
                const username = (await sessionUtils.getUserCredentials(this.stateManager))?.username
                if (username) {
                    return [
                        createLabel({
                            id: 'userInfo',
                            label: 'Logged-in as',
                            value: username,
                        }),
                        createButton({
                            id: 'refresh',
                            label: 'Refresh session',
                            value: undefined,
                            onTap: () => this.refreshSession(),
                        }),
                        createButton({
                            id: 'logout',
                            label: 'Logout',
                            value: undefined,
                            onTap: () => this.logout(),
                        }),
                    ]
                }

                return [
                    createNavigationButton({
                        id: 'loginButton',
                        label: 'Login',
                        value: undefined,
                        form: createForm({
                            sections: () => Promise.resolve([
                                createSection({
                                    id: 'username_section',
                                    header: 'Username',
                                    footer: 'Enter your MangaUpdates account username',
                                    rows: () =>
                                        Promise.resolve([
                                            createInputField({
                                                id: 'username',
                                                placeholder: 'Username',
                                                value: '',
                                                maskInput: false,
                                            }),
                                        ]),
                                }),
                                createSection({
                                    id: 'password_section',
                                    header: 'Password',
                                    footer: 'Enter the password associated with your MangaUpdates account Username',
                                    rows: () => Promise.resolve([
                                        createInputField({
                                            id: 'password',
                                            placeholder: 'Password',
                                            value: '',
                                            maskInput: true,
                                        }),
                                    ]),
                                }),
                            ]),
                            onSubmit: (values) => this.login(values),
                            validate: () => Promise.resolve(true),
                        }),
                    }),
                ]
            },
        })
    }

    async getSearchResults(query: SearchRequest, metadata: searchUtils.SearchMetadata | undefined): Promise<PagedResults> {
        const logPrefix = '[getSearchResults]'
        console.log(`${logPrefix} starts`)
        try {
            const search = query.title || ''
            const page = metadata?.nextPage || 1

            // MangaUpdates will return an error for empty search strings
            if (!search) {
                console.log(`${logPrefix} ignoring empty search`)
                return createPagedResults({ results: [], metadata: { nextPage: null } })
            }


            console.log(`${logPrefix} searching for "${search}" (page=${page})`)
            const response = await this.requestManager.schedule(
                createRequestObject({
                    url: `https://www.mangaupdates.com/series.html?search=${encodeURIComponent(search)}&page=${encodeURIComponent(page)}`,
                    method: 'GET',
                }),
                1
            )

            if (response.status > 299) {
                console.log(`${logPrefix} failed (${response.status}): ${response.data}`)
                throw new Error('Search request failed!')
            }

            const results = searchUtils.parseSearchResults(this.cheerio, response.data)

            console.log(`${logPrefix} complete`)
            return results
        } catch (e) {
            console.log(`${logPrefix} error`)
            console.log(e)
            throw e
        }
    }

    async processActionQueue(actionQueue: TrackerActionQueue): Promise<void> {
        const logPrefix = '[processActionQueue]'
        console.log(`${logPrefix} starts`)

        const chapterReadActions = await actionQueue.queuedChapterReadActions()
        console.log(`${logPrefix} found ${chapterReadActions.length} action(s)`)
        for (const action of chapterReadActions) {
            const params = {
                mangaId: action.mangaId,
                volumeProgress: Math.floor(action.volumeNumber) || 1,
                chapterProgress: Math.floor(action.chapterNumber),
            }
            console.log(`${logPrefix} processing action: ${JSON.stringify(params)}`)

            // If we're tracking the manga but it isn't on any list, then the
            // progress update will do nothing. Make sure it's on a list.
            //
            // Don't bother to fail the entire action if this fails. In most
            // cases the manga will already be on a list and I'd rather have
            // the happy-path be more reliable.
            try {
                const html = await this.loadMangaPage(action.mangaId)
                const list = listUtils.getListInfo(this.cheerio, html, action.mangaId)
                if (list.listName === listUtils.STANDARD_LIST_NAMES.NONE) {
                    console.log(`${logPrefix} manga is not in a list - adding to Reading List`)
                    await this.setMangaList({
                        mangaId: action.mangaId,
                        listId: listUtils.STANDARD_LIST_IDS.READING,
                    })
                }
            } catch (e) {
                console.log(`${logPrefix} list check failed`)
                console.log(e)
            }

            try {
                await this.setMangaProgress(params)
                await actionQueue.discardChapterReadAction(action)
            } catch (e) {
                console.log(`${logPrefix} progress update failed`)
                console.log(e)
                await actionQueue.retryChapterReadAction(action)
            }
        }

        console.log(`${logPrefix} complete`)
    }

    ////////////////////
    // Session Management
    ////////////////////

    private async login(credentials: sessionUtils.Credentials): Promise<void> {
        const logPrefix = '[login]'
        console.log(`${logPrefix} starts`)

        if (!sessionUtils.validateCredentials(credentials)) {
            console.error(`${logPrefix} tried to store invalid mu_credentials: ${JSON.stringify(credentials)}`)
            throw new Error('Must provide a username and password!')
        }

        try {
            const username = encodeURIComponent(credentials.username)
            const password = encodeURIComponent(credentials.password)

            const loginResponse = await this.requestManager.schedule(
                createRequestObject({
                    url: 'https://www.mangaupdates.com/login.html',
                    method: 'POST',
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    data: `act=login&username=${username}&password=${password}`,
                }),
                0
            )
            if (loginResponse.status > 299) {
                console.log(`${logPrefix} login error (${loginResponse.status}): ${loginResponse.data}`)
                throw new Error('Incorrect username/password!')
            }

            // Sanity check to make sure the cookies actually work
            const userProfileResponse = await this.requestManager.schedule(
                createRequestObject({
                    url: 'https://www.mangaupdates.com/submit.html',
                    method: 'GET',
                }),
                0
            )
            if (userProfileResponse.status > 299 || !userProfileResponse.data.includes(`Welcome back, ${credentials.username}`)) {
                console.log(`${logPrefix} profile check failed (${userProfileResponse.status}): ${userProfileResponse.data}`)
                throw new Error('Incorrect username/password!')
            }

            await sessionUtils.setUserCredentials(this.stateManager, credentials)
        } catch (e) {
            console.log(`${logPrefix} failed to log in`)
            console.log(e)
            throw new Error('Login failed!')
        }
        console.log(`${logPrefix} complete`)
    }

    private async refreshSession(): Promise<void> {
        const logPrefix = '[refreshSession]'
        console.log(`${logPrefix} starts`)

        const credentials = await sessionUtils.getUserCredentials(this.stateManager)
        if (!credentials) {
            console.log(`${logPrefix} no credentials available, unable to refresh`)
            throw new Error('Could not find login credentials!')
        }

        await this.logout()
        await this.login(credentials)

        console.log(`${logPrefix} complete`)
    }

    private async logout(): Promise<void> {
        await Promise.all([
            sessionUtils.clearUserCredentials(this.stateManager),
            sessionUtils.clearCookies(this.stateManager),
        ])
    }

    private async getLoggedInUserAvatarUrl(): Promise<string> {
        const response = await this.requestManager.schedule(
            createRequestObject({
                url: 'https://www.mangaupdates.com/submit.html?act=edit_profile',
                method: 'GET',
            }),
            1
        )

        // not worth throwing here - we'll just return the fallback image
        if (response.status > 299) {
            console.log(`[getLoggedInUserAvatarUrl] failed (${response.status}): ${response.data}`)
        }

        return sessionUtils.getUserProfileImage(this.cheerio, response.data)
    }

    ////////////////////
    // List Management
    ////////////////////

    private async handleMangaFormChanges(values: MangaFormValues): Promise<void> {
        const logPrefix = '[handleMangaFormChanges]'
        console.log(`${logPrefix} starts: ${JSON.stringify(values)}`)

        // These requests are all idempotent, so it's fairly safe for us to make
        // them unconditionally. If somebody makes a change via the website
        // between when they load the form and when they submit it, then I'll
        // clobber that change, but also don't do silly things like that.
        try {
            const actions: Promise<void>[] = [
                this.setMangaList({
                    mangaId: values.mangaId,
                    listId: values.listId[0]
                }),
            ]

            if (values.listId[0] !== listUtils.STANDARD_LIST_IDS.NONE) {
                actions.push(
                    this.setMangaProgress({
                        mangaId: values.mangaId,
                        volumeProgress: values.volumeProgress,
                        chapterProgress: values.chapterProgress,
                    }),
                )
            }

            await Promise.all(actions)
        } catch (e) {
            console.log(`${logPrefix} failed`)
            console.log(e)
            throw e
        }

        console.log(`${logPrefix} complete`)
    }

    private async setMangaList(params: { mangaId: string, listId: string }): Promise<void> {
        const logPrefix = '[setMangaList]'
        console.log(`${logPrefix} starts: ${JSON.stringify(params)}`)

        const query = [
            `s=${encodeURIComponent(params.mangaId)}`,
            `l=${encodeURIComponent(params.listId)}`,
            `cache_j=${Math.floor(100000000 * Math.random())},${Math.floor(100000000 * Math.random())},${Math.floor(100000000 * Math.random())}`
        ]

        if (params.listId === listUtils.STANDARD_LIST_IDS.NONE) {
            // deletion flag
            query.push('r=1')
        }

        const response = await this.requestManager.schedule(
            createRequestObject({
                url: `https://www.mangaupdates.com/ajax/list_update.php?${query.join('&')}`,
                method: 'GET',
            }),
            1
        )

        if (response.status > 299) {
            console.log(`${logPrefix} failed (${response.status}): ${response.data}`)
            throw new Error('Manga list update failed!')
        }

        console.log(`${logPrefix} complete`)
    }

    private async setMangaProgress(params: { mangaId: string, volumeProgress: number, chapterProgress: number  }): Promise<void> {
        const logPrefix = '[setMangaProgress]'
        console.log(`${logPrefix} starts: ${JSON.stringify(params)}`)

        const query = [
            'ver=2',
            `s=${encodeURIComponent(params.mangaId)}`,
            `set_v=${encodeURIComponent(params.volumeProgress)}`,
            `set_c=${encodeURIComponent(params.chapterProgress)}`,
            `cache_j=${Math.floor(100000000 * Math.random())},${Math.floor(100000000 * Math.random())},${Math.floor(100000000 * Math.random())}`

            // MangaUpdates sends this, but it doesn't seem to be necessary...
            // `lid=${encodeURIComponent(params.listId)}`,
        ]

        const response = await this.requestManager.schedule(
            createRequestObject({
                url: `https://www.mangaupdates.com/ajax/chap_update.php?${query.join('&')}`,
                method: 'GET',
            }),
            1
        )

        if (response.status > 299) {
            console.log(`${logPrefix} failed (${response.status}): ${response.data}`)
            throw new Error('Manga progress update failed!')
        }

        console.log(`${logPrefix} complete`)
    }

    ////////////////////
    // Other Data Fetching
    ////////////////////

    private async loadMangaPage(mangaId: string): Promise<string> {
        const response = await this.requestManager.schedule(
            createRequestObject({
                url: `https://www.mangaupdates.com/series.html?id=${encodeURIComponent(mangaId)}`,
                method: 'GET',
            }),
            1
        )

        if (response.status > 299) {
            console.log(`[loadMangaInfo] failed (${response.status}): ${response.data}`)
            throw new Error('Manga request failed!')
        }

        return response.data
    }

    private async getLists(): Promise<{listId: string, listName: string}[]> {
        const standardLists = listUtils.STANDARD_LISTS.map((list) => ({
            listId: listUtils.STANDARD_LIST_IDS[list],
            listName: listUtils.STANDARD_LIST_NAMES[list]
        }))

        const customListsResponse = await this.requestManager.schedule(
            createRequestObject({
                url: 'https://www.mangaupdates.com/mylist.html?act=edit',
                method: 'GET',
            }),
            1
        )

        if (customListsResponse.status > 299) {
            console.log(`[getLists] failed (${customListsResponse.status}): ${customListsResponse.data}`)
            throw new Error('Custom lists request failed!')
        }

        const customLists = listUtils.getCustomLists(this.cheerio, customListsResponse.data)

        return [...standardLists, ...customLists]
    }
}
