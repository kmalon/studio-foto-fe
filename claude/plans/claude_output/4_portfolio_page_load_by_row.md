# Plan 4 — Portfolio load by row

**Branch:** `feature/4-portfolio-page-load-by-row`

## Context
`claude/plans/4_portfolio_page_load_by_row.md`: Portfolio `.masonry` = CSS `columns` → order goes down col 1, then col 2. Want row order (1,2,3 top row). Also only fetch imgs visible on page; rest while scrolling. Now: `loading="lazy"` on imgs w/o size → collapse to 0 height → browser fetches many/all at once.

## Decisions (answered)
- row-order masonry: JS round-robin split into N cols (photo i → col i % N), keep uneven heights
- shared component for Portfolio + Session (`/gallery/:slug`)

## Files
**New**
- `src/hooks/useColumnCount.ts` — `matchMedia` → 3 / 2 (≤900px) / 1 (≤560px); updates on change.
- `src/components/PhotoMasonry.tsx`
  - props: `photos: Photo[]`, `onSelect(photo)`, `showCaption?`
  - `cols = useColumnCount()`; batch = `cols * 3` rows initially; `visible` state = count rendered.
  - render only `photos.slice(0, visible)` → unrendered imgs never fetched.
  - distribute rendered slice round-robin into `cols` `<div class="masonry__col">`.
  - sentinel `<div>` after grid; `IntersectionObserver` (rootMargin `400px`) → `visible += cols * 3` until all shown; disconnect at end.
  - keep `loading="lazy"` + `decoding="async"` on imgs; `.photo-card` button markup same as now.
- (CSS) `App.css`: `.masonry` → `display:flex; gap:var(--gap); align-items:flex-start`; `.masonry__col` → `flex:1; min-width:0; display:flex; flex-direction:column; gap:var(--gap)`; drop `columns`/`break-inside`/`margin-bottom` + media queries for columns (handled by hook). Keep `.masonry .photo-card` styles.

**Modify**
- `src/pages/Portfolio.tsx` — replace map with `<PhotoMasonry photos={photos} onSelect={setActive} showCaption />`.
- `src/pages/Session.tsx` — same, no caption.
- `claude/plans/app_description.md` — masonry = PhotoMasonry (row order, incremental render), new hook dir.

## Verification
- `npm run build` + `npm run lint` pass.
- `npm run dev`: Portfolio — first row = photos 1..3 (file name order); DevTools Network img filter → only first batch loaded; scroll → new batches fetched. Resize 900/560px → 2/1 cols, order kept. Lightbox opens on click. Session page same.

## Unresolved questions
No questions
