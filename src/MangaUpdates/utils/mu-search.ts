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

        const parsedResultUrl = /series\/([A-Za-z0-9]+)\//.exec(urlAnchor.attr('href') || '')
        if (!parsedResultUrl) {
            console.log(`${logPrefix} failed to parse serach result (idx=${i}): ${html}`)
            throw new Error('Failed to parse search results!')
        }

        const base36Id = parsedResultUrl[1] || ''
        const id = parseInt(base36Id, 36)
        const title = urlAnchor.text()

        if (!base36Id || isNaN(id) || !title) {
            console.log(`${logPrefix} failed to extract serach result values (idx=${i}): ${html}`)
            throw new Error('Failed to parse search results!')
        }

        // if the user isn't logged in, adult results won't have an image
        const image = $(SEARCH_RESULT_TILE_IMAGE, tile).attr('src') || ''

        console.log(`${logPrefix} result ${i}: [${base36Id}->${id}] ${title} (${image})`)
        results.push(createMangaTile({
            id: String(id),
            title: createIconText({ text: title }),
            image,
        }))
    })

    const nextPageUrl =  $(NEXT_PAGE_LINK, html).attr('href') || ''
    const parsedNextPageUrl = /series\.html\?.*page=(\d+)/.exec(nextPageUrl)
    const nextPage = parsedNextPageUrl ? Number(parsedNextPageUrl[0]) || null : null
    console.log(`${logPrefix} results parsed (nextPage=${nextPage || '<null>'})`)

    return createPagedResults({ results, metadata: { nextPage } })
}
