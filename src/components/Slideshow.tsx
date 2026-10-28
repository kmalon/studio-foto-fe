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
    // srcs detected as portrait once loaded — shown uncropped on landscape screens
    const [portrait, setPortrait] = useState<Set<string>>(() => new Set())
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
    // mount only current + neighbours: prev keeps the cross-fade, next is preloaded in the background
    const mounted = new Set([index, (index + 1) % count, (index - 1 + count) % count])

    return (
        <section className="slideshow" aria-roledescription="karuzela" aria-label="Galeria zdjęć">
            {photos.map((photo, i) => {
                if (!mounted.has(i)) return null
                const isPortrait = portrait.has(photo.src)
                return (
                    <div
                        key={photo.src}
                        className={`slideshow__slide ${i === index ? 'is-active' : ''} ${isPortrait ? 'is-portrait' : ''}`}
                        aria-hidden={i !== index}
                    >
                        {/* blurred fill behind an uncropped portrait photo (same URL, served from cache) */}
                        {isPortrait && <img className="slideshow__backdrop" src={photo.src} alt="" />}
                        <img
                            className="slideshow__img"
                            src={photo.src}
                            alt={photo.alt}
                            fetchPriority={i === 0 ? 'high' : 'auto'}
                            onLoad={(e) => {
                                const { naturalWidth, naturalHeight } = e.currentTarget
                                if (naturalHeight > naturalWidth) {
                                    setPortrait((prev) => new Set(prev).add(photo.src))
                                }
                            }}
                        />
                    </div>
                )
            })}

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
