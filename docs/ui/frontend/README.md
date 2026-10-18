# Frontend screenshots

These are real browser captures of the current React source, in English and Arabic. They are review evidence, not generated UI mockups. Desktop captures use 1440 × 960; phone captures use 393 × 800. Full-page images may be taller than the viewport.

## Browse in order

1. [Mobile — English](mobile-en.md)
2. [Mobile — Arabic](mobile-ar.md)
3. [Desktop — English](desktop-en.md)
4. [Desktop — Arabic](desktop-ar.md)

Each gallery follows the same flow: landing, account screens, business setup, overview, feedback, empty feedback and response details. Additional landing detail images are listed separately below.

## Regenerate the complete set

From the repository root:

```sh
npm ci
npx playwright install chromium
npm run screenshots
```

The command builds and serves the production frontend bundle on local port 5191, waits for bundled fonts, images, and dashboard sizing, and captures every route in both languages. It validates the compact phone sign-in link, visible approved logos and persistent account/setup headers, exact blue SVG language icon, bottom help placement, absence of horizontal overflow, and consistent navbar height. It also fails if an existing PNG was not refreshed, so older aliases cannot silently remain stale. It does not alter application code or the separate color preview.

Set `SCREENSHOT_PORT` if the default port is occupied. `PLAYWRIGHT_CHROMIUM_EXECUTABLE` optionally selects an existing Chromium executable; otherwise Playwright uses its installed Chromium. Reduced motion and disabled screenshot animations make captures stable.

## File map

Replace `{lang}` with `en` or `ar`.

| Screen                     | Desktop                           | Phone                                    |
| -------------------------- | --------------------------------- | ---------------------------------------- |
| Landing, full page         | `{lang}-landing.png`              | `{lang}-mobile.png`                      |
| Login                      | `{lang}-login.png`                | `{lang}-mobile-login.png`                |
| Create account             | `{lang}-signup.png`               | `{lang}-mobile-signup.png`               |
| Forgot password            | `{lang}-forgot.png`               | `{lang}-mobile-forgot.png`               |
| Reset password             | `{lang}-reset.png`                | `{lang}-mobile-reset.png`                |
| Business information       | `{lang}-business-information.png` | `{lang}-mobile-business-information.png` |
| Business information error | `{lang}-business-error.png`       | `{lang}-mobile-business-error.png`       |
| Business setup             | `{lang}-business-setup.png`       | `{lang}-mobile-business-setup.png`       |
| Get started                | `{lang}-get-started.png`          | `{lang}-mobile-get-started.png`          |
| Overview                   | `{lang}-dashboard.png`            | `{lang}-mobile-dashboard.png`            |
| Overview — Empty State     | `{lang}-dashboard-empty.png`      | `{lang}-mobile-dashboard-empty.png`      |
| Feedback list              | `{lang}-feedbacks.png`            | `{lang}-mobile-feedbacks.png`            |
| Feedback empty state       | `{lang}-feedbacks-empty.png`      | `{lang}-mobile-feedbacks-empty.png`      |
| Feedback details           | `{lang}-feedback-details.png`     | `{lang}-mobile-feedback-details.png`     |

The existing detail filenames are preserved and recaptured from the same run:

- `active-ar-mobile-hero.png`: Arabic landing at the top of the phone viewport.
- `active-ar-mobile-footer.png`: Arabic landing scrolled to the footer.
- `active-en-mobile-footer.png`: English landing scrolled to the footer.

All 63 PNGs are refreshed together. The original 17 filenames remain valid; unchanged desktop views may produce identical files. The complete matrix now covers all 14 routes in both languages and viewport sizes, plus the open shared assistant in each language/viewport combination. Business screens show the initial empty prototype state and do not imply saved workspace data.

`capture-manifest.json` records the actual route, language, viewport, image dimensions, scroll position and SHA-256 for each capture. The `active-*` files are deliberate viewport details of the full landing image, not different screen designs. All other filenames map to the route/locale/viewport matrix above.
