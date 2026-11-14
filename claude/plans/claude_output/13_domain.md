# 13 Domain – move to angelikamalon.pl

## Context
Site served from `kmalon.github.io/studio-foto-fe`. Switch to own domain `https://angelikamalon.pl` at root `/` (no `/studio-foto-fe` path). All base-dependent code derives from vite `base` (BASE_PATH, ROUTER_BASENAME, LOGO_PATH, index.html links via vite) → only config + origin change.

## Changes
1. `vite.config.ts`: `base: '/'`.
2. `src/seo/site.ts`: `SITE_ORIGIN = 'https://angelikamalon.pl'`; update comments mentioning `/studio-foto-fe/` (ROUTER_BASENAME → `/`, absUrl example `/assets/x.webp`). BASE_PATH → `''` automatically → SITE_URL = origin, basename `/`.
3. `public/CNAME`: `angelikamalon.pl` (copied to dist; needed for `gh-pages` deploy path, harmless for Actions deploy).
4. `package.json`: `homepage: "https://angelikamalon.pl"`. Keep `name` (internal npm name, not URL).
5. `claude/13_domain.md` → move to `claude/plans/13_domain.md` (consistency with other plans).
6. Update `app_description.md` (base `/`, SITE_URL, homepage, CNAME, basename).

## Manual (outside repo, user)
- DNS: apex A → 185.199.108-111.153 (+ AAAA 2606:50c0:8000-8003::153), `www` CNAME → `kmalon.github.io`.
- GitHub repo Settings → Pages → Custom domain `angelikamalon.pl` + Enforce HTTPS. GH then 301s old `kmalon.github.io/studio-foto-fe/*` → new domain (path kept).
- Google Search Console: add new property, submit sitemap, Change of Address.

## Verification
- `npm run build`; grep `dist` for `studio-foto-fe` / `github.io` → none.
- Check `dist/index.html` canonical/og = `https://angelikamalon.pl/`, `dist/sitemap.xml`, `dist/robots.txt`, `dist/CNAME`, logo src `/logo.svg`, JSON-LD urls.
- `npx vite preview` → nav links, gallery session, 404, old EN redirect stubs work at root.

## Questions
No questions (assumes apex `angelikamalon.pl` canonical, `www` redirects to apex — GH Pages does this automatically).

## Branch
feature/13_custom_domain_angelikamalon_pl
