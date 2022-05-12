import type {
    Tracker,
    PagedResults,
    MangaTile,
} from 'paperback-extensions-common'

const logPrefix = '[mu-search]'

const SEARCH_RESULT_TILES = '#main_content > .p-2 > .row:first-of-type > .col-lg-6'
const SEARCH_RESULT_TILE_URL = '.col.text a[alt="Series Info"]'
const SEARCH_RESULT_TILE_IMAGE = 'img'

const NEXT_PAGE_LINK = '#main_content > .p-2 > .row:last-of-type > .p-1:first-of-type .justify-content-end a'

type CheerioAPI = Tracker['cheerio']

export interface SearchMetadata {
    nextPage?: number | null
}

export function parseSearchResults($: CheerioAPI, html: string): PagedResults {
    const results: MangaTile[] = []
    $(SEARCH_RESULT_TILES, html).map((i, tile) => {
        const urlAnchor = $(SEARCH_RESULT_TILE_URL, tile)

        const parsedResultUrl = /series\.html\?.*id=(\d+)/.exec(urlAnchor.attr('href') || '')
        if (!parsedResultUrl) {
            console.log(`${logPrefix} failed to parse serach result (idx=${i}): ${html}`)
            throw new Error('Failed to parse search results!')
        }

        const id = parsedResultUrl[1] || ''
        const title = urlAnchor.text()

        if (!id || !title) {
            console.log(`${logPrefix} failed to extract serach result values (idx=${i}): ${html}`)
            throw new Error('Failed to parse search results!')
        }

        // if the user isn't logged in, adult results won't have an image
        const image = $(SEARCH_RESULT_TILE_IMAGE, tile).attr('src') || ''

        results.push(createMangaTile({
            id,
            title: createIconText({ text: title }),
            image,
        }))
    })

    const nextPageUrl =  $(NEXT_PAGE_LINK, html).attr('href') || ''
    const parsedNextPageUrl = /series\.html\?.*page=(\d+)/.exec(nextPageUrl)
    const nextPage = parsedNextPageUrl ? Number(parsedNextPageUrl[0]) || null : null

    return createPagedResults({ results, metadata: { nextPage } })
}
