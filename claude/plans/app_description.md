# App Description

## What
Photographer portfolio site, brand "Angelika Malon Fotografia" (SPA, prerendered). Polish content. Static, no backend. SEO target: "Fotograf ślubny Warszawa | Angelika Malon".
Visual direction: minimal dark wedding-photographer portfolio.

## Stack
- React 19 + TypeScript, Vite 6
- react-router 7 (`BrowserRouter`, basename = `BASE_URL` sans trailing `/`)
- `react-image-gallery` (About page gallery)
- `react-markdown` (gallery session overview)
- `vite-imagetools@9` (vite 6 compat; slideshow srcset) · `@fontsource/{cormorant-garamond,jost}` self-hosted fonts (latin+latin-ext, imported in main.tsx)
- Plain CSS + custom properties (no framework)

## Deploy
- GitHub Pages via `gh-pages -d dist` (`npm run deploy`)
- `build` = tsc + vite build + `vite build --ssr src/entry-server.tsx --outDir dist-ssr` + `scripts/prerender.mjs`: renders each page in `entry-server.tsx` `pages` -> dist/<route>/index.html (full markup + head tags + JSON-LD, React preload hints moved to head), dist/404.html (noindex), redirect stubs for old EN URLs (`redirects`), sitemap.xml (image entries), robots.txt; deletes dist-ssr. index.html markers `<!--head-->…<!--/head-->` + `<!--app-->`. Client `hydrateRoot` if root has element, else `createRoot` (dev). New route => add to `pages` in entry-server.tsx.
- SSR-safe rule: render output must match server (no window in render; `useColumnCount` = useSyncExternalStore w/ server snapshot 3).
- `vite.config.ts` base: `/studio-foto-fe/`
- homepage: https://kmalon.github.io/studio-foto-fe
- workflow: `.github/workflows/jekyll-gh-pages.yml`

