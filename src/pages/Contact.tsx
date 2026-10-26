import { useState, type FormEvent } from 'react'
import PageShell from '../components/PageShell.tsx'
import './Contact.css'
import { EMAIL, WEB3FORMS_ACCESS_KEY } from '../data/AngelikaInfo.tsx'

type Status = 'idle' | 'sending' | 'success' | 'error'

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', date: '', message: '' })

    const update = (field: keyof typeof form) => (e: { target: { value: string } }) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }))

    const [status, setStatus] = useState<Status>('idle')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setStatus('sending')
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    access_key: WEB3FORMS_ACCESS_KEY,
                    subject: `Zapytanie o termin — ${form.name || 'strona www'}`,
                    from_name: form.name,
                    name: form.name,
                    email: form.email,
                    'data wydarzenia': form.date || 'nie podano',
                    message: form.message,
                }),
            })
            const data = await response.json()
            if (!data.success) throw new Error(data.message)
            setStatus('success')
            setForm({ name: '', email: '', date: '', message: '' })
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
                    Termin, miejsce, klimat jaki sobie wyobrażacie — reszta wyjdzie w rozmowie.
                    <br />
                    Odpisuję zwykle w ciągu dwóch dni roboczych.
                    <br />
                    Opowiedzmy razem Waszą historię.
                </p>
            </section>

            <section className="section">
                <div className="container contact">
                    <dl className="contact__details">
                        <dt>E-mail</dt>
                        <dd>
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

                        <label className="form__field">
                            <span>Data wydarzenia</span>
                            <input
                                type="date"
                                name="date"
                                value={form.date}
                                onChange={update('date')}
                                required
                            />
                        </label>

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
                    </form>
                </div>
            </section>
        </PageShell>
    )
}

export default Contact
