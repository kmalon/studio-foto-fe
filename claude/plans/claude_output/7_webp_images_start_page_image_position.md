# Plan 7: webp images + start page mobile focal points

## Context
Commit `ac42f27` converted all jpg -> webp. `src/data/portfolio.ts` globs only `*.jpg` -> Start slideshow + Portfolio now empty/broken. Gallery glob already has webp. Start slideshow on portrait mobile crops landscape photos to center (`object-fit: cover`) -> people cut off in many frames.

## 1. webp support (`src/data/portfolio.ts`)
- Shared const `IMG = '{jpg,jpeg,png,webp,JPG}'`-style ext pattern — Vite needs literal glob strings, so inline `*.{jpg,jpeg,png,webp}` in 3 globs: portfolio/full, portfolio/thumbs, start.
- Gallery (`src/data/gallery.ts`) already OK — no change.
- Remove macOS junk tracked in git: `._*`, `.DS_Store` in src/assets (28 `._` files, AppleDouble, not images). Add `.DS_Store` + `._*` to `.gitignore`.

## 2. Start mobile focal points
- `Photo` type: add optional `focus?: string` (CSS object-position, e.g. `'20% 50%'`).
- `portfolio.ts`: `slideFocus: Record<string,string>` keyed by file name (`'03.webp': '21%'`…); slides built from glob entries -> `focus: slideFocus[name]`.
- `Slideshow.tsx`: on `.slideshow__img` (+ backdrop) set `style={{ '--focus': photo.focus }}` when present.
- `Slideshow.css`: `@media (orientation: portrait) { .slideshow__img { object-position: var(--focus, 50% 50%) } }` — landscape/desktop unchanged.
- Values (estimated from viewing each image; pos computed so people centered on ~390x844 viewport):

| file | people at | object-position x |
|---|---|---|
| 01 | cliff couple ~52% | 53% |
| 02 | couple+dog ~62% | 67% |
| 03 | B&W couple ~30% | 21% |
| 04 | drone couple ~42% | 39% |
| 05 | stairs couple center | 50% (omit) |
| 06 | drone cliff couple ~11% | 0% |
| 07 | first dance ~25% | 14% |
| 08 | poppy woman ~70% | 79% |
| 09 | windmill couple ~54% | 55% |
| 10 | bench couple ~52% | 53% |
| 11 | couple faces left ~22% | 10% |
| 12 | foreheads ~32% | 24% |
| 13 | B&W close-up ~33% | 22% |
| 14 | couple by column ~10% | 0% |

## 3. Docs
- Update `app_description.md`: webp exts, `Photo.focus`, slideFocus map, junk ignore.

## Verify
- `npm run build` + `npx tsc -b` clean.
- `npm run dev`: Start, Portfolio, Gallery show images; DevTools mobile (iPhone portrait) — each slide shows people; desktop unchanged.

## Questions
No questions (answered: delete+ignore junk = yes; convert-images.sh untouched).

## Branch
`feature/7_webp_start_focus`
