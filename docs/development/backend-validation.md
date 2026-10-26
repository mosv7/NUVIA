> Historical implementation record: references to apps/api, its routes, worker and validation describe the removed backend. Current runtime is backend/; see README and docs/api/README.md. These results do not verify the replacement.

# Backend foundation validation

## Monorepo validation — 2026-10-21

The JavaScript applications now live in `apps/web` and `apps/api`, with package-owned dependencies/tests and shared public constants under `packages/shared-types`. A separate staged-source checkout without private configuration or old node_modules passed frozen offline installation, 21 backend tests, 26 frontend behavior tests, the real browser account lifecycle and a production build. A further Vite configuration regression verifies permitted source/dependency paths and denial of synthetic private mailbox/credential paths without reading private files. Formatting and lint passed.

Clean installation exposed an inherited `preserveSymlinks` setting that hid a React scheduler resolution problem in the working checkout; using default pnpm/Vite resolution fixed the clean browser flow. Independent review also caught an overly broad development filesystem allowlist and a Node minimum mismatch with pnpm 11; both are repaired and re-reviewed. The supported minimum is Node 22.13.

All 60 EN/AR desktop/mobile preview candidates were generated outside the repository, with asset/font/overflow checks. Approved gallery images were preserved. The combined development launcher reached API readiness and served the web app against the existing local replica set; Ctrl+C stopped its owned services and released ports 3001/5173.

The optional FastAPI scaffold passes two health tests and Ruff checks; it explicitly reports analysis unavailable. Docker Compose configuration validates, but local image builds/runtime remain unverified because the Docker daemon is unavailable. The [workspace CI run](https://github.com/mosv7/NUVIA/actions/runs/39509384961) for implementation commit `01ebbc5` passed all four jobs: web, accounts, AI scaffold and containers. The container job built and started MongoDB/API/mail/nginx/FastAPI on Linux and passed same-origin API/web and scaffold health checks. This provides container smoke evidence, not production deployment or full browser acceptance inside Docker. Atlas account-flow and SMTP acceptance remain unverified.

The Mongoose and foundation records below are historical snapshots preceding the monorepo layout.

## Mongoose migration validation — 2026-10-21

The application persistence layer now uses seven connection-scoped Mongoose models. A clean `pnpm install --frozen-lockfile`, 20 backend tests, 26 frontend tests, formatting/lint/build and the browser account lifecycle passed locally after conversion. New regressions cover insert/update validation, unknown-field rejection, model isolation across databases, no implicit collection creation during connection/read-only queries, and legacy UUID/ObjectId fixtures through reconnect/login/password reset. Existing custom indexes and unique/TTL/partial-index definitions remain intact. Tests use isolated replica sets; no shared application data is used by the suites.

An independent read-only review reported no actionable findings. The connected development API, mailbox worker and frontend also started against the existing persistent local database; readiness/session HTTP checks returned 200. The Atlas read-only connection check still failed on this machine, so this does not establish Atlas acceptance. SMTP delivery remains unverified. No private configuration or bulk data rewrite was required.

The original foundation record below is historical; its 16/21 test counts predate the later regression tests and Mongoose migration.

Recorded 2026-10-20 on Windows, Node.js v24.13.1, MongoDB 7.0.24. Node 22 Linux checks are configured in CI; remote results must be checked after pushing.

- Initial frontend baseline: 10 tests passed.
- Backend: 16 behavior tests against isolated local replica sets, covering real transactions/indexes/storage, owner isolation, strict validation, session expiry/CSRF, token reuse/expiry/concurrency, recovery, mail retry/encryption and primary-branch invariants.
- Frontend: 21 tests, including connected forms, failed-save preservation, stale login, same-screen verification links, stale-CSRF explicit retry, preview isolation, keyboard behavior and Arabic.
- Browser: real register -> private verification mail -> login -> failed-save retry -> persistent business/branch -> reload -> logout/login -> reset -> old password rejected -> new password accepted. EN desktop 1440x900 and AR mobile 393x800; no unexpected page/network errors or mobile horizontal overflow. Explicit design previews remain separate.
- Clean `pnpm install --frozen-lockfile`, formatting, lint and production build passed. Backend, frontend and browser commands passed again after review repairs before delivery.
- Credentials, private local mailbox/tools and remote chat attachments are ignored and excluded from source commits.

Local screenshots are under `test-results/accounts/` and contain synthetic data only.

## Review and limits

Independent read-only review found three Important issues: preview verification could call real APIs, stale CSRF could block explicit retries after session revocation, and readiness lacked a driver-supported client timeout. Each has a regression observed failing before the fix and is covered by the final test run. No deferred minor findings.

The clean-install validation also exposed a state-hydration race that could overwrite early onboarding input. Connected onboarding now initializes its own draft from the resolved workspace before rendering controls; the failed-save regression and browser flow passed after that fix.

An interim isolated Atlas test attempt failed during TLS connection establishment. All passing account-flow evidence uses the local replica set. The final development Atlas authenticated ping succeeded with explicit local DNS/TLS compatibility options; no data was written by that check. A ping alone never establishes account-flow acceptance.

The Windows test archive is about 600 MB. This machine uses only the required executable, extracted from the official MongoDB HTTPS ZIP with range requests and verified against its ZIP CRC/size, under ignored `.local/tools/`. No permanent service or system DNS/TLS setting was changed.

SMTP provider credentials were not supplied, so real email delivery is unverified. The adapter/retry path uses fake transport tests; full verification/reset consumption uses the private local mailbox. Customer feedback collection, AI, analytics, reports, Google OAuth, subscriptions and teams are outside this slice.

Implementation retained the approved feature checkout. Backend tasks were developed together while obtaining the test binary, then validated as an integrated suite and committed together. This changes commit granularity, not delivered scope.
