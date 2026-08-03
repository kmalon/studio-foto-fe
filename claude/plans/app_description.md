# App Description

## What
Photography studio portfolio site (SPA). Polish content. Static, no backend.
Visual direction: minimal dark wedding-photographer portfolio (ref: www.szymonolma.pl).

## Stack
- React 19 + TypeScript, Vite 6
- react-router 7 (`HashRouter` — required for GH Pages)
- `react-image-gallery` (About page gallery)
- Plain CSS + custom properties (no framework)
- `@fit-screen/react` — installed, UNUSED (removable)

## Deploy
- GitHub Pages via `gh-pages -d dist` (`npm run deploy`)
- `vite.config.ts` base: `/studio-foto-fe/`
- homepage: https://kmalon.github.io/studio-foto-fe
- workflow: `.github/workflows/jekyll-gh-pages.yml`

## Routes (`src/App.tsx`)
```
/           Home       hero + intro + work preview + CTA
/portfolio  Portfolio  masonry grid + lightbox
/about      About      bio + facts + ImageGallery
/contact    Contact    details + mailto form
*           -> Home
```
`ScrollToTop` in App.tsx resets scroll on navigation (HashRouter doesn't).

## Structure
```
index.html          lang=pl, meta, Google Fonts, inline SVG favicon
src/
  main.tsx          HashRouter + StrictMode
  App.tsx           routes + ScrollToTop
  index.css         reset + base type, imports styles/tokens.css
  App.css           .container .section .eyebrow .btn .link-underline .photo-grid .photo-card
  styles/tokens.css design tokens (see below)
  data/portfolio.ts Photo[] `photos` + `featured` (=photos.slice(0,3))
  components/
    Navbar.tsx/.css fixed; transparent -> solid after 40px scroll; burger drawer <900px
    Footer.tsx/.css contact + socials + copyright
    PageShell.tsx   Navbar + <main class=shell-main> + Footer
  pages/
    Home.tsx/.css       Portfolio.tsx/.css
    About.tsx/.css      Contact.tsx/.css
  assets/         aaa.jpg (BW couple), bbb.jpg (UNUSED, 15 MB), ccc.png (hero, winter aerial)
public/           empty
```

## Design tokens (`src/styles/tokens.css`)
- `--bg #0d0d0d` `--bg-alt #151515` `--fg #f2f0ed` `--muted #8f8b86` `--line rgba(242,240,237,.14)` `--accent #c9a227`
- `--font-display` Cormorant Garamond (headings) · `--font-ui` Jost (body/nav)
- nav/eyebrow/button text: `--nav-size .78rem`, uppercase, `--nav-track .18em`
- `--maxw 1280px` `--gap` `--section-y` `--pad-x` `--nav-h 4.75rem`
- Dark-only. Headings fluid via `clamp()`.

## Content
All copy is generated placeholder Polish (fictional "Studio Foto", kontakt@studiofoto.pl).
Grid images: 2 local assets + picsum.photos URLs.

## Conventions
- `.tsx`/`.ts` extension included in imports
- Default exports for components
- Colocated CSS per component/page; shared utilities in `App.css`
- BEM-ish class names (`nav__link`, `photo-card__cap`, `is-active`, `is-open`)
- Pages wrap content in `<PageShell>`

## Known debt
- `src/assets/bbb.jpg` = 15 MB, unreferenced — downscale or delete
- `ccc.png` = 1.5 MB, ships in bundle as hero
- Google Fonts is an external request (system fallbacks in stack)
