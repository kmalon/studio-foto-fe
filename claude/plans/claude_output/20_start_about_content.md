# Plan 20 - Start/About content

## Context
New copy for Start + About is already in the working tree (uncommitted). Plan: About h1 split into big + smaller part; Start last paragraph gets inline links. Also fix copy formatting (answered: fix all).

## Steps
1. `src/pages/About.tsx` h1:
   `<h1>Zapisuję czułość, <span className="about-intro__sub">o której z biegiem lat łatwo zapomnieć.</span></h1>`
   - `About.css`: `.about-intro__sub { display:block; font-size: clamp(1.6rem, 3.6vw, 2.75rem); margin-top: .35em; color: var(--fg) }` (big part keeps base h1 size). Comma stays in big line.
2. `src/pages/Start.tsx` last paragraph: wrap words in `<Link>`:
   - "portfolio" -> `ROUTES.portfolio`, "galerii" -> `ROUTES.gallery`, "napisz do mnie" -> `ROUTES.contact`.
   - New shared `.text-link` in `App.css` (color --fg, underline, offset .2em, hover --accent) - same look as `.legal a`.
3. Copy cleanup (wording unchanged), both files:
   - each blank-line block -> own `<p>` (About: `lead`; Start: plain)
   - spaces: "ludzi, którzy", "rodzinnych, ciążowych"
   - `–` -> ` - ` (convention: plain hyphen in prose)
   - fix JSX indentation
4. app_description.md: note About h1 sub-line + `.text-link` in App.css utilities.

## Verify
- `npm run build` (tsc + prerender) passes
- check dist/index.html links `/portfolio/` `/galeria/` `/kontakt/`; dist/o-mnie/index.html h1 span
- `npm run dev` visual check desktop + mobile

## Questions
No questions

## Branch
feature/20_start_about_content
