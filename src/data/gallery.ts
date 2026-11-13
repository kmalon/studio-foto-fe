import type { Photo } from './portfolio.ts'
import altText from './altText.ts'

export type Session = {
    /** URL slug: folder name without number prefix, hyphens, no diacritics ('2_sesja_slubna' -> 'sesja-slubna'). */
    slug: string
    /** Folder name in assets/gallery (number prefix = order). */
    folder: string
    /** First overview line, e.g. 'Sesja ślubna'. */
    title: string
    /** Second overview line (meta description source). */
    description?: string
    /** Gallery page card image: first thumbial, falls back to first full. */
    cover: string
    /** Raw content of overview.md (rendered as markdown). */
    overview: string
    photos: Photo[]
}

const fullImages = import.meta.glob<string>('../assets/gallery/*/full/*.{jpg,jpeg,png,webp}', {
    eager: true,
    import: 'default',
})
const thumbImages = import.meta.glob<string>(
    '../assets/gallery/*/thumbial/*.{jpg,jpeg,png,webp}',
    { eager: true, import: 'default' },
)
const overviews = import.meta.glob<string>('../assets/gallery/*/overview.md', {
    eager: true,
    query: '?raw',
    import: 'default',
})

/** '../assets/gallery/<folder>/<sub>/<file>' -> [folder, file] */
const parse = (path: string) => {
    const parts = path.split('/')
    const i = parts.indexOf('gallery')
    return [parts[i + 1], parts[parts.length - 1]] as const
}

// folder -> file name -> url, file names sorted
const groupBySession = (images: Record<string, string>) => {
    const grouped: Record<string, Record<string, string>> = {}
    Object.keys(images)
        .sort()
        .forEach((path) => {
            const [slug, file] = parse(path)
            grouped[slug] ??= {}
            grouped[slug][file] = images[path]
        })
    return grouped
}

const PL: Record<string, string> = { ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z' }

/** '2_Sesja_Ślubna' -> 'sesja-slubna' */
export const toSlug = (folder: string) =>
    folder
        .replace(/^\d+[_-]?/, '')
        .toLowerCase()
        .replace(/[ąćęłńóśźż]/g, (c) => PL[c])
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

/** First overview lines (markdown markers + trailing dot stripped) -> title, description. */
const metaFromOverview = (overview: string, fallback: string) => {
    const lines = overview
        .split('\n')
        .map((line) => line.replace(/^[#>*\s-]+/, '').trim())
        .filter(Boolean)
    return {
        title: lines[0]?.replace(/\.$/, '') || fallback,
        description: lines[1],
    }
}

const fullBySession = groupBySession(fullImages)
const thumbsBySession = groupBySession(thumbImages)

// newest (highest folder prefix) first; numeric so 10_ sorts above 9_
export const sessions: Session[] = Object.keys(fullBySession)
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
    .map((folder) => {
        const full = fullBySession[folder]
        const thumbs = thumbsBySession[folder] ?? {}
        const overview = overviews[`../assets/gallery/${folder}/overview.md`] ?? ''
        const slug = toSlug(folder)
        const { title, description } = metaFromOverview(overview, slug.replace(/-/g, ' '))
        const photos = Object.entries(full).map(([name, src], i) => ({
            src,
            thumb: thumbs[name] ?? src,
            alt: altText[`gallery/${folder}/${name}`] ?? `${title} — zdjęcie ${i + 1}`,
            caption: '',
        }))
        return {
            slug,
            folder,
            title,
            description,
            cover: Object.values(thumbs)[0] ?? photos[0].src,
            overview,
            photos,
        }
    })

export const getSession = (slug: string | undefined) =>
    sessions.find((session) => session.slug === slug)
