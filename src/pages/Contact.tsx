import { useState, type FormEvent } from 'react'
import PageShell from '../components/PageShell.tsx'
import usePageMeta from '../hooks/usePageMeta.ts'
import { BRAND } from '../seo/site.ts'
import './Contact.css'
import { EMAIL, WEB3FORMS_ACCESS_KEY } from '../data/AngelikaInfo.tsx'
import aboutGrey from '../assets/about/aml_grey.jpg'
import { Link } from 'react-router'
import { ROUTES } from '../routes.ts'

type Status = 'idle' | 'sending' | 'success' | 'error'

const EMPTY_FORM = { name: '', email: '', date: '', venue: '', message: '' }

const Contact = () => {
    const [form, setForm] = useState(EMPTY_FORM)

    const update = (field: keyof typeof form) => (e: { target: { value: string } }) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }))

    const [status, setStatus] = useState<Status>('idle')
    usePageMeta({
        title: 'Kontakt – fotograf ślubny Warszawa | Angelika Malon',
        description:
            'Zapytaj o wolny termin reportażu ślubnego lub sesji zdjęciowej w Warszawie i całej Polsce. Napisz do Angeliki Malon — odpowiadam w ciągu dwóch dni.',
        image: aboutGrey,
    })

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setStatus('sending')
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    subject: `Zapytanie o termin — ${form.name || 'strona www'} | ${BRAND}`,
                    from_name: form.name,
                    name: form.name,
                    email: form.email,
                    'data wydarzenia': form.date || 'nie podano',
                    'miejsce wydarzenia': form.venue || 'nie podano',
                    message: form.message,
                }),
            })
            const data = await response.json()
            if (!data.success) throw new Error(data.message)
            setStatus('success')
            setForm(EMPTY_FORM)
        } catch {
            setStatus('error')
        }
    }

    return (
        <PageShell>
            <section className="container page-head">
                <p className="eyebrow">Kontakt</p>
                <h1>Napisz kilka słów</h1>
                <p className="lead">
                    Termin, miejsce, klimat jaki sobie wyobrażacie - reszta wyjdzie w rozmowie.
                    <br />
                    Odpisuję zwykle w ciągu dwóch dni roboczych.
                    <br />
                    Opowiedzmy razem Waszą historię.
                </p>
            </section>

            <section className="section">
                <div className="container contact">
                    <dl className="contact__details">
                        <dt>Umówmy się na kawę</dt>
                        <dd>
                            <span className="contact__lead">Wypełnij formularz lub napisz maila:</span>
                            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                        </dd>

                    </dl>

                    <form className="form" onSubmit={handleSubmit}>
                        <div className="form__row">
                            <label className="form__field">
                                <span>Imię</span>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={update('name')}
                                    required
                                />
                            </label>
                            <label className="form__field">
                                <span>E-mail</span>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={update('email')}
                                    required
                                />
                            </label>
                        </div>

                        <div className="form__row">
                            <label className="form__field">
                                <span>Data wydarzenia (opcjonalnie)</span>
                                <input
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={update('date')}
                                />
                            </label>
                            <label className="form__field">
                                <span>Miejsce wydarzenia (opcjonalnie)</span>
                                <input
                                    type="text"
                                    name="venue"
                                    autoComplete="off"
                                    value={form.venue}
                                    onChange={update('venue')}
                                />
                            </label>
                        </div>

                        <label className="form__field">
                            <span>Wiadomość</span>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={update('message')}
                                required
                            />
                        </label>

                        <button type="submit" className="btn" disabled={status === 'sending'}>
                            {status === 'sending' ? 'Wysyłanie…' : 'Wyślij wiadomość'}
                        </button>
                        <p className="form__note" role="status" aria-live="polite">
                            {status === 'success' && 'Dziękuję! Wiadomość została wysłana.'}
                            {status === 'error' && (
                                <>
                                    Nie udało się wysłać wiadomości. Spróbuj ponownie lub napisz na{' '}
                                    <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
                                </>
                            )}
                        </p>
                        <p className="form__privacy">
                            Wysyłając wiadomość, przekazujesz mi swoje dane wyłącznie w celu odpowiedzi
                            na zapytanie. Szczegóły w{' '}
                            <Link to={ROUTES.privacy}>polityce prywatności</Link>.
                        </p>
                    </form>
                </div>
            </section>
        </PageShell>
    )
}

export default Contact
