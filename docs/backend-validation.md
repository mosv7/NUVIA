# Backend foundation validation

Recorded 2026-10-20 on Windows, Node.js v24.13.1, MongoDB 7.0.24. Node 22 Linux checks are configured in CI; remote results must be checked after pushing.

- Initial frontend baseline: 10 tests passed.
- Backend: 16 behavior tests against isolated local replica sets, covering real transactions/indexes/storage, owner isolation, strict validation, session expiry/CSRF, token reuse/expiry/concurrency, recovery, mail retry/encryption and primary-branch invariants.
- Frontend: 21 tests, including connected forms, failed-save preservation, stale login, same-screen verification links, stale-CSRF explicit retry, preview isolation, keyboard behavior and Arabic.
- Browser: real register -> private verification mail -> login -> failed-save retry -> persistent business/branch -> reload -> logout/login -> reset -> old password rejected -> new password accepted. EN desktop 1440x900 and AR mobile 393x800; no unexpected page/network errors or mobile horizontal overflow. Explicit design previews remain separate.
- Clean `npm ci`, formatting, lint and production build passed. Backend, frontend and browser commands passed again after review repairs before delivery.
- Credentials, private local mailbox/tools and remote chat attachments are ignored and excluded from source commits.

Local screenshots are under `test-results/accounts/` and contain synthetic data only.

## Review and limits

Independent read-only review found three Important issues: preview verification could call real APIs, stale CSRF could block explicit retries after session revocation, and readiness lacked a driver-supported client timeout. Each has a regression observed failing before the fix and is covered by the final test run. No deferred minor findings.

The clean-install validation also exposed a state-hydration race that could overwrite early onboarding input. Connected onboarding now initializes its own draft from the resolved workspace before rendering controls; the failed-save regression and browser flow passed after that fix.

An interim isolated Atlas test attempt failed during TLS connection establishment. All passing account-flow evidence uses the local replica set. The final development Atlas authenticated ping succeeded with explicit local DNS/TLS compatibility options; no data was written by that check. A ping alone never establishes account-flow acceptance.

The Windows test archive is about 600 MB. This machine uses only the required executable, extracted from the official MongoDB HTTPS ZIP with range requests and verified against its ZIP CRC/size, under ignored `.local/tools/`. No permanent service or system DNS/TLS setting was changed.

SMTP provider credentials were not supplied, so real email delivery is unverified. The adapter/retry path uses fake transport tests; full verification/reset consumption uses the private local mailbox. Customer feedback collection, AI, analytics, reports, Google OAuth, subscriptions and teams are outside this slice.

Implementation retained the approved feature checkout. Backend tasks were developed together while obtaining the test binary, then validated as an integrated suite and committed together. This changes commit granularity, not delivered scope.
