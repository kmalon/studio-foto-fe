import Navbar from '../components/Navbar.tsx'
import Slideshow from '../components/Slideshow.tsx'
import { slides } from '../data/portfolio.ts'
import usePageMeta from '../hooks/usePageMeta.ts'
import './Start.css'

const Start = () => {
    usePageMeta(
        'Fotografia ślubna i rodzinna',
        'Studio Foto — fotografia ślubna, rodzinna i portretowa w stylu reportażowym.',
    )

    return (
        <>
            <Navbar />
            <main className="start">
                <Slideshow photos={slides} interval={2000} />
            </main>
        </>
    )
}

export default Start
