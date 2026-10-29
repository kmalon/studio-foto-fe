# Plan 3 — Gallery page (sessions)

**Branch:** `feature/3-gallery-page`

## Context
`claude/plans/3_gallery_page.md`: new nav item "Galeria". `src/assets/gallery/<session>/` = one session (`thumbial/`, `full/`, `overview.md`). Gallery page = list of sessions (cover from `thumbial/`). Click → session page: `overview.md` rendered via react-markdown on top, then `full/` images.

## Decisions (answered)
- empty `thumbial/` → cover = first `full/` image
- session view = masonry + lightbox (like Portfolio); grid img = same-name file in `thumbial/` else full
- overview.md passed raw (no dedent) — user fixes file indent
- no title; overview only. Card label: none / folder slug as `alt` only

## Routes (`src/App.tsx`)
```
/gallery         Gallery   session cards grid
/gallery/:slug   Session   overview md + masonry + lightbox
```
Unknown slug → `<Navigate to="/gallery" />`.

## Files
**New dep:** `react-markdown` (npm i).

**New**
- `src/data/gallery.ts`
  - `import.meta.glob` eager: `../assets/gallery/*/full/*.{jpg,jpeg,png,webp}`, `.../thumbial/*.{...}` (import default), `../assets/gallery/*/overview.md` with `query: '?raw'`.
  - group by folder name (path segment after `gallery/`); sort by file name.
  - `type Session = { slug; cover: string; overview: string; photos: Photo[] }` (reuse `Photo` from `data/portfolio.ts`: `src`=full, `thumb`=same-name thumbial ?? full).
  - `cover` = first thumbial ?? first full. Skip sessions with 0 full imgs.
  - export `sessions: Session[]`, `getSession(slug)`.
- `src/components/Lightbox.tsx` — extract lightbox JSX + Esc handler from `Portfolio.tsx`; props `photo | null`, `onClose`. Move `.lightbox*` CSS → `Lightbox.css`. Portfolio uses it (no visual change).
- `src/pages/Gallery.tsx/.css` — `PageShell` + `page-head` (eyebrow "Galeria", h1 + lead placeholder PL) + grid of `<Link to={/gallery/${slug}}>` cards w/ `.photo-card` cover img (aspect 4/5, cover, lazy).
- `src/pages/Session.tsx/.css` — `useParams` → `getSession`; `page-head` holds `<ReactMarkdown>{overview}</ReactMarkdown>` in `.session__overview` (styled p/h/ul/a w/ tokens); `.masonry` grid (reuse Portfolio.css class → move `.masonry` to `App.css`) + `<Lightbox>`; back link `.link-underline` "← Wróć do galerii".

**Modify**
- `src/App.tsx` — 2 routes.
- `src/components/Navbar.tsx` — add `{ to: '/gallery', label: 'Galeria' }` after Portfolio (NavLink non-`end` → active on session page too).
- `src/pages/Portfolio.tsx/.css` — use `Lightbox`, drop moved CSS.
- `claude/plans/app_description.md` — refresh (routes, gallery data, react-markdown; also stale bits: no `/home`, assets folders).

## Note
`full/` jpgs 5–13 MB ship as-is → slow; user should add downscaled thumbial imgs. Not in scope.

## Verify
- `npm run build` + `npm run lint` clean.
- dev: nav "Galeria" → card for sesja_z_krowa (cover = first full) → session page shows overview text (renders as code block until md indent fixed), 2 imgs, lightbox + Esc work; Portfolio lightbox unchanged; `/#/gallery/xyz` → redirect.

No questions
