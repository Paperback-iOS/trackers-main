/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
    ContentRating,
    Form,
    PagedResults,
    Request,
    Response,
    SearchRequest,
    Section,
    SourceInfo,
    TrackedManga,
    Tracker
} from 'paperback-extensions-common'
import { KomgaCommon } from './KomgaCommon'



export const KomgaInfo: SourceInfo = {
    name: 'Komga',
    author: 'Lemon',
    contentRating: ContentRating.EVERYONE,
    icon: 'icon.png',
    version: '1.0.1',
    description: 'Komga Tracker',
    authorWebsite: 'https://github.com/FramboisePi',
    websiteBaseURL: 'https://komga.org'
}

const PAGE_SIZE = 40

export class Komga extends Tracker {
    stateManager = createSourceStateManager({})

    async getAuthorizationString(): Promise<string>{
        const authorizationString = await this.stateManager.retrieve('authorization') as string
    
        if (authorizationString === null) {
            throw new Error('Unset credentials in source settings')
        }
        return authorizationString
    }
    
    async getKomgaAPI(): Promise<string>{
        const komgaAPI = await this.stateManager.retrieve('komgaAPI') as string
    
        if (komgaAPI === null) {
            throw new Error('Unset server URL in source settings')
        }
        return komgaAPI
    }

    requestManager = createRequestManager({
        requestsPerSecond: 5,
        requestTimeout: 20000,
        interceptor: {
            // Authorization injector
            interceptRequest: async (request: Request): Promise<Request> => {
                const authorizationString = await this.getAuthorizationString()
                request.headers = {
                    ...(request.headers ?? {}),
                    ...({
                        'content-type': 'application/json',
                        'accept': 'application/json',
                    }),
                    ...(authorizationString != null ? {
                        'authorization': authorizationString
                    } : {})
                }
                
                return request
            },
            interceptResponse: async (response: Response): Promise<Response> => {
                return response
            }
        }
    })
      
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    async getSearchResults(searchQuery: SearchRequest, metadata: any): Promise<PagedResults> {
        return KomgaCommon.searchRequest(searchQuery, metadata, this.requestManager, this.stateManager, PAGE_SIZE)
    }

    // @ts-ignore
    getMangaForm(mangaId: string): Form {
        return createForm({
            sections: async () => {
                return [
                    createSection({
                        id: 'mangaId',
                        rows: async () => [
                            createLabel({
                                id: 'id',
                                label: 'Manga id: ' + mangaId,
                                value: undefined
                            }),
                            createLabel({
                                id: 'info',
                                label: 'The app will sync read chapters to the Komga server',
                                value: undefined
                            })
                        ]
                    })
                ]
            },
            onSubmit: () => {
                return Promise.resolve()
            },
            validate: async () => true 
        })
    } 
    
    async getTrackedManga(mangaId: string): Promise<TrackedManga> {

        const komgaAPI = await this.getKomgaAPI()

        const request = createRequestObject({
            url: `${komgaAPI}/series/${mangaId}/`,
            method: 'GET',
        })

        const response = await this.requestManager.schedule(request, 1)
        const result = (typeof response.data) === 'string' ? JSON.parse(response.data) : response.data

        const metadata = result.metadata
        const booksMetadata = result.booksMetadata

        const authors: string[] = []
        const artists: string[] = []

        // Additional roles: colorist, inker, letterer, cover, editor
        for (const entry of booksMetadata.authors) {
            if (entry.role === 'writer') {
                authors.push(entry.name)
            }
            if (entry.role === 'penciller') {
                artists.push(entry.name)
            }
        }

        return createTrackedManga({
            id: mangaId,
            mangaInfo: createMangaInfo({
                image: `${komgaAPI}/series/${mangaId}/thumbnail`,
                titles: [metadata.title],
                artist: artists.join(', '),
                author: authors.join(', '),
                desc: (metadata.summary ? metadata.summary : booksMetadata.summary),
                hentai: false,
                
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                status: 'Reading',
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                banner: ''
            })
        })
    }

    async getSourceMenu(): Promise<Section> {
        return createSection({
            id: 'information',
            header: 'Informations',
            rows: async () => {
                return [
                    createMultilineLabel({
                        label: 'This tracker sync read chapters from the app to the Komga server.\nNote: only titles from the Komga source can be synced.',
                        value: '',
                        id: 'description'
                    }),
                    createLabel({
                        label: 'Use the source settings menu to set your server credentials.',
                        value: '',
                        id: 'settings'
                    })
                    
                ]
            }
        })
    }

    // @ts-ignore
    async processActionQueue(actionQueue: TrackedMangaChapterReadAction): Promise<void> {
        
        const chapterReadActions = await actionQueue.queuedChapterReadActions()

        const komgaAPI = await this.getKomgaAPI()

        for (const readAction of chapterReadActions) {

            if (readAction.sourceId != 'Komga') {
                console.log(`Manga ${readAction.mangaId} from source ${readAction.sourceId} can not be used as it does not come from Komga. Discarding`)
                await actionQueue.discardChapterReadAction(readAction)
            } else {
                try {
                    // The app only support completed read status so the last page read is not important and set to 1
                    const request = createRequestObject({
                        url: `${komgaAPI}/books/${readAction.sourceChapterId}/read-progress`,
                        method: 'PATCH',
                        data: {
                            'page': 1,
                            'completed': true
                        }
                    })
                  
                    const response = await this.requestManager.schedule(request, 1)
                  
                    if(response.status < 400) {
                        await actionQueue.discardChapterReadAction(readAction)
                    } else {
                        await actionQueue.retryChapterReadAction(readAction)
                    }
                } catch(error) {
                    console.log(`Tracker action for manga id ${readAction.mangaId} failed with error:`)
                    console.log(error)
                    await actionQueue.retryChapterReadAction(readAction)
                }
            }
        }
    }
}

