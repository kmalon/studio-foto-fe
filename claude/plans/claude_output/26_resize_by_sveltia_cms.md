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
