# App Description

## What
Photographer portfolio site, brand "Angelika Malon Fotografia" (SPA, prerendered). Polish content. Static, no backend. SEO target: "Fotograf ślubny Warszawa | Łuków | Angelika Malon" (areas: Warszawa + Łuków everywhere).
Visual direction: minimal dark wedding-photographer portfolio.

## Stack
- React 19 + TypeScript, Vite 6
- react-router 7 (`BrowserRouter`, basename = `ROUTER_BASENAME` = `BASE_URL` WITH trailing `/` = `/`)
- `react-image-gallery` (About page gallery)
- `react-markdown` (gallery session overview)
- `vite-imagetools@9` (vite 6 compat; slideshow srcset) · `@fontsource/{cormorant-garamond,jost}` self-hosted fonts (latin+latin-ext, imported in main.tsx)
- Plain CSS + custom properties (no framework)

## Deploy
- GitHub Pages, custom domain `angelikamalon.pl` (apex, `public/CNAME`; DNS + repo Pages setting manual; GH 301s old kmalon.github.io/studio-foto-fe/*). Also `gh-pages -d dist` (`npm run deploy`)
- `build` = tsc + vite build + `vite build --ssr src/entry-server.tsx --outDir dist-ssr` + `scripts/prerender.mjs`: renders each page in `entry-server.tsx` `pages` -> dist/<route>/index.html (full markup + head tags + JSON-LD, React preload hints moved to head), dist/404.html (noindex), redirect stubs for old EN URLs (`redirects`), sitemap.xml (image entries), robots.txt; deletes dist-ssr. index.html markers `<!--head-->…<!--/head-->` + `<!--app-->`. Client `hydrateRoot` if root has element, else `createRoot` (dev). New route => add to `pages` in entry-server.tsx.
- SSR-safe rule: render output must match server (no window in render; `useColumnCount` = useSyncExternalStore w/ server snapshot 3).
- `vite.config.ts` base: `/` (site at domain root); alias `@assets` -> assets dir (`.env` `ASSETS_SOURCE=internal` -> src/assets | `external` -> `ASSETS_DIR` e.g. `../assets_external`, CI workflow fetches it before build; default `src/assets_external` gitignored, tracked .env keeps internal; missing -> error; `server.fs.allow` adds it); ALL asset imports/globs via `@assets/…` (gallery parses glob keys from path tail); custom plugin `imageSize`: `?size` import -> `{width,height}` via sharp metadata (no emitted file)
- build info (hidden): `vite.config.ts` `buildInfo` -> `__BUILD_INFO__` define {site, assets, assetsSource, built}; site = env `BUILD_SHA` (CI github.sha) || git HEAD; assets = env `ASSETS_SHA` (CI checked-out assets commit) || internal -> site sha || git HEAD of assets dir || unknown. Exposed: `<meta name="build">` (injected before `<!--head-->`, all prerendered pages), `dist/version.json`, `console.info` in main.tsx
- homepage: https://angelikamalon.pl
- CMS: Sveltia at `/admin/` (static `public/admin/{index.html,config.yml}`, unpkg unversioned script, not linked, meta noindex only (no robots Disallow, else crawler never sees noindex)); github backend -> assets repo amalonart/studio_foto_assets main, token auth only (fine-grained PAT Contents RW); collection `gallery` = `assets/gallery/{{slug}}/overview` raw md (slug editable = folder `N_name`), media -> entry `full/`; global media_folder `assets`. altText/slideFocus/thumbial manual. Commits -> auto rebuild via dispatch
- workflow: `.github/workflows/deploy.yml` (triggers: push master, manual, `repository_dispatch` `assets-updated` from assets repo (notify-site.yml + `SITE_DISPATCH_TOKEN` PAT there) -> build + deploy (each guarded) only if .env external; jobs config (sparse .env -> source/dir) -> build -> deploy; build: [if .env ASSETS_SOURCE=external: sparse checkout `assets/` of `ASSETS_REPO` amalonart/studio_foto_assets@`ASSETS_REF` main -> ASSETS_DIR] -> npm ci + build -> Pages); dispatch checks out `client_payload.sha` (assets repo notify-fe.yml sends sha/ref)

## Routes (`src/App.tsx`)
```
/           Start      fullscreen Slideshow (Navbar)
/           (cont.)    below slideshow: h1 + intro (last para inline .text-link portfolio/galerii/napisz do mnie), SessionLinks, Footer
/portfolio  Portfolio  PhotoMasonry + Lightbox
/galeria    Gallery    session cover cards (.photo-grid, caption = title), link to session
/galeria/:slug Session overview.md (ReactMarkdown, whole file shown; `# ` line 1 = h1, headings hyphens -> .h-dash) + PhotoMasonry + Lightbox; unknown slug -> NotFound
/o-mnie     About      h1 big part + smaller `.about-intro__sub` span, bio paras + ImageGallery of session covers; click slide -> its session; + SessionLinks
/kontakt    Contact    details + web3forms form (+ privacy note link)
/polityka-prywatnosci Privacy  RODO policy (admin, form/web3forms, cookies+GA4 section only if GA_ID, rights, copyright section); "Zmień ustawienia cookies" btn
*           NotFound   404 page (PageShell, links home/galeria, noindex)
Old /about /contact /gallery /gallery/<folder> -> static meta-refresh stubs (build only). Folder renumbered => add legacy `/gallery/<old_folder>` entry to `redirects` (done for old 1_/2_ sessions, now 3_/4_).
Internal links: ALWAYS via `src/routes.ts` (`ROUTES.*`, `sessionPath(slug)`), trailing slash (GH Pages 301s slash-less).
```
App.tsx also renders `<Analytics/>` (after Routes: page_view per nav) + `<CookieConsent/>`.
`ScrollToTop` in App.tsx resets scroll on navigation (non-data BrowserRouter doesn't); instant + useLayoutEffect (html has smooth scroll).

## Analytics / consent
- `.env` (tracked, used by CI build): `VITE_GA_ID`, `VITE_WEB3FORMS_KEY`, `ASSETS_SOURCE`, `ASSETS_DIR` (build-time only). GA4 ID = `VITE_GA_ID` (-> `GA_ID` in seo/site.ts; set). Empty -> no GA, no banner, no footer cookie btn, policy says no cookies.
- `src/analytics/ga.ts`: opt-in; gtag.js injected only after accept (Consent Mode v2, ad_* denied, send_page_view false); choice in localStorage `cookie-consent`; external store (subscribe/getConsent/setConsent/openBanner/isBannerOpen); reject -> consent denied + delete `_ga*` cookies.
- `hooks/useConsent.ts` useSyncExternalStore (server snapshot null/false -> banner never prerendered).
- `components/CookieConsent.tsx/.css` fixed bottom bar, Odrzuć/Akceptuję equal. Footer bottom: "Polityka prywatności" link + "Ustawienia cookies" (reopen).

## Structure
```
index.html          lang=pl, favicon.ico/svg + apple-touch-icon + site.webmanifest + theme-color links, head/app markers (template)
src/
  main.tsx          fonts + BrowserRouter + StrictMode; hydrate/createRoot
  entry-server.tsx  SSR render(path) -> {html, head}; `pages` (route + sitemap images), `redirects`
  seo/site.ts       BRAND, PERSON, ROUTER_BASENAME, SITE_ORIGIN/SITE_URL (https://angelikamalon.pl), SOCIALS, AREA_SERVED, LOGO_PATH, pageUrl/absUrl, structuredData (ProfessionalService + Person @graph)
  seo/head.ts       PageMeta type, HeadContext (SSR collector), headTags (description, robots, canonical w/ trailing slash, og:*, twitter:*), headHtml (prerender), applyHead (client upsert)
  App.tsx           routes + ScrollToTop
  routes.ts         ROUTES (trailing-slash link targets) + sessionPath
  index.css         reset + base type, imports styles/tokens.css
  App.css           .container .section .eyebrow .btn .link-underline .text-link (inline prose link) .nowrap .h-dash .photo-grid .photo-card .masonry .masonry__col
  styles/tokens.css design tokens (see below)
  data/portfolio.ts Photo type (opt. `focus` = object-position, `srcSet`, `width`/`height` = build-time size via `?size` glob, `loadSizes`); `photos` (assets/portfolio full+thumbs paired by name) + `featured` + `slides` (assets/start; srcSet via imagetools glob query 640/1024/1600/2048; focus from `@assets/slideFocus.ts`)
  data/gallery.ts   `sessions`/`getSession(slug)` from assets/gallery/<folder>/{full,thumbial,overview.md}; slug = `toSlug(folder)` (drop `N_` prefix, `_`->`-`, PL diacritics stripped); title/description = overview lines 1/2; sorted desc by folder (numeric-aware); thumb = same-name thumbial ?? full; sizes from `?size` glob (thumbial wins); cover = 1st thumbial ?? 1st full
  assets/slideFocus.ts start slide file -> object-position (portrait crop), ambient decl in vite-env.d.ts
  assets/altText.ts unique PL alt (lives in assets dir, import `@assets/altText.ts`, ambient decl in vite-env.d.ts) per photo, key "<dir>/<file>" (start/…, portfolio/…, gallery/<folder>/…); missing -> generic fallback. New photo => add entry
  data/AngelikaInfo.tsx EMAIL only (kontakt@angelikamalon.pl, content -> stays in code)
  components/
    Navbar.tsx/.css fixed; Logo left, links right; transparent -> solid after 40px scroll; burger drawer <900px (full-viewport bg, logo hidden while open via `nav--open`, which drops backdrop-filter)
    Logo.tsx        `public/logo.svg` (potrace of old PNG, 34 KB; black line art, CSS invert + screen blend; `--logo` token + calc() neg. margins crop padding)
    SessionLinks.tsx crawlable <Link> list of sessions (Home, About)
    Slideshow.tsx/.css custom crossfade, auto 5s (`interval` prop), side arrows, ←/→, pauses on hidden tab, caption + counter; srcSet sizes=100vw, 1st slide fetchPriority high, neighbours loading=lazy; portrait screens: object-position from `--focus` (photo.focus) keeps people in crop
    Footer.tsx/.css BRAND + contact + socials (SOCIALS) + copyright + legal links
    PageShell.tsx   Navbar + <main class=shell-main> + Footer
    Lightbox.tsx/.css fullscreen overlay ({photos, index, onIndexChange}); prev/next arrows (wrap), ←/→, swipe, counter, preloads neighbours; Esc/backdrop closes (Portfolio, Session)
    Chevron.tsx     arrow svg (Slideshow, Lightbox)
    PhotoMasonry.tsx balanced masonry: ratios from Photo width/height (build time) -> deterministic layout, 1st batch (cols*3, SSR cols=3) in prerendered HTML; each photo to shortest col (flex cols); img width/height + aspect-ratio (no CLS), 1st row eager rest lazy; next batch when sentinel near viewport (IntersectionObserver); all shown -> `masonry--flush` crops last card per col so bottoms align
  hooks/
    useColumnCount.ts matchMedia cols 3 / 2 (<=900) / 1 (<=560)
    usePageMeta.ts  ({title (full), description, image?, noindex?}) -> SSR: writes HeadContext; client: applyHead. Every page MUST call it (prerender throws otherwise). DEFAULT_IMAGE = 1st slide
  pages/
    Start.tsx/.css  (`.start` height 100svh: small viewport, never under mobile browser bars, static on scroll -> no slide rescale; `useStableStartHeight` `--start-h` px fallback only w/o svh support)
    Privacy.tsx/.css legal page (.legal prose)
    Contact.tsx     web3forms (key = `.env` `VITE_WEB3FORMS_KEY`, read directly here): name, email, date (opt.), venue "Miejsce wydarzenia" (opt.), message
    Portfolio.tsx  Gallery.tsx  Session.tsx/.css  NotFound.tsx/.css
    About.tsx/.css  Contact.tsx/.css
  assets/         (default assets dir) start/ (slides), portfolio/{full,thumbs}, about/, gallery/<folder>/{full,thumbial,overview.md}, altText.ts, slideFocus.ts
scripts/prerender.mjs post-build static pages, 404, redirects, sitemap, robots (see Deploy)
scripts/make-icons.mjs one-off: public/favicon.svg (gold Cormorant "A" path on #0d0d0d) -> favicon.ico (48/32/16), apple-touch-icon.png 180, icon-192/512.png; rerun + commit after svg edit
public/CNAME      custom domain for GH Pages
public/admin/     Sveltia CMS (index.html + config.yml)
public/logo.svg   logo (stable URL, used in JSON-LD)
public/site.webmanifest icons 192/512
```

## Design tokens (`src/styles/tokens.css`)
- `--bg #0d0d0d` `--bg-alt #151515` `--fg #f2f0ed` `--muted #8f8b86` `--line rgba(242,240,237,.14)` `--accent #c9a227`
- `--font-display` Cormorant Garamond (headings) · `--font-ui` Jost (body/nav)
- nav/eyebrow/button text: `--nav-size .78rem`, uppercase, `--nav-track .18em`
- `--maxw 1280px` `--gap` `--section-y` `--pad-x` `--logo clamp(9rem,42vw,15.75rem)` (fluid) `--nav-h = --logo*0.794`
- Dark-only. Headings fluid via `clamp()`.

## Content
Copy Polish; brand "Angelika Malon Fotografia" (BRAND const). Titles pattern "<Page> | fotograf … Warszawa | Łuków | Angelika Malon". Separators: ` | ` between label fragments (titles/alts/meta), plain hyphen ` - ` in prose; no `·`/`–`/`—`. City pair "Warszawa | Łuków" (prose: "z Warszawy i Łukowa", "w Warszawie, Łukowie"); Start h1 city in `.nowrap`; hyphens in headings wrapped in `.h-dash` (Jost; Cormorant `-` is slanted).
Images: own photos in src/assets, webp, named `NN-opis-z-alt.webp` (NN zero-padded = display order, rest = slug of alt text; thumbs/thumbial same name) (globs accept jpg/jpeg/png/webp; `convert-images.sh` converts). overview.md: line 1 `# Title` (no leading spaces, else code block), line 2 = intro + meta desc; all visible. Full how-to in README. Sessions (desc order shown): 4_ ślubna Łazienki, 3_ rodzinno-brzuszkowa, 2_ Paula Smyk (artystka, Łuków), 1_ Julia (kobieca, miejska+studio). New gallery session = new folder in assets/gallery (auto route/sitemap; add alt entries to assets altText.ts). New start image -> add entry to assets `slideFocus.ts` if people off-center. macOS junk (`.DS_Store`, `._*`) gitignored.

## Conventions
- `.tsx`/`.ts` extension included in imports
- Default exports for components
- Colocated CSS per component/page; shared utilities in `App.css`
- BEM-ish class names (`nav__link`, `photo-card__cap`, `is-active`, `is-open`)
- Pages wrap content in `<PageShell>` (except Start: Navbar only)

## Known debt
- Only 1st masonry batch prerendered; rest covered by image sitemap
- `@fit-screen/react` unused
