# Plan 10 — SEO

## Context
Site = client-only SPA: empty HTML, generic titles/alt, Google Fonts, 572 KB PNG logo, English URLs. Goal: crawlable prerendered HTML, brand "Angelika Malon Fotografia", Polish URLs, structured data, image sitemap.

## Decisions
- Prerender: custom SSR (no vite-react-ssg — would force data router rewrite). `vite build --ssr src/entry-server.tsx` + `scripts/prerender.mjs` (replaces `scripts/spa-routes.mjs`).
- SITE_URL = `https://kmalon.github.io/studio-foto-fe` (one constant).
- Old URLs -> redirect stubs. Alt text -> I view all photos.

## Steps
1. **Cleanup**: remove debug script (`index.html`), DebugBoundary + `__report` (`src/main.tsx`).
2. **Site config** `src/seo/site.ts`: BRAND "Angelika Malon Fotografia", SITE_ORIGIN, SITE_URL, EMAIL (reuse `data/AngelikaInfo.tsx`), socials (IG/FB, moved from Footer), areaServed (Warszawa, mazowieckie, Polska), `absUrl(path)`.
3. **Routes PL** (`App.tsx`, Navbar, Footer, NotFound, Gallery, Session back link): `/`, `/portfolio`, `/galeria`, `/galeria/:slug`, `/o-mnie`, `/kontakt`.
   - `data/gallery.ts`: `slug` = folder sans `^\d+_`, `_`->`-`, PL diacritics transliterated, lowercase; keep `folder` for sort/glob. Add `title`/`description` (move `metaFromOverview` from Session.tsx).
4. **Meta system**: rewrite `hooks/usePageMeta.ts` -> `usePageMeta({title, description, image?, noindex?})`.
   - Server: writes into `HeadContext` collector (render-time).
   - Client: useEffect upserts `<title>`, description, canonical, robots, og:title/description/image/url/type/site_name/locale, twitter:card/title/description/image. Renders nothing -> no hydration mismatch.
   - Canonical = `absUrl(pathname)` with trailing slash.
   - NotFound: drop hoisted `<meta robots>`, pass `noindex`.
5. **Titles/descriptions** (around "Fotograf ślubny Warszawa | Angelika Malon"):
   - `/` "Fotograf ślubny Warszawa | Angelika Malon"
   - portfolio "Portfolio – fotografia ślubna Warszawa | Angelika Malon"
   - galeria "Galeria sesji ślubnych i rodzinnych | Angelika Malon"
   - session "<title> – fotograf Warszawa | Angelika Malon"
   - o-mnie "O mnie – fotograf ślubny z Warszawy | Angelika Malon"
   - kontakt "Kontakt – fotograf ślubny Warszawa | Angelika Malon"
   - descriptions 140–160 chars, PL, keyword-led.
6. **SSR entry** `src/entry-server.tsx`: `render(url)` -> renderToString(`<StaticRouter basename location><HeadContext><App/>`) + collected head; exports `routes()` (page list incl. sessions), `photos`, `slides`, `sessions` for sitemap.
   - `main.tsx`: `hydrateRoot` if `#root` has children else `createRoot` (dev).
   - `useColumnCount`: `useSyncExternalStore` w/ server snapshot 3 (SSR + hydration safe). Guard other window use if build breaks (react-image-gallery check).
7. **prerender.mjs** (build: `tsc -b && vite build && vite build --ssr src/entry-server.tsx --outDir dist-ssr && node scripts/prerender.mjs`):
   - per route: template `dist/index.html`, inject head tags + JSON-LD at `<!--head-->`, app html at `<!--app-->`, write `dist/<route>/index.html`.
   - `404.html`: NotFound render + static `<meta name="robots" content="noindex">`.
   - redirect stubs for old `/about /contact /gallery /gallery/<oldFolder>` (meta refresh + canonical + noindex).
   - `sitemap.xml` w/ `image:image` (home: slides, portfolio: all photos, session: its photos, galeria: covers) + `robots.txt` (Sitemap line).
   - delete `dist-ssr`; gitignore it. Remove `scripts/spa-routes.mjs`.
8. **JSON-LD** (injected every page): `@graph` ProfessionalService (name, url, logo, image, email, areaServed, sameAs IG/FB, founder->Person) + Person (Angelika Malon, jobTitle Fotograf, image, sameAs).
9. **Home** (`pages/Start.tsx/.css`): slideshow stays fullscreen; below: section w/ `<h1>Fotograf ślubny Warszawa – Angelika Malon Fotografia</h1>`, ~200 words PL copy, links Portfolio/Galeria/Kontakt (btn), list of session `<Link>`s (title + cover), then `<Footer/>`.
10. **About**: keep ImageGallery; add list of real `<Link>` to each session below it (title).
11. **Brand rename**: Footer brand + copyright, Logo alt, favicon letter "A", contact form subject, index.html default title/description -> "Angelika Malon Fotografia". `usePageMeta` SITE constant gone.
12. **Alt text**: build contact sheets (sharp, scratchpad) of all start/portfolio/session photos; write `src/data/altText.ts` map `"<dir>/<file>" -> alt` (unique, descriptive PL, e.g. "Panna młoda poprawia welon w Łazienkach Królewskich"). Fallback: context + index. Gallery cards alt = session title; About gallery alt = session title.
13. **Logo SVG**: trace `logo.png` once with npm `potrace` (npx in scratchpad) -> `public/logo.svg` (stable URL for JSON-LD), optimized; `Logo.tsx` uses `${BASE_URL}logo.svg`; delete `logo.png`. Verify CSS invert/crop margins unchanged visually.
14. **Slideshow srcset**: add `vite-imagetools`; `data/portfolio.ts` slides get `srcSet` via glob query `w=640;1024;1600;2048&format=webp&as=srcset`; `<img srcSet sizes="100vw">`; `fetchPriority="high"` only first slide, others `loading` default; type `Photo.srcSet?`.
15. **Fonts**: add `@fontsource/cormorant-garamond` (300,400) + `@fontsource/jost` (200,300,400), import in `main.tsx` (latin + latin-ext); drop Google links/preconnect from index.html.
16. **Cleanup**: remove unused `@fit-screen/react`? — no, out of scope. Update README if it mentions routes/spa-routes.

## Verification
- `npm run lint`, `npm run build` ok.
- `dist/{,portfolio,galeria,galeria/<slug>,o-mnie,kontakt}/index.html` contain h1, content, unique title/description, canonical, og/twitter, JSON-LD; `dist/404.html` has noindex; old-path stubs redirect.
- `sitemap.xml` valid, image entries present; `robots.txt`.
- `npx vite preview`: navigate pages, no hydration errors in console (check via browser if available), slideshow srcset loads small size on narrow viewport, fonts served locally, logo SVG renders same.

## Unresolved questions
No questions

## Branch
feature/10_seo_prerender
