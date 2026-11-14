import { GA_ID } from '../seo/site.ts'

/**
 * Google Analytics 4 with prior opt-in consent (GDPR / PL law):
 * gtag.js is NOT requested and no cookies are set until the visitor accepts.
 * Consent Mode v2: everything denied by default, only analytics_storage granted on accept.
 */

export type Consent = 'granted' | 'denied'

const STORAGE_KEY = 'cookie-consent'

declare global {
    interface Window {
        dataLayer?: unknown[]
        gtag?: (...args: unknown[]) => void
    }
}

let consent: Consent | null = null
let consentRead = false
let bannerOpen = false
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())

export const subscribe = (listener: () => void) => {
    listeners.add(listener)
    return () => {
        listeners.delete(listener)
    }
}

export const getConsent = (): Consent | null => {
    if (!consentRead && typeof window !== 'undefined') {
        consentRead = true
        try {
            const v = window.localStorage.getItem(STORAGE_KEY)
            consent = v === 'granted' || v === 'denied' ? v : null
        } catch {
            consent = null
        }
    }
    return consent
}

export const setConsent = (value: Consent) => {
    consent = value
    consentRead = true
    bannerOpen = false
    try {
        window.localStorage.setItem(STORAGE_KEY, value)
    } catch {
        // storage blocked: choice holds for this visit only
    }
    if (value === 'granted') loadGa()
    else revokeGa()
    notify()
}

/** Banner visible: analytics configured and (no choice yet or reopened from footer/privacy page). */
export const isBannerOpen = () => Boolean(GA_ID) && (bannerOpen || getConsent() === null)

export const openBanner = () => {
    bannerOpen = true
    notify()
}

let loaded = false

// gtag.js expects the `arguments` object pushed, not an array -> classic function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function gtag(..._args: unknown[]) {
    window.dataLayer = window.dataLayer ?? []
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments)
}

export const loadGa = () => {
    if (!GA_ID || typeof window === 'undefined') return
    if (loaded) {
        window.gtag?.('consent', 'update', { analytics_storage: 'granted' })
        return
    }
    loaded = true
    window.gtag = gtag
    gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'granted',
    })
    gtag('js', new Date())
    gtag('config', GA_ID, { send_page_view: false })
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`
    document.head.appendChild(s)
}

/** Withdrawn consent: stop collection, drop GA cookies. */
const revokeGa = () => {
    if (loaded) window.gtag?.('consent', 'update', { analytics_storage: 'denied' })
    document.cookie.split(';').forEach((c) => {
        const name = c.split('=')[0].trim()
        if (name === '_ga' || name.startsWith('_ga_')) {
            const expire = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
            document.cookie = expire
            document.cookie = `${expire}; domain=${location.hostname}`
            document.cookie = `${expire}; domain=.${location.hostname}`
        }
    })
}

export const trackPage = (path: string, title: string) => {
    if (!loaded || getConsent() !== 'granted') return
    window.gtag?.('event', 'page_view', {
        page_path: path,
        page_location: window.location.href,
        page_title: title,
    })
}
