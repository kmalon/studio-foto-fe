import { Link } from 'react-router'
import PageShell from '../components/PageShell.tsx'
import { featured } from '../data/portfolio.ts'
import portrait from '../assets/aaa.jpg'
import heroImage from '../assets/ccc.png'
import './Home.css'

const Home = () => (
    <PageShell>
        <section className="hero">
            <img className="hero__bg" src={heroImage} alt="" />
            <div className="container hero__content">
                <p className="eyebrow">Fotografia ślubna &amp; portretowa</p>
                <h1 className="hero__title">Historie zapisane światłem</h1>
                <p className="hero__tagline">
                    Nie ustawiam kadrów. Czekam na moment, w którym wszystko dzieje się samo —
                    i wtedy naciskam spust migawki.
                </p>
            </div>
            <span className="hero__scroll">Przewiń</span>
        </section>

        <section className="section">
            <div className="container intro">
                <figure className="intro__figure">
                    <img src={portrait} alt="Para młoda w kontrze pod wieczór" />
                </figure>
                <div className="intro__body">
                    <p className="eyebrow">Kilka słów</p>
                    <h2>Cześć, tu Studio Foto Angela!!! :D</h2>
                    <p>
                        Fotografuję od dwunastu lat, a najbardziej lubię te kadry, o których nikt
                        nie wiedział, że powstają. Ślub to jeden dzień — ale emocje, które w nim
                        siedzą, zostają na dużo dłużej. Moim zadaniem jest je zatrzymać.
                    </p>
                    <p>
                        Pracuję w stylu reportażowym: bez sztywnych póz, bez godzinnych sesji
                        w środku przyjęcia. Jestem obok, blisko ludzi, i pozwalam dniu toczyć się
                        własnym rytmem.
                    </p>
                    <p className="intro__signature">— Studio Foto</p>
                </div>
            </div>
        </section>

        <section className="section section--alt">
            <div className="container">
                <div className="work__head">
                    <div>
                        <p className="eyebrow">Wybrane kadry</p>
                        <h2>Ostatnie realizacje</h2>
                    </div>
                    <Link to="/portfolio" className="link-underline">
                        Zobacz portfolio
                    </Link>
                </div>

                <div className="photo-grid">
                    {featured.map((photo) => (
                        <figure className="photo-card" key={photo.caption}>
                            <img src={photo.src} alt={photo.alt} loading="lazy" />
                            <figcaption className="photo-card__cap">{photo.caption}</figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>

        <section className="section">
            <div className="container cta">
                <p className="eyebrow">Porozmawiajmy</p>
                <h2>Umówmy się na kawę</h2>
                <p>
                    Opowiedz mi o swoim dniu — o miejscu, o ludziach, o tym co jest dla Was ważne.
                    Resztę ustalimy przy stoliku.
                </p>
                <Link to="/contact" className="btn">
                    Napisz do mnie
                </Link>
            </div>
        </section>
    </PageShell>
)

export default Home
