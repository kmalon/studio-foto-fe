import { Children, useCallback, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import ReactMarkdown, { type Components } from 'react-markdown'
import PageShell from '../components/PageShell.tsx'
import Lightbox from '../components/Lightbox.tsx'
import PhotoMasonry from '../components/PhotoMasonry.tsx'
import { getSession, type Session as SessionData } from '../data/gallery.ts'
import usePageMeta from '../hooks/usePageMeta.ts'
import NotFound from './NotFound.tsx'
import './Session.css'
import { ROUTES } from '../routes.ts'

/** Hyphens in headings -> `.h-dash` (Cormorant's `-` is slanted). */
const dashed = (children: ReactNode) =>
    Children.map(children, (child) =>
        typeof child === 'string'
            ? child.split('-').flatMap((part, i) =>
                  i ? [<span key={i} className="h-dash">-</span>, part] : [part],
              )
            : child,
    )

const headings: Components = {
    h1: ({ children }) => <h1>{dashed(children)}</h1>,
    h2: ({ children }) => <h2>{dashed(children)}</h2>,
    h3: ({ children }) => <h3>{dashed(children)}</h3>,
}

const Session = () => {
    const { slug } = useParams()
    const session = getSession(slug)

    return session ? <SessionView key={session.slug} session={session} /> : <NotFound />
}

const SessionView = ({ session }: { session: SessionData }) => {
    const [active, setActive] = useState<number | null>(null)
    const close = useCallback(() => setActive(null), [])
    const { title, description } = session
    usePageMeta({
        title: `${title} | fotograf Warszawa | Łuków | Angelika Malon`,
        description: `${description ? `${description} ` : ''}${title} | ${session.photos.length} zdjęć. Angelika Malon Fotografia, fotograf ślubny i rodzinny z Warszawy i Łukowa.`,
        image: session.photos[0]?.src,
    })

    return (
        <PageShell>
            <section className="container page-head">
                <Link to={ROUTES.gallery} className="link-underline session__back">
                    ← Wróć do galerii
                </Link>
                <div className="session__overview">
                    <ReactMarkdown components={headings}>{session.overview}</ReactMarkdown>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <PhotoMasonry photos={session.photos} onSelect={(p) => setActive(session.photos.indexOf(p))} />
                </div>
            </section>

            <Lightbox
                photos={session.photos}
                index={active}
                onClose={close}
                onIndexChange={setActive}
            />
        </PageShell>
    )
}

export default Session
