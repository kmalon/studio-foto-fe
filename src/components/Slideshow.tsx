import { useCallback, useEffect, useState } from 'react'
import type { Photo } from '../data/portfolio.ts'
import './Slideshow.css'

type SlideshowProps = {
    photos: Photo[]
    /** Auto-advance delay in ms. */
    interval?: number
}

const pad = (n: number) => String(n).padStart(2, '0')

const Chevron = ({ dir }: { dir: 'left' | 'right' }) => (
    <svg viewBox="0 0 24 48" aria-hidden="true">
        <path d={dir === 'left' ? 'M20 2 4 24l16 22' : 'M4 2l16 22L4 46'} />
    </svg>
)

const Slideshow = ({ photos, interval = 5000 }: SlideshowProps) => {
    const [index, setIndex] = useState(0)
    const [paused, setPaused] = useState(false)
    const count = photos.length

    const go = useCallback((step: number) => setIndex((i) => (i + step + count) % count), [count])

    // Re-armed on every index change, so manual navigation restarts the countdown.
    useEffect(() => {
        if (paused || count < 2) return
        const id = window.setTimeout(() => go(1), interval)
        return () => window.clearTimeout(id)
    }, [index, paused, interval, count, go])

    // don't burn through slides while the tab is in the background
    useEffect(() => {
        const onVisibility = () => setPaused(document.hidden)
        document.addEventListener('visibilitychange', onVisibility)
        return () => document.removeEventListener('visibilitychange', onVisibility)
    }, [])

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') go(-1)
            if (e.key === 'ArrowRight') go(1)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [go])

    const current = photos[index]

    return (
        <section className="slideshow" aria-roledescription="karuzela" aria-label="Galeria zdjęć">
            {photos.map((photo, i) => (
                <img
                    key={photo.src}
                    className={`slideshow__img ${i === index ? 'is-active' : ''}`}
                    src={photo.src}
                    alt={photo.alt}
                    aria-hidden={i !== index}
                    fetchPriority={i === 0 ? 'high' : 'auto'}
                />
            ))}

            <button
                type="button"
                className="slideshow__arrow slideshow__arrow--prev"
                aria-label="Poprzednie zdjęcie"
                onClick={() => go(-1)}
            >
                <Chevron dir="left" />
            </button>
            <button
                type="button"
                className="slideshow__arrow slideshow__arrow--next"
                aria-label="Następne zdjęcie"
                onClick={() => go(1)}
            >
                <Chevron dir="right" />
            </button>

            <div className="slideshow__meta" aria-live="polite">
                <span className="slideshow__caption">{current.caption}</span>
                <span className="slideshow__count">
                    {pad(index + 1)} / {pad(count)}
                </span>
            </div>
        </section>
    )
}

export default Slideshow
