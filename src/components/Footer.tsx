import { Link } from 'react-router'
import './Footer.css'
import { EMAIL } from '../data/AngelikaInfo.tsx'
import { BRAND, SOCIALS } from '../seo/site.ts'
import { ROUTES } from '../routes.ts'

const Footer = () => (
    <footer className="footer">
        <div className="container">
            <div className="footer__top">
                <div className="footer__col">
                    <div className="footer__brand">{BRAND}</div>
                    <p>Fotograf ślubny i rodzinny. Warszawa i cała Polska.</p>
                </div>

                <div className="footer__col">
                    <p>
                        <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                    </p>
                </div>

                <ul className="footer__social">
                    <li>
                        <a href={SOCIALS.instagram} target="_blank" rel="noreferrer">
                            Instagram
                        </a>
                    </li>
                    <li>
                        <a href={SOCIALS.facebook} target="_blank" rel="noreferrer">
                            Facebook
                        </a>
                    </li>
                    <li>
                        <Link to={ROUTES.contact}>Kontakt</Link>
                    </li>
                </ul>
            </div>

            <div className="footer__bottom">
                © {new Date().getFullYear()} {BRAND}. Wszystkie prawa zastrzeżone.
            </div>
        </div>
    </footer>
)

export default Footer
