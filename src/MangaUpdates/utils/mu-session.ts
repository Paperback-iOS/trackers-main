// import { CookieJar } from 'tough-cookie'
import type {
    SourceStateManager,
    Tracker,
    Cookie
} from 'paperback-extensions-common'

const logPrefix = '[mu-session]'

const STATE_MU_CREDENTIALS = 'mu_credentials'
const STATE_MU_COOKIES = 'mu_cookies'

const USER_PROFILE_IMAGE = '#main_content img[name="avimage"]'

const FALLBACK_IMAGE = 'https://cdn.mangaupdates.com/avatar/a0.gif'

export interface Credentials {
    username: string
    password: string
}

interface RawCookie {
    name: string;
    value: string;
    domain: string;
    path?: string;
    created?: number;
    expires?: number;
}

type CheerioAPI = Tracker['cheerio']

function isOptionalString(val: unknown): val is string | undefined {
    return val == null || typeof val === 'string'
}

function isOptionalNumber(val: unknown): val is number | undefined {
    return val == null || (typeof val === 'number' && !Number.isNaN(val))
}

export function validateCredentials(credentials: unknown): credentials is Credentials {
    return (
        credentials != null
        && typeof credentials === 'object'
        && typeof (credentials as Credentials).username === 'string'
        && typeof (credentials as Credentials).password === 'string'
    )
}

export async function getUserCredentials(stateManager: SourceStateManager): Promise<Credentials | undefined> {
    const credentialsString = await stateManager.keychain.retrieve(STATE_MU_CREDENTIALS)
    if (typeof credentialsString !== 'string') {
        return undefined
    }

    const credentials = JSON.parse(credentialsString)
    if (!validateCredentials(credentials)) {
        console.log(`${logPrefix} store contains invalid credentials!`)
        return undefined
    }

    return credentials
}

export async function setUserCredentials(stateManager: SourceStateManager, credentials: Credentials): Promise<void> {
    if (!validateCredentials(credentials)) {
        console.log(`${logPrefix} tried to store invalid mu_credentials: ${JSON.stringify(credentials)}`)
        throw new Error('tried to store invalid mu_credentials')
    }

    await stateManager.keychain.store(STATE_MU_CREDENTIALS, JSON.stringify(credentials))
}

export async function clearUserCredentials(stateManager: SourceStateManager): Promise<void> {
    console.log(`${logPrefix} logout starts`)
    await stateManager.keychain.store(STATE_MU_CREDENTIALS, undefined)
    console.log(`${logPrefix} logout complete`)
}

function validateRawCookie(rawCookie: unknown): rawCookie is RawCookie {
    return (
        rawCookie != null
        && typeof rawCookie === 'object'
        && typeof (rawCookie as Cookie).domain === 'string'
        && typeof (rawCookie as Cookie).name === 'string'
        && typeof (rawCookie as Cookie).value === 'string'
        && isOptionalString((rawCookie as Cookie).path)
        && isOptionalNumber((rawCookie as Cookie).created)
        && isOptionalNumber((rawCookie as Cookie).expires)
    )
}

function serializeCookie(cookie: Cookie): RawCookie {
    const rawCookie: RawCookie = {
        domain: cookie.domain,
        name: cookie.name,
        value: cookie.value,
    }

    if (cookie.path) {
        rawCookie.path = cookie.path
    }

    if (cookie.created) {
        rawCookie.created = cookie.created.getTime()
    }

    if (cookie.expires) {
        rawCookie.expires = cookie.expires.getTime()
    }

    return rawCookie
}

function deserializeCookie(rawCookie: RawCookie): Cookie {
    const cookieInfo: Cookie = {
        domain: rawCookie.domain,
        name: rawCookie.name,
        value: rawCookie.value,
    }

    if (rawCookie.path) {
        cookieInfo.path = rawCookie.path
    }

    if (rawCookie.created) {
        cookieInfo.created = new Date(rawCookie.created)
    }

    if (rawCookie.expires) {
        cookieInfo.expires = new Date(rawCookie.expires)
    }

    return createCookie(cookieInfo)
}

async function getRawCookies(stateManager: SourceStateManager): Promise<RawCookie[]> {
    const cookiesString = await stateManager.keychain.retrieve(STATE_MU_COOKIES)
    if (typeof cookiesString !== 'string') {
        return []
    }

    const rawCookies = JSON.parse(cookiesString)
    if (!Array.isArray(rawCookies)) {
        return []
    }

    const validRawCookies = rawCookies.filter(rawCookie => validateRawCookie(rawCookie))
    if (validRawCookies.length < rawCookies.length) {
        console.log(`${logPrefix} store contains invalid cookies!`)
    }

    return validRawCookies
}

// Currently I only make requests to `www.mangaupdates.com`. If I add requests
// to _other_ domains in future, this will need to filter the cookies by request
// domain.
export async function getCookies(stateManager: SourceStateManager): Promise<Cookie[]> {
    const rawCookies = await getRawCookies(stateManager)
    return rawCookies.map(deserializeCookie)
}

export async function addCookies(stateManager: SourceStateManager, cookies: Cookie[]): Promise<void> {
    if (cookies.length === 0) {
        // nothing to do
        return
    }

    const oldCookies = await getRawCookies(stateManager)
    const newCookies = cookies.map(cookie => serializeCookie(cookie))

    const mergedCookies: Record<string, RawCookie> = {}
    for (const cookie of oldCookies) {
        const key = `${cookie.domain}|${cookie.name}`
        if (mergedCookies[key]) {
            console.log(`${logPrefix} found unexpected duplicate in oldCookies!`)
        }
        mergedCookies[key] = cookie
    }
    for (const cookie of newCookies) {
        const key = `${cookie.domain}|${cookie.name}`
        mergedCookies[key] = cookie
    }

    const cookiesToStore = Object.values(mergedCookies)


    // paranoid sanity check
    if (cookiesToStore.some(rawCookie => !validateRawCookie(rawCookie))) {
        console.log(`${logPrefix} tried to store invalid mu_cookies: ${JSON.stringify(cookiesToStore)}`)
        throw new Error('tried to store invalid mu_cookies')
    }

    await stateManager.keychain.store(STATE_MU_COOKIES, JSON.stringify(cookiesToStore))
}

export async function clearCookies(stateManager: SourceStateManager): Promise<void> {
    await stateManager.keychain.store(STATE_MU_COOKIES, undefined)
}

export function getUserProfileImage($: CheerioAPI, html: string): string {
    return $(USER_PROFILE_IMAGE, html).attr('src') ||  FALLBACK_IMAGE
}
