# Frontend review gallery

Real browser captures of the integrated React frontend. Sample workspace figures are restricted to `/preview/` routes. Connected account, authentication and backend behavior are preserved.

## Browse by device and language

| Viewport                      | English                           | Arabic                            |
| ----------------------------- | --------------------------------- | --------------------------------- |
| Phone · 390 × 844             | [English](mobile-en.md)           | [العربية](mobile-ar.md)           |
| Tablet portrait · 820 × 1180  | [English](tablet-portrait-en.md)  | [العربية](tablet-portrait-ar.md)  |
| Tablet landscape · 1024 × 768 | [English](tablet-landscape-en.md) | [العربية](tablet-landscape-ar.md) |
| Desktop · 1440 × 960          | [English](desktop-en.md)          | [العربية](desktop-ar.md)          |

The gallery contains 336 full-page images: 42 screens/states in two UI languages at four viewport sizes. Each image is stored once under `screens/{viewport}/{language}/`. `capture-manifest.json` records its route, viewport, pixel dimensions and SHA-256. Report content keeps its supplied report language, which can differ from the surrounding UI language.

## Validation

The responsive audit checked 42 screens/states × 2 UI languages × 8 viewport widths (360, 600, 768, 820, 851, 1024, 1180, 1366): 672 checks. The audit checks visible content against viewport bounds; it does not prove that every possible overlap, physical device or browser is covered. Representative layouts and open date/branch menus were also inspected visually. See [review notes](review-notes.md).

Screenshots use browser viewport emulation. Physical iPad/Safari and real backend/database acceptance tests were not run in this environment.

## Regenerate

From the repository root, run `pnpm screenshots` after the normal frozen dependency installation. The script builds the web app, uses explicit preview routes and regenerates this matrix.
