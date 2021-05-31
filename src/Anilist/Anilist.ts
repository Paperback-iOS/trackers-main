import { ContentRating, Form, FormRow, PagedResults, SearchRequest, Section, SourceInfo, TrackedManga, Tracker } from 'paperback-extensions-common'
import { GQL_GET_USER_PROFILE } from './models/graphql-queries'
import { AnilistUser } from './models/anilist-user'

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
    requestManager = createRequestManager({requestsPerSecond: 5, requestTimeout: 20000})
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
        get: async (): Promise<AnilistUser | undefined> => {
            return await this.stateManager.retrieve('userInfo')
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
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                data: {
                    query: GQL_GET_USER_PROFILE
                }
            }), 0)

            console.log(response.data)
            const json = typeof response.data == 'string' ? JSON.parse(response.data) : response.data
            const userInfo: AnilistUser | undefined = json['data']['Viewer']

            if(userInfo == null) { 
                console.log('Unable to fetch UserInfo')
                console.log(JSON.stringify(json['errors'], null, 2))
            }

            await this.stateManager.store('userInfo', userInfo)
        }
    }
    
    async setUserInfo(value: AnilistUser | undefined): Promise<void> {
        await this.stateManager.store('userInfo', value)
    }
    

    getSearchResults(_query: SearchRequest): Promise<PagedResults> {
        return Promise.resolve(createPagedResults({results: []}))
    }

    async getMangaForm(_mangaId: string): Promise<Form> {
        return createForm({
            sections: async () => [],
            onSubmit: async (_values) => { return },
            validate: async (_values) => true 
        })
    } 
    

    getTrackedManga(_mangaId: string): Promise<TrackedManga> {
        return Promise.resolve({
            id: '', mangaInfo: Object.create(null)
        })
    }

    async getSourceMenu(): Promise<Section> {
        return createSection({
            id: 'sourceMenu',
            header: 'Source Menu',
            rows: async () => {
                console.log('GETTING ROWS')
                const accessTokenIsValid = await this.accessToken.isValid()
                console.log('ACCESSTOKEN IS VALID: '  + accessTokenIsValid)
                if (accessTokenIsValid) return [
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
