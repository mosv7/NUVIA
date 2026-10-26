# Frontend verification — 26 October 2026

## Scope

The approved Frontend presentation is reconciled with the modular monorepo. Authentication providers, access policy, CSRF/session transport, request cancellation and owner-scoped workspace services remain in place. Backend and AI-service implementation files are unchanged.

Connected accounts use saved identity and honest empty/unavailable states. Synthetic feedback, analytics, reports, assistant replies and customer-form submission remain explicit previews. Survey publishing, public response persistence, analysis, billing, profile mutation, preferences and two-factor service endpoints are not implemented by the existing backend. Their preview controls do not prove production support.

## Completed changes

- Removed the internal public review page from build inputs; retained public feedback redirect without duplicate source trees.
- Enabled unused-variable warnings and removed unused bindings; unified LF/Prettier formatting.
- Split WorkspacePages into feature-focused modules; lazy-loaded analytics, reports and surveys.
- Centralized the public survey URL and versioned guarded browser-storage access. Direct global storage access is prohibited outside the facade.
- Restored native action controls, image alternatives, visible keyboard focus and dialog focus restoration/trapping.
- Retained approved empty Overview, Feedbacks and Surveys, responsive menus, link arrows/colours, full-width subscription frame and feedback answer controls.
- Business/profile/branch actions use the existing real API; unsupported location edits and future services report their availability honestly.
- Refreshed 280 EN/AR desktop/mobile screenshots with actual dimensions and hashes.

## Verification

- Original desktop Frontend: lint, 173 tests, build and formatting checks passed after promotion.
- Monorepo frontend: 173 tests passed; lint passed with zero warnings.
- Existing backend suite: 21 tests passed against an isolated MongoDB replica set.
- Development-server private-file denial regression passed.
- Real Vite proxy integration passed: session bootstrap, registration, unverified-login rejection, token verification, cookie login, persistent onboarding, owner-scoped create/list/update/archive branches and logout. Only synthetic test identities and an isolated disposable database were used. The test chooses an available port rather than depending on Windows port 5173.
- 120 representative viewport reviews checked widths 320, 768 and 1024 in both languages. No horizontal document overflow or missing image alternatives appeared. At 320px the workflow-step labels were adjusted to stack. Some Arabic glyphs extend beyond nominal line-height metrics while overflow remains visible; these measurements are retained in the audit and are not described as hidden content.
- The 320 × 568 mobile menu retained Growth plan and Help center. View Related Responses preserved its aspect query instead of opening an unfiltered list.

## Limits and reproducibility

The local Windows environment rejects pnpm workspace-link creation. Frozen resolution/download was verified, then the same pinned ESLint, Vitest, Vite and Prettier tools were invoked directly for local checks. CI uses the repository's standard pnpm commands. Full browser account lifecycle CI, physical iPad/Safari, private Atlas acceptance and real SMTP delivery are separate checks; do not infer they passed from preview captures. The existing AI scaffold remains health-only.

Large feature CSS is loaded with its lazy route. It was not blindly purged because generated selectors affect the approved design. Screenshots are a visual reference, not proof of all possible layouts.
