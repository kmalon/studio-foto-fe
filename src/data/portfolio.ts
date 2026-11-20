import altText from '@assets/altText.ts'
import slideFocus from '@assets/slideFocus.ts'

export type Photo = {
    src: string
    /** Responsive candidates (`<img srcset>`), generated at build time. */
    srcSet?: string
    /** Smaller version for grids; falls back to `src` when missing. */
    thumb?: string
    alt: string
    caption: string
    /** CSS object-position used when the photo is cropped on portrait screens. */
    focus?: string
    /** Intrinsic size of `thumb` (build time, `?size` import) — masonry layout without measuring. */
    width?: number
    height?: number
}

export type ImageSize = { width: number; height: number }

/** File name -> intrinsic size, from a `?size` glob (vite.config.ts `imageSize` plugin). */
export const loadSizes = (sizes: Record<string, ImageSize>) =>
    Object.fromEntries(
        Object.entries(sizes).map(([path, size]) => [path.split('/').pop()!, size]),
    )

const loadImages = (images: Record<string, string>) =>
    Object.fromEntries(
        Object.entries(images).map(([path, url]) => [path.split('/').pop()!, url]),
    )

// full + thumbial are paired by file name; ordered by file name
const portfolioFull = loadImages(
    import.meta.glob<string>('@assets/portfolio/full/*.{jpg,jpeg,png,webp}', {
        eager: true,
        import: 'default',
    }),
)
const portfolioThumbial = loadImages(
    import.meta.glob<string>('@assets/portfolio/thumbial/*.{jpg,jpeg,png,webp}', {
        eager: true,
        import: 'default',
    }),
)

const portfolioSizes = loadSizes(
    import.meta.glob<ImageSize>('@assets/portfolio/{full,thumbial}/*.{jpg,jpeg,png,webp}', {
        eager: true,
        query: '?size',
        import: 'default',
    }),
)

export const photos: Photo[] = Object.entries(portfolioFull).map(([name, src], i) => ({
    src,
    thumb: portfolioThumbial[name] ?? src,
    ...portfolioSizes[name],
    alt: altText[`portfolio/${name}`] ?? `Fotografia ślubna i portretowa | Angelika Malon, zdjęcie ${i + 1}`,
    caption: '',
}))

/** First three entries — used as the Home page work preview. */
export const featured: Photo[] = photos.slice(0, 3)

// every image dropped into assets/start, ordered by file name
const startImages = loadImages(
    import.meta.glob<string>('@assets/start/*.{jpg,jpeg,png,webp}', {
        eager: true,
        import: 'default',
    }),
)
// same files resized by vite-imagetools (never upscaled) -> srcset string
const startSrcSets = loadImages(
    import.meta.glob<string>('@assets/start/*.{jpg,jpeg,png,webp}', {
        eager: true,
        query: { w: '640;1024;1600;2048', format: 'webp', quality: '82', as: 'srcset' },
        import: 'default',
    }),
)

/** Start page slideshow — full-screen photos from assets/start. */
export const slides: Photo[] = Object.entries(startImages).map(([name, src], i) => ({
    src,
    srcSet: startSrcSets[name],
    alt: altText[`start/${name}`] ?? `Fotograf ślubny Warszawa | Łuków | Angelika Malon, zdjęcie ${i + 1}`,
    caption: '',
    focus: slideFocus[name],
}))
