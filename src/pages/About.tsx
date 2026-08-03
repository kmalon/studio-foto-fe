import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/css/image-gallery.css'
import PageShell from '../components/PageShell.tsx'
import { photos } from '../data/portfolio.ts'
import './About.css'

const items = photos.map((photo) => ({
    original: photo.src,
    thumbnail: photo.src,
    originalAlt: photo.alt,
    thumbnailAlt: photo.alt,
    description: photo.caption,
}))

const About = () => (
    <PageShell>
        <section className="container page-head">
            <p className="eyebrow">O mnie</p>
            <h1>Fotograf, nie reżyser</h1>
            <p className="lead">
                Najlepsze zdjęcia powstają wtedy, kiedy nikt o nich nie myśli.
                Dlatego rzadko o coś proszę — częściej po prostu jestem obok.
            </p>
        </section>

        <section className="section">
            <div className="container bio">
                <div>
                    <h2>Jak pracuję</h2>
                    <p>
                        Zaczynam wcześnie i zostaję do końca. Dzień ślubny ma swój rytm i nie
                        warto go przerywać — dlatego nie ustawiam grup na godzinę i nie wyciągam
                        nikogo z parkietu na sesję. Kadry układają się same, trzeba tylko być
                        w odpowiednim miejscu.
                    </p>
                    <p>
                        Fotografuję głównie w naturalnym świetle, w czerni i bieli tam, gdzie
                        kolor tylko przeszkadza. Materiał oddaję w ciągu sześciu tygodni —
                        w galerii online, z prawem do druku.
                    </p>
                </div>

                <div>
                    <h2>W skrócie</h2>
                    <ul className="facts">
                        <li>
                            <span>Doświadczenie</span>
                            <strong>12 lat, 240+ dni ślubnych</strong>
                        </li>
                        <li>
                            <span>Styl</span>
                            <strong>Reportaż, światło naturalne</strong>
                        </li>
                        <li>
                            <span>Zasięg</span>
                            <strong>Kraków, cała Polska, Europa</strong>
                        </li>
                        <li>
                            <span>Czas realizacji</span>
                            <strong>do 6 tygodni</strong>
                        </li>
                        <li>
                            <span>Materiał</span>
                            <strong>400–700 zdjęć, galeria online</strong>
                        </li>
                    </ul>
                </div>
            </div>
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
