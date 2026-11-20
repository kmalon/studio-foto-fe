# 24 Assets SHA + build SHA on page

## Context
Need to know which site commit + which assets commit is live. Assets repo `notify-fe.yml` dispatches `assets-updated` with `client_payload.sha` / `.ref`. Info must be invisible to visitors.

## Proposal (where to expose)
- `<meta name="build" content="site=<sha> assets=<sha> built=<ISO>">` in head (all prerendered pages, view-source/curl)
- `/version.json` `{site, assets, assetsSource, built}` (curl-friendly, for checking deploy)
- one `console.info` on client load: `site abc1234 | assets def5678 | built …` (short SHAs)

## Steps
1. `deploy.yml`
   - assets checkout `ref`: `github.event.client_payload.sha || env.ASSETS_REF` (dispatch builds exactly the notified commit, no race w/ later pushes)
   - "Place external assets": before mv, `ASSETS_SHA=$(git -C .assets-repo rev-parse HEAD)` -> `$GITHUB_ENV` (real checked-out sha; covers push/manual too); log if payload sha differs
   - Build step env: `BUILD_SHA: ${{ github.sha }}`
2. `vite.config.ts`: `buildInfo(mode, assets)`:
   - site = `BUILD_SHA` || `git rev-parse HEAD` (local) || `unknown`
   - assets = `ASSETS_SHA` || internal -> `site` sha (assets in same repo) || `git -C <assetsDir> rev-parse HEAD` if git repo || `unknown`
   - `assetsSource`, `built` = ISO now
   - `define: { __BUILD_INFO__: JSON.stringify(info) }`
   - small plugin `buildInfo`: `transformIndexHtml` injects meta before `<!--head-->` (outside markers -> survives prerender replace); `generateBundle` (client only, skip ssr) emits `version.json`
3. `src/vite-env.d.ts`: `declare const __BUILD_INFO__: {site; assets; assetsSource; built}`
4. `src/main.tsx`: `console.info(...)` once (client only, not in SSR/render)
5. README: short note where to find SHAs
6. Update app_description.md (Deploy section)

## Verification
- `npm run build` -> `dist/version.json` ok, `grep 'name="build"' dist/index.html dist/galeria/index.html`
- `ASSETS_SHA=x BUILD_SHA=y npm run build` -> values propagate
- `npm run preview` -> console line visible; nothing visible on page
- `tsc` passes

## Questions
No questions (defaults chosen: full SHAs in meta/json, short in console; dispatch build pins payload sha). Say if you prefer only some of the 3 exposures.

## Branch
`feature/24_assets_sha_on_page`
