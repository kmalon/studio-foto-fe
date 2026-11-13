/**
 * Internal link targets — always with a trailing slash: GitHub Pages serves
 * `<route>/index.html` and redirects slash-less URLs (301), canonical URLs end with `/`.
 */
export const ROUTES = {
    home: '/',
    portfolio: '/portfolio/',
    gallery: '/galeria/',
    about: '/o-mnie/',
    contact: '/kontakt/',
    privacy: '/polityka-prywatnosci/',
} as const

export const sessionPath = (slug: string) => `/galeria/${slug}/`
