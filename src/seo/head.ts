import { createContext } from 'react'
import { BRAND, absUrl, pageUrl } from './site.ts'

export type PageMeta = {
    /** Full document title. */
    title: string
    description: string
    /** OG/Twitter image (asset URL); falls back to the default share image. */
    image?: string
    noindex?: boolean
}

/** Server-side collector: the page's usePageMeta writes here during renderToString. */
export type HeadCollector = { meta?: PageMeta; pathname?: string }
export const HeadContext = createContext<HeadCollector | null>(null)

type Tag =
    | { kind: 'meta'; key: 'name' | 'property'; id: string; content: string }
    | { kind: 'link'; rel: string; href: string }

/** All per-page head tags (besides <title>) — single source for prerender and client updates. */
export const headTags = (meta: PageMeta, pathname: string, fallbackImage: string): Tag[] => {
    const url = pageUrl(pathname)
    const image = absUrl(meta.image ?? fallbackImage)
    const tags: Tag[] = [
        { kind: 'meta', key: 'name', id: 'description', content: meta.description },
        { kind: 'meta', key: 'name', id: 'robots', content: meta.noindex ? 'noindex' : 'index, follow' },
        { kind: 'link', rel: 'canonical', href: url },
        { kind: 'meta', key: 'property', id: 'og:type', content: 'website' },
        { kind: 'meta', key: 'property', id: 'og:locale', content: 'pl_PL' },
        { kind: 'meta', key: 'property', id: 'og:site_name', content: BRAND },
        { kind: 'meta', key: 'property', id: 'og:title', content: meta.title },
        { kind: 'meta', key: 'property', id: 'og:description', content: meta.description },
        { kind: 'meta', key: 'property', id: 'og:url', content: url },
        { kind: 'meta', key: 'property', id: 'og:image', content: image },
        { kind: 'meta', key: 'name', id: 'twitter:card', content: 'summary_large_image' },
        { kind: 'meta', key: 'name', id: 'twitter:title', content: meta.title },
        { kind: 'meta', key: 'name', id: 'twitter:description', content: meta.description },
        { kind: 'meta', key: 'name', id: 'twitter:image', content: image },
    ]
    return tags
}

const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Prerender: tags as an HTML string for <head>. */
export const headHtml = (meta: PageMeta, pathname: string, fallbackImage: string) =>
    [
        `<title>${esc(meta.title)}</title>`,
        ...headTags(meta, pathname, fallbackImage).map((t) =>
            t.kind === 'meta'
                ? `<meta ${t.key}="${t.id}" content="${esc(t.content)}" />`
                : `<link rel="${t.rel}" href="${esc(t.href)}" />`,
        ),
    ].join('\n    ')

/** Client: create or update each tag in document.head (never duplicates). */
export const applyHead = (meta: PageMeta, pathname: string, fallbackImage: string) => {
    document.title = meta.title
    for (const t of headTags(meta, pathname, fallbackImage)) {
        const selector =
            t.kind === 'meta' ? `meta[${t.key}="${t.id}"]` : `link[rel="${t.rel}"]`
        let el = document.head.querySelector(selector)
        if (!el) {
            el = document.createElement(t.kind)
            if (t.kind === 'meta') el.setAttribute(t.key, t.id)
            else el.setAttribute('rel', t.rel)
            document.head.appendChild(el)
        }
        if (t.kind === 'meta') el.setAttribute('content', t.content)
        else el.setAttribute('href', t.href)
    }
}
