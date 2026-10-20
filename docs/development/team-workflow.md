# Team workflow

Status: proposed collaboration baseline for the 10-person team in the source proposal. Actual assignees, sprint dates, and repository protections are not configured by this documentation setup.

## Responsibilities

| Role | Members | Primary ownership |
| --- | --- | --- |
| AI engineers | 3 | Annotation/model evaluation; ABSA/sentiment; clustering/trends/report grounding |
| Backend developers | 2 | Identity/tenancy/collection; jobs/analytics/report and export APIs |
| UI designer | 1 | Bilingual flows, RTL, charts, accessibility, and design handoff |
| Frontend developers | 2 | Collection/survey UI; analytics/reports and integration |
| Business analysts | 2 | Requirements, taxonomy/annotation guidance, business-owner evaluation and acceptance |

Choose one accountable owner for each issue. Responsibilities may overlap, but acceptance authority must be explicit. A designated project owner resolves scope, licensing, spending, and provider/data-policy decisions.

## Source of truth

Keep requirements and technical contracts in `docs/`. Use GitHub issues for actionable work, pull requests for implementation review, and `docs/decisions/` for accepted architectural decisions. Chat discussions become durable only when their outcomes are recorded.

The existing `AGENTS.md` is preserved as requested. Its references to an empty workspace describe the initial state; current setup/status is documented in README and these files.

Proposed code organization follows AGENTS: `src/frontend/`, `src/backend/`, `src/ai/`, `tests/`, and `assets/`. Document framework-driven deviations before introducing them.

## Delivery order

1. Confirm baseline decisions, aspect taxonomy, data permissions, and acceptance targets.
2. Configure formatter, linter, tests, dependency locking, environment examples, and verified clean-checkout commands.
3. Deliver a synthetic-data vertical slice: publish form, submit feedback, run one model, view score, generate a validated report.
4. Add measured clustering, trends, segment comparisons, exports, and bilingual polish.
5. Evaluate with a frozen dataset and consenting business owners.
6. Deliver conversational analytics, survey suggestions, and forecasting through separate reviewed contracts and evaluations.

Each stage ends with a reproducible demonstration and documented limitations. Avoid building all subsystems in isolation before integration.

## Issue readiness

An issue is ready when it has a concrete user outcome, scope, dependencies, accountable owner, acceptance criteria, affected API/schema versions, and validation approach. Split work that cannot produce a reviewable result in a few days.

Business analysts own acceptance wording. Engineers identify technical dependencies. Designer handoffs include Arabic/English variants, loading, empty, error, and insufficient-data states.

## Branches and commits

Use `main` as the integration branch. After the initial documentation bootstrap, use short-lived branches such as `feat/questionnaire-publication`, `fix/tenant-export-filter`, or `docs/annotation-guide`.

Use concise imperative commit subjects, such as `Add questionnaire publication contract`. Keep commits focused. Never commit secrets, real customer feedback, private evaluation datasets, generated exports, or local model caches.

## Pull requests and review

PR descriptions state the problem, resulting behavior, linked issue, validation performed, and material limitations. Include screenshots for visible UI changes in English and Arabic where relevant.

At least one teammate reviews each PR. API/schema changes need a backend reviewer and the affected consumer. AI changes need evaluation evidence and an AI reviewer. Tenant/privacy changes need explicit isolation and deletion evidence. Contract-breaking changes require coordinated consumer updates.

Proposed main-branch protections: require review, passing configured checks, and resolved conversations; block force pushes. Configure these after real CI checks exist and confirm plan availability. This setup does not enable branch protection.

## Testing and integration

Configure testing with the first executable code:

- Backend: behavior tests for validation, roles, cross-tenant access, idempotency, and job recovery.
- AI: reproducible evaluation plus fixtures for mixed sentiment, dialectal text, empty input, and unsupported language.
- Frontend: critical flow integration tests and Arabic RTL/keyboard checks.
- System: end-to-end synthetic-data submission-to-report test, contract checks, and representative load measurements.

Use synthetic shared fixtures and versioned example payloads. Test migrations on an empty database and an upgraded prior schema. Verify model and prompt changes against baseline results rather than relying on a successful API response.

## Definition of done

Work is complete when acceptance criteria pass, relevant tests/checks run successfully, reviewers approve, docs/contracts match behavior, and limitations are recorded. Production changes also require verified configuration, migration/rollback plans, and monitoring for the changed path.

AI delivery additionally requires dataset provenance, versioned artifacts, evaluation results by language/dialect, traceable evidence, and review of failure examples.

Do not describe functionality as shipped merely because its documentation or UI mockup exists.

## Cadence and handoffs

Use a weekly planning/review meeting, a short integration checkpoint twice per week, and written async updates on blockers and completed evidence. Rotate demonstration ownership across roles.

Frontend/backend handoffs agree on payloads before implementation. AI/backend handoffs specify model inputs, outputs, versions, latency assumptions, and failure states. Business analysts review score interpretation and recommendations with owners; the designer checks whether uncertainty and sample counts are understandable.

## Release and incident practice

Tag releases after staging acceptance, archive evaluation manifests, and record deployment/model versions. Keep a rollback path to the previous application and approved model.

For an incident, assign an incident owner, contain the failing path, preserve redacted evidence, and record impact and recovery. Never post credentials or raw customer responses in public issues. Report suspected vulnerabilities privately to the project owner until a dedicated reporting channel is established.
