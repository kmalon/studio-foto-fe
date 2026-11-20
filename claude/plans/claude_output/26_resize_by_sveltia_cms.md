# 26 Sveltia CMS: resize uploads to WebP

## Context
CMS uploads (plan 25) land as-is (jpg/png, any size); WebP conversion still manual via `convert-images.sh`. Use Sveltia built-in image optimization so uploads match script's "full" profile.

Sveltia facts (docs): `media_libraries.all.transformations.raster_image` {format: webp only, quality 0-100, width/height = max box, keep aspect, never enlarge}; Exif stripped; ext -> `.webp`; applies to Asset Library + entry uploads; global or per image field only (no per-folder/collection) -> one profile for all. Animated files untouched. No XMP copyright (script adds it) — not possible.

## Steps
1. `public/admin/config.yml` add top-level (comment: mirrors convert-images.sh FULL_*):
   ```yaml
   media_libraries:
     all:
       slugify_filename: true   # "01 Opis.JPG" -> 01-opis.jpg -> .webp; keeps NN-opis naming
       transformations:
         raster_image:
           format: webp
           quality: 90     # FULL_Q
           width: 2048     # FULL_SIZE 2048x2048>
           height: 2048
   ```
2. README "CMS (/admin/)": uploads auto -> WebP max 2048px q90, slugified names; thumbs (`portfolio/thumbs`, `thumbial/`) get same full profile -> for 800px/q80 thumbs still use script (thumbial optional anyway); no copyright XMP via CMS; remove "WebP conversion" from manual list; HEIC/orientation: check rotated photo after upload.
3. `app_description.md` CMS line: add transformations note.

## Verification
- `npm run build` -> `dist/admin/config.yml` contains block; YAML parses (`node -e` w/ yaml? or python yaml).
- Manual (user): `/admin/` -> upload jpg to session -> committed `full/<slug>.webp`, ≤2048px.

## Unresolved questions
No questions (thumbs = same full profile, accepted limitation since Sveltia has no per-folder transforms).

## Branch
feature/26_sveltia_webp_resize

---

# 26 fix: gallery folder missing in CMS Asset Library

## Issue
Asset Library tree under global `assets` shows start/portfolio/about but no `gallery/`. Cause (Sveltia docs): `assets/gallery` = folder of collection `gallery` whose media folder is entry-relative (`{{slug}}/overview` + `full`) -> its own sidebar location, listed flat, not a browsable subfolder of global folder.

## Fix
1. `public/admin/config.yml` add top-level `asset_collections` (fixed path -> browsable subfolders per docs):
   ```yaml
   asset_collections:
     - name: gallery_assets
       label: Galeria (pliki)
       icon: photo_library
       media_folder: /assets/gallery
       public_folder: /assets/gallery
   ```
   + comment why. Name unique vs collection `gallery`. Transformations (media_libraries.all) should apply; verify on upload.
2. Update stale comment above `media_folder` (claims gallery/ browsable via global tree).
3. README CMS section: Assets bullet -> gallery via "Galeria (pliki)" location (browse `<folder>/full|thumbial`).
4. app_description CMS line: + asset_collections gallery.
5. Append this fix to `claude/plans/claude_output/26_resize_by_sveltia_cms.md`; commit on `feature/26_sveltia_webp_resize`.

## Verification
- YAML parses (js-yaml); `ASSETS_SOURCE=internal npm run build` -> dist/admin/config.yml has block.
- Manual (user): `/admin/` Assets sidebar -> "Galeria (pliki)" -> session folders -> full/thumbial; upload jpg -> webp.

## Unresolved questions
No questions

---

# 26 fix 2: gallery/ still missing in global Assets tree

## Issue
After fix 1 (asset_collections `/assets/gallery`) global `assets` tree still has no `gallery/`. Cause (Sveltia source `services/assets/subfolders.js`, `config/folders/assets.js`): any configured asset folder nested in another is its own sidebar location, never listed as subfolder of the outer one ("deepest folder wins"). Two such folders sat on assets/gallery: fix 1 asset collection + `gallery` collection's entry-relative media folder (`full`). Fix 1 made it worse, not better.
Sveltia skips adding a collection asset folder when it's not entry-relative and equals global media/public folder (assets.js ~L220).

## Fix
1. `public/admin/config.yml`:
   - remove `asset_collections` block + its comment.
   - collection `gallery`: `media_folder: full`/`public_folder: full` -> `/assets` / `/assets` (= global -> no separate folder) + comment why (overview.md never references images; photos are globbed from `full/`, so entry-relative uploads not needed).
   - global comment: gallery/<sesja>/{full,thumbial} browsable in global tree.
2. README CMS: drop "Galeria (pliki)" + "images uploaded in an entry go to full/"; upload session photos via Assets -> assets -> gallery -> <folder> -> full (new session: create entry, then in Assets create `full` folder in it/upload).
3. app_description CMS line: remove asset_collections, collection media = global.
4. Append to `claude/plans/claude_output/26_resize_by_sveltia_cms.md`; commit on `feature/26_sveltia_webp_resize`.

## Verification
- js-yaml parse; `ASSETS_SOURCE=internal npm run build` -> dist/admin/config.yml updated.
- Manual (user, `npm run dev` -> /admin/index.html, hard reload): Assets -> assets -> gallery -> 4 session folders -> full/thumbial.

## Unresolved questions
No questions

---

# 26 fix 3: overview.md not visible in global Assets

## Issue
Global Assets now shows gallery/<sesja>/{full,thumbial} but not overview.md. Cause (Sveltia `services/backends/process.js` createFileList): file in a collection entry folder -> entry only, never asset. overview.md = `gallery` collection entry -> hidden from Assets. User chose: drop Sesje collection -> overview.md listed as plain asset (upload/replace/download/delete, no in-CMS text editing).

## Fix
1. `public/admin/config.yml`: replace whole `collections:` gallery block with `collections: []` (Sveltia only requires collections to be an array, `parser/collections/index.js`) + comment: assets-only CMS, overview.md handled as file in Assets (edit locally, re-upload same name; keep line 1 `# Title`, line 2 desc). Drop commit_messages create/update/delete (no entries) — keep uploadMedia/deleteMedia.
2. Note: `slugify_filename` would rename uploaded `overview.md`? -> stays `overview.md` (already slug). OK. Transformations: raster only, md untouched.
3. README CMS: remove Sesje bullet; Assets covers gallery incl. overview.md; new session = in Assets gallery/ create folder `N_nazwa`, upload overview.md + `full/` photos; no text editor.
4. app_description CMS line: no collections (assets-only), overview.md as asset.
5. Append to `claude/plans/claude_output/26_resize_by_sveltia_cms.md`; commit on `feature/26_sveltia_webp_resize`.

## Verification
- js-yaml parse; `ASSETS_SOURCE=internal npm run build` -> dist/admin/config.yml has `collections: []`.
- Manual (user, `npm run dev` -> /admin/index.html): no config error; Assets -> gallery -> <sesja> shows overview.md + full/thumbial.

## Unresolved questions
No questions
