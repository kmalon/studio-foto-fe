import { EMAIL } from '../data/AngelikaInfo.tsx'

/** Brand used in titles, footer, structured data. */
export const BRAND = 'Angelika Malon Fotografia'
export const PERSON = 'Angelika Malon'

/** Public origin + app base path (vite `base`) — absolute URLs for canonical/OG/sitemap. */
export const SITE_ORIGIN = 'https://kmalon.github.io'
export const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '')
export const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`

export const SOCIALS = {
    instagram: 'https://www.instagram.com/angelika.malon',
    facebook: 'https://www.facebook.com/Malonaangelika',
}

export const AREA_SERVED = ['Warszawa', 'województwo mazowieckie', 'Polska']

/** Logo served from public/ — stable (unhashed) URL for JSON-LD. */
export const LOGO_PATH = `${BASE_PATH}/logo.svg`

/** Route path ('/kontakt') -> canonical absolute URL with trailing slash (GH Pages serves dir/index.html). */
export const pageUrl = (path: string) => `${SITE_URL}${path.replace(/\/?$/, '/')}`

/** Asset URL ('/studio-foto-fe/assets/x.webp' or absolute) -> absolute URL. */
export const absUrl = (url: string) => (/^https?:/.test(url) ? url : `${SITE_ORIGIN}${url}`)

/** schema.org graph: ProfessionalService + Person, same on every page. */
export const structuredData = (image: string) => ({
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'ProfessionalService',
            '@id': `${SITE_URL}/#business`,
            name: BRAND,
            description:
                'Fotograf ślubny Warszawa — reportaż ślubny, sesje narzeczeńskie, rodzinne, ciążowe i portretowe.',
            url: `${SITE_URL}/`,
            logo: absUrl(LOGO_PATH),
            image: absUrl(image),
            email: EMAIL,
            areaServed: AREA_SERVED.map((name) => ({ '@type': 'Place', name })),
            address: { '@type': 'PostalAddress', addressLocality: 'Warszawa', addressCountry: 'PL' },
            sameAs: Object.values(SOCIALS),
            founder: { '@id': `${SITE_URL}/#person` },
        },
        {
            '@type': 'Person',
            '@id': `${SITE_URL}/#person`,
            name: PERSON,
            jobTitle: 'Fotograf',
            url: `${SITE_URL}/o-mnie/`,
            image: absUrl(image),
            email: EMAIL,
            worksFor: { '@id': `${SITE_URL}/#business` },
            sameAs: Object.values(SOCIALS),
        },
    ],
})
