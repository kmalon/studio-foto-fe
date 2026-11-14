import { Link } from 'react-router'
import { setConsent } from '../analytics/ga.ts'
import { useBannerOpen } from '../hooks/useConsent.ts'
import { ROUTES } from '../routes.ts'
import './CookieConsent.css'

/** Opt-in banner for analytics cookies; client-only, shown until a choice is stored. */
const CookieConsent = () => {
    const open = useBannerOpen()
    if (!open) return null

    return (
        <div className="cookie" role="dialog" aria-live="polite" aria-label="Zgoda na pliki cookies">
            <p className="cookie__text">
                Używam plików cookies Google Analytics, aby poznać statystyki odwiedzin strony.
                Zostaną zapisane tylko za Twoją zgodą. Więcej w{' '}
                <Link to={ROUTES.privacy} className="cookie__link">polityce prywatności</Link>.
            </p>
            <div className="cookie__actions">
                <button type="button" className="btn" onClick={() => setConsent('denied')}>
                    Odrzuć
                </button>
                <button type="button" className="btn" onClick={() => setConsent('granted')}>
                    Akceptuję
                </button>
            </div>
        </div>
    )
}

export default CookieConsent
