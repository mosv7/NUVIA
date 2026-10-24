# Frontend review gallery

[Browse the English desktop screens](desktop-en.md).

42 full-page screenshots at 1440 × 960, organized under `screens/desktop/en/`. The manifest records each route, viewport, image dimensions and SHA-256.

Phone, Arabic and tablet images are excluded from this delivery. The existing English and Arabic application code remains included.

## Validation

The responsive review checked 42 screens/states, both UI languages and eight widths: 672 viewport-bound checks. This does not establish every possible overlap or physical-device/browser combination. Physical iPad/Safari and private backend/database acceptance were not run. See [review notes](review-notes.md).

## Regenerate

Run `pnpm screenshots` from the repository root after the normal frozen dependency installation. The configured matrix captures English desktop screens. Capture presentation omits the preview badge and anchors the assistant launcher to the bottom of a full-page image; normal application navigation and authentication are unchanged.
