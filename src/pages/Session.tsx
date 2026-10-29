import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import ReactMarkdown from 'react-markdown'
import PageShell from '../components/PageShell.tsx'
import Lightbox from '../components/Lightbox.tsx'
import { getSession } from '../data/gallery.ts'
import type { Photo } from '../data/portfolio.ts'
import './Session.css'

const Session = () => {
    const { slug } = useParams()
    const session = getSession(slug)
    const [active, setActive] = useState<Photo | null>(null)

    if (!session) return <Navigate to="/gallery" replace />

    return (
        <PageShell>
            <section className="container page-head">
                <Link to="/gallery" className="link-underline session__back">
                    ← Wróć do galerii
                </Link>
                <div className="session__overview">
                    <ReactMarkdown>{session.overview}</ReactMarkdown>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="masonry">
                        {session.photos.map((photo) => (
                            <button
                                type="button"
                                className="photo-card"
                                key={photo.src}
                                onClick={() => setActive(photo)}
                            >
                                <img src={photo.thumb ?? photo.src} alt={photo.alt} loading="lazy" />
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <Lightbox photo={active} onClose={() => setActive(null)} />
        </PageShell>
    )
}

export default Session