## Routes (`src/App.tsx`)
```
/           Start      fullscreen Slideshow (Navbar)
/           (cont.)    below slideshow: h1 + ~200 words intro, btn links Portfolio/Galeria/Kontakt, SessionLinks, Footer
/portfolio  Portfolio  PhotoMasonry + Lightbox
/galeria    Gallery    session cover cards (.photo-grid, caption = title), link to session
/galeria/:slug Session overview.md (ReactMarkdown, raw) + PhotoMasonry + Lightbox; unknown slug -> NotFound
/o-mnie     About      bio + ImageGallery of session covers; click slide -> its session; + SessionLinks
/kontakt    Contact    details + web3forms form
*           NotFound   404 page (PageShell, links home/galeria, noindex)
Old /about /contact /gallery /gallery/<folder> -> static meta-refresh stubs (build only).
```
`ScrollToTop` in App.tsx resets scroll on navigation (non-data BrowserRouter doesn't); instant + useLayoutEffect (html has smooth scroll).

## Structure
```
index.html          lang=pl, inline SVG favicon "A", head/app markers (template)
src/
  main.tsx          fonts + BrowserRouter + StrictMode; hydrate/createRoot
  entry-server.tsx  SSR render(path) -> {html, head}; `pages` (route + sitemap images), `redirects`
  seo/site.ts       BRAND, PERSON, SITE_URL (https://kmalon.github.io/studio-foto-fe), SOCIALS, AREA_SERVED, LOGO_PATH, pageUrl/absUrl, structuredData (ProfessionalService + Person @graph)
  seo/head.ts       PageMeta type, HeadContext (SSR collector), headTags (description, robots, canonical w/ trailing slash, og:*, twitter:*), headHtml (prerender), applyHead (client upsert)
  App.tsx           routes + ScrollToTop
  index.css         reset + base type, imports styles/tokens.css
  App.css           .container .section .eyebrow .btn .link-underline .photo-grid .photo-card .masonry .masonry__col
  styles/tokens.css design tokens (see below)
  data/portfolio.ts Photo type (opt. `focus` = object-position, `srcSet`); `photos` (assets/portfolio full+thumbs paired by name) + `featured` + `slides` (assets/start; srcSet via imagetools glob query 640/1024/1600/2048; `slideFocus` map file->focus)
  data/gallery.ts   `sessions`/`getSession(slug)` from assets/gallery/<folder>/{full,thumbial,overview.md}; slug = `toSlug(folder)` (drop `N_` prefix, `_`->`-`, PL diacritics stripped); title/description = overview lines 1/2; sorted desc by folder (numeric-aware); thumb = same-name thumbial ?? full; cover = 1st thumbial ?? 1st full
  data/altText.ts   unique PL alt per photo, key "<dir>/<file>" (start/…, portfolio/…, gallery/<folder>/…); missing -> generic fallback. New photo => add entry
  data/AngelikaInfo.tsx EMAIL + web3forms key
  components/
    Navbar.tsx/.css fixed; Logo left, links right; transparent -> solid after 40px scroll; burger drawer <900px (full-viewport bg, logo hidden while open via `nav--open`, which drops backdrop-filter)
    Logo.tsx        `public/logo.svg` (potrace of old PNG, 34 KB; black line art, CSS invert + screen blend; `--logo` token + calc() neg. margins crop padding)
    SessionLinks.tsx crawlable <Link> list of sessions (Home, About)
    Slideshow.tsx/.css custom crossfade, auto 5s (`interval` prop), side arrows, ←/→, pauses on hidden tab, caption + counter; srcSet sizes=100vw, 1st slide fetchPriority high, neighbours loading=lazy; portrait screens: object-position from `--focus` (photo.focus) keeps people in crop
    Footer.tsx/.css BRAND + contact + socials (SOCIALS) + copyright
    PageShell.tsx   Navbar + <main class=shell-main> + Footer
    Lightbox.tsx/.css fullscreen photo overlay, Esc/click closes (Portfolio, Session)
    PhotoMasonry.tsx balanced masonry: batch (cols*3) preloaded via `new Image()` -> h/w ratios -> each photo to shortest col (flex cols); next batch when current measured + sentinel near viewport (IntersectionObserver) -> unrendered imgs not fetched; all shown -> `masonry--flush` crops last card per col so bottoms align
  hooks/
    useColumnCount.ts matchMedia cols 3 / 2 (<=900) / 1 (<=560)
    usePageMeta.ts  ({title (full), description, image?, noindex?}) -> SSR: writes HeadContext; client: applyHead. Every page MUST call it (prerender throws otherwise). DEFAULT_IMAGE = 1st slide
  pages/
    Start.tsx/.css  Portfolio.tsx  Gallery.tsx  Session.tsx/.css  NotFound.tsx/.css
    About.tsx/.css  Contact.tsx/.css
  assets/         start/ (slides), portfolio/{full,thumbs}, about/, gallery/<folder>/{full,thumbial,overview.md}
scripts/prerender.mjs post-build static pages, 404, redirects, sitemap, robots (see Deploy)
public/logo.svg   logo (stable URL, used in JSON-LD)
```

## Design tokens (`src/styles/tokens.css`)
- `--bg #0d0d0d` `--bg-alt #151515` `--fg #f2f0ed` `--muted #8f8b86` `--line rgba(242,240,237,.14)` `--accent #c9a227`
- `--font-display` Cormorant Garamond (headings) · `--font-ui` Jost (body/nav)
- nav/eyebrow/button text: `--nav-size .78rem`, uppercase, `--nav-track .18em`
- `--maxw 1280px` `--gap` `--section-y` `--pad-x` `--logo clamp(9rem,42vw,15.75rem)` (fluid) `--nav-h = --logo*0.794`
- Dark-only. Headings fluid via `clamp()`.

## Content
Copy Polish; brand "Angelika Malon Fotografia" (BRAND const). Titles pattern "<Page> – … | Angelika Malon".
Images: own photos in src/assets, webp (globs accept jpg/jpeg/png/webp; `convert-images.sh` converts). New gallery session = new folder in assets/gallery (auto route/sitemap; add alt entries to altText.ts). New start image -> add entry to `slideFocus` if people off-center. macOS junk (`.DS_Store`, `._*`) gitignored.

## Conventions
- `.tsx`/`.ts` extension included in imports
- Default exports for components
- Colocated CSS per component/page; shared utilities in `App.css`
- BEM-ish class names (`nav__link`, `photo-card__cap`, `is-active`, `is-open`)
- Pages wrap content in `<PageShell>` (except Start: Navbar only)

## Known debt
- Masonry photos not in prerendered HTML (measured client-side); image sitemap covers them
- `@fit-screen/react` unused
