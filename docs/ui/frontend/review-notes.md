# Responsive and Arabic UI review

## Current product refresh

- Added Overview, feedback list, empty collection and response details to the routed prototype.
- Applied the approved geometric logo with the original icon, blue V and a dark-background variant.
- Persistent headers share 76 px desktop and 72 px mobile heights; wide-screen dashboard scaling is compensated.
- Improved tablet action wrapping, phone evidence links, feedback cards up to 1100 px and short-screen sidebar reachability.
- Regenerated all 55 browser screenshots across 13 routes, English/Arabic and desktop/phone. Every checksum and PNG dimension matches the capture manifest.
- Format, lint, eight flow tests and production build pass. Sample data remains local; no backend or AI integration is claimed.

The sections below record the earlier nine-route review; the current matrix supersedes its scope and screenshot counts.

## Corrections

- The shared `.back` display rule exposed the mobile-only back arrow on desktop business screens. That extra flex item pushed the logo into the middle of the header. The scoped default rule now hides the arrow on desktop while preserving the mobile override. Logo alignment is checked against the actual header padding in English and Arabic.
- Password-recovery links use the appropriate return-arrow direction in Arabic.
- The Arabic password hint explicitly describes the existing Latin-letter validation requirement.
- Corrected the Arabic spelling of “آراءهم” in the onboarding guide.
- Arabic onboarding labels and progress markers explicitly use Arabic numerals, independently of the browser's default numbering system.

## Verification

- Reviewed all nine delivered routes at widths 320, 360, 393, 430, 700, 850, 851, 1024 and 1440, in both languages: 162 route/width/language combinations. No horizontal overflow, clipped audited headings/labels/buttons, broken images or out-of-bounds text inputs were found. Small radio controls were excluded from the text-input width check.
- Verified business header alignment across all four business routes at widths 393, 851, 1024 and 1440 in both languages: 32 combinations.
- Login and signup fit at 360 × 800, 393 × 800 and 1440 × 800 in both languages. Natural scrolling remains available for short windows, validation messages, keyboard display and larger text.
- Eight flow tests pass, including stale login-response isolation, Arabic return direction and Arabic onboarding numerals.
- Regenerated all 39 screenshots. `capture-manifest.json` records each image's real route, language, viewport, dimensions and checksum. Every checksum and PNG dimension was checked; no exact duplicate PNGs were found. Existing `active-*` files remain intentional viewport details of the full landing page.

## Design comparison and scope

The Figma `final ui` page was inspected, including the business-information, login, signup and English mobile-landing frames. The desktop business logo now occupies the reference header edge. Existing user-approved changes to mobile headers, language/help placement, compact typography, button sizing and card motion were retained.

There is no supplied Arabic mobile design. Arabic phone layouts were reviewed as RTL adaptations of the existing screens, rather than claimed as pixel-identical to a nonexistent Arabic phone frame. This review covers the implemented landing, account and onboarding screens; the additional dashboard/survey designs in Figma are outside the current app routes. Actual iPhone Safari keyboard/bounce behavior still needs device confirmation.
