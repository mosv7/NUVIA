# Frontend-only hardening

No API, AI-service, database model or shared API contract is changed. Survey publishing, public response collection and live analysis still require backend services and retain their unavailable states on connected account routes. Existing real authentication/business services remain unchanged.

- App/root Suspense fallbacks announce loading in EN/AR. ErrorBoundary shows a safe message and retry action; retry reloads the page because rejected lazy imports are cached. Hash navigation clears a failed page boundary.
- ProductProvider dispatch uses stable IDs (for example `export-report`, `create-survey`, `analytics`). Direct callers and Overview quick actions use IDs, independently of translated text. Imported reference-label compatibility is isolated in `actionIdFromLabel`/`routeForLabel`.
- CSS cleanup merges only adjacent rules with identical declarations inside the same parent; selector specificity, cascade position and declaration values are retained. Workspace/mobile duplicate blocks were combined; dashboard CSS had no safe adjacent duplicates and was left intact. No broad removal of `!important` or design normalization was attempted.
- React Hooks and targeted JSX accessibility rules validate image alternatives, ARIA attributes/roles and focus order. The original standalone frontend now has the same Hooks checks as the monorepo.

Validation: original frontend 177 tests, lint, build and Prettier passed. Additional regression cases cover suspended loading, render failure/retry and stable action routing; browser checks exercise unchanged EN/AR desktop and phone views. This is not an end-to-end survey API test: no survey API was added at the user's request.
