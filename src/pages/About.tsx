import { useRef } from 'react'
import { useNavigate } from 'react-router'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'
import PageShell from '../components/PageShell.tsx'
import SessionLinks from '../components/SessionLinks.tsx'
import { sessions } from '../data/gallery.ts'
import usePageMeta from '../hooks/usePageMeta.ts'
import './About.css'
import aboutGrey from '../assets/about/aml_grey.jpg'
import { sessionPath } from '../routes.ts'

// one cover per session; clicking a slide opens its session
const items = sessions.map(({ cover, title }) => ({
    original: cover,
    thumbnail: cover,
    originalAlt: title,
    thumbnailAlt: title,
}))

const About = () => {
    const gallery = useRef<ImageGallery>(null)
    const navigate = useNavigate()
    usePageMeta({
        title: 'O mnie | fotograf ślubny Warszawa | Łuków | Angelika Malon',
        description:
            'Angelika Malon | fotograf ślubny i rodzinny z Warszawy i Łukowa. Reportaż pełen emocji, czułości i prawdziwych chwil. Poznaj mnie i mój sposób pracy.',
        image: aboutGrey,
    })

    return (
        <PageShell>
            <section className="container page-head about-intro">
                <div>
                    <p className="eyebrow">O mnie</p>
                    <h1>
                        Zapisuję czułość,{' '}
                        <span className="about-intro__sub">o której z biegiem lat łatwo zapomnieć.</span>
                    </h1>
                    <div className="lead about-intro__text">
                        <p>
                            Cześć! Nazywam się Angelika. Pochodzę z Lubelszczyzny, a od niedawna na nowo
                            odkrywam piękno Warszawy.
                        </p>
                        <p>
                            Wierzę, że najlepsze zdjęcia to te, do których wraca się po latach, aby na nowo
                            poczuć emocje tamtych dni. Kiedy opadnie pierwszy zachwyt, a codzienność nabierze
                            tempa, zostają kadry pełne ciepła, drobnych gestów i spojrzeń ludzi, którzy są
                            dla Was najważniejsi.
                        </p>
                        <p>
                            Niezależnie od tego, czy spotkamy się w domowym zaciszu, eleganckiej sali, czy na
                            hucznej zabawie w wiejskiej remizie - jestem tam w pełni z Wami i dla Was. Zależy
                            mi, abyście czuli się przy mnie swobodnie i bezpiecznie. Jak przy dobrej
                            przyjaciółce, przy której nie trzeba niczego udawać.
                        </p>
                        <p>
                            Mam w sobie ogromną wrażliwość na prawdziwe chwile - takie, w których widać po
                            prostu Wasze życie, bez upiększania i reżyserii.
                        </p>
                        <p>
                            Jeśli szukacie fotografa, który zatrzyma dla Was właśnie taki kawałek świata -
                            napiszcie do mnie i opowiedzcie o swoich planach.
                        </p>
                    </div>
                </div>

                <img className="about-intro__photo" src={aboutGrey} alt="Angelika Malon | fotograf ślubny z Warszawy i Łukowa, portret" />
            </section>

            <section className="section section--alt">
                <div className="container">
                    <div className="section-head">
                        <p className="eyebrow">Galeria</p>
                        <h2>Przekrój ostatnich sesji</h2>
                    </div>
                    <div className="gallery-wrap">
                        <ImageGallery
                            ref={gallery}
                            items={items}
                            showPlayButton={false}
                            lazyLoad
                            showFullscreenButton={false}
                            onClick={() => {
                                const index = gallery.current?.getCurrentIndex() ?? 0
                                navigate(sessionPath(sessions[index].slug))
                            }}
                        />
                    </div>
                    <nav className="about-sessions" aria-label="Sesje w galerii">
                        <SessionLinks />
                    </nav>
                </div>
            </section>
        </PageShell>
    )
}

export default About
