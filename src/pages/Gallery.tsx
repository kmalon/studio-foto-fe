import { Link } from 'react-router'
import PageShell from '../components/PageShell.tsx'
import { sessions } from '../data/gallery.ts'

const Gallery = () => (
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
                    {sessions.map(({ slug, cover }) => (
                        <Link to={`/gallery/${slug}`} className="photo-card" key={slug}>
                            <img src={cover} alt={slug} loading="lazy" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    </PageShell>
)

export default Gallery
