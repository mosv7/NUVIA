# Connected workspace integration

The connected workspace uses the existing Node API for survey editing, publishing, public responses, stored feedback, analytics, reports, and account settings. Preview routes keep local interactions and sample data. Help Center is bilingual self-service guidance with links to the workspace.

## Survey and feedback

Publish an active survey before distributing its same-origin public link or downloading its PNG QR code. A signed QR link can attribute a completed submission to that channel. The public form uses its server-issued version, resolves branch attribution, and offers the survey’s enabled EN/AR languages. It refreshes an edited form before accepting a new answer. The backend stores the agreed form snapshot and deduplicates retries with the submission ID. Owners can browse and export their saved feedback and open the original response from assistant citations.

## Analytics and reports

Analytics use the current owner’s business. Response volumes and ratings use stored responses. Sentiment and aspects count results with accepted analysis provenance. The completion rate is unavailable until form starts are measured. Aspect scores are signed polarity confidence. Forecasts, anomaly assessments, and risk assessments need validated methods.

Saved reports scope reads and date-filtered generation to the active owner’s business. Generation uses the authenticated, source-validated AI contract. Report citations point to stored feedback. Baseline and legacy unverified reports retain explicit quality status. Generation requires sufficient written feedback, an available configured provider, and a scope within the documented limits.

## Operational limits

Live support and ticket submission remain unavailable. Signup address verification uses explicit confirmation from a mail link. Team access, Google OAuth, and billing remain planned. Verify SMTP delivery and configured AI behavior separately. Browser and API integration tests use synthetic accounts and an isolated transaction-capable database.
