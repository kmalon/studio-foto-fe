# 25 Sveltia CMS (/admin/)

## Context
Owner wants to edit content w/o git: Sveltia CMS at `/admin/`, editing assets repo `amalonart/studio_foto_assets` (`assets/`, branch main). Commits there already trigger site rebuild (notify -> `repository_dispatch assets-updated`). Scope (answered): gallery sessions + media; altText.ts/slideFocus.ts stay manual TS. Auth: GitHub token sign-in only.

## Steps
1. `public/admin/index.html` (static, copied by Vite to `dist/admin/`, not React/prerender): lang pl, `<meta name="robots" content="noindex,nofollow">`, title "Admin | Angelika Malon", `<script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>` (docs: unversioned, no type=module, no css).
2. `public/admin/config.yml`:
   - `backend`: `name: github`, `repo: amalonart/studio_foto_assets`, `branch: main`, `auth_methods: [token]`, `commit_messages` (PL-ish/short, e.g. `cms: create {{collection}} "{{slug}}"`, upload/delete media).
   - `site_url: https://angelikamalon.pl`, `media_folder: assets`, `public_folder: /assets` (global asset lib: browse start/, portfolio/full|thumbs, about/, gallery/… via breadcrumbs).
   - collection `gallery` "Sesje": `folder: assets/gallery`, `format: raw`, `extension: md`, `path: '{{slug}}/overview'`, `slug: {editable: true, hint: "N_nazwa_sesji (N = kolejność, wyższy = wyżej), bez polskich znaków"}`, `media_folder: full`, `public_folder: full`, `create: true`, `delete: false`, `sortable_fields` none; field `body` markdown w/ hint "Linia 1: `# Tytuł`, linia 2: opis (meta description)".
3. `scripts/prerender.mjs` robots.txt: add `Disallow: /admin/`. Sitemap untouched (admin not in `pages`).
4. README: section "CMS (/admin/)": create fine-grained PAT (repo studio_foto_assets, Contents RW), Sign In with Token, what's editable (session overview, upload photos to full/, new session = new entry w/ slug), limits (thumbial + altText/slideFocus manual, file naming `NN-opis.webp`), rebuild auto after commit (~min).
5. Update `app_description.md` (Deploy/Structure: public/admin).

## Verification
- `npm run build` -> `dist/admin/index.html` + `config.yml` exist, `dist/robots.txt` has Disallow, prerender count unchanged.
- `npm run preview` -> open `/admin/` -> Sveltia login screen shows token button only (manual token login by user: sessions list = 4 folders, overview body loads).

## Unresolved questions
No questions

## Branch
feature/25_sveltia_cms

## Follow-up
- Removed robots `Disallow: /admin/` (blocked crawl hides meta noindex); admin relies on meta noindex only.
