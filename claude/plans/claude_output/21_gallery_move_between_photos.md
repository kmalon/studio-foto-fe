# 21 Lightbox prev/next navigation

## Context
Session (and Portfolio) Lightbox shows 1 photo only; must close + reopen to see next. Add in-lightbox navigation w/ arrows.

## Changes
- `src/components/Lightbox.tsx`: props -> `{ photos: Photo[], index: number | null, onClose, onIndexChange(i) }`
  - prev/next buttons (same chevron SVG + aria-labels "Poprzednie/Następne zdjęcie" as Slideshow), wrap-around
  - keys ←/→ (+ Esc existing)
  - touch swipe (horizontal >50px) on mobile
  - counter "3 / 24" next to caption
  - buttons `stopPropagation` (backdrop click still closes); hide arrows when photos.length < 2
  - preload neighbours (`new Image().src`) for snappy nav
- `src/components/Lightbox.css`: `.lightbox__arrow(--prev/--next)` mirroring `.slideshow__arrow` (Slideshow.css:72); counter style; smaller arrows on mobile
- `src/pages/Session.tsx` + `src/pages/Portfolio.tsx`: state `active: number | null`; `onSelect={(p) => setActive(photos.indexOf(p))}`; pass `photos`, `index`, `onIndexChange={setActive}`
- `app_description.md`: Lightbox line -> prev/next arrows, ←/→, swipe, counter
- Commit also includes pre-existing uncommitted `src/pages/Start.tsx` change (removed btn links) per CLAUDE.md "all changes"

## Verify
`npm run build` (tsc + prerender OK); `npm run dev` -> session page: open photo, arrows/keys/swipe move, wraps, Esc/backdrop closes; same on Portfolio.

## Questions
No questions (assumed: wrap-around yes, Portfolio gets same nav since shared component, Start.tsx diff committed together).

## Branch
`feature/21_lightbox_prev_next_navigation`
