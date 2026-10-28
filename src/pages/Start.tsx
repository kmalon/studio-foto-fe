import Navbar from '../components/Navbar.tsx'
import Slideshow from '../components/Slideshow.tsx'
import { slides } from '../data/portfolio.ts'
import './Start.css'

const Start = () => (
    <>
        <Navbar />
        <main className="start">
            <Slideshow photos={slides} interval={2000} />
        </main>
    </>
)

export default Start
