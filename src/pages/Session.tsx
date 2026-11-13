import { useState } from 'react'
import { Link, useParams } from 'react-router'
import ReactMarkdown from 'react-markdown'
import PageShell from '../components/PageShell.tsx'
import Lightbox from '../components/Lightbox.tsx'
import PhotoMasonry from '../components/PhotoMasonry.tsx'
import { getSession, type Session as SessionData } from '../data/gallery.ts'
import type { Photo } from '../data/portfolio.ts'
import usePageMeta from '../hooks/usePageMeta.ts'
import NotFound from './NotFound.tsx'
import './Session.css'

const Session = () => {
    const { slug } = useParams()
    const session = getSession(slug)

    return session ? <SessionView key={session.slug} session={session} /> : <NotFound />
}

const SessionView = ({ session }: { session: SessionData }) => {
    const [active, setActive] = useState<Photo | null>(null)
    const { title, description } = session
    usePageMeta({
        title: `${title} – fotograf Warszawa | Angelika Malon`,
        description: `${description ? `${description} ` : ''}${title} — ${session.photos.length} zdjęć. Angelika Malon Fotografia, fotograf ślubny i rodzinny z Warszawy.`,
        image: session.photos[0]?.src,
    })

    return (
        <PageShell>
            <section className="container page-head">
                <Link to="/galeria" className="link-underline session__back">
                    ← Wróć do galerii
                </Link>
                <div className="session__overview">
                    <ReactMarkdown>{session.overview}</ReactMarkdown>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <PhotoMasonry photos={session.photos} onSelect={setActive} />
                </div>
            </section>

            <Lightbox photo={active} onClose={() => setActive(null)} />
        </PageShell>
    )
}

export default Session
