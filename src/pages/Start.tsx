import { useEffect } from 'react'
import { Link } from 'react-router'
import Navbar from '../components/Navbar.tsx'
import Footer from '../components/Footer.tsx'
import Slideshow from '../components/Slideshow.tsx'
import SessionLinks from '../components/SessionLinks.tsx'
import { slides } from '../data/portfolio.ts'
import usePageMeta from '../hooks/usePageMeta.ts'
import './Start.css'
import { ROUTES } from '../routes.ts'

/**
 * Fallback for browsers without `svh` (CSS uses 100svh: static + never under the
 * browser bars). Freezes the slideshow height in px so the URL bar hiding on scroll
 * doesn't resize -> rescale the photo. Recomputed only when the width changes
 * (rotation, desktop resize), height-only resizes are ignored.
 */
const useStableStartHeight = () => {
    useEffect(() => {
        if (CSS.supports('height', '100svh')) return
        const root = document.documentElement
        let width = 0
        const update = () => {
            if (window.innerWidth === width) return
            width = window.innerWidth
            root.style.setProperty('--start-h', `${window.innerHeight}px`)
        }
        update()
        window.addEventListener('resize', update)
        return () => {
            window.removeEventListener('resize', update)
            root.style.removeProperty('--start-h')
        }
    }, [])
}

const Start = () => {
    useStableStartHeight()
    usePageMeta({
        title: 'Fotograf ślubny Warszawa | Łuków | Angelika Malon',
        description:
            'Angelika Malon Fotografia | fotograf ślubny Warszawa | Łuków. Naturalny reportaż ślubny, sesje narzeczeńskie, rodzinne i ciążowe w Warszawie, Łukowie i całej Polsce.',
        image: slides[0]?.src,
    })

    return (
        <>
            <Navbar />
            <main>
                <div className="start">
                    <Slideshow photos={slides} interval={2000} />
                </div>

                <section className="section home-intro">
                    <div className="container home-intro__inner">
                        <p className="eyebrow">Angelika Malon Fotografia</p>
                        <h1>Fotograf ślubny <span className="nowrap">Warszawa | Łuków</span> <span className="h-dash">-</span> reportaż pełen prawdziwych emocji</h1>
                        <div className="home-intro__text">
                            <p>
                                Cześć, jestem Angelika.
                            </p>
                            <p>
                                Tworzę naturalne fotografie pełne bliskości - bez stresu i sztywnego pozowania.
                            </p>
                            <p>
                                Mieszkam w Warszawie, ale sercem i aparatem wciąż regularnie wracam w moje
                                rodzinne strony - do Łukowa i na całą Lubelszczyznę. Fotografuję tam, gdzie
                                dzieje się coś dla Was ważnego: od eleganckich warszawskich plenerów, przez
                                huczne wesela na Mazowszu i Lubelszczyźnie, aż po kameralne uroczystości
                                w domowym zaciszu.
                            </p>
                            <p>
                                Specjalizuję się w reportażu ślubnym i okolicznościowym. Towarzyszę Wam od
                                porannych przygotowań, przez ceremonię, aż po ostatni taniec. Poza ślubami
                                spotkacie mnie na sesjach narzeczeńskich, poślubnych, rodzinnych, ciążowych
                                i portretowych.
                            </p>
                            <p>
                                Chcę, żeby czas spędzony przed moim obiektywem był dla Was po prostu miłym
                                spotkaniem - bez pośpiechu i sztucznego uśmiechania.
                            </p>
                            <p>
                                Rozgość się. Zobacz wybrane kadry w{' '}
                                <Link to={ROUTES.portfolio} className="text-link">portfolio</Link>, obejrzyj
                                pełne reportaże w <Link to={ROUTES.gallery} className="text-link">galerii</Link>{' '}
                                albo <Link to={ROUTES.contact} className="text-link">napisz do mnie</Link>,
                                żeby zapytać o wolny termin.
                            </p>
                        </div>

                        <nav className="home-intro__sessions" aria-label="Sesje w galerii">
                            <h2>Ostatnie sesje</h2>
                            <SessionLinks />
                        </nav>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}

export default Start
