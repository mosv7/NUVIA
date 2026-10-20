# Frontend development and review

The frontend uses React/JSX + Vite, supports English and Arabic/RTL, and bundles its fonts/assets locally. Account and business-onboarding routes now require the [Node/MongoDB backend](backend.md). The legacy prototype flows described below remain available under `/preview/#/<route>` without an API; sample analytics and assistant replies are preview-only. Real product routes require verified accounts and show saved workspace data plus empty/unavailable states.

## Routes

| Route                    | Delivered UI                                                            |
| ------------------------ | ----------------------------------------------------------------------- |
| `#/landing`              | Landing, navigation, feature dialogs, and local demo-form validation    |
| `#/login`                | Login form with validation and a demo failed-login response             |
| `#/signup`               | Signup validation, password visibility, and a demo existing-email state |
| `#/forgot`               | Request validation; no email is sent                                    |
| `#/reset`                | Password/confirmation validation; no password is changed                |
| `#/business-information` | Required business name and industry                                     |
| `#/business-error`       | Direct preview of the information error state                           |
| `#/business-setup`       | Single/multiple branch selection and primary-branch validation          |
| `#/get-started`          | In-memory setup summary                                                 |
| `#/dashboard`            | Overview metrics, branch/date filters, CSV export and sample feedback   |
| `#/dashboard-empty`      | First-time Overview with no responses and first-survey guidance         |
| `#/feedbacks`            | Feedback list with search, filters, selection and pagination            |
| `#/feedbacks-empty`      | Empty feedback collection and survey-sharing demo                       |
| `#/feedback-details`     | Sample response details and aspect analysis                             |

Use the language selector in the footer or dashboard header to change language. From signup, the business-setup preview link opens onboarding without pretending that an account was created. Form values clear on reload; do not enter real credentials for demo review. The landing's demo form validates input locally and sends no booking or email.

## Source map

- `apps/web/src/app/router/AppRouter.jsx`: route and language state, authentication forms.
- `apps/web/src/pages/`: landing and onboarding steps.
- `apps/web/src/components/`: shared fields, onboarding card, illustrative dashboard preview.
- `apps/web/src/styles/`: landing, authentication, onboarding, and dashboard-preview styles.
- `apps/web/src/features/auth/api.js`: isolated demonstration adapter, to be replaced after identity contracts are agreed.
- `apps/web/public/assets/`: original images and SVGs, organized by screen; see its asset README.
- `apps/web/tests/`: critical flow, validation, RTL, and keyboard tests.

## Run and preview

Run commands from the repository root. Use Node.js 22.13 or later and pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the Local URL printed in the terminal. Keep the terminal running. Opening `apps/web/index.html` by double-click does not run the React development app.

For a phone on the same trusted Wi-Fi network:

```sh
pnpm dev:network
```

Open the printed Network URL on the phone; localhost refers to the phone itself. Keep the computer awake and the dev server running. If the firewall blocks the connection, allow the Node process only on the intended private network. Do not disable the firewall or expose the development server as a public deployment.

For the production bundle and local HTTP preview:

```sh
pnpm build
pnpm preview
```

Vite writes the generated bundle to `apps/web/dist/`. It is ignored by Git and is served over HTTP rather than opened as a file.

For portable, double-clickable demos with fonts and assets embedded:

```sh
pnpm build
pnpm previews
```

Open `previews/landing.html` or `previews/business.html`. These are generated review artifacts, ignored by Git; regenerate after changing the source.

## Checks and limitations

```sh
pnpm format:check
pnpm lint
pnpm test:web
pnpm build
```

Use `pnpm format` to format the code and `ppnpm test:web:watch` for test development. The GitHub workflow runs the same checks after a clean install.

Automated UI tests cover language/RTL persistence, invalid signup without password persistence, required business/branch inputs and step progression, and keyboard password visibility. Browser review additionally checks desktop/mobile layout, image loading, a visible shared logo, consistent persistent navbar height, and no page-level horizontal overflow. This is not a complete accessibility audit or backend/system acceptance.

