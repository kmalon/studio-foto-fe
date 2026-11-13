import { Link } from 'react-router'
import PageShell from '../components/PageShell.tsx'
import usePageMeta from '../hooks/usePageMeta.ts'
import './NotFound.css'

const NotFound = () => {
    usePageMeta('Nie znaleziono strony', 'Strona, której szukasz, nie istnieje.')

    return (
        <PageShell>
            {/* React 19 hoists this into <head>; keeps 404 pages out of search results */}
            <meta name="robots" content="noindex" />
            <section className="container page-head not-found">
                <p className="eyebrow">404</p>
                <h1>Nie znaleziono strony</h1>
                <p className="lead">
                    Strona, której szukasz, nie istnieje lub została przeniesiona.
                </p>
                <div className="not-found__actions">
                    <Link to="/" className="btn">Strona główna</Link>
                    <Link to="/gallery" className="btn">Galeria</Link>
                </div>
            </section>
        </PageShell>
    )
}

export default NotFound
