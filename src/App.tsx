import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import Home from './pages/Home.tsx'
import Portfolio from './pages/Portfolio.tsx'
import About from './pages/About.tsx'
import Contact from './pages/Contact.tsx'
import './App.css'

/** HashRouter keeps the scroll position between routes — reset it on navigation. */
const ScrollToTop = () => {
    const { pathname } = useLocation()
    useEffect(() => window.scrollTo(0, 0), [pathname])
    return null
}

function App() {
    return (
        <>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<Home />} />
            </Routes>
        </>
    )
}

export default App
