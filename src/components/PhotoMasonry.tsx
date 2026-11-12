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

/** Each photo goes to the shortest column (heights in width units, gaps ignored). */
const layout = (photos: Photo[], ratios: ReadonlyMap<string, number>, cols: number) => {
    const columns: Photo[][] = Array.from({ length: cols }, () => [])
    const heights: number[] = Array(cols).fill(0)
    for (const photo of photos) {
        const c = heights.indexOf(Math.min(...heights))
        columns[c].push(photo)
        heights[c] += ratios.get(photo.src)!
    }
    return columns
}

/**
 * Balanced masonry: photo dimensions are read by preloading (only the shown
 * batch is fetched), then each photo lands in the shortest column. Next batch is
 * appended once the current one is measured and the sentinel nears the viewport.
 * When everything is shown, the last photo of each column is cropped so all
 * columns end on one line.
 */
const PhotoMasonry = ({ photos, onSelect, showCaption = false }: Props) => {
    const cols = useColumnCount()
    const batch = cols * BATCH_ROWS
    const [visible, setVisible] = useState(batch)
    // height / width per photo src
    const [ratios, setRatios] = useState<ReadonlyMap<string, number>>(new Map())
    const sentinel = useRef<HTMLDivElement>(null)

    const shown = photos.slice(0, visible)
    const firstUnknown = shown.findIndex((photo) => !ratios.has(photo.src))
    // only a measured prefix is placed, so earlier photos never reshuffle
    const placed = firstUnknown === -1 ? shown : shown.slice(0, firstUnknown)
    const batchReady = firstUnknown === -1
    const hasMore = visible < photos.length
    const flush = !hasMore && batchReady

    useEffect(() => {
        const pending = shown.filter((photo) => !ratios.has(photo.src))
        const images = pending.map((photo) => {
            const img = new Image()
            const done = (ratio: number) =>
                setRatios((prev) =>
                    prev.has(photo.src) ? prev : new Map(prev).set(photo.src, ratio),
                )
            img.onload = () =>
                done(img.naturalWidth ? img.naturalHeight / img.naturalWidth : 1)
            img.onerror = () => done(1)
            img.src = photo.thumb ?? photo.src
            return img
        })
        return () =>
            images.forEach((img) => {
                img.onload = null
                img.onerror = null
            })
        // re-run only when the shown set changes; ratios is read for filtering
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [photos, visible])

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

    const columns = layout(placed, ratios, cols)

    return (
        <>
            <div className={`masonry ${flush ? 'masonry--flush' : ''}`}>
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
                                    // reserve space before decode -> no jump
                                    style={{ aspectRatio: 1 / ratios.get(photo.src)! }}
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
