# Plan 11 — trailing slashes, SSR masonry, favicon, mobile zoom, contact

## Context
SEO audit: internal links 301 (no trailing slash), masonry photos absent from prerendered HTML, favicon = data URI (not crawlable), mobile Start zoom bug, contact form conversion.

## 1. Trailing slash links
- New `src/routes.ts`: `ROUTES = { home:'/', portfolio:'/portfolio/', gallery:'/galeria/', about:'/o-mnie/', contact:'/kontakt/' }`, `sessionPath(slug) = /galeria/${slug}/`.
- Use in: Navbar (links + logo), Footer, Start, NotFound, Session (back), Gallery cards, SessionLinks, About `navigate`.
- Home href: basename `/studio-foto-fe` + `/` renders `/studio-foto-fe` (no slash) → set router basename = `BASE_URL` WITH trailing slash (`/studio-foto-fe/`) in `main.tsx` + `entry-server.tsx` (RR7 joinPaths normalizes `//`; stripBasename accepts trailing slash). Add `ROUTER_BASENAME` in `seo/site.ts`.
- `entry-server` `pages`/`redirects` keep paths (pageUrl already adds slash); StaticRouter location ok.
- Verify: `grep 'href="/studio-foto-fe[^"]*[^/"]"' dist/**/*.html` → no internal hits (except assets).

## 2. Masonry photos in prerendered HTML
- Dimensions at build: extra glob over thumbs (portfolio thumbs, gallery thumbial + full fallback) with vite-imagetools query `as: 'meta:width;height'` (no new asset emitted). If imagetools emits extra files/slow → fallback: `scripts/image-sizes.mjs` (sharp, already in node_modules) writing `src/data/imageSizes.json`, run in `build` before tsc.
- `Photo` type: add `width?`, `height?`. Fill in `data/portfolio.ts` + `data/gallery.ts`.
- `PhotoMasonry`: drop `new Image()` preloading + ratios state; ratio = height/width (fallback 1). Layout deterministic → first batch (cols*3, server cols=3) rendered in SSR. Keep IntersectionObserver batches, flush logic. `<img width height>` attrs + aspectRatio → no CLS. First row eager, rest `loading="lazy"`.
- Result: prerendered portfolio/session pages contain first 9 `<img>` w/ alt.

## 3. Favicon
- `scripts/make-icons.mjs` (one-off, sharp): from `public/favicon.svg` (current "A" svg, letter as path-free text→ render via sharp) → `public/favicon.ico` (48×48 PNG-in-ICO, hand-written header), `apple-touch-icon.png` 180, `icon-192.png`, `icon-512.png`. Commit outputs.
- `public/site.webmanifest` (name BRAND, short_name, icons relative, theme/bg `#0d0d0d`, start_url `./`).
- `index.html`: replace data URI with `<link rel=icon href=/favicon.ico sizes=48x48>`, `<link rel=icon type=image/svg+xml href=/favicon.svg>`, apple-touch-icon, manifest, `theme-color` (Vite prefixes base).

## 4. Mobile Start zoom on scroll
- Slide photo rescales while scrolling: viewport height change (URL bar hide) resizes `.start` → `object-fit: cover` rescales.
- Fix: `.start { height: var(--start-h, 100svh) }`; Start.tsx effect sets `--start-h = innerHeight px` on mount + on resize only when width changes (orientation), ignoring height-only resizes. SSR markup unchanged (CSS fallback) → no hydration mismatch.

## 5. Contact
- Label "Data wydarzenia (opcjonalnie)".
- New text field "Miejsce wydarzenia" (optional, `name=venue`) next to date in `.form__row`; payload `'miejsce wydarzenia': form.venue || 'nie podano'`; reset state.

## 6. Docs
- Update `app_description.md` (routes.ts, basename w/ slash, Photo dims, favicon files, contact fields, remove masonry debt).

## Verification
- `npm run build` + `npm run lint`; inspect `dist/portfolio/index.html`, session pages for `<img` count + alt; links end with `/`; `dist/favicon.ico` exists.
- `npm run preview`: nav works, active NavLink states, masonry loads more on scroll, no reshuffle, contact form renders.

## Answered
- Zoom = slide photo rescales → stable-height fix.
- Favicon = keep gold "A" on black.
- Field = "Miejsce wydarzenia", optional (payload key `'miejsce wydarzenia'`).

No questions

## Branch
`feature/11_trailing_slash_ssr_masonry_favicon`
