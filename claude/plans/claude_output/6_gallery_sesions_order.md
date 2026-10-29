# 6 — Gallery sessions order reversed

## Context
Sessions listed in asc folder order (`1_przyroda`, `2_sesja_z_krowa`). Want reverse: last folder first (newest session on top).

## Change
- `src/data/gallery.ts`: `sessions` build — sort slugs desc instead of asc.
  - Use numeric-aware compare: `.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))`
  - Reason: plain `.sort()` puts `10_x` before `2_x` → wrong once >9 sessions.
- Photo order inside session unchanged (asc).
- `sessions` shared → `/gallery` cards + `/about` slideshow both get reversed order; `getSession` unaffected.
- Update `app_description.md` gallery.ts line: "sessions sorted desc (numeric-aware) by folder name".

## Verify
- `npm run build` (tsc + vite) passes.
- `npm run dev` → `/gallery`: `2_sesja_z_krowa` first, `1_przyroda` second; `/about` slide order matches; card click opens right session.

## Unresolved questions
No questions. (Answered: `/about` reversed too; numeric-aware sort.)

## Branch
`feature/6-gallery-sessions-order`
