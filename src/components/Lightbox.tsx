import { useEffect } from 'react'
import type { Photo } from '../data/portfolio.ts'
import './Lightbox.css'

type LightboxProps = {
    photo: Photo | null
    onClose: () => void
}

const Lightbox = ({ photo, onClose }: LightboxProps) => {
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
