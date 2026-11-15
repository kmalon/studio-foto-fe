# Plan 17: README - adding new images / new gallery session

## Context
README = Vite template boilerplate + 3-line resize note. Need step-by-step guide for adding photos to gallery session (new or existing) in `src/assets/gallery`. Docs only, no code change.

## Facts (from code)
- Session folder `src/assets/gallery/<N>_<name>/{full,thumbial,overview.md}`; `N` = order (highest = newest, first); slug = folder w/o `N_`, `_`->`-`, PL diacritics stripped (`data/gallery.ts` `toSlug`).
- `overview.md`: line 1 = title, line 2 = meta description, rest markdown.
- Photo order = file name sort -> `NN-` zero-padded prefix.
- thumbial matched to full by same file name.
- Alt text: `src/data/altText.ts` key `gallery/<folder>/<file>`; missing -> generic fallback (bad SEO).
- Session links (Start bottom, O mnie, Galeria cards, sitemap, routes, old-URL redirect) auto-generated from `sessions` -> no manual link edits. Only manual: optional mention in prose.
- `convert-images.sh` converts in place to webp (full 2048 / thumb 800), deletes originals.

## Changes
1. `README.md` (English): keep Vite boilerplate; append below it (replace/absorb existing "Photos resize" note):
   - **Adding photos to a gallery session** steps:
     1. New session: create `src/assets/gallery/<next N>_<sesja_opis>/` + `full/`, `thumbial/`, `overview.md` (title line, description line, text). Existing: use its folder.
     2. Copy originals into `full/` AND `thumbial/` (same names).
     3. Rename: `NN-opis-z-alt.webp` - `NN` zero-padded display order (continue existing numbering; renumber if inserting); camera/random/numeric names (`IMG_1234`, `DSC_0001`, `20240512_…`) -> descriptive PL slug of what's in photo (lowercase, no diacritics, hyphens, ~6-10 words). Example table before/after. Optional shell loop snippet for bulk prefixing numbers.
     4. Run `bash convert-images.sh` (from repo root) -> webp.
     5. Add alt entries to `src/data/altText.ts` (key `gallery/<folder>/<file>`, PL sentence matching file name).
     6. Links: automatic (Start bottom list, O mnie list + carousel, Galeria card, sitemap, prerendered page). Check them in `npm run dev`; optionally mention new session type in Start intro / About prose.
     7. Verify: `npm run build`, check `dist/galeria/<slug>/index.html` + `dist/sitemap.xml`; commit; push master.
   - Short sections: start slideshow images (`src/assets/start`, `slideFocus`), portfolio images (`full` + `thumbs`), resize note (keep existing mogrify line).
2. app_description.md: no change (docs only).

## Verify
- README renders (markdown), paths/commands match repo (`convert-images.sh` location, glob dirs).

## Answered
- Language: English. Boilerplate: keep, append guide.

No questions

Branch: feature/17_readme_adding_new_session
