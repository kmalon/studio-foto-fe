import { Link } from 'react-router'
import PageShell from '../components/PageShell.tsx'
import usePageMeta from '../hooks/usePageMeta.ts'
import { BRAND } from '../seo/site.ts'
import './NotFound.css'

const NotFound = () => {
    usePageMeta({
        title: `Nie znaleziono strony | ${BRAND}`,
        description: 'Strona, której szukasz, nie istnieje lub została przeniesiona.',
        noindex: true,
    })

    return (
        <PageShell>
            <section className="container page-head not-found">
                <p className="eyebrow">404</p>
                <h1>Nie znaleziono strony</h1>
                <p className="lead">
                    Strona, której szukasz, nie istnieje lub została przeniesiona.
                </p>
                <div className="not-found__actions">
                    <Link to="/" className="btn">Strona główna</Link>
                    <Link to="/galeria" className="btn">Galeria</Link>
                </div>
            </section>
        </PageShell>
    )
}

export default NotFound