The desktop landing caps typography and hero scaling on wide screens and reduces the excess top space. The blue glow stays behind the hero copy. Onboarding uses a consistent desktop introduction card across steps. Small screens use stacked layouts; taller forms may use normal page scrolling instead of an internal form scrollbar.

## UI review screenshots

English and Arabic screenshots are committed under `docs/ui/frontend/` for reviewer comparison. Run `npx playwright install chromium` once, then `pnpm screenshots` to regenerate the entire set, with one image per documented screen/state. See [the screenshot file map](../ui/frontend/README.md). They contain only synthetic prototype content. No backend, authentication, or AI capability should be inferred from a screenshot.

## Mobile refinements

Account screens keep the language selector in the bottom footer on small screens while hiding copyright and utility links. The mobile landing footer follows the Figma language/copyright/social row, and the hero preview keeps equal gutters in English and Arabic. Bottom padding is reduced, the mobile browser theme stays white, and root vertical overscroll is disabled on landing pages to avoid exposing a blank area during bounce scrolling. Phone typography is slightly smaller, and the landing navigation remains fixed during scrolling. Only feature and process cards use a brief 280 ms entry animation with an 8 px movement and no stagger; language switching and reduced-motion preferences remain supported. Business onboarding keeps only the language selector in its mobile footer. The iPhone-specific browser bounce still needs confirmation on the user's actual Safari device.

## Account viewport fit

Login and signup use compact spacing at common screen heights, with no internal form scrollbar. Browser review confirms both languages fit at 393 × 800 and 1440 × 800. Shorter viewports, enlarged text, keyboard display, and validation errors may require natural page scrolling so fields remain reachable; content is never clipped to enforce a fixed screen. Mobile inputs use a 16 px font to avoid automatic focus zoom on iOS.

## Mobile language and pending account requests

At widths up to 850 px, account and business screens keep a blue language control at the bottom, show the approved logo, and provide an arrow-only return control with an accessible name and RTL direction. Desktop header content remains unchanged. Changing account routes invalidates pending submissions and resets loading state; stale results cannot overwrite notices or clear a newer request. The regression test resolves an old login request while a new signup request is pending.

## Shared branding and responsive product screens

The approved logo combines the original blue icon with the selected geometric NUVIA lettering and blue V. Transparent SVG variants for light and dark backgrounds live in `apps/web/public/assets/brand/`. `apps/web/src/styles/site-chrome.css` applies the same mark across headers and the landing footer. All top bars remain visible while scrolling and share a 76 px desktop height and 72 px height at widths up to 850 px. Dashboard zoom is compensated so wide screens keep the same physical header and logo size.

Overview and feedback use synthetic sample data; no analytics backend or AI service is connected. Feedback rows become cards on widths up to 1100 px, mobile navigation uses a drawer, and short desktop viewports keep subscription/help links reachable by scrolling. Detailed charts and analysis tables may scroll inside their cards.

## Current Overview and shared controls

The approved Overview keeps the existing logo, metric icon colors, blue export action and bold arrows. AI Daily Insight appears on the left and Aspect Scores on the right, followed by What to do next and Quick Actions. Branch attention, Key Insights, Ask NUVIA content cards, recent-response panels and customer-segment panels are omitted from this layout. Medium recommendation priority uses a yellow treatment. Aspect scores currently show positive-share percentages; they are not the proposed 0–10 metric.

Branch and date selections retain the Overview layout and recalculate illustrative metrics and charts. Cards without detailed scoped aggregates show an unavailable/empty message instead of repeating all-branch insights. CSV export reflects the selected overview scope.

The shared assistant opens in a white panel from the same compact floating button on Overview and Feedback screens. It moves to the left in Arabic and remains on the right in English. It includes a summary, an input and canned demo replies without suggested-question buttons; no retrieval or AI service is implemented.

Language and branch controls use keyboard-accessible custom lists with selected-state indicators. The sidebar label is Business & Teams (النشاط التجاري والفِرق in Arabic). This is a label update, not a delivered team-management route. Existing prototype boundaries still apply.

The approved first-time empty Overview is available at `#/dashboard-empty`, retaining the shared navigation, language and branch controls, and floating assistant. It shows a compact survey illustration, no-response message, first-survey action, and three onboarding steps. The existing no-results state after filtering remains available.
