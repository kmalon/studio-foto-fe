import { useEffect, useRef, useState } from 'react'
import useColumnCount from '../hooks/useColumnCount.ts'
import type { Photo } from '../data/portfolio.ts'

type Props = {
    photos: Photo[]
    onSelect: (photo: Photo) => void
    showCaption?: boolean
}

/** Rows rendered per batch; more are appended while scrolling. */
const BATCH_ROWS = 3

/**
 * Masonry laid out in row order (photo i -> column i % cols).
 * Only rendered photos are fetched: next batch is appended once the current
 * one has loaded (real heights known) and the sentinel nears the viewport.
 */
const PhotoMasonry = ({ photos, onSelect, showCaption = false }: Props) => {
    const cols = useColumnCount()
    const batch = cols * BATCH_ROWS
    const [visible, setVisible] = useState(batch)
    const [loaded, setLoaded] = useState<ReadonlySet<string>>(new Set())
    const sentinel = useRef<HTMLDivElement>(null)

    const shown = photos.slice(0, visible)
    const batchReady = shown.every((photo) => loaded.has(photo.src))
    const hasMore = visible < photos.length

    useEffect(() => {
        const el = sentinel.current
        if (!el || !batchReady || !hasMore) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisible((v) => v + batch)
            },
            { rootMargin: '400px 0px' },
        )
        observer.observe(el)
        return () => observer.disconnect()
    }, [batchReady, hasMore, batch])

    const columns: Photo[][] = Array.from({ length: cols }, () => [])
    shown.forEach((photo, i) => columns[i % cols].push(photo))

    // keyed by src: column changes remount imgs and re-fire onLoad
    const markLoaded = (src: string) => () =>
        setLoaded((prev) => (prev.has(src) ? prev : new Set(prev).add(src)))

    return (
        <>
            <div className="masonry">
                {columns.map((column, c) => (
                    <div className="masonry__col" key={c}>
                        {column.map((photo) => (
                            <button
                                type="button"
                                className="photo-card"
                                key={photo.src}
                                onClick={() => onSelect(photo)}
                            >
                                <img
                                    src={photo.thumb ?? photo.src}
                                    alt={photo.alt}
                                    decoding="async"
                                    onLoad={markLoaded(photo.src)}
                                    onError={markLoaded(photo.src)}
                                />
                                {showCaption && (
                                    <span className="photo-card__cap">{photo.caption}</span>
                                )}
                            </button>
                        ))}
                    </div>
                ))}
            </div>
            <div ref={sentinel} aria-hidden="true" />
        </>
    )
}

export default PhotoMasonry
