# Plan 9 — BrowserRouter + 404

## Context
HashRouter URLs (`/#/portfolio`) bad for SEO (crawlers ignore fragment, all pages = 1 URL). Switch to clean paths. GH Pages static → no SPA fallback; need build-time route files. Add real 404 page (now `*` -> Start).

## Approach
Static per-route copies of `index.html` → known routes return HTTP 200, unknown → GH Pages `404.html` (HTTP 404, real status for SEO) which boots app → React renders NotFound. No redirect hacks (`?/path` trick hurts SEO).

## Steps
1. `src/main.tsx`: `HashRouter` → `BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}` (works dev `/` + prod `/studio-foto-fe`).
2. `src/pages/NotFound.tsx/.css`: PageShell; eyebrow "404", heading "Nie znaleziono strony", short text, `.btn` links → `/` + `/gallery`. meta via step 6b.
3. `src/App.tsx`: `*` → `<NotFound />`; update ScrollToTop comment (HashRouter → BrowserRouter, no data-router scroll restore).
4. `src/pages/Session.tsx`: unknown slug → `<NotFound />` instead of `Navigate /gallery` (consistent w/ server 404).
5. `scripts/spa-routes.mjs` (node, no deps): after vite build copy `dist/index.html` → `dist/{portfolio,gallery,about,contact}/index.html`, `dist/gallery/<slug>/index.html` per folder in `src/assets/gallery`, + `dist/404.html`.
6. `package.json` build: `tsc -b && vite build && node scripts/spa-routes.mjs` (covers Actions workflow + `npm run deploy`).
6b. Per-route meta: `src/hooks/usePageMeta.ts(title, description?)` — useEffect sets `document.title` + updates existing `meta[name=description]` (index.html keeps defaults; no duplicate tags; restore on unmount not needed — every page sets own). Call in Start, Portfolio, Gallery, Session (session title + overview-derived/plain desc), About, Contact, NotFound. Polish placeholder copy, format `<Page> — Studio Foto`. NotFound also adds `meta robots noindex` via React 19 hoisting.
7. Staged Home.tsx/.css deletion → include in commit.
8. Update `app_description.md` (BrowserRouter, 404, spa-routes script, Home removed, routes table).

## Verify
- `npm run build` → check dist route dirs + 404.html; `npm run lint`.
- `npm run preview`: `/studio-foto-fe/portfolio` direct load, nav links, `/studio-foto-fe/gallery/<slug>` reload, `/studio-foto-fe/xyz` + bad slug → 404 page.

## Questions
No questions (answered: bad slug → 404; per-route meta → now).

## Branch
`feature/9_browser_router_404`
