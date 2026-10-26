import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import Logo from './Logo.tsx'
import './Navbar.css'

const links = [
    { to: '/', label: 'Start' },
    { to: '/home', label: 'Strona główna' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/about', label: 'O mnie' },
    { to: '/contact', label: 'Kontakt' },
]

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false)
    const [open, setOpen] = useState(false)
    const { pathname } = useLocation()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        onScroll()
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // close the mobile drawer whenever the route changes
    useEffect(() => {
        setOpen(false)
    }, [pathname])

    // don't let the page scroll behind the open drawer
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : ''
        return () => {
            document.body.style.overflow = ''
        }
    }, [open])

    return (
        <header className={`nav ${scrolled || open ? 'nav--solid' : ''}`}>
            <div className="container nav__inner">
                <NavLink to="/" className="nav__brand">
                    <Logo />
                </NavLink>

                <button
                    type="button"
                    className={`nav__burger ${open ? 'is-open' : ''}`}
                    aria-label={open ? 'Zamknij menu' : 'Otwórz menu'}
                    aria-expanded={open}
                    onClick={() => setOpen((v) => !v)}
                >
                    <span />
                    <span />
                    <span />
                </button>

                <nav>
                    <ul className={`nav__list ${open ? 'is-open' : ''}`}>
                        {links.map(({ to, label }) => (
                            <li key={to}>
                                <NavLink
                                    to={to}
                                    end={to === '/'}
                                    className={({ isActive }) =>
                                        `nav__link ${isActive ? 'is-active' : ''}`
                                    }
                                >
                                    {label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Navbar
