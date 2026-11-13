// Post-build: GitHub Pages has no SPA fallback, so every BrowserRouter route
// needs its own HTML file. Known routes get a copy of index.html (HTTP 200);
// 404.html is served for anything else (real HTTP 404) and boots the app,
// which then renders the NotFound page.
import { copyFileSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const dist = 'dist'
const index = join(dist, 'index.html')

const sessions = readdirSync('src/assets/gallery', { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => `gallery/${entry.name}`)

const routes = ['portfolio', 'gallery', 'about', 'contact', ...sessions]

for (const route of routes) {
    const dir = join(dist, route)
    mkdirSync(dir, { recursive: true })
    copyFileSync(index, join(dir, 'index.html'))
}
copyFileSync(index, join(dist, '404.html'))

console.log(`spa-routes: ${routes.length} routes + 404.html`)
