# NUVIA

AI-powered customer feedback analytics and business intelligence for Arabic and English.

NUVIA helps businesses turn free-text customer feedback into aspect scores, recurring complaint topics, trends, and prioritized recommendations. Customers submit feedback through published questionnaires shared by link or QR code. Business teams explore the results through a bilingual dashboard with Arabic RTL support.

## Project status

This repository is in the planning and documentation phase. It has no application code, dependency manifest, migrations, trained models, configured CI, or executable tests yet. The documents describe the intended system, not deployed functionality.

The source proposal is `AI_Powered_Customer_Feedback_Analytics_&_Business_Intelligence_Platform.pdf`, supplied in the original workspace. The initial public repository contains the documentation derived from it; the PDF remains local. Technical choices and numerical targets introduced in these documents are **proposed baselines** for team review.

## Documentation

| Document | Purpose |
| --- | --- |
| [Requirements](docs/requirements.md) | Product scope, priorities, acceptance criteria, and open decisions |
| [Architecture](docs/architecture.md) | Components, boundaries, data flow, deployment, and failure handling |
| [API contracts](docs/api-contracts.md) | Proposed HTTP interface, payloads, errors, access rules, and asynchronous jobs |
| [Database](docs/database.md) | Tenant model, entities, integrity rules, storage, and migration strategy |
| [AI pipeline](docs/ai-pipeline.md) | Processing, scoring, evaluation, provenance, and safeguards |
| [Team workflow](docs/team-workflow.md) | Responsibilities, delivery sequence, reviews, and definition of done |
| [Repository guidelines](AGENTS.md) | Existing contributor instructions, preserved unchanged |

## Planned capabilities

- Sentiment and aspect-based sentiment analysis for English, Arabic, and Arabic-English code switching.
- Complaint clustering, aspect scores out of 10, trend analysis, and segment comparison.
- Structured AI reports with traceable evidence and prioritized actions.
- Multi-tenant questionnaire collection and analytics.
- Later delivery stages: grounded conversational analytics, AI survey suggestions, and predictive indicators.

See the requirements document for the delivery order. Later stages remain part of the proposal but are not prerequisites for the first end-to-end slice.

## Proposed implementation baseline

A React/TypeScript dashboard, Python FastAPI backend, Python AI workers, PostgreSQL with pgvector, Redis-backed asynchronous jobs, and object storage are proposed. The proposal specifies Python NLP tooling but leaves concrete backend and frontend frameworks open. No framework is installed or committed by this setup.

## Repository layout

```text
NUVIA/
  AGENTS.md
  README.md
  docs/
    architecture.md
    api-contracts.md
    database.md
    ai-pipeline.md
    requirements.md
    team-workflow.md
```

When implementation starts, use `src/` for application code, `tests/` for automated tests, and `assets/` for static resources. Model evaluation material belongs under `tests/ai/`; supporting documentation belongs under `docs/`.

## Development setup

There are no working local development, build, formatting, or test commands yet. The first implementation change must configure a formatter, linter, and test framework, verify all commands from a clean checkout, and document prerequisites and exact commands here.

Never commit credentials, customer responses, private datasets, or local environment files. Commit placeholder configuration examples when actual configuration is introduced.

## Contribution and licensing

Use focused issues and pull requests following [the team workflow](docs/team-workflow.md). Public visibility does not establish an open-source license; no license has been selected. The project owner must choose a license before external reuse is encouraged.
