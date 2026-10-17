# NUVIA

AI-powered customer feedback analytics and business intelligence for Arabic and English.

NUVIA helps businesses turn free-text customer feedback into aspect scores, recurring complaint topics, trends, and prioritized recommendations. Customers submit feedback through published questionnaires shared by link or QR code. Business teams explore the results through a bilingual dashboard with Arabic RTL support.

## Project status

This repository now includes the supplied bilingual React frontend prototype, its build/lint/format tooling, critical-flow tests, and frontend CI configuration. Backend services, database migrations, trained models, and real authentication are not implemented. The system documents describe the intended platform, not deployed functionality.

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

A React/TypeScript dashboard, Python FastAPI backend, Python AI workers, PostgreSQL with pgvector, Redis-backed asynchronous jobs, and object storage are proposed. The proposal specifies Python NLP tooling but leaves concrete backend and frontend frameworks open. The imported frontend uses React with JavaScript/JSX and Vite; the TypeScript baseline and backend/AI choices remain proposals. See [the frontend integration decision](docs/decisions/0001-frontend-prototype.md).

## Repository layout

```text
NUVIA/
  AGENTS.md
  README.md
  package.json
  package-lock.json
  src/frontend/       # React app, configuration, and public assets
  tests/frontend/     # Critical-flow UI tests
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
npm run dev
```

Open the Local URL printed in the terminal. For a phone on the same Wi-Fi, run `npm run dev:network` and use its Network URL. `npm run build` creates the production bundle; `npm run preview` serves it locally.

Checks: `npm run format:check`, `npm run lint`, `npm test`, and `npm run build`. Use `npm run format` to apply formatting and `npm run test:watch` for iterative tests.

For double-clickable HTML review files, run `npm run build` followed by `npm run previews`; open `previews/landing.html` or `previews/business.html`. Generated previews and bundles are not committed.

See [Frontend development and review](docs/frontend.md) for routes, source locations, demo limitations, and mobile review. The current UI validates inputs locally; it does not create accounts, send email, save business data, or run analytics/AI.

Never commit credentials, customer responses, private datasets, or local environment files. Commit placeholder configuration examples when actual configuration is introduced.

## Contribution and licensing

Use focused issues and pull requests following [the team workflow](docs/team-workflow.md). Public visibility does not establish an open-source license; no license has been selected. The project owner must choose a license before external reuse is encouraged.
