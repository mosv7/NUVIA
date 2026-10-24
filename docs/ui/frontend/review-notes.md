# Frontend review notes

The delivery preserves the monorepo's connected authentication provider, access policy, HTTP client, workspace ownership and honest empty account states. Illustrative analytics, reports, assistant replies and survey data remain behind the explicit preview boundary.

## Changes and review

- Compact mobile controls, consistent contextual back controls and retained source-page filters.
- Branch multi-selection applies on Done and combines with survey search in English and Arabic.
- Responsive feedback cards at intermediate widths retain every field without forcing a wide table.
- Survey AI cards, headings, sharing controls and action rows adapt to the available workspace width.
- Report branch context stacks when the desktop sidebar leaves insufficient space.
- Assistant scope controls sit at the start of the conversation frame on phones; small metadata keeps its muted background.
- Unreachable duplicate source modules were removed after checking the bundle import graph; unused asset bindings and copied report-filter effects were removed.

## Verification

- Web build completed; Vite retains a large-chunk advisory.
- Web ESLint completed with zero errors and zero warnings.
- Connected authentication/workspace and preview tests passed locally.
- 672 viewport-bound checks covered 42 screens/states, both languages and eight widths.
- 176 fresh screenshots cover desktop and phone in English and Arabic. Tablet layouts were checked during the responsive audit; tablet images are excluded.
- Date selection, sort direction, branch selection/Done and contextual return controls were checked in the preview.

## Limits

These are browser-emulated viewport checks, not physical iPad/Safari acceptance. Database, mail delivery and real backend integration must be tested with the project's private environment after integration. Generated preview reports and survey actions do not establish implemented backend services.

The Segment filter is restored with a regression assertion for all six disabled connected-account filters. The account browser lifecycle and all CI jobs passed after the correction.

## Connected verification design restoration

The connected email verification route now uses the approved original presentation, including pending, expired and verified states. Verification token consumption, real resend requests and the explicit preview boundary are retained. Signup carries its submitted email into verification in memory without persisting credentials. Successful verification continues to login, not an unauthenticated business setup.

The signup, login, recovery and business setup presentation was compared with the original frontend. Ten account/setup routes were checked in English and Arabic at 390, 820 and 1440 pixels: 60 additional viewport-bound checks.

Account language controls now use one shared 16px blue globe in login, signup, recovery and verification screens, including the story caption. Updated captures include these controls in both interface languages.

Account headers use an icon-only back control opposite the NUVIA logo, mirrored in Arabic, without changing authentication behavior. The browser tab is titled NUVIA and uses the square brand icon for readability at favicon size.
