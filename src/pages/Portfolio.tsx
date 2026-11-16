import { useCallback, useState } from 'react'
import PageShell from '../components/PageShell.tsx'
import Lightbox from '../components/Lightbox.tsx'
import PhotoMasonry from '../components/PhotoMasonry.tsx'
import { photos } from '../data/portfolio.ts'
import usePageMeta from '../hooks/usePageMeta.ts'

const Portfolio = () => {
    const [active, setActive] = useState<number | null>(null)
    const close = useCallback(() => setActive(null), [])
    usePageMeta({
        title: 'Portfolio | fotografia ślubna Warszawa | Łuków | Angelika Malon',
        description:
            'Portfolio fotografa ślubnego z Warszawy i Łukowa: reportaże ślubne, plenery, sesje narzeczeńskie, rodzinne i portretowe. Zobacz wybrane kadry Angeliki Malon.',
        image: photos[0]?.src,
    })

    return (
        <PageShell>
            <section className="container page-head">
                <p className="eyebrow">Portfolio</p>
                <h1>Kadry, które zostają</h1>
                <p className="lead">
                    Wybór z ostatnich sezonów - śluby, plenery i sesje narzeczeńskie.
                    Kliknij zdjęcie, żeby zobaczyć je w pełnym rozmiarze.
                </p>
            </section>

            <section className="section">
                <div className="container">
                    <PhotoMasonry photos={photos} onSelect={(p) => setActive(photos.indexOf(p))} showCaption />
                </div>
            </section>

            <Lightbox
                photos={photos}
                index={active}
                onClose={close}
                onIndexChange={setActive}
            />
        </PageShell>
    )
}

export default Portfolio
