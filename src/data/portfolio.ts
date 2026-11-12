export type Photo = {
    src: string
    /** Smaller version for grids; falls back to `src` when missing. */
    thumb?: string
    alt: string
    caption: string
    /** CSS object-position used when the photo is cropped on portrait screens. */
    focus?: string
}

const loadImages = (images: Record<string, string>) =>
    Object.fromEntries(
        Object.entries(images).map(([path, url]) => [path.split('/').pop()!, url]),
    )

// full + thumbs are paired by file name; ordered by file name
const portfolioFull = loadImages(
    import.meta.glob<string>('../assets/portfolio/full/*.{jpg,jpeg,png,webp}', {
        eager: true,
        import: 'default',
    }),
)
const portfolioThumbs = loadImages(
    import.meta.glob<string>('../assets/portfolio/thumbs/*.{jpg,jpeg,png,webp}', {
        eager: true,
        import: 'default',
    }),
)

export const photos: Photo[] = Object.entries(portfolioFull).map(([name, src]) => ({
    src,
    thumb: portfolioThumbs[name] ?? src,
    alt: 'Zdjęcie z portfolio studia',
    caption: '',
}))

/** First three entries — used as the Home page work preview. */
export const featured: Photo[] = photos.slice(0, 3)

// every image dropped into assets/start, ordered by file name
const startImages = loadImages(
    import.meta.glob<string>('../assets/start/*.{jpg,jpeg,png,webp}', {
        eager: true,
        import: 'default',
    }),
)

/**
 * Start slides: horizontal object-position on portrait (mobile) screens, so the
 * crop keeps the people in frame. Missing file -> centered.
 */
const slideFocus: Record<string, string> = {
    '01.webp': '53% 50%',
    '02.webp': '67% 50%',
    '03.webp': '21% 50%',
    '04.webp': '39% 50%',
    '06.webp': '0% 50%',
    '07.webp': '14% 50%',
    '08.webp': '79% 50%',
    '09.webp': '55% 50%',
    '10.webp': '53% 50%',
    '11.webp': '10% 50%',
    '12.webp': '24% 50%',
    '13.webp': '22% 50%',
    '14.webp': '0% 50%',
}

/** Start page slideshow — full-screen photos from assets/start. */
export const slides: Photo[] = Object.entries(startImages).map(([name, src]) => ({
    src,
    alt: 'Zdjęcie z portfolio studia',
    caption: '',
    focus: slideFocus[name],
}))
