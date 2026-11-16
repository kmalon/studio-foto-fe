import { useEffect, useRef, type TouchEvent } from 'react'
import type { Photo } from '../data/portfolio.ts'
import Chevron from './Chevron.tsx'
import './Lightbox.css'

type LightboxProps = {
    photos: Photo[]
    /** Index of the open photo; null = closed. */
    index: number | null
    onClose: () => void
    onIndexChange: (index: number) => void
}

const SWIPE_MIN = 50

const Lightbox = ({ photos, index, onClose, onIndexChange }: LightboxProps) => {
    const count = photos.length
    const photo = index === null ? null : photos[index] ?? null
    const touchX = useRef<number | null>(null)

    const go = (dir: 1 | -1) => {
        if (index === null || count < 2) return
        onIndexChange((index + dir + count) % count)
    }
    const goRef = useRef(go)
    goRef.current = go

    useEffect(() => {
        if (!photo) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
            else if (e.key === 'ArrowRight') goRef.current(1)
            else if (e.key === 'ArrowLeft') goRef.current(-1)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [photo, onClose])

    const open = photo !== null
    useEffect(() => {
        if (!open) return
        const prevOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = prevOverflow
        }
    }, [open])

    // preload neighbours for instant navigation
    useEffect(() => {
        if (index === null || count < 2) return
        for (const i of [index + 1, index - 1]) {
            new Image().src = photos[(i + count) % count].src
        }
    }, [index, photos, count])

    if (!photo || index === null) return null

    const onTouchStart = (e: TouchEvent) => {
        touchX.current = e.touches[0].clientX
    }
    const onTouchEnd = (e: TouchEvent) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        touchX.current = null
        if (Math.abs(dx) >= SWIPE_MIN) go(dx < 0 ? 1 : -1)
    }

    const stop = (e: { stopPropagation: () => void }) => e.stopPropagation()

    return (
        <div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={photo.caption || photo.alt}
            onClick={onClose}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
            <button
                type="button"
                className="lightbox__close"
                aria-label="Zamknij podgląd"
                onClick={onClose}
            >
                &times;
            </button>

            {count > 1 && (
                <>
                    <button
                        type="button"
                        className="lightbox__arrow lightbox__arrow--prev"
                        aria-label="Poprzednie zdjęcie"
                        onClick={(e) => {
                            stop(e)
                            go(-1)
                        }}
                    >
                        <Chevron dir="left" />
                    </button>
                    <button
                        type="button"
                        className="lightbox__arrow lightbox__arrow--next"
                        aria-label="Następne zdjęcie"
                        onClick={(e) => {
                            stop(e)
                            go(1)
                        }}
                    >
                        <Chevron dir="right" />
                    </button>
                </>
            )}

            <img key={photo.src} src={photo.src} alt={photo.alt} onClick={stop} />

            <div className="lightbox__meta" aria-live="polite">
                {photo.caption && <span>{photo.caption}</span>}
                {count > 1 && (
                    <span className="lightbox__count">
                        {index + 1} / {count}
                    </span>
                )}
            </div>
        </div>
    )
}

export default Lightbox
