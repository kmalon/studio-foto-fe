# Plan 12 – Analytics, cookie consent, privacy/legal

## Context
Need GA4 traffic stats. Site in PL/EU → GA cookies need prior opt-in consent (GDPR + PL Prawo telekomunikacyjne/PKE) → consent banner + privacy policy (also covers web3forms contact data). Footer already has "© … Wszystkie prawa zastrzeżone"; add copyright clause (photos protected, no reuse) inside legal page instead of separate thin page (SEO: no thin pages).

## Approach
1. **Config** `src/seo/site.ts`: `GA_ID` from `import.meta.env.VITE_GA_ID` (`.env` committed, ID public anyway). Empty → analytics fully off (dev/no ID).
2. **`src/analytics/ga.ts`**:
   - `loadGa()` – inject `gtag/js?id=GA_ID` script once, `gtag('js')`, `gtag('config', GA_ID, {send_page_view:false, anonymize_ip})`. Consent Mode v2: `consent default` denied all → `update` analytics_storage granted on accept; ad_* stay denied.
   - `trackPage(path, title)` – `page_view` event.
   - consent store: `localStorage['cookie-consent'] = 'granted'|'denied'` (try/catch), `getConsent/setConsent`, small subscribe for re-open from footer.
   - Script NOT loaded until granted (no cookies before consent, no 3rd-party request).
3. **`src/components/CookieConsent.tsx/.css`**: fixed bottom bar, dark tokens, PL text + link to policy, buttons "Akceptuję" / "Odrzuć" (equal weight – required). Rendered only client-side after mount (SSR renders null → no hydration mismatch). Hidden once choice stored.
4. **`src/components/Analytics.tsx`** (in App.tsx next to ScrollToTop): on consent granted → loadGa; on pathname change → trackPage (SPA nav). Effects only, SSR-safe.
5. **Page `/polityka-prywatnosci`** `src/pages/Privacy.tsx` (PageShell, page-head + prose, usePageMeta, indexable): administrator (Angelika Malon, EMAIL), data from form (web3forms, purpose: reply, basis art.6 1b/f, retention), GA4 (purpose, basis consent, Google as processor, transfer to US – DPF), cookies list (`_ga`, `_ga_*`, localStorage consent key), rights (access, deletion, withdraw consent, complaint to PUODO), **Prawa autorskie** section (all photos © Angelika Malon, no copying without consent). Button "Zmień ustawienia cookies" → reopen banner.
6. Wiring: `ROUTES.privacy = '/polityka-prywatnosci/'`; route in App.tsx; `pages` entry in entry-server.tsx (sitemap); Footer bottom: link "Polityka prywatności" + "Ustawienia cookies" button; Contact form: short note under submit "Wysyłając formularz… zgodnie z Polityką prywatności" (link).
7. Update app_description.md.

## Files
`src/seo/site.ts`, new `src/analytics/ga.ts`, `src/components/{CookieConsent,Analytics}.tsx`, `CookieConsent.css`, `src/pages/Privacy.tsx/.css`, `src/App.tsx`, `src/routes.ts`, `src/entry-server.tsx`, `src/components/Footer.tsx/.css`, `src/pages/Contact.tsx`, `.env`, `src/vite-env.d.ts` (env type).

## Verify
`npm run build` (prerender includes dist/polityka-prywatnosci/index.html, sitemap entry; no gtag in HTML); `npm run lint`; `npm run preview` → banner shows, no requests to googletagmanager before accept; accept → gtag loaded, page_view on nav (Network/GA DebugView); reject → nothing loaded; reload → banner gone; footer "Ustawienia cookies" reopens.

## Decisions
- GA ID: none yet → `.env` `VITE_GA_ID=` empty, analytics off until set. Banner also hidden while no ID? → yes, banner only when GA_ID set (no cookies otherwise = no consent needed).
- Admin: name + email only.
- Copyright: section in privacy page.

No questions

## Branch
`feature/12_analytics_cookie_consent_privacy`
