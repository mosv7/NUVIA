# NUVIA

AI-powered customer feedback analytics and business intelligence for Arabic and English.

NUVIA helps businesses turn free-text customer feedback into aspect scores, recurring complaint topics, trends, and prioritized recommendations. Customers submit feedback through published questionnaires shared by link or QR code. Business teams explore the results through a bilingual dashboard with Arabic RTL support.

## Project status

The bilingual React app now connects to a Node.js/Express/MongoDB backend for verified owner accounts, cookie sessions, password recovery and persistent business/branch onboarding. Product routes require authentication and display saved workspace data with empty/unavailable analytics states. Sample Overview/Feedback/assistant content lives under `/preview/`. Feedback collection, trained models, AI, live analytics and team access are not implemented.

The source proposal is `AI_Powered_Customer_Feedback_Analytics_&_Business_Intelligence_Platform.pdf`, supplied in the original workspace. The initial public repository contains the documentation derived from it; the PDF remains local. Technical choices and numerical targets introduced in these documents are **proposed baselines** for team review.

## Documentation

| Document                               | Purpose                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------ |
| [Requirements](docs/requirements.md)   | Product scope, priorities, acceptance criteria, and open decisions             |
| [Architecture](docs/architecture.md)   | Components, boundaries, data flow, deployment, and failure handling            |
| [API contracts](docs/api-contracts.md) | Proposed HTTP interface, payloads, errors, access rules, and asynchronous jobs |
| [Database](docs/database.md)           | Tenant model, entities, integrity rules, storage, and migration strategy       |
| [AI pipeline](docs/ai-pipeline.md)     | Processing, scoring, evaluation, provenance, and safeguards                    |
| [Team workflow](docs/team-workflow.md) | Responsibilities, delivery sequence, reviews, and definition of done           |
| [Repository guidelines](AGENTS.md)     | Existing contributor instructions, preserved unchanged                         |

## Planned capabilities

- Sentiment and aspect-based sentiment analysis for English, Arabic, and Arabic-English code switching.
- Complaint clustering, aspect scores out of 10, trend analysis, and segment comparison.
- Structured AI reports with traceable evidence and prioritized actions.
- Multi-tenant questionnaire collection and analytics.
- Later delivery stages: grounded conversational analytics, AI survey suggestions, and predictive indicators.

See the requirements document for the delivery order. Later stages remain part of the proposal but are not prerequisites for the first end-to-end slice.

## Proposed implementation baseline

The project owner selected Node.js for the application API, MongoDB for storage and Python/FastAPI for the future AI service. The frontend retains React/JavaScript/JSX and Vite. These choices supersede the earlier PostgreSQL/application-FastAPI proposals. See [the backend decision](docs/decisions/0002-node-mongodb-foundation.md) and [implemented setup/contracts](docs/backend.md).

## Repository layout

```text
NUVIA/
  AGENTS.md
  README.md
  package.json
  package-lock.json
  src/frontend/       # React app, configuration, and public assets
  src/backend/        # Express API, MongoDB, auth, mail and workspaces
  tests/frontend/     # Critical-flow UI tests
  tests/backend/      # Isolated MongoDB behavior tests
  tests/e2e/          # Real browser account/onboarding lifecycle
  .github/workflows/  # Frontend checks
  docs/
    architecture.md
    api-contracts.md
    database.md
    ai-pipeline.md
    requirements.md
    team-workflow.md
```

Application code lives in `src/frontend/` and automated tests in `tests/frontend/`. Frontend static resources use Vite's `src/frontend/public/assets/` directory, as documented in the integration decision. Future backend/AI modules belong under `src/`; model evaluation material belongs under `tests/ai/`.

## Development setup

Use Node.js 22.12 or later and npm 10 or later. Run these commands from the repository root:

```sh
npm ci
npm run setup:local
npm run dev
```

Open the Local URL printed in the terminal. For a phone on the same Wi-Fi, run `npm run dev:network` and use its Network URL. `npm run build` creates the production bundle; `npm run preview` serves it locally.

Checks: `npm run format:check`, `npm run lint`, `npm test`, and `npm run build`. Use `npm run format` to apply formatting and `npm run test:watch` for iterative tests.

For double-clickable HTML review files, run `npm run build` followed by `npm run previews`; open `previews/landing.html` or `previews/business.html`. Generated previews and bundles are not committed.

For the connected application, configure MongoDB then run `npm run dev:backend` and `npm run mail:work` in two additional terminals. See [backend setup and commands](docs/backend.md). Development verification/reset messages use a private local mailbox unless SMTP is configured; real email delivery is not established by local tests. Open `/preview/#/landing` for a design-only review without backend access.

Backend checks: `npm run test:backend:unit`, `npm run test:backend`, and `npm run test:e2e:accounts`. Integration tests use an isolated local MongoDB replica set and synthetic identities. See [validation evidence](docs/backend-validation.md).

Never commit credentials, customer responses, private datasets, or local environment files. Commit placeholder configuration examples when actual configuration is introduced.

## Contribution and licensing

Use focused issues and pull requests following [the team workflow](docs/team-workflow.md). Public visibility does not establish an open-source license; no license has been selected. The project owner must choose a license before external reuse is encouraged.

## Review the current screens

Browse the [ordered screen galleries](docs/ui/frontend/README.md): mobile English, mobile Arabic, desktop English, then desktop Arabic. Each gallery follows the same screen order.

The current Overview places AI Daily Insight on the left and Aspect Scores on the right, followed by recommendations and Quick Actions. The sidebar uses **Business & Teams**. The first-time empty Overview is available at `#/dashboard-empty`, with a survey illustration, creation action and getting-started steps.
