import { useRef } from 'react'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'
import PageShell from '../components/PageShell.tsx'
import { photos } from '../data/portfolio.ts'
import './About.css'
import aboutGrey from '../assets/about/aml_grey.jpg'

const items = photos.map((photo) => ({
    // thumb as the main slide, full-size photo only once opened in fullscreen
    original: photo.thumb ?? photo.src,
    fullscreen: photo.src,
    thumbnail: photo.thumb ?? photo.src,
    originalAlt: photo.alt,
    thumbnailAlt: photo.alt,
    description: photo.caption,
}))

const About = () => {
    const gallery = useRef<ImageGallery>(null)
    const galleryWrap = useRef<HTMLDivElement>(null)

    return (
        <PageShell>
            <section className="container page-head about-intro">
                <div>
                    <p className="eyebrow">O mnie</p>
                    <h1>Zapisuję czułość, o której z biegiem lat łatwo zapomnieć.</h1>
                    <p className="lead">
                        Cześć,
                       <br />
                       <br />
                        Nazywam się Angelika Malon, pochodzę z Lubelszczyzny, a od niedawna mieszkam w Warszawie. Wierzę, że najlepsze zdjęcia to te, do których wraca się po latach, aby na nowo przeżyć to, co już dawno za nami. Kiedy opadnie pierwszy zachwyt, a codzienność nabierze tempa, zostają kadry przepełnione ciepłem, gestami i spojrzeniami ludzi, którzy są dla Was najważniejsi.
                        <br />
                        <br />
                        Niezależnie od tego, czy spotkamy się w domowym zaciszu, eleganckiej sali, czy na wiejskiej zabawie w remizie – jestem tam w pełni z Wami i dla Was. Zależy mi, abyście czuli się przy mnie swobodnie i bezpiecznie. Jak przy przyjaciółce, której możecie bez przeszkód powierzyć swoje emocje.
                        <br />
                        <br />
                        Mam w sobie ogromną miłość i wrażliwość do prawdziwych chwil – takich, w których jest życie, dokładnie takie, jakim jest.

                    </p>
                </div>

                <img className="about-intro__photo" src={aboutGrey} alt="Angelika Malon" />
            </section>

            <section className="section section--alt">
                <div className="container">
                    <div className="section-head">
                        <p className="eyebrow">Galeria</p>
                        <h2>Przekrój ostatnich sesji</h2>
                    </div>
                    <div className="gallery-wrap" ref={galleryWrap}>
                        <ImageGallery
                            ref={gallery}
                            items={items}
                            showPlayButton={false}
                            lazyLoad
                            useBrowserFullscreen={false}
                            onClick={() => gallery.current?.fullScreen()}
                            // back from fullscreen: bring the gallery to the middle of the viewport
                            onScreenChange={(isFullscreen) => {
                                if (isFullscreen) return
                                // wait a frame so the gallery is back in its normal layout before measuring
                                requestAnimationFrame(() =>
                                    galleryWrap.current?.scrollIntoView({ block: 'center' }),
                                )
                            }}
                        />
                    </div>
                </div>
            </section>
        </PageShell>
    )
}

export default About
