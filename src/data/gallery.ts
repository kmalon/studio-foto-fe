import type { Photo } from './portfolio.ts'

export type Session = {
    /** Folder name in assets/gallery — used in the URL. */
    slug: string
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

/** '../assets/gallery/<slug>/<sub>/<file>' -> [slug, file] */
const parse = (path: string) => {
    const parts = path.split('/')
    const i = parts.indexOf('gallery')
    return [parts[i + 1], parts[parts.length - 1]] as const
}

// slug -> file name -> url, file names sorted
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

const fullBySession = groupBySession(fullImages)
const thumbsBySession = groupBySession(thumbImages)

// newest (highest folder prefix) first; numeric so 10_ sorts above 9_
export const sessions: Session[] = Object.keys(fullBySession)
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
    .map((slug) => {
        const full = fullBySession[slug]
        const thumbs = thumbsBySession[slug] ?? {}
        const photos = Object.entries(full).map(([name, src]) => ({
            src,
            thumb: thumbs[name] ?? src,
            alt: 'Zdjęcie z sesji',
            caption: '',
        }))
        return {
            slug,
            cover: Object.values(thumbs)[0] ?? photos[0].src,
            overview: overviews[`../assets/gallery/${slug}/overview.md`] ?? '',
            photos,
        }
    })

export const getSession = (slug: string | undefined) =>
    sessions.find((session) => session.slug === slug)
