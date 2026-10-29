import { useState } from 'react'
import PageShell from '../components/PageShell.tsx'
import Lightbox from '../components/Lightbox.tsx'
import { photos, type Photo } from '../data/portfolio.ts'

const Portfolio = () => {
    const [active, setActive] = useState<Photo | null>(null)

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
                                key={photo.src}
                                onClick={() => setActive(photo)}
                            >
                                <img src={photo.thumb ?? photo.src} alt={photo.alt} loading="lazy" />
                                <span className="photo-card__cap">{photo.caption}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <Lightbox photo={active} onClose={() => setActive(null)} />
        </PageShell>
    )
}

export default Portfolio
