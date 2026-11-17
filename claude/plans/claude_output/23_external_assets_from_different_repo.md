# 23 External assets from different repo (CI)

## Context
Plan 22 added `ASSETS_SOURCE`/`ASSETS_DIR` (.env) but CI never fetches external assets. Need deploy step: if `.env` `ASSETS_SOURCE=external` -> fetch `assets/` from public repo `amalonart/studio_foto_assets` (main) into `src/assets_external/` (= `ASSETS_DIR`) before build. Repo checked: public, layout matches (about, gallery, portfolio, start, altText.ts, slideFocus.ts).

## Changes `.github/workflows/deploy.yml` (build job, after Checkout, before Build)
1. Step `Read assets config` (id `assets`): parse tracked `.env` (`grep '^ASSETS_SOURCE='`, `'^ASSETS_DIR='`, strip CR/quotes; defaults `internal`, `./src/assets_external`) -> `$GITHUB_OUTPUT` `source`, `dir`; echo chosen source.
2. Step `Checkout external assets` — `if: steps.assets.outputs.source == 'external'`: `actions/checkout@v4` with `repository: amalonart/studio_foto_assets`, `ref: main`, `path: .assets-repo`, `sparse-checkout: assets` (cone mode, only that dir), `fetch-depth: 1`.
3. Step `Place external assets` — same `if`: `rm -rf "$DIR" && mkdir -p "$(dirname "$DIR")" && mv .assets-repo/assets "$DIR" && rm -rf .assets-repo`; fail if `$DIR/altText.ts` missing; `ls` summary.
4. Build unchanged (vite reads same `.env` -> uses dir).
- Repo/ref as workflow `env` (`ASSETS_REPO`, `ASSETS_REF`) at top for easy change.

## Docs
- README "External assets" CI paragraph: workflow auto-fetches from `amalonart/studio_foto_assets` `assets/` when `.env` external; to switch: set `ASSETS_SOURCE=external` in `.env` + commit.
- app_description Deploy: workflow fetch step.

## Verify
- Local simulate step script: `ASSETS_SOURCE` parse via bash on `.env` (internal + temp external copy).
- Local: `git clone --depth 1 --filter=blob:none --sparse <repo> scratch` + `sparse-checkout set assets`, `ASSETS_SOURCE=external ASSETS_DIR=<scratch>/assets npm run build` ok -> proves remote content builds.
- YAML lint: `python3 -c yaml.safe_load`.
- Real run: push branch/merge -> Actions log (user).

## Questions
No questions

## Branch
feature/23_external_assets_from_different_repo
