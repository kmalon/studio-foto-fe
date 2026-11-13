// SSR entry used only by scripts/prerender.mjs at build time (vite build --ssr).
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App.tsx'
import { HeadContext, headHtml, type HeadCollector } from './seo/head.ts'
import { BASE_PATH, ROUTER_BASENAME, SITE_URL, absUrl, pageUrl, structuredData } from './seo/site.ts'
import { DEFAULT_IMAGE } from './hooks/usePageMeta.ts'
import { photos, slides } from './data/portfolio.ts'
import { sessions } from './data/gallery.ts'
import aboutGrey from './assets/about/aml_grey.jpg'

export { SITE_URL }

/** Route path (without base) -> { app html, head html }. */
export const render = (path: string) => {
    const collector: HeadCollector = {}
    const html = renderToString(
        <StrictMode>
            <HeadContext.Provider value={collector}>
                <StaticRouter basename={ROUTER_BASENAME} location={`${BASE_PATH}${path}`}>
                    <App />
                </StaticRouter>
            </HeadContext.Provider>
        </StrictMode>,
    )
    if (!collector.meta) throw new Error(`prerender: ${path} did not call usePageMeta`)
    const jsonLd = JSON.stringify(structuredData(aboutGrey)).replace(/</g, '\\u003c')
    const head = [
        headHtml(collector.meta, collector.pathname ?? path, DEFAULT_IMAGE),
        `<script type="application/ld+json">${jsonLd}</script>`,
    ].join('\n    ')
    return { html, head }
}

type Page = { path: string; images: { src: string; alt: string }[] }

/** Every indexable page + the photos shown on it (image sitemap). */
export const pages: Page[] = [
    { path: '/', images: slides },
    { path: '/portfolio', images: photos },
    { path: '/galeria', images: sessions.map((s) => ({ src: s.photos[0].src, alt: s.title })) },
    ...sessions.map((s) => ({ path: `/galeria/${s.slug}`, images: s.photos })),
    { path: '/o-mnie', images: [{ src: aboutGrey, alt: 'Angelika Malon — fotograf ślubny z Warszawy' }] },
    { path: '/kontakt', images: [] },
]

/** Old English URLs -> new Polish ones (static redirect stubs). */
export const redirects: Record<string, string> = {
    '/about': '/o-mnie',
    '/contact': '/kontakt',
    '/gallery': '/galeria',
    ...Object.fromEntries(sessions.map((s) => [`/gallery/${s.folder}`, `/galeria/${s.slug}`])),
}

export { absUrl, pageUrl }
