import { Link } from 'react-router'
import PageShell from '../components/PageShell.tsx'
import { sessions } from '../data/gallery.ts'
import usePageMeta from '../hooks/usePageMeta.ts'
import { sessionPath } from '../routes.ts'

const Gallery = () => {
    usePageMeta({
        title: 'Galeria sesji ślubnych i rodzinnych | Angelika Malon',
        description:
            'Galeria pełnych sesji: śluby, plenery w Łazienkach Królewskich, sesje rodzinne i ciążowe. Fotograf ślubny Warszawa | Łuków | Angelika Malon Fotografia.',
        image: sessions[0]?.photos[0]?.src,
    })

    return (
        <PageShell>
            <section className="container page-head">
                <p className="eyebrow">Galeria</p>
                <h1>Za każdym zdjęciem kryje się osobna historia.</h1>
                <p className="lead">
                    Zobacz wybrane sesje i reportaże – kliknij dowolną okładkę, by zanurzyć się w pełnej galerii kadrów.
                </p>
            </section>

            <section className="section">
                <div className="container">
                    <div className="photo-grid">
                        {sessions.map(({ slug, cover, title }) => (
                            <Link to={sessionPath(slug)} className="photo-card" key={slug}>
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
