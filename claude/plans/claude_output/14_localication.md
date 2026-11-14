# 14 Localization: Warszawa · Łuków + separators

## Context
Task `claude/14_localication.md`: every city mention -> Warszawa + Łuków; city in Start H1 must not wrap; replace ` - ` / ` — ` / ` | ` phrase separators with nicer ones. Decided: add Łuków everywhere; `·` for titles/alts/city pair, en dash `–` in prose.

## Rules
- City pair label: `Warszawa · Łuków`. Inflected prose: `z Warszawy i Łukowa`, `w Warszawie i Łukowie`.
- `<title>`: phrases joined with `·`, brand suffix keeps ` | Angelika Malon` (SEO convention, distinct from city dot). E.g. `Fotograf ślubny Warszawa · Łuków | Angelika Malon`, `Kontakt · fotograf ślubny Warszawa · Łuków | Angelika Malon`.
- Meta descriptions / alts: `·` between label-like fragments (`Angelika Malon Fotografia · fotograf ślubny Warszawa · Łuków.`), `–` inside sentences.
- Prose (Start, Contact, Portfolio, Privacy, About): ` - ` -> ` – `.
- Code comments untouched. About bio "od niedawna mieszkam w Warszawie" stays (biographical fact).

## Changes
- `src/pages/Start.tsx`: title/desc per rules; H1 `Fotograf ślubny <span className="nowrap">Warszawa · Łuków</span> – reportaż pełen prawdziwych emocji`; intro "fotografem ślubnym z Warszawy i Łukowa", "Pracuję w Warszawie, Łukowie, na Mazowszu, Lubelszczyźnie i w całej Polsce –"; other ` - ` -> ` – `.
- `src/App.css` (shared utils): `.nowrap { white-space: nowrap; }`.
- `src/pages/{Contact,About,Portfolio,Gallery,Session,Privacy,NotFound}.tsx`: titles/descriptions/alts/prose per rules; Contact desc `w Warszawie, Łukowie i całej Polsce`; email subject `Zapytanie o termin · name | BRAND`.
- `src/components/Footer.tsx`: `Warszawa · Łuków i cała Polska.`
- `src/seo/site.ts`: AREA_SERVED + `'Łuków'`, `'województwo lubelskie'`; description per rules (address locality stays Warszawa).
- `src/entry-server.tsx`: About sitemap alt `Angelika Malon · fotograf ślubny z Warszawy i Łukowa`.
- `src/data/portfolio.ts`, `src/data/gallery.ts`: fallback alts ` - ` -> ` · `, slides fallback `Fotograf ślubny Warszawa · Łuków · Angelika Malon, zdjęcie N`.
- `src/data/altText.ts`: ` – ` separators -> ` · ` where label-like (2 entries).
- `index.html`: title + desc per rules (em dash gone).
- `claude/plans/app_description.md`: SEO target + title pattern + `.nowrap` util.

## Verification
- `grep -rnE " [-—] | \| Łuków|Warszawa\b" src index.html` -> only intended hits.
- `npm run build` ok; check `dist/index.html` h1/title/JSON-LD; dev server: narrow viewport, city stays on one line.

## Questions
No questions

## Branch
feature/14_localization_lukow_separators

---

# 14 fix: dot -> pipe, en dash -> hyphen

## Issue
After plan 14 user wants `·` separators -> `|`, and en dash `–` -> shorter plain hyphen `-`.

## Changes
- All user-facing ` · ` -> ` | ` (titles, meta desc, alts, footer, JSON-LD desc, Start h1 `.nowrap` span `Warszawa | Łuków`, contact email subject, index.html).
- All user-facing ` – ` -> ` - ` (Start, Contact, Portfolio, Privacy, About prose incl. pre-existing About ones).
- Code comments untouched.
- `claude/plans/app_description.md`: separators rule -> `|` + ` - `.
- Also included user edits: About `<br />`, gallery overview typo "nad wodą".

## Verification
- `grep -rn " · \| – " src index.html` -> none; `npm run build` ok; dist h1/title checked.
