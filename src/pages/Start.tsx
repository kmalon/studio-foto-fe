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
 * Freeze the slideshow height in px. Mobile browsers change the viewport height
 * while the URL bar hides on scroll; a viewport-relative height would resize the
 * slides and `object-fit: cover` would visibly rescale the photo. Recomputed only
 * when the width changes (rotation, desktop resize), height-only resizes are ignored.
 */
const useStableStartHeight = () => {
    useEffect(() => {
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
        title: 'Fotograf ślubny Warszawa | Angelika Malon',
        description:
            'Angelika Malon Fotografia — fotograf ślubny Warszawa. Naturalny reportaż ślubny, sesje narzeczeńskie, rodzinne i ciążowe w Warszawie i całej Polsce.',
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
                        <h1>Fotograf ślubny Warszawa — reportaż pełen prawdziwych emocji</h1>
                        <div className="home-intro__text">
                            <p>
                                Nazywam się Angelika Malon i jestem fotografem ślubnym z Warszawy.
                                Fotografuję śluby, wesela i plenery w stylu reportażowym — bez
                                sztywnego pozowania, za to z uważnością na gesty, spojrzenia i
                                drobne chwile, które łatwo przeoczyć w biegu tego wyjątkowego dnia.
                                Towarzyszę Wam od przygotowań, przez ceremonię w kościele lub urzędzie,
                                aż po ostatni taniec na sali weselnej.
                            </p>
                            <p>
                                Poza reportażem ślubnym realizuję sesje narzeczeńskie, plenery
                                poślubne, sesje rodzinne, ciążowe i portretowe. Pracuję w Warszawie,
                                na Mazowszu i w całej Polsce — chętnie fotografuję w Łazienkach
                                Królewskich, w pałacowych ogrodach, na łąkach o zachodzie słońca i
                                wszędzie tam, gdzie czujecie się sobą. Zależy mi, abyście przy mnie
                                czuli się swobodnie, jak przy dobrej przyjaciółce.
                            </p>
                            <p>
                                Zobacz wybrane kadry w portfolio, obejrzyj pełne sesje w galerii albo
                                napisz do mnie i zapytaj o wolny termin. Razem opowiemy Waszą historię
                                — tak, aby po latach wracać do niej z uśmiechem.
                            </p>
                        </div>

                        <div className="home-intro__actions">
                            <Link to={ROUTES.portfolio} className="btn">Portfolio</Link>
                            <Link to={ROUTES.gallery} className="btn">Galeria</Link>
                            <Link to={ROUTES.contact} className="btn">Kontakt</Link>
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
