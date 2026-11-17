import altText from '@assets/altText.ts'

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

// full + thumbs are paired by file name; ordered by file name
const portfolioFull = loadImages(
    import.meta.glob<string>('@assets/portfolio/full/*.{jpg,jpeg,png,webp}', {
        eager: true,
        import: 'default',
    }),
)
const portfolioThumbs = loadImages(
    import.meta.glob<string>('@assets/portfolio/thumbs/*.{jpg,jpeg,png,webp}', {
        eager: true,
        import: 'default',
    }),
)

const portfolioSizes = loadSizes(
    import.meta.glob<ImageSize>('@assets/portfolio/{full,thumbs}/*.{jpg,jpeg,png,webp}', {
        eager: true,
        query: '?size',
        import: 'default',
    }),
)

export const photos: Photo[] = Object.entries(portfolioFull).map(([name, src], i) => ({
    src,
    thumb: portfolioThumbs[name] ?? src,
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

/**
 * Start slides: horizontal object-position on portrait (mobile) screens, so the
 * crop keeps the people in frame. Missing file -> centered.
 */
const slideFocus: Record<string, string> = {
    '01-para-na-skalistym-klifie-nad-oceanem-o-zachodzie-slonca.webp': '53% 50%',
    '02-przyszli-rodzice-z-psem-spaceruja-po-lace-w-zlotej-godzinie.webp': '67% 50%',
    '03-czarno-biale-zdjecie-pary-tanczacej-w-klebach-mgly.webp': '21% 50%',
    '04-para-lezaca-w-zielonej-trawie-ujecie-z-drona.webp': '39% 50%',
    '06-para-na-skalach-nad-turkusowym-oceanem-widok-z-lotu-ptaka.webp': '0% 50%',
    '07-pierwszy-taniec-pary-mlodej-przy-podswietlanym-napisie.webp': '14% 50%',
    '08-kobieta-w-bialej-sukience-wsrod-czerwonych-makow-o-zachodzie.webp': '79% 50%',
    '09-drewniany-wiatrak-w-skansenie-i-para-w-promieniach.webp': '55% 50%',
    '10-para-mloda-siedzi-na-bialej-lawce-w-palacowym-ogrodzie.webp': '53% 50%',
    '11-czarno-biale-zdjecie-para-mloda-trzyma-sie-za-rece-ich.webp': '10% 50%',
    '12-para-mloda-dotyka-sie-czolami-w-domu-przed-slubem.webp': '37% 50%',
    '13-czarno-biale-zdjecie-pan-mlody-obejmuje-panne-mloda.webp': '22% 50%',
    '14-para-mloda-caluje-sie-miedzy-kolumnami-na-pierwszym-planie.webp': '0% 50%',
}

/** Start page slideshow — full-screen photos from assets/start. */
export const slides: Photo[] = Object.entries(startImages).map(([name, src], i) => ({
    src,
    srcSet: startSrcSets[name],
    alt: altText[`start/${name}`] ?? `Fotograf ślubny Warszawa | Łuków | Angelika Malon, zdjęcie ${i + 1}`,
    caption: '',
    focus: slideFocus[name],
}))
