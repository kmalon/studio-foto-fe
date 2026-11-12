# App Description

## What
Photography studio portfolio site (SPA). Polish content. Static, no backend.
Visual direction: minimal dark wedding-photographer portfolio.

## Stack
- React 19 + TypeScript, Vite 6
- react-router 7 (`HashRouter` — required for GH Pages)
- `react-image-gallery` (About page gallery)
- `react-markdown` (gallery session overview)
- Plain CSS + custom properties (no framework)
- `@fit-screen/react` — installed, UNUSED (removable)

## Deploy
- GitHub Pages via `gh-pages -d dist` (`npm run deploy`)
- `vite.config.ts` base: `/studio-foto-fe/`
- homepage: https://kmalon.github.io/studio-foto-fe
- workflow: `.github/workflows/jekyll-gh-pages.yml`

## Routes (`src/App.tsx`)
```
/           Start      fullscreen Slideshow only (Navbar, no footer)
/portfolio  Portfolio  PhotoMasonry + Lightbox
/gallery    Gallery    session cover cards (.photo-grid), link to session
/gallery/:slug Session overview.md (ReactMarkdown, raw) + PhotoMasonry + Lightbox; unknown slug -> /gallery
/about      About      bio + ImageGallery of session covers (1 per session); click slide -> its /gallery/:slug
/contact    Contact    details + mailto form
*           -> Start
```
`ScrollToTop` in App.tsx resets scroll on navigation (HashRouter doesn't); instant + useLayoutEffect (html has smooth scroll).

## Structure
```
index.html          lang=pl, meta, Google Fonts, inline SVG favicon
src/
  main.tsx          HashRouter + StrictMode
  App.tsx           routes + ScrollToTop
  index.css         reset + base type, imports styles/tokens.css
  App.css           .container .section .eyebrow .btn .link-underline .photo-grid .photo-card .masonry .masonry__col
  styles/tokens.css design tokens (see below)
  data/portfolio.ts Photo type (opt. `focus` = object-position); `photos` (assets/portfolio full+thumbs paired by name) + `featured` + `slides` (assets/start; `slideFocus` map file->focus)
  data/gallery.ts   `sessions`/`getSession(slug)` from assets/gallery/<slug>/{full,thumbial,overview.md} via import.meta.glob; sessions sorted desc by folder name (numeric-aware); thumb = same-name thumbial ?? full; cover = 1st thumbial ?? 1st full
  data/AngelikaInfo.tsx EMAIL + web3forms key
  components/
    Navbar.tsx/.css fixed; Logo left, links right; transparent -> solid after 40px scroll; burger drawer <900px (full-viewport bg, logo hidden while open via `nav--open`, which drops backdrop-filter)
    Logo.tsx        `assets/logo.png` (black line art, CSS invert + screen blend; `--logo` token + calc() neg. margins crop padding)
    Slideshow.tsx/.css custom crossfade, auto 5s (`interval` prop), side arrows, ←/→, pauses on hidden tab, caption + counter; portrait screens: object-position from `--focus` (photo.focus) keeps people in crop
    Footer.tsx/.css contact + socials + copyright
    PageShell.tsx   Navbar + <main class=shell-main> + Footer
    Lightbox.tsx/.css fullscreen photo overlay, Esc/click closes (Portfolio, Session)
    PhotoMasonry.tsx balanced masonry: batch (cols*3) preloaded via `new Image()` -> h/w ratios -> each photo to shortest col (flex cols); next batch when current measured + sentinel near viewport (IntersectionObserver) -> unrendered imgs not fetched; all shown -> `masonry--flush` crops last card per col so bottoms align
  hooks/
    useColumnCount.ts matchMedia cols 3 / 2 (<=900) / 1 (<=560)
  pages/
    Start.tsx/.css  Home.tsx/.css (unrouted)  Portfolio.tsx  Gallery.tsx  Session.tsx/.css
    About.tsx/.css  Contact.tsx/.css
  assets/         logo.png, start/ (slides), portfolio/{full,thumbs}, about/, gallery/<session>/{full,thumbial,overview.md}
public/           empty
```

## Design tokens (`src/styles/tokens.css`)
- `--bg #0d0d0d` `--bg-alt #151515` `--fg #f2f0ed` `--muted #8f8b86` `--line rgba(242,240,237,.14)` `--accent #c9a227`
- `--font-display` Cormorant Garamond (headings) · `--font-ui` Jost (body/nav)
- nav/eyebrow/button text: `--nav-size .78rem`, uppercase, `--nav-track .18em`
- `--maxw 1280px` `--gap` `--section-y` `--pad-x` `--logo clamp(9rem,42vw,15.75rem)` (fluid) `--nav-h = --logo*0.794`
- Dark-only. Headings fluid via `clamp()`.

## Content
All copy is generated placeholder Polish (fictional "Studio Foto", kontakt@studiofoto.pl).
Images: own photos in src/assets, webp (globs accept jpg/jpeg/png/webp; `convert-images.sh` converts). New gallery session = new folder in assets/gallery (no code change). New start image -> add entry to `slideFocus` if people off-center. macOS junk (`.DS_Store`, `._*`) gitignored.

## Conventions
- `.tsx`/`.ts` extension included in imports
- Default exports for components
- Colocated CSS per component/page; shared utilities in `App.css`
- BEM-ish class names (`nav__link`, `photo-card__cap`, `is-active`, `is-open`)
- Pages wrap content in `<PageShell>` (except Start: Navbar only)

## Known debt
- Home page unrouted (no `/home`)
- Google Fonts is an external request (system fallbacks in stack)
