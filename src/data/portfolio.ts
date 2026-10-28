export type Photo = {
    src: string
    /** Smaller version for grids; falls back to `src` when missing. */
    thumb?: string
    alt: string
    caption: string
}

const loadImages = (images: Record<string, string>) =>
    Object.fromEntries(
        Object.entries(images).map(([path, url]) => [path.split('/').pop()!, url]),
    )

// full + thumbs are paired by file name; ordered by file name
const portfolioFull = loadImages(
    import.meta.glob<string>('../assets/portfolio/full/*.jpg', { eager: true, import: 'default' }),
)
const portfolioThumbs = loadImages(
    import.meta.glob<string>('../assets/portfolio/thumbs/*.jpg', { eager: true, import: 'default' }),
)

export const photos: Photo[] = Object.entries(portfolioFull).map(([name, src]) => ({
    src,
    thumb: portfolioThumbs[name] ?? src,
    alt: 'Zdjęcie z portfolio studia',
    caption: '',
}))

/** First three entries — used as the Home page work preview. */
export const featured: Photo[] = photos.slice(0, 3)

// every jpg dropped into assets/start, ordered by file name
const startImages = import.meta.glob<string>('../assets/start/*.jpg', {
    eager: true,
    import: 'default',
})

/** Start page slideshow — full-screen photos from assets/start. */
export const slides: Photo[] = Object.values(startImages).map((src) => ({
    src,
    alt: 'Zdjęcie z portfolio studia',
    caption: '',
}))
