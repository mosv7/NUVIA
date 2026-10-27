---
version: alpha
name: NUVIA
description: Bilingual customer feedback workspace using the approved blue brand and white product surfaces.
colors:
  primary: '#1e68ef'
  text: '#10213d'
  muted: '#64738a'
  border: '#dfe7f2'
  danger: '#f04438'
  background: '#ffffff'
typography:
  body:
    fontFamily: 'DM Sans, sans-serif'
  display:
    fontFamily: 'Manrope, sans-serif'
  arabic:
    fontFamily: 'Noto Sans Arabic, sans-serif'
rounded:
  input: '8px'
components:
  field: {}
  primary-button: {}
  choice-menu: {}
---

# NUVIA design context

The maintained visual references are the ordered galleries in `docs/ui/frontend/` and the existing account/onboarding/product components. The sole backend is `backend/`; current authentication connects through `/api`. It does not introduce a new visual identity. The brand reference is the approved geometric NUVIA mark, blue actions, white surfaces, and restrained line illustrations.

Owners create an account and business workspace, then review customer feedback on desktop or phone. English and Arabic/RTL are supported; locale does not imply a deployment country. Marketing landing and product workspace use the same brand, with denser navigation and controls inside the product.

## Runtime ownership

Runtime CSS remains canonical (mapping model B). `apps/web/src/styles/app.css` defines `--primary`, `--dark`, `--muted`, `--border`, and `--error`, mirrored above. Authentication, verification and loading states consume those variables. Font files are bundled by `main.jsx`. Existing styles own the layout/type scales; no duplicate theme adapter or new color palette is introduced. `setup.css` and `site-chrome.css` retain onboarding geometry and shared branding.

Existing headers use 76px desktop / 72px mobile geometry and responsive product navigation. The mobile breakpoint for account/business chrome is 850px. Preserve stacked narrow layouts, natural vertical scrolling and 16px mobile input text; never clip forms to force viewport fit. Verification uses the same action color, border, typography and 8px field radius as sibling account controls.

## Interaction contract

- Forms validate locally and on the server, disable duplicate submission while pending and announce failure/success through status/alert regions. Failed saving retains non-secret fields and never advances the step.
- Hash routes support refresh and persisted onboarding. Public account routes remain reachable; product routes require a signed-in owner and completed setup. Registration signs in directly; email verification is unavailable with the sole backend.
- Arabic changes document direction, labels and navigation semantics. User-entered names are displayed as entered. Dates use the user's locale and workspace reporting defaults.
- Private product routes show saved identity/workspace data and honest empty/unavailable states. Sample records, canned assistant replies and synthetic subscription/usage claims belong only to explicit `/preview/` routes.
- Account feedback routes reuse `FeedbackShell` and `FeedbackList` with the reviewed empty layout: heading, five filters, zero-response table, illustration, actions and getting-started steps. Sample responses open `/preview/#/feedbacks`; survey sharing reports its unavailable state while the connected frontend flow remains under development. Backend publishing state alone does not establish public response collection. Keep the approved empty Overview copy in previews, with availability-aware copy in account routes.
- Preserve visible focus, keyboard-operable menus, password visibility controls, native form semantics and reduced-motion behavior. No additional decorative motion is introduced.
- Verify changes through frontend tests and the account browser scenario at desktop and 393px mobile widths in both languages. Reference screenshots remain previews, not proof of real backend/AI behavior.

## Security continuation routes

`#/login-2fa` and `#/confirm-email` reuse AuthPage/Field, existing type/colors/art and EN/AR copy. Challenges stay only in memory; refreshing a login challenge requires password sign-in again. Email-change tokens leave the URL before an explicit confirmation; invalid/used links report failure without claiming success. Busy states prevent duplicate submission, navigation aborts pending work and late replies do not navigate. Broader settings screens remain under development. Browser evidence covers desktop/narrow EN/AR and replay/error cases.
