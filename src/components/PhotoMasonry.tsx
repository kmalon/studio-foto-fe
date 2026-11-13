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

/** height / width from the build-time size; unknown -> square. */
const ratio = (photo: Photo) =>
    photo.width && photo.height ? photo.height / photo.width : 1

/** Each photo goes to the shortest column (heights in width units, gaps ignored). */
const layout = (photos: Photo[], cols: number) => {
    const columns: Photo[][] = Array.from({ length: cols }, () => [])
    const heights: number[] = Array(cols).fill(0)
    for (const photo of photos) {
        const c = heights.indexOf(Math.min(...heights))
        columns[c].push(photo)
        heights[c] += ratio(photo)
    }
    return columns
}

/**
 * Balanced masonry: photo sizes are known at build time, so the layout is
 * deterministic and the first batch is part of the prerendered HTML (crawlable
 * images, no layout shift). Each photo lands in the shortest column; the next
 * batch is appended when the sentinel nears the viewport (unrendered photos are
 * never fetched). When everything is shown, the last photo of each column is
 * cropped so all columns end on one line.
 */
const PhotoMasonry = ({ photos, onSelect, showCaption = false }: Props) => {
    const cols = useColumnCount()
    const batch = cols * BATCH_ROWS
    const [visible, setVisible] = useState(batch)
    const sentinel = useRef<HTMLDivElement>(null)

    const shown = photos.slice(0, visible)
    const hasMore = visible < photos.length

    useEffect(() => {
        const el = sentinel.current
        if (!el || !hasMore) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisible((v) => v + batch)
            },
            { rootMargin: '400px 0px' },
        )
        observer.observe(el)
        return () => observer.disconnect()
        // re-observe after each batch: a sentinel still in view fires again
    }, [hasMore, batch, visible])

    const columns = layout(shown, cols)

    return (
        <>
            <div className={`masonry ${hasMore ? '' : 'masonry--flush'}`}>
                {columns.map((column, c) => (
                    <div className="masonry__col" key={c}>
                        {column.map((photo) => {
                            const aboveFold = photos.indexOf(photo) < cols
                            return (
                                <button
                                    type="button"
                                    className="photo-card"
                                    key={photo.src}
                                    onClick={() => onSelect(photo)}
                                >
                                    <img
                                        src={photo.thumb ?? photo.src}
                                        alt={photo.alt}
                                        width={photo.width}
                                        height={photo.height}
                                        decoding="async"
                                        loading={aboveFold ? 'eager' : 'lazy'}
                                        // reserve space before load -> no layout shift
                                        style={{ aspectRatio: 1 / ratio(photo) }}
                                    />
                                    {showCaption && (
                                        <span className="photo-card__cap">{photo.caption}</span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                ))}
            </div>
            <div ref={sentinel} aria-hidden="true" />
        </>
    )
}

export default PhotoMasonry
