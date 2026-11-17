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
