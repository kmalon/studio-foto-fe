import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'
import PageShell from '../components/PageShell.tsx'
import { photos } from '../data/portfolio.ts'
import './About.css'
import aboutGrey from '../assets/about/aml_grey.jpg'

const items = photos.map((photo) => ({
    original: photo.src,
    thumbnail: photo.src,
    originalAlt: photo.alt,
    thumbnailAlt: photo.alt,
    description: photo.caption,
}))

const About = () => (
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
                <div className="gallery-wrap">
                    <ImageGallery items={items} showPlayButton={false} lazyLoad />
                </div>
            </div>
        </section>
    </PageShell>
)

export default About
