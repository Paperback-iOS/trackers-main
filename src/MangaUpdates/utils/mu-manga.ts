import {
    Tracker,
    Manga,
} from 'paperback-extensions-common'

const logPrefix = '[mu-manga]'

const MANGA_TITLE_MAIN = '#main_content .tabletitle'
const MANGA_INFO_COLUMNS = '#main_content > .p-2:nth-child(2) > .row > .col-6'

const MANGA_CATEGORY_VOTE_ANCHOR = '#cat_opts a'

const IS_HENTAI_GENRE: Record<string, boolean> = {
    Adult: true,
    Hentai: true,
    Smut: true,
}

type CheerioAPI = Tracker['cheerio']

function getSectionContent($: CheerioAPI, html: string, title: string) {
    const columns = $(MANGA_INFO_COLUMNS, html)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isSectionHeader = (el: any) => !!el && $(el).hasClass('sCat')

    const debugSectionsFound: string[] = []

    const leftColSections = $(columns[0]).children()
    for (let i = 0; i < leftColSections.length - 1; i++) {
        if (isSectionHeader(leftColSections[i])) {
            const currTitle = $('b', leftColSections[i]).text().trim()
            debugSectionsFound.push(currTitle)
            if (currTitle === title) {
                return $(leftColSections[i + 1])
            }
        }
    }

    const rightColSections = $(columns[1]).children()
    for (let i = 0; i < rightColSections.length - 1; i++) {
        if (isSectionHeader(rightColSections[i])) {
            const currTitle = $('b', rightColSections[i]).text().trim()
            debugSectionsFound.push(currTitle)
            if (currTitle === title) {
                return $(rightColSections[i + 1])
            }
        }
    }

    console.log(`${logPrefix} failed to find section "${title}": ${JSON.stringify(debugSectionsFound)}`)
    throw new Error('Failed to find section content')
}

function getFirstLine(str: string): string {
    // find the first non-empty line in the string
    return str.trim().split('\n').map(line => line.trim()).find(line => line) || ''
}

function parseTitles($: CheerioAPI, html: string): string[] {
    const mainTitle = $(MANGA_TITLE_MAIN, html).text().trim()
    const altTitles = getSectionContent($, html, 'Associated Names')
        .text()
        .split('\n')
        .map(title => title.trim())
    return [mainTitle, ...altTitles].filter(title => title && title !== 'N/A')
}

function parseStatus($: CheerioAPI, html: string): string {
    // NOTE: There can be a decent amount of variation in the format here.
    //
    // Series with multiple seasons (e.g. manhwa) may have something like:
    //
    //   > 38 Chapters (Ongoing)
    //   >
    //   > S1: 38 Chapters (Complete) 1~38
    //   > S2: (TBA)
    //
    // Cancelled series can have something like:
    //
    //   > 4 Volumes (Incomplete due to the artist's death)
    //
    // Make sure to handle everything we reasonably can.
    const statusText = getFirstLine(getSectionContent($, html, 'Status in Country of Origin').text())
    const statusMatch = /\(([a-zA-Z]+)\)/.exec(statusText)
    const status = statusMatch ? statusMatch[1]?.toLowerCase() || '' : ''

    if (status.includes('incomplete') || status.includes('discontinued')) {
        return 'ABANDONED'
    }

    if (status.includes('hiatus')) {
        return 'HIATUS'
    }

    if (status.includes('ongoing')) {
        return 'ONGOING'
    }

    if (status.includes('complete')) {
        return 'COMPLETED'
    }

    return 'UNKNOWN'

}

function parseRating($: CheerioAPI, html: string): number | undefined {
    const ratingText = getFirstLine(getSectionContent($, html, 'User Rating').text())
    const ratingMatch = /([\d.]+)\s*\/\s*10\.0/.exec(ratingText)
    if (!ratingMatch) {
        return undefined
    }

    const rating = parseFloat(ratingMatch[1] || '')
    return isNaN(rating) ? undefined : rating
}

function parseGenres($: CheerioAPI, html: string): string[] {
    const genres: string[] = []
    getSectionContent($, html, 'Genre').find('a').map((_i, item) => {
        const href = $(item).attr('href') || ''
        if (/series.html\?.*act=genresearch/.exec(href)) {
            genres.push($(item).text().trim())
        }
    })
    return genres
}

export function getMangaInfo($: CheerioAPI, html: string, mangaId: string): Manga {
    const info: Manga = {
        titles: parseTitles($, html),
        image: getSectionContent($, html, 'Image').find('img').attr('src') || '',

        // Long descriptions are under a cut, but there's an ID we can use
        desc: $('#div_desc_more', html).text().trim() || getSectionContent($, html, 'Description').text(),

        author: getFirstLine(getSectionContent($, html, 'Author(s)').text()),
        artist: getFirstLine(getSectionContent($, html, 'Artist(s)').text()),

        // The type for `status` is lies - it actually expects the string name of the enum value
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        status: parseStatus($, html) as any,

        rating: parseRating($, html),
        hentai: parseGenres($, html).some(genre => IS_HENTAI_GENRE[genre]),
    }

    console.log(`${logPrefix} parsed manga (id=${mangaId}): ${JSON.stringify(info)}`)

    return info
}

export function getIdFromPage($: CheerioAPI, html: string, mangaId: string): string {
    const href = $(MANGA_CATEGORY_VOTE_ANCHOR, html).attr('href')
    if (!href) {
        throw new Error('unable to find ID')
    }

    const matches = /\.showCat\((\d+),/.exec(href)
    if (!matches) {
        throw new Error('unable to parse ID')
    }

    const canonicalId = matches[1]
    if (!canonicalId) {
        // should be impossible, but TS thinks the elements of a RegExpExecArray
        // are `string | undefined`
        throw new Error('empty ID')
    }

    console.log(`${logPrefix} found ID (id=${mangaId}): ${canonicalId}`)

    return canonicalId
}
