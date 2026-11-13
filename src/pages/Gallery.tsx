import { Link } from 'react-router'
import PageShell from '../components/PageShell.tsx'
import { sessions } from '../data/gallery.ts'
import usePageMeta from '../hooks/usePageMeta.ts'

const Gallery = () => {
    usePageMeta({
        title: 'Galeria sesji ślubnych i rodzinnych | Angelika Malon',
        description:
            'Galeria pełnych sesji: śluby, plenery w Łazienkach Królewskich, sesje rodzinne i ciążowe. Fotograf ślubny Warszawa — Angelika Malon Fotografia.',
        image: sessions[0]?.photos[0]?.src,
    })

    return (
        <PageShell>
            <section className="container page-head">
                <p className="eyebrow">Galeria</p>
                <h1>Sesje</h1>
                <p className="lead">
                    Każda sesja to osobna historia. Wybierz zdjęcie, żeby zobaczyć całą sesję.
                </p>
            </section>

            <section className="section">
                <div className="container">
                    <div className="photo-grid">
                        {sessions.map(({ slug, cover, title }) => (
                            <Link to={`/galeria/${slug}`} className="photo-card" key={slug}>
                                <img src={cover} alt={title} loading="lazy" />
                                <span className="photo-card__cap">{title}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </PageShell>
    )
}

export default Gallery
