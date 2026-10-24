# Frontend review gallery

| Device               | English                  | Arabic                  |
| -------------------- | ------------------------ | ----------------------- |
| Desktop - 1440 x 960 | [English](desktop-en.md) | [Arabic](desktop-ar.md) |
| Phone - 390 x 844    | [English](mobile-en.md)  | [Arabic](mobile-ar.md)  |

176 full-page screenshots: 44 screens/states for each device and interface language. Images are stored once under `screens/{device}/{language}/`. The manifest records routes, viewport sizes, actual image dimensions and SHA-256 values. Report content retains its supplied report language, which may differ from the interface language.

## Validation

The responsive review checked 42 screens/states, two interface languages and eight widths: 672 viewport-bound checks. These do not establish every possible overlap or physical-device/browser combination. Physical iPad/Safari and private database/mail acceptance were not run. See [review notes](review-notes.md).

## Regenerate

Run `pnpm screenshots` from the repository root after frozen dependency installation and a web build. Capture mode omits the preview badge and anchors the assistant launcher at the bottom of full-page images; normal application navigation and authentication are unchanged.
