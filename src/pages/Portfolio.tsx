import { useEffect, useState } from 'react'
import PageShell from '../components/PageShell.tsx'
import { photos, type Photo } from '../data/portfolio.ts'
import './Portfolio.css'

const Portfolio = () => {
    const [active, setActive] = useState<Photo | null>(null)

    useEffect(() => {
        if (!active) return
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setActive(null)
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [active])

    return (
        <PageShell>
            <section className="container page-head">
                <p className="eyebrow">Portfolio</p>
                <h1>Kadry, które zostają</h1>
                <p className="lead">
                    Wybór z ostatnich sezonów — śluby, plenery i sesje narzeczeńskie.
                    Kliknij zdjęcie, żeby zobaczyć je w pełnym rozmiarze.
                </p>
            </section>

            <section className="section">
                <div className="container">
                    <div className="masonry">
                        {photos.map((photo) => (
                            <button
                                type="button"
                                className="photo-card"
                                key={photo.caption}
                                onClick={() => setActive(photo)}
                            >
                                <img src={photo.src} alt={photo.alt} loading="lazy" />
                                <span className="photo-card__cap">{photo.caption}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {active && (
                <div
                    className="lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-label={active.caption}
                    onClick={() => setActive(null)}
                >
                    <button
                        type="button"
                        className="lightbox__close"
                        aria-label="Zamknij podgląd"
                        onClick={() => setActive(null)}
                    >
                        &times;
                    </button>
                    <img
                        src={active.src}
                        alt={active.alt}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <span className="lightbox__caption">{active.caption}</span>
                </div>
            )}
        </PageShell>
    )
}

export default Portfolio
