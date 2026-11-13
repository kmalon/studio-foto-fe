import { Link } from 'react-router'
import { sessions } from '../data/gallery.ts'

/** Crawlable <a href> list of all gallery sessions (Home, About). */
const SessionLinks = () => (
    <ul className="session-links">
        {sessions.map(({ slug, title }) => (
            <li key={slug}>
                <Link to={`/galeria/${slug}`} className="link-underline">
                    {title}
                </Link>
            </li>
        ))}
    </ul>
)

export default SessionLinks
