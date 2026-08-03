import { Link } from 'react-router'
import './Footer.css'

const Footer = () => (
    <footer className="footer">
        <div className="container">
            <div className="footer__top">
                <div className="footer__col">
                    <div className="footer__brand">Studio Foto</div>
                    <p>Fotografia ślubna i portretowa. Kraków i cała Polska.</p>
                </div>

                <div className="footer__col">
                    <p>
                        <a href="mailto:kontakt@studiofoto.pl">kontakt@studiofoto.pl</a>
                    </p>
                    <p>
                        <a href="tel:+48600100200">+48 600 100 200</a>
                    </p>
                </div>

                <ul className="footer__social">
                    <li>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer">
                            Instagram
                        </a>
                    </li>
                    <li>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer">
                            Facebook
                        </a>
                    </li>
                    <li>
                        <Link to="/contact">Kontakt</Link>
                    </li>
                </ul>
            </div>

            <div className="footer__bottom">
                © {new Date().getFullYear()} Studio Foto. Wszystkie prawa zastrzeżone.
            </div>
        </div>
    </footer>
)

export default Footer
