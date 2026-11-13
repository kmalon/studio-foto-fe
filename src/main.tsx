import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import '@fontsource/cormorant-garamond/latin-300.css'
import '@fontsource/cormorant-garamond/latin-ext-300.css'
import '@fontsource/cormorant-garamond/latin-400.css'
import '@fontsource/cormorant-garamond/latin-ext-400.css'
import '@fontsource/jost/latin-200.css'
import '@fontsource/jost/latin-ext-200.css'
import '@fontsource/jost/latin-300.css'
import '@fontsource/jost/latin-ext-300.css'
import '@fontsource/jost/latin-400.css'
import '@fontsource/jost/latin-ext-400.css'
import './index.css'
import App from './App.tsx'
import { ROUTER_BASENAME } from './seo/site.ts'

const root = document.getElementById('root')!
const app = (
    <StrictMode>
        <BrowserRouter basename={ROUTER_BASENAME}>
            <App />
        </BrowserRouter>
    </StrictMode>
)

// built pages are prerendered (scripts/prerender.mjs) -> hydrate; dev server serves an empty root
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
