# 27 Portfolio thumbs dir rename

## Context
Portfolio thumbs dir `portfolio/thumbs` ≠ gallery `thumbial`. Unify -> `portfolio/thumbial`. Assets repo (`../studio-foto-fe_assets`) already has staged rename `assets/portfolio/thumbs -> thumbial` (uncommitted, out of scope here). FE must follow.
Missing dir never breaks build: glob empty -> `thumb` falls back to full. So merge order FE/assets safe (only heavier thumbs in between).

## Steps
1. `git mv src/assets/portfolio/thumbs src/assets/portfolio/thumbial` (internal assets).
2. `src/data/portfolio.ts`: globs `@assets/portfolio/thumbs/*` -> `thumbial/*`; `{full,thumbs}` -> `{full,thumbial}`; rename `portfolioThumbs` const + comment "full + thumbs" -> thumbial. No transitional dual glob.
3. `convert-images.sh`: DIRS line `src/assets/portfolio/thumbs` -> `thumbial`; comments (`full/ AND thumbs/`, `../thumbs` example) -> thumbial.
4. `README.md` lines 66, 152, 162, 165, 303: `portfolio/thumbs` -> `portfolio/thumbial`.
5. `public/admin/config.yml` comments lines 16, 23 -> thumbial.
6. app_description.md: `portfolio/{full,thumbs}` -> `{full,thumbial}`; data/portfolio.ts line "full+thumbs" -> thumbial.
7. grep `thumbs` (excl node_modules/dist/claude) -> only var names in gallery.ts (ok, generic).

## Verification
- `ASSETS_SOURCE=internal npm run build` -> success; dist/portfolio/index.html img src for masonry = thumbial-derived hashed files (smaller than full), width/height present.
- Optionally build w/ `ASSETS_DIR=../studio-foto-fe_assets/assets ASSETS_SOURCE=external` (staged rename present) -> same.

## Unresolved questions
No questions

## Branch
`feature/27_portfolio_thumbs_dir_rename`
