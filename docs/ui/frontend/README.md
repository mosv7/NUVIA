# Frontend review gallery

**[Browse all screenshots by section](screens/README.md)** — Landing, Authentication, Onboarding, Overview, Feedbacks, Analytics, Reports, Surveys, Business, Settings, Assistant, Notifications and Subscription.

| Device                  | English                  | Arabic                  |
| ----------------------- | ------------------------ | ----------------------- |
| Desktop â€” 1440 Ã— 960 | [English](desktop-en.md) | [Arabic](desktop-ar.md) |
| Phone â€” 390 Ã— 844    | [English](mobile-en.md)  | [Arabic](mobile-ar.md)  |

280 refreshed captures cover 67 routes plus three additional empty states in both languages and viewports. Captures include full-page and viewport images; actual dimensions and SHA-256 values are recorded in [the manifest](capture-manifest.json). Images use synthetic preview data, never private account data.

An additional responsive review covered 20 representative routes at widths 320, 768 and 1024 in English and Arabic (120 checks). The compact menu was checked at 320 Ã— 568 with Growth plan and Help center visible. These checks do not establish physical-device or every browser compatibility. See [review notes](review-notes.md).

## Regenerate

After a frozen dependency installation and web build, run `pnpm screenshots`. This reproducible utility generates full-page PNG files and updates the manifest. Capture mode hides the preview badge; normal account authentication is unchanged.
