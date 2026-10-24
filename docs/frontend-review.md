# Reviewed frontend integration (draft)

The web workspace adds the reviewed survey builder, analytics, reports and assistant screens under explicit preview routes. Account routes retain the existing authentication provider, API adapters and honest empty states. Synthetic feedback, report figures and assistant replies remain preview data.

## Scope

- Reuse the current monorepo and existing authentication and onboarding contracts.
- Add bilingual preview screens, shared controls, navigation and reviewed landing animation assets.
- Keep the latest mobile header, profile/language menu, mobile hero layout and workspace overrides out of this delivery. Those changes remain in the standalone Frontend folder for a later review.
- API, AI service and shared contract source files are unchanged.

## Validation and remaining review

The web production build and 26 existing web tests passed before the final formatting pass; both are being repeated for the final commit. The build reports a large JavaScript chunk warning.

This is a draft integration. Source lint currently reports unused bindings in imported preview modules and effect dependency warnings. Desktop and narrow-screen visual acceptance and live backend authentication require a configured runtime and remain outstanding. Do not merge until those checks and cleanup are complete.

## Local startup

Use the existing root START-LAPTOP.cmd. It keeps the repository's pnpm workspace and API proxy setup. Real authentication requires the existing private backend configuration and database; uploading frontend files does not create that configuration or prove a working login.
