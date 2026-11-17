# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

# External assets

Assets (photos, `overview.md` files, `altText.ts`, `slideFocus.ts`) can come from a local folder outside the repo.
Configured in `.env` (build-time only, not bundled; process env vars override `.env`):

```
ASSETS_SOURCE=internal          # internal = src/assets, external = ASSETS_DIR
ASSETS_DIR=../assets_external   # relative to project root or absolute
```

- External dir must have the same layout as `src/assets`: `start/`, `portfolio/{full,thumbs}/`,
  `about/`, `gallery/<N>_<name>/{full,thumbial,overview.md}`, `altText.ts`, `slideFocus.ts`.
- Code imports assets via the `@assets` alias (`vite.config.ts`), which points to the chosen dir.
- CI/CD: fetch the external assets into `ASSETS_DIR` before `npm run build`
  (e.g. `ASSETS_SOURCE=external npm run build`). Missing dir -> build fails with a clear error.

# Content: adding photos

All photos live in the **assets dir** (`src/assets` by default, or an external dir, see
[External assets](#external-assets); paths below use `src/assets`). They are picked up automatically by `import.meta.glob`
(jpg/jpeg/png/webp), but the site expects **WebP files with numbered, descriptive names**
and an **alt text entry** for every photo.

## Adding photos to a gallery session

A session is one folder in `src/assets/gallery`:

```
src/assets/gallery/<N>_<session_name>/
  full/         full-size photos (lightbox)
  thumbial/     thumbnails (grid), SAME file names as in full/
  overview.md   session text shown above the photos (markdown), see below
```

### 1. Pick or create the session folder

- **Existing session**: use its folder.
- **New session**: create `src/assets/gallery/<N>_<session_name>/` with `full/`, `thumbial/` and `overview.md`.
  - `N` = next number (highest number = newest session, shown first; numeric sort, so `10_` > `9_`).
  - Folder name: lowercase, no Polish letters, words separated by `_` (e.g. `3_sesja_slubna_lukow`).
  - URL slug = folder name without the `N_` prefix, `_` -> `-`:
    `3_sesja_slubna_lukow` -> `/galeria/sesja-slubna-lukow/`. Do not rename the folder later (it changes the URL).
  - `overview.md` example:

    ```md
    # Sesja ślubna

    Para młoda w Łukowie - plener w parku miejskim.

    Optional longer description (markdown).
    ```

    The **whole file is displayed** on the session page. The first two non-empty lines are
    also read for SEO (`metaFromOverview` in `src/data/gallery.ts`):

    | Line | Shown on page as | Also used for |
    | --- | --- | --- |
    | 1 `# Title` | page heading (h1) | page `<title>`, Galeria card caption, session links (Start, O mnie) |
    | 2 | first paragraph | start of the meta description |
    | rest | markdown text | - |

    - Start line 1 with `# ` and **no leading spaces**: 4+ spaces make markdown render it as a
      code block instead of a heading. The `#` and a trailing dot are removed from the title.
    - Keep line 2 one plain sentence (~120-150 characters), it works as both intro text and description.
    - There is no hidden, meta-only line: anything you write is visible.

### 2. Copy the originals

Copy the same exported originals into **both** `full/` and `thumbial/`
(the convert script resizes them differently). A thumbnail is matched to its full photo by file name.

### 3. Rename the files: number + description

Pattern: `NN-description-of-the-photo.<ext>`

- **`NN` = display order**, zero-padded (`01`, `02`, ... `10`). Photos are sorted by file name,
  so without the prefix the order is random and `10` would land before `2`.
  Adding to an existing session: continue the numbering (last is `09` -> start at `10`);
  inserting in the middle means renumbering the following files.
- **description** = short Polish description of what is in the photo (it becomes the base of the alt text):
  lowercase, no Polish letters, words separated by `-`, about 6-10 words.
- Names given by the camera/phone, random or numbers only (`IMG_1234.jpg`, `DSC_0001.JPG`,
  `20240512_181203.jpg`, `1.jpg`, `a8f3c2.jpg`) **must** be replaced with a descriptive name.
  Look at each photo and describe it.

| Before | After |
| --- | --- |
| `DSC_0412.JPG` | `01-para-mloda-idzie-za-reke-przez-park.jpg` |
| `IMG_20240512_181203.jpg` | `02-czarno-biale-zdjecie-pocalunku-pary-mlodej.jpg` |
| `7.jpg` | `03-panna-mloda-poprawia-welon-przed-lustrem.jpg` |

Keep the names identical in `full/` and `thumbial/`. Quick way: rename in `full/`, then copy the
originals to `thumbial/` again.

Optional helper: prefix numbers in the current (alphabetical) order, keeping the rest of the name
(then replace camera names by hand):

```bash
cd src/assets/gallery/<folder>/full
n=1; for f in *; do mv -n -- "$f" "$(printf '%02d' $n)-$f"; n=$((n+1)); done
```

### 4. Convert to WebP

From the repo root:

```bash
bash convert-images.sh
```

Converts in place: `full/` max 2048 px (q90), `thumbial/` 800 px wide (q80), adds copyright metadata.
**Originals are deleted** after conversion, so keep your exports elsewhere.
Needs `imagemagick` + `webp` (cwebp, webpmux).

### 5. Add alt texts

Add one entry per photo to `src/assets/altText.ts` (thumbnails share it):

```ts
'gallery/3_sesja_slubna_lukow/01-para-mloda-idzie-za-reke-przez-park.webp': 'Para młoda idzie za rękę przez park',
```

Key = `gallery/<folder>/<file>` (final `.webp` name). Value = Polish sentence with proper letters,
usually the file name description. Missing entry -> generic "<title> | zdjęcie N" (bad for SEO).

### 6. Links to the session

Nothing to edit by hand. Every session is listed automatically (from `src/data/gallery.ts` `sessions`):

- Start page: session links at the bottom of the intro (`SessionLinks`)
- O mnie: carousel of session covers + session links
- Galeria: session card (cover = first thumbnail)
- `/galeria/<slug>/` prerendered page, `sitemap.xml` (with images), redirect from old `/gallery/<folder>/`

Optional: if the session is a new kind of shoot, mention it in the prose of the Start intro
(`src/pages/Start.tsx`) or About page.

### 7. Check and publish

```bash
npm run dev     # check Galeria, the session page, links on Start and O mnie
npm run build   # must pass; check dist/galeria/<slug>/index.html and dist/sitemap.xml
```

Commit and push to `master` -> GitHub Actions deploys to GitHub Pages.

## Other images

- **Start slideshow**: `src/assets/start/NN-description.webp` + alt entry `start/<file>`.
  If people are off-center, add the file to `src/assets/slideFocus.ts` (object-position for portrait screens).
- **Portfolio**: same name in `src/assets/portfolio/full` and `src/assets/portfolio/thumbs`, `NNN-description` (3 digits),
  alt entry `portfolio/<file>`.
- Run `bash convert-images.sh` for both (directories configured in `DIRS` inside the script).
- Content / column images (About): `mogrify -resize 1200x -strip -quality 80 -interlace Plane src/assets/about/*.jpg`
