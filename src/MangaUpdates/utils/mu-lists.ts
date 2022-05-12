import { Tracker } from 'paperback-extensions-common'

const logPrefix = 'mu-lists'

const MANGA_LIST_NAME = '#showList > .my-auto u'
const MANGA_PROGRESS_VOLUMES = '#chap-links a[title="Increment Volume"]'
const MANGA_PROGRESS_CHAPTERS = '#chap-links a[title="Increment Chapter"]'

const CUSTOM_LIST_NAMES = '#main_content form:last-child .lrow.col-3 input[type="text"]'

export const STANDARD_LISTS = [
    'NONE',
    'READING',
    'WISH',
    'COMPLETE',
    'UNFINISHED',
    'ON_HOLD',
] as const

export const STANDARD_LIST_NAMES = {
    NONE: 'None',
    READING: 'Reading List',
    WISH: 'Wish List',
    COMPLETE: 'Complete List',
    UNFINISHED: 'Unfinished List',
    ON_HOLD: 'On Hold List',
} as const

export const STANDARD_LIST_IDS = {
    NONE: '-1',
    READING: '0',
    WISH: '1',
    COMPLETE: '2',
    UNFINISHED: '3',
    ON_HOLD: '4',
} as const

interface ListInfo {
    listName: string;
    volumeProgress: number;
    chapterProgress: number;
}

type CheerioAPI = Tracker['cheerio']

export function getListInfo($: CheerioAPI, html: string, mangaId: string): ListInfo {
    const info: ListInfo = {
        listName: $(MANGA_LIST_NAME, html).text().trim() || STANDARD_LIST_NAMES.NONE,
        volumeProgress: parseInt($(MANGA_PROGRESS_VOLUMES, html).text().trim().slice(2)) || 0,
        chapterProgress: parseInt($(MANGA_PROGRESS_CHAPTERS, html).text().trim().slice(2)) || 0,
    }

    console.log(`${logPrefix} parsed list info (id=${mangaId}): ${JSON.stringify(info)}`)

    return info
}

export function getCustomLists($: CheerioAPI, html: string): {listId: string, listName: string}[] {
    const customLists: {listId: string, listName: string}[] = []

    $(CUSTOM_LIST_NAMES, html).map((i, item) => {
        const listIdString = $(item).attr('name') || ''
        const listIdMatches = /lists\[(\d+)\]\[title\]/.exec(listIdString)
        const listId = listIdMatches ? listIdMatches[1] : null

        const listName = $(item).attr('value')

        if (!listId || !listName) {
            console.log(`${logPrefix} failed to parse custom lists (idx=${i}): ${html}`)
            throw new Error('Failed to parse custom lists!')
        }

        customLists.push({ listId, listName })
    })

    return customLists
}
