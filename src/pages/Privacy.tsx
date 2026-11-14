import { Link } from 'react-router'
import PageShell from '../components/PageShell.tsx'
import usePageMeta from '../hooks/usePageMeta.ts'
import { openBanner } from '../analytics/ga.ts'
import { EMAIL } from '../data/AngelikaInfo.tsx'
import { BRAND, GA_ID, PERSON, SITE_URL } from '../seo/site.ts'
import { ROUTES } from '../routes.ts'
import './Privacy.css'

const UPDATED = '13 listopada 2026'

const Privacy = () => {
    usePageMeta({
        title: `Polityka prywatności i prawa autorskie | ${BRAND}`,
        description:
            'Polityka prywatności strony Angelika Malon Fotografia: dane z formularza kontaktowego, pliki cookies, Google Analytics, Twoje prawa oraz prawa autorskie do zdjęć.',
    })

    const mail = <a href={`mailto:${EMAIL}`}>{EMAIL}</a>

    return (
        <PageShell>
            <section className="container page-head">
                <p className="eyebrow">Informacje prawne</p>
                <h1>Polityka prywatności</h1>
                <p className="lead">
                    Jak przetwarzam Twoje dane na stronie {SITE_URL.replace(/^https:\/\//, '')} i na
                    jakich zasadach można korzystać z moich zdjęć.
                </p>
            </section>

            <section className="section">
                <div className="container legal">
                    <h2>1. Administrator danych</h2>
                    <p>
                        Administratorem Twoich danych osobowych jest {PERSON} ({BRAND}). W sprawach
                        dotyczących danych osobowych napisz: {mail}.
                    </p>

                    <h2>2. Formularz kontaktowy i e-mail</h2>
                    <p>
                        Wysyłając wiadomość przez <Link to={ROUTES.contact}>formularz kontaktowy</Link>{' '}
                        lub e-mailem, przekazujesz mi imię, adres e-mail, treść wiadomości oraz
                        opcjonalnie datę i miejsce wydarzenia. Używam ich wyłącznie, aby odpowiedzieć
                        na zapytanie i przygotować ofertę (art. 6 ust. 1 lit. b RODO — działania przed
                        zawarciem umowy; art. 6 ust. 1 lit. f RODO — prowadzenie korespondencji).
                    </p>
                    <p>
                        Wiadomości z formularza są przesyłane przez usługę Web3Forms na moją skrzynkę
                        Gmail (Google). Dane przechowuję przez czas korespondencji, a jeśli nie dojdzie
                        do współpracy — nie dłużej niż 12 miesięcy od ostatniej wiadomości. Podanie
                        danych jest dobrowolne, ale bez adresu e-mail nie mogę odpowiedzieć.
                    </p>

                    <h2>3. Pliki cookies</h2>
                    {GA_ID ? (
                        <>
                            <p>
                                Strona zapisuje pliki cookies wyłącznie za Twoją zgodą, wyrażoną w
                                banerze przy pierwszej wizycie. Bez zgody nie są zapisywane żadne
                                cookies analityczne ani nie jest ładowany skrypt Google.
                            </p>
                            <ul>
                                <li>
                                    <code>_ga</code>, <code>_ga_*</code> — Google Analytics, statystyki
                                    odwiedzin; ważność do 2 lat.
                                </li>
                                <li>
                                    <code>cookie-consent</code> (pamięć przeglądarki, localStorage) —
                                    zapamiętuje Twoją decyzję w sprawie cookies; nie jest wysyłany na
                                    serwer.
                                </li>
                            </ul>
                            <h2>4. Google Analytics</h2>
                            <p>
                                Po wyrażeniu zgody korzystam z Google Analytics 4 (Google Ireland Ltd.),
                                aby wiedzieć, które strony są odwiedzane i jak często. Dane są
                                zbierane w formie zagregowanej, z wyłączonymi funkcjami reklamowymi;
                                Google Analytics 4 nie przechowuje adresów IP. Podstawą jest Twoja
                                zgoda (art. 6 ust. 1 lit. a RODO). Dane mogą być przekazywane do USA na
                                podstawie programu EU-U.S. Data Privacy Framework. Zgodę możesz w każdej
                                chwili wycofać:
                            </p>
                            <p>
                                <button type="button" className="btn legal__btn" onClick={openBanner}>
                                    Zmień ustawienia cookies
                                </button>
                            </p>
                        </>
                    ) : (
                        <p>
                            Strona nie używa plików cookies analitycznych ani marketingowych. Nie są
                            na niej osadzone skrypty śledzące.
                        </p>
                    )}

                    <h2>{GA_ID ? '5' : '4'}. Twoje prawa</h2>
                    <p>
                        Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia
                        przetwarzania, przenoszenia oraz sprzeciwu, a także wycofania zgody w dowolnym
                        momencie (bez wpływu na wcześniejsze przetwarzanie). Wystarczy napisać na {mail}.
                        Przysługuje Ci również skarga do Prezesa Urzędu Ochrony Danych Osobowych (PUODO).
                    </p>

                    <h2>{GA_ID ? '6' : '5'}. Prawa autorskie</h2>
                    <p>
                        Wszystkie zdjęcia i teksty na tej stronie są utworami w rozumieniu ustawy o
                        prawie autorskim i prawach pokrewnych. Autorką i właścicielką praw jest {PERSON}.
                        Kopiowanie, pobieranie, publikowanie, modyfikowanie lub wykorzystywanie zdjęć —
                        w całości lub we fragmentach, także w mediach społecznościowych — bez mojej
                        pisemnej zgody jest zabronione. Wszystkie prawa zastrzeżone.
                    </p>
                    <p>
                        Osoby widoczne na zdjęciach wyraziły zgodę na ich publikację. Jeśli jesteś na
                        zdjęciu i chcesz, aby zostało usunięte, napisz na {mail}.
                    </p>

                    <p className="legal__updated">Ostatnia aktualizacja: {UPDATED}</p>
                </div>
            </section>
        </PageShell>
    )
}

export default Privacy
