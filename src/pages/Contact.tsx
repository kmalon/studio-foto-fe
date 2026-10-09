import { useState, type FormEvent } from 'react'
import PageShell from '../components/PageShell.tsx'
import './Contact.css'

const EMAIL = 'kontakt@studiofoto.pl'

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', date: '', message: '' })

    const update = (field: keyof typeof form) => (e: { target: { value: string } }) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }))

    // No backend — hand the message off to the visitor's mail client.
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        const subject = `Zapytanie o termin — ${form.name || 'strona www'}`
        const body = [
            `Imię: ${form.name}`,
            `E-mail: ${form.email}`,
            `Data wydarzenia: ${form.date || 'nie podano'}`,
            '',
            form.message,
        ].join('\n')
        window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
            subject,
        )}&body=${encodeURIComponent(body)}`
    }

    return (
        <PageShell>
            <section className="container page-head">
                <p className="eyebrow">Kontakt</p>
                <h1>Napisz kilka słów</h1>
                <p className="lead">
                    Termin, miejsce, klimat jaki sobie wyobrażacie — reszta wyjdzie w rozmowie.
                    Odpisuję zwykle w ciągu dwóch dni roboczych.
                </p>
            </section>

            <section className="section">
                <div className="container contact">
                    <dl className="contact__details">
                        <dt>E-mail</dt>
                        <dd>
                            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                        </dd>

                        <dt>Telefon</dt>
                        <dd>
                            <a href="tel:+48600100200">+48 600 100 200</a>
                        </dd>

                        <dt>Baza</dt>
                        <dd>
                            Kraków — pracuję w całej Polsce
                            <br />i poza jej granicami.
                        </dd>

                        <dt>Terminy</dt>
                        <dd>Sezon 2026 — wolne weekendy wiosną i jesienią.</dd>
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

                        <button type="submit" className="btn">
                            Wyślij wiadomość
                        </button>
                        <p className="form__note">
                            Formularz otworzy Twój program pocztowy z gotową treścią.
                        </p>
                    </form>
                </div>
            </section>
        </PageShell>
    )
}

export default Contact
