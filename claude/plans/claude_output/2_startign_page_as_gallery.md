# Plan 2 — Start page as fullscreen gallery

**Branch:** `feature/2-starting-page-as-gallery`

## Context
`claude/plans/2_startign_page_as_gallery.md`: `/` = only a fullscreen gallery, auto-advance every X s, manual side arrows, navbar overlaid (links right, logo left), old Home reachable from menu.

## Routes (`src/App.tsx`)
```
/           Start      NEW fullscreen slideshow (no footer)
/home       Home       existing page, unchanged content
/portfolio /about /contact  unchanged
*           -> Start
```

## Files

**New**
- `src/components/Slideshow.tsx` + `.css` — custom, no new dep (react-image-gallery = thumbnail-gallery look, harder to make full-bleed cover).
  - props: `photos: Photo[]`, `interval = 5000`.
  - state `index`; `setTimeout` keyed on `index` → auto-advance; manual nav resets timer automatically (effect re-runs on index change).
  - all slides stacked absolute, `object-fit: cover`, crossfade via `opacity` + `.is-active`; render all imgs (browser loads them; first `fetchpriority="high"`).
  - prev/next `<button>` arrows left/right edges, vertically centered, thin SVG chevrons, `aria-label` "Poprzednie zdjęcie"/"Następne zdjęcie".
  - keyboard ←/→ (window keydown); pause on `document.hidden`; `prefers-reduced-motion` → no fade.
  - caption bottom-left + counter `03 / 09` bottom-right (small, `--nav-size` uppercase).
  - dark gradient top overlay so navbar readable.
- `src/components/Logo.tsx` — inline SVG monogram "S" (same as favicon: gold serif on square/ring) + wordmark "Studio Foto". Used in Navbar brand.
- `src/pages/Start.tsx` + `.css` — `<Navbar />` + `<main class="start"><Slideshow photos={photos} /></main>`; `height: 100svh`, `overflow: hidden`. No `PageShell` (no footer).

**Modify**
- `src/App.tsx` — routes as above.
- `src/components/Navbar.tsx` — links: `Start → /` (end), add `Strona główna → /home`, rest same; brand → `<Logo />` linking `/`. Layout already brand-left / links-right (`space-between`) — keep.
- `src/components/Navbar.css` — `.nav__brand` flex + gap for svg mark.
- `src/pages/Home.tsx` — nothing except any internal `/` links (none present).
- `src/data/portfolio.ts` — reuse `photos`; optional `slideshow` export (landscape picsum `1600x1000` sizes for full-bleed instead of 900x1200 portrait).

## Verify
- `npm run build` + `npm run lint` clean.
- `npm run dev`: `/` fullscreen slides, auto change ~5 s, arrows + ←/→ work, timer resets after click, nav right + logo left, burger <900px still works over slideshow; `/#/home` shows old Home; active link highlighting correct.

## Unresolved questions
1. Interval X — default 5 s ok?
2. Menu label for old Home — "Strona główna"? (Keep "Start" for gallery)
3. Logo — generated SVG "S" monogram + wordmark ok, or you have a logo file?
4. Slideshow photos — same `photos` list (9) or separate landscape set?
