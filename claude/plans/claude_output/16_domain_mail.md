# Plan 16: domain mail

## Context
Switch public contact email from gmail to `kontakt@angelikamalon.pl` (brand/SEO consistency w/ domain).

## Changes
1. `src/data/AngelikaInfo.tsx`: `EMAIL = 'kontakt@angelikamalon.pl'` -> auto-propagates to Footer, Contact (2x mailto), Privacy, JSON-LD `seo/site.ts` (ProfessionalService + Person email).
2. `src/pages/Privacy.tsx` §2: "na moją skrzynkę Gmail (Google)" -> "na moją skrzynkę e-mail" (neutral, no provider).
3. app_description: no structural change; skip unless needed.

## Manual (outside repo)
- Web3Forms dashboard: delivery email for access key -> new address (key tied to account email).
- DNS MX for domain mailbox.

## Verify
- `grep -rn gmail src` -> none.
- `npm run build`; grep `dist/` for `kontakt@angelikamalon.pl` in index.html (footer + JSON-LD), kontakt/, polityka-prywatnosci/; no `gmail`.

No questions

Branch: feature/16_domain_mail

---

# Fix 16: config from AngelikaInfo.tsx -> .env (where relevant)

## Issue
`src/data/AngelikaInfo.tsx` mixes content (EMAIL) + service config (WEB3FORMS_ACCESS_KEY). Move config to `.env` (pattern of `VITE_GA_ID`); keep content in code.

## Decision
- `EMAIL` -> STAYS. It's site content (footer, contact, privacy, JSON-LD), same in every build, not an integration setting. Keeping it in code keeps it typed and next to other content.
- `WEB3FORMS_ACCESS_KEY` -> `.env` `VITE_WEB3FORMS_KEY`. It's an integration setting (could change per account or be swapped for a test key). Note: the key ends up in the client bundle anyway (Web3Forms keys are public by design), so this is about keeping config in one place, not hiding a secret. `.env` is tracked in git -> CI build gets it with no workflow change.

## Changes
1. `.env`: add commented `VITE_WEB3FORMS_KEY=5d4f4c6c-…` (current value).
2. `src/vite-env.d.ts`: `readonly VITE_WEB3FORMS_KEY?: string` + doc.
3. `src/data/AngelikaInfo.tsx`: `export const WEB3FORMS_ACCESS_KEY = (import.meta.env.VITE_WEB3FORMS_KEY ?? '').trim()` (same trim pattern as GA_ID in `seo/site.ts`); Contact.tsx import unchanged.
4. app_description: Structure line `AngelikaInfo.tsx EMAIL + web3forms key` -> `EMAIL; WEB3FORMS_ACCESS_KEY from .env VITE_WEB3FORMS_KEY`; Analytics/env note lists both vars.

## Verify
- `npm run build` OK; `grep -r 5d4f4c6c dist/assets` -> key present in bundle (env injected); not in src.

No questions
