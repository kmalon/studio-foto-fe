# Plan 5 — mobile fix (portrait nav)

## Context
Portrait / <900px: open drawer has logo over it, drawer bg only covers header height, logo fixed 15.75rem (too big on phones).
Root cause bg: `.nav--solid` has `backdrop-filter` → becomes containing block for `position: fixed` `.nav__list` → `inset:0` = header box (nav-h tall), not viewport.

## Changes
1. `src/components/Navbar.tsx`
   - header class add `nav--open` when `open`.
2. `src/components/Navbar.css` (in `@media (max-width: 900px)`)
   - `.nav--open { backdrop-filter: none; }` → drawer fixed to viewport again.
   - `.nav__list`: `height: 100dvh` (fallback `100vh`), `z-index: 55`, keep `background: var(--bg)` → full-length bg, above page.
   - `.nav--open .nav__brand { opacity: 0; visibility: hidden; pointer-events: none; }` (fade transition) → logo hidden, menu on top.
   - burger stays z-index 60 (visible to close).
3. Logo scaling
   - `src/styles/tokens.css`: add `--logo: clamp(9rem, 42vw, 15.75rem);` and `--nav-h: calc(var(--logo) * 0.794);` (0.794 = current 12.5/15.75 ratio → desktop unchanged).
   - `Navbar.css .logo`: drop local `--logo: 15.75rem` (use token).
   - `App.css` shell padding already uses `--nav-h` → follows automatically.
4. Update `claude/plans/app_description.md` (tokens `--logo`, nav open behavior).

## Verification
- `npm run build` (tsc + vite) passes.
- `npm run dev`, devtools portrait 375×667 / 768×1024: logo smaller, scales w/ width; open burger → logo hidden, drawer full-height bg, links centered, burger closes; scrolled state (solid nav) open → still full bg. Desktop 1440: unchanged.

## Unresolved questions
No questions

## Branch
feature/5-mobile-nav-fix
