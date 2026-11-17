# 22 External assets

## Context
Assets (photos, overview.md, alts) now hardwired to `src/assets` via relative `import.meta.glob`. Want: optional external local dir (CI fetches it to folder next to repo, e.g. `../assets_external`), chosen by config var. altText.ts lives with assets.

## Approach
Vite alias `@assets` -> internal `src/assets` or external dir (build-time). All globs/imports use alias -> sizes/srcset/prerender pipeline unchanged.

1. `.env` (tracked): add
   - `ASSETS_SOURCE=internal` (`internal` | `external`)
   - `ASSETS_DIR=../assets_external` (path, rel. to project root or abs; used only if external)
   - no `VITE_` prefix -> not in client bundle; read in vite.config via `loadEnv(mode, cwd, '')` (+ `process.env` override, CI can set env)
2. `vite.config.ts`: `defineConfig(({mode}) => …)`; resolve assets dir; external + dir missing -> throw clear error; `resolve.alias['@assets'] = dir`; `server.fs.allow: [root, dir]` (dev serves outside root). Log chosen source once.
3. Move `src/data/altText.ts` -> `src/assets/altText.ts` (git mv); update header comment (keys rel. to assets dir).
4. `src/vite-env.d.ts`: `declare module '@assets/altText.ts' { const altText: Record<string,string>; export default altText }` (tsc passes regardless of source; img imports covered by vite/client `*.jpg`).
5. `src/data/portfolio.ts`, `src/data/gallery.ts`: globs `'../assets/…'` -> `'@assets/…'`; import altText from `@assets/altText.ts`.
   - gallery `parse`: index from path tail (folder = parts[len-3]) not `indexOf('gallery')` (external path may contain 'gallery'; key form for alias globs not guaranteed)
   - overviews: group by folder (parts[len-2]) instead of literal `'../assets/gallery/${folder}/overview.md'` lookup
6. About img import in `pages/About.tsx`, `pages/Contact.tsx`, `entry-server.tsx` -> `@assets/about/…jpg`.
7. README: section "External assets" (vars, folder layout = same as src/assets incl. altText.ts, CI must fetch dir before `npm run build`); replace `src/assets` mentions with "assets dir".
8. Workflow untouched (CI fetch = user's side, per answer).

## Verify
- `npm run build` internal -> dist same as before (diff route HTML/sitemap vs master build).
- `cp -r src/assets ../assets_external`, rename one alt/session title there, `ASSETS_SOURCE=external npm run build` -> dist reflects external change; `npm run dev` external shows images.
- `ASSETS_SOURCE=external ASSETS_DIR=../nope npm run build` -> clear error.
- `npx tsc -b` passes; remove test dir after.

## Questions
No questions

## Branch
feature/22_external_assets

---

# 22 fix: slideFocus -> assets

## Issue
`slideFocus` (start slide file -> object-position) hardcoded in `src/data/portfolio.ts`; tied to start images -> must live in assets dir (internal/external), like altText.ts.

## Fix
1. New `src/assets/slideFocus.ts`: default export `Record<string,string>` (map moved as-is; keys = files in start/, missing -> centered).
2. `src/data/portfolio.ts`: inline map dropped; `import slideFocus from '@assets/slideFocus.ts'`.
3. `src/vite-env.d.ts`: ambient `declare module '@assets/slideFocus.ts'`.
4. README (external layout, Start slideshow note) + app_description updated.
5. `.env` committed with user's values (`ASSETS_SOURCE=external`, `ASSETS_DIR=./src/assets_external`) per user decision; CI must provide that dir.

## Verify
`npx tsc -b` ok; `ASSETS_SOURCE=internal npm run build` -> dist identical to previous build except JS hash.

---

# 22 fix: README update

## Issue
README "External assets" outdated vs actual setup: example `ASSETS_DIR=../assets_external` (now `./src/assets_external`), said "outside the repo", no gitignore note, no local test how-to. Local `src/assets_external/` (88 MB copy) untracked -> would be committed.

## Fix
1. `.gitignore`: `/src/assets_external/`.
2. README "External assets" rewritten: example = tracked `.env` (internal, `./src/assets_external`), dir anywhere (default gitignored), local test (`cp -r src/assets src/assets_external` + `ASSETS_SOURCE=external npm run dev|build`), CI (fetch into ASSETS_DIR + set external; tracked .env keeps internal), content edits go to external dir when used.
3. app_description: default ext dir gitignored, tracked .env internal.
4. `.env` local change (external) NOT committed (user decision).
