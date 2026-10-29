import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import Start from './pages/Start.tsx'
import Portfolio from './pages/Portfolio.tsx'
import Gallery from './pages/Gallery.tsx'
import Session from './pages/Session.tsx'
import About from './pages/About.tsx'
import Contact from './pages/Contact.tsx'
import './App.css'

/** HashRouter keeps the scroll position between routes — reset it on navigation. */
const ScrollToTop = () => {
    const { pathname } = useLocation()
    // Block body on purpose: a concise arrow would return scrollTo's value,
    // which React would then try to call as a cleanup function.
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])
    return null
}

function App() {
    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Start />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/gallery/:slug" element={<Session />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<Start />} />
            </Routes>
        </>
    )
}

export default App
