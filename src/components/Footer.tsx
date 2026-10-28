import { Link } from 'react-router'
import './Footer.css'
import { EMAIL } from '../data/AngelikaInfo.tsx'

const Footer = () => (
    <footer className="footer">
        <div className="container">
            <div className="footer__top">
                <div className="footer__col">
                    <div className="footer__brand">Angelika Malon</div>
                    <p>Fotograf emocji. Warszawa i świat.</p>
                </div>

                <div className="footer__col">
                    <p>
                        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                    </p>
                </div>

                <ul className="footer__social">
                    <li>
                        <a href="https://www.instagram.com/angelika.malon?exln=bjFxbHJtNHQyd2hw&utm_source=qr" target="_blank" rel="noreferrer">
                            Instagram
                        </a>
                    </li>
                    <li>
                        <a href="https://www.facebook.com/Malonaangelika/" target="_blank" rel="noreferrer">
                            Facebook
                        </a>
                    </li>
                    <li>
                        <Link to="/contact">Kontakt</Link>
                    </li>
                </ul>
            </div>

            <div className="footer__bottom">
                © {new Date().getFullYear()} Angelika Malon. Wszystkie prawa zastrzeżone.
            </div>
        </div>
    </footer>
)

export default Footer
