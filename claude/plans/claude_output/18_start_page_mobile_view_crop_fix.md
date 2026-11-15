# Plan 18: Start page mobile – slideshow bottom hidden under browser bars

## Context
Portrait phone: bottom of slideshow (photo bottom, caption/counter) hidden under browser bottom bar / URL bar → `.start` taller than visible screen. Cause: `useStableStartHeight` (Start.tsx, plan 11) sets `--start-h = window.innerHeight` once, re-measured only on width change. innerHeight = current (often large, bars-collapsed or not-yet-settled) viewport on iOS Safari / Chrome Android → stale, too tall. Plan-11 goal (no photo rescale on URL-bar hide) must stay.

## Fix
- `100svh` = small viewport (all bars shown) → always fully visible, AND static while bars hide/show → no rescale. Native replacement for JS freeze.
- `src/pages/Start.css`: `.start { height: 100vh; height: 100svh; }` drop `var(--start-h…)`.
- `src/pages/Start.tsx`: `useStableStartHeight` → fallback only: early return if `CSS.supports('height', '100svh')`; else keep current innerHeight logic (old browsers). Update doc comment. (`.start` height uses `var(--start-h, 100svh)` only inside `@supports not (height: 100svh)` block → `height: var(--start-h, 100vh)`.)
- SSR unchanged (CSS only, effect client-side) → no hydration mismatch.

## Docs
- `app_description.md`: Start.tsx line → `.start` height 100svh (static small viewport, never under bars, no rescale); `--start-h` JS fallback only w/o svh support.

## Verify
- `npm run build` clean.
- DevTools iPhone/Pixel portrait: slideshow fills screen, caption/counter visible; real phone (iOS Safari bottom bar, Chrome Android): bottom visible, scroll → no photo rescale; rotate → re-fits.

## Branch
`feature/18_start_mobile_bottom_crop`

## Questions
No questions (answered: bug = portrait, bottom under browser bar).
