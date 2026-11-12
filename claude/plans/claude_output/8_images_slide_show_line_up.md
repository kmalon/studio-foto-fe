# Plan 8 — masonry columns lined up at page end

## Context
Portfolio + gallery Session use `PhotoMasonry` (round-robin: photo i -> col i % cols). Columns end at different heights -> empty space at bottom. Fix: balanced masonry (shortest column) + flush bottom edge once all photos shown. (Plan file name says "slide show", content is about masonry — slideshow untouched.)

## Changes

### `src/components/PhotoMasonry.tsx`
- Replace `loaded` set w/ `ratios: ReadonlyMap<src, number>` (h/w).
- Preload effect: for `photos.slice(0, visible)` w/o ratio -> `new Image()`, src = `thumb ?? src`; onload -> ratio `naturalHeight/naturalWidth`; onerror -> 1. Cleanup: null handlers on unmount.
- `placed` = longest prefix of shown photos w/ known ratio (keeps order deterministic, no reshuffle).
- Layout (pure, recomputed on `cols` change): `heights[cols]`; each photo -> column w/ min height (ties -> leftmost); `heights[c] += ratio`.
- `batchReady` = all shown have ratio; sentinel / IntersectionObserver logic unchanged.
- Drop img `onLoad/onError` (img served from cache after preload).
- `flush = !hasMore && placed.length === photos.length` -> add `masonry--flush` class.

### `src/App.css`
- `.masonry--flush { align-items: stretch; }`
- `.masonry--flush .masonry__col > .photo-card:last-child { flex-grow: 1; display: flex; flex-direction: column; }`
- `... :last-child img { flex: 1 1 auto; min-height: 0; object-fit: cover; }`
- Check `.photo-card__cap` / hover styles still fine.

### `claude/plans/app_description.md`
- PhotoMasonry line: shortest-column placement via preloaded ratios; last card per col cropped to flush bottom when all shown.

## Verification
- `npm run build` (tsc + vite) passes; `npm run lint` if present.
- `npm run dev`: /portfolio + /gallery/<slug> at 3/2/1 cols — scroll to end, bottoms aligned, no gaps; lazy batches still load on scroll; resize changes cols w/o glitch; Lightbox opens correct photo.

## Unresolved questions
No questions

## Branch
feature/8_masonry_line_up
