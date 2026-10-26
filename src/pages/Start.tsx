import Navbar from '../components/Navbar.tsx'
import Slideshow from '../components/Slideshow.tsx'
import { slides } from '../data/portfolio.ts'
import './Start.css'

const Start = () => (
    <>
        <Navbar />
        <main className="start">
            <Slideshow photos={slides} />
        </main>
    </>
)

export default Start
