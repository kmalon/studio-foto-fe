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
