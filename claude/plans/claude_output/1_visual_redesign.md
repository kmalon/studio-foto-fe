# Plan 1 — Visual redesign (skeleton → photographer portfolio)

**Branch:** `feature/1-visual-redesign`

## Context
Repo is a Vite+React starter skeleton with placeholder junk (`Czeeeee!`, `ffdsafdsa`), unstyled `<ul>` navbar, Vite default dark theme, dead commented code, `/contact` link with no route. `claude/plans/0_init.md` asks: make it visually like www.szymonolma.pl (minimal PL wedding-photo portfolio), fix styles + home menu, generate own content. Outcome: presentable dark portfolio site, 4 routes, responsive, deployable to GH Pages unchanged.

Decisions (confirmed): Polish content · routes Home/Portfolio/About/Contact · local 3 photos + picsum for grids.

## Design system (new `src/styles/tokens.css`, imported by `index.css`)
- Palette: `--bg #0d0d0d`, `--bg-alt #151515`, `--fg #f2f0ed`, `--muted #8f8b86`, `--line rgba(242,240,237,.14)`, `--accent #c9a227`.
- Type: display `Cormorant Garamond` (serif), UI/nav `Jost` (sans) — Google Fonts `<link>` in `index.html`, system fallbacks in stack.
- Scale: fluid `clamp()` for h1/h2; nav = 0.78rem, uppercase, `letter-spacing:.18em`.
- Spacing/layout vars: `--gap`, `--section-y`, `--maxw 1280px`.
- Global: `box-sizing:border-box`, `img{max-width:100%;display:block}`, remove `place-items:center` on body, remove `text-align:center` on `#root`.

## Files

**Rewrite**
- `src/index.css` — reset + tokens import + base type. Drop Vite starter button/link/`prefers-color-scheme` block (site is dark-only).
- `src/App.css` — delete `.logo` + `logo-spin` + `.first-page*` + `.main`. Replace with layout/section/grid/button utilities.
- `src/Navbar.tsx` — `<header>`; centered wordmark `STUDIO FOTO`; `NavLink` items START / PORTFOLIO / O MNIE / KONTAKT with active underline; `position:fixed`, transparent over hero → solid `--bg` after 40px scroll (`useState` + scroll listener); hamburger → full-screen drawer below 900px (`useState`, close on route change via `useLocation`).
- `src/pages/Home.tsx` — sections: (1) full-viewport hero `ccc.png` + dark gradient overlay, serif headline + tagline + scroll cue; (2) intro split — `aaa.JPG` portrait + "Cześć, jestem…" copy; (3) work preview 3-col grid (picsum) w/ hover zoom + caption, link → `/portfolio`; (4) CTA band; renders `<Footer/>`.
- `src/pages/About.tsx` — page header, bio columns, restyled `ImageGallery` (keep `react-image-gallery`); `<Footer/>`.
- `src/pages/About.css` → replace `.gallery-page`/`.aaa` absolute-centering hacks; add dark overrides for `.image-gallery-*` (bullets, thumbnails, nav arrows).
- `index.html` — `lang="pl"`, real `<title>`, meta description, font links, remove `vite.svg` favicon ref (point at existing asset or drop).

**New**
- `src/components/Footer.tsx` + `Footer.css` — contact line, IG/FB text links, copyright.
- `src/components/PageShell.tsx` — `Navbar` + `<main>` + `Footer` wrapper so pages stop repeating it.
- `src/pages/Portfolio.tsx` + `.css` — responsive grid (CSS `columns` masonry), `useState` lightbox overlay (Esc/click to close). Sources: 2 local + picsum.
- `src/pages/Contact.tsx` + `.css` — split layout: copy/details left, form right; submit builds `mailto:` (no backend).
- `src/data/portfolio.ts` — typed array of `{src, alt, caption}` used by Home preview + Portfolio.

**Delete**
- `src/Gallery.tsx` (100% commented out), `src/assets/react.svg`, `public/vite.svg` (if favicon rewired).

**Routes** — `src/App.tsx`: strip all comment blocks; add `/portfolio`, `/contact`; add `*` → `Home`.

## Notes / risks
- `src/assets/bbb.jpg` is **15 MB** — will not be used as a CSS background (would dominate bundle). Left on disk, unreferenced; recommend downscaling or deleting in a follow-up.
- `HashRouter` + `base:'/studio-foto-fe/'` stay untouched — GH Pages deploy unaffected.
- Google Fonts is an external request; fallback stack keeps layout sane offline.

## Verification
1. `npm run dev` → check `/`, `/#/portfolio`, `/#/about`, `/#/contact`; every nav item resolves (no blank `/contact`).
2. Resize 1440 / 900 / 390 px — no horizontal scroll; hamburger appears <900px, drawer opens/closes, closes on navigation.
3. Navbar transparent on hero, solid after scroll; active item underlined.
4. Lightbox: open, Esc closes, click-outside closes.
5. `npm run lint` clean; `npm run build` succeeds; `npm run preview` renders identically.

## Unresolved questions
No questions.
