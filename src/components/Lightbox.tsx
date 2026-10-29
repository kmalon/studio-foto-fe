import { useEffect, useRef } from 'react'
import type { Photo } from '../data/portfolio.ts'
import './Lightbox.css'

type LightboxProps = {
    photo: Photo | null
    onClose: () => void
}

const Lightbox = ({ photo, onClose }: LightboxProps) => {
    const ref = useRef<HTMLDivElement>(null)

    // Pin the overlay to the visual viewport: if the mobile browser ends up
    // zoomed in, the overlay (and its close button) still covers exactly
    // what is visible on screen.
    useEffect(() => {
        const vv = window.visualViewport
        const el = ref.current
        if (!photo || !vv || !el) return
        const sync = () => {
            el.style.left = `${vv.offsetLeft}px`
            el.style.top = `${vv.offsetTop}px`
            el.style.width = `${vv.width}px`
            el.style.height = `${vv.height}px`
            el.style.setProperty('--lightbox-h', `${vv.height}px`)
        }
        sync()
        vv.addEventListener('resize', sync)
        vv.addEventListener('scroll', sync)
        return () => {
            vv.removeEventListener('resize', sync)
            vv.removeEventListener('scroll', sync)
        }
    }, [photo])

    useEffect(() => {
        if (!photo) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', onKey)
        const prevOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => {
            window.removeEventListener('keydown', onKey)
            document.body.style.overflow = prevOverflow
        }
    }, [photo, onClose])

    if (!photo) return null

    return (
        <div
            ref={ref}
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={photo.caption || photo.alt}
            onClick={onClose}
        >
            <button
                type="button"
                className="lightbox__close"
                aria-label="Zamknij podgląd"
                onClick={onClose}
            >
                &times;
            </button>
            <img src={photo.src} alt={photo.alt} onClick={(e) => e.stopPropagation()} />
            <span className="lightbox__caption">{photo.caption}</span>
        </div>
    )
}

export default Lightbox
