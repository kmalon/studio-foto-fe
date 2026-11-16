# Plan 19: new sessions (Julia, Paula Smyk) + renumber old sessions & portfolio

## Context
User commit c06c2b4 on branch `feature/new_sessions_with_artist_and_city_style` (master = parent): added 2 sessions (photos already webp+resized), renamed old sessions 1_/2_ -> 3_/4_, deleted photos in old sessions + portfolio (gaps, dup numbers, full/thumb name mismatch). Need repo part per README.

State on branch:
- `1_sesja_kobieca_spotkanie_z_Julia` 21 photos `0000101.webp`…`0002101.webp`; overview ok-ish
- `2_spotkanie_z_artystka_Paula_Smyk` 51 photos `01, 02, 02A, 03A, 36aaa…`
- `3_sesja_rodzinno_brzuszkowa` 14 (gaps, dup 12, thumb `11-` vs full `12-`)
- `4_sesja_slubna_lazienki_krolewskie` 40 (gaps/dups, 2 thumb mismatches)
- portfolio 105 (dups, gaps; thumb `013.webp` vs full `013-rodzice-…`)
- all old descriptions (name minus number) unique + have altText entries

## Steps
1. `git checkout feature/new_sessions_with_artist_and_city_style` (work on top of user commit; plan-feature-branch branches from it).
2. Renumber script (node, one-off, scratchpad): per dir, sort full names like app (`Array.sort()`), new name = `NN-<desc>` (2 digits sessions, 3 digits portfolio); thumb paired by desc suffix (fallback: number, for `013.webp`); `git mv` via temp names (avoid collisions). Outputs old->new map.
3. `altText.ts`: rewrite keys via map (portfolio + old sessions; folder prefix 1_/2_ -> 3_/4_). Drop stale keys of deleted photos.
4. New sessions: view each thumbial, give descriptive PL name `NN-opis-…` (order = current sort), rename full+thumbial same; add alt entries (`gallery/<folder>/<file>`).
5. Folder names lowercase: `1_sesja_kobieca_spotkanie_z_julia`, `2_spotkanie_z_artystka_paula_smyk` (README rule; slug unchanged).
6. overview.md both: strip trailing whitespace / blank-space line; `–` -> ` - ` (content convention; headings auto `.h-dash`).
7. `entry-server.tsx` redirects: add legacy `/gallery/1_sesja_rodzinno_brzuszkowa`, `/gallery/2_sesja_slubna_lazienki_krolewskie` (folders renamed -> old EN URLs would break / point nowhere).
8. Session order: keep branch numbering (old 4_/3_ first, new 2_/1_ last).
9. `npm run build`; check dist/galeria/*, sitemap, no generic "zdjęcie N" alts (grep dist), full/thumb lists equal.
10. Update app_description.md (sessions list n/a, maybe legacy redirect note).

## Verification
build passes; `grep -r "zdjęcie [0-9]" dist/galeria` empty; diff full vs thumb names each dir; numbering contiguous; dev check Galeria order.

## Unresolved questions
No questions (answered: keep branch numbering; lowercase folders; `–` -> `-`).

## Branch
`feature/19_new_sessions_julia_paula_renumber`
