# Requirements

Status: draft planning baseline, derived from the graduation project proposal in the original workspace. Delivery stages, limits, and numerical targets below are proposed and must be confirmed before implementation.

## Purpose and users

NUVIA converts unstructured customer opinions into measurable, actionable business insight. The primary user is a business owner or analyst comparing service quality across branches and periods. Customers submit feedback without a platform account. Workspace owners manage membership and collection channels.

The scientific focus is bilingual NLP, especially dialectal Arabic and aspect-level polarity. Collection forms support that analysis; they should remain lightweight.

## Delivery stages

| Stage | Scope | Exit evidence |
| --- | --- | --- |
| Foundation | Tenant isolation, accounts, questionnaires, submissions, queued jobs | One tenant completes the collection flow; isolation and failure tests pass |
| First analytics slice | Sentiment, ABSA, scores, dashboard, grounded report | One questionnaire produces traceable analysis and a report |
| Expanded intelligence | Clusters, trends, anomalies, segment comparison, exports | Evaluated outputs and reproducible dashboards |
| Extended proposal | Conversational analytics, survey suggestions, forecasting, optional public link page | Separate evaluation and product acceptance for each feature |

## Functional requirements

| ID | Requirement | Acceptance criterion |
| --- | --- | --- |
| FR-01 | Isolate business workspaces | A user cannot read, change, export, or retrieve vectors from a workspace without active membership |
| FR-02 | Support owner, analyst, and viewer roles | Owner manages membership and surveys; analyst manages analysis and exports; viewer reads dashboards and reports |
| FR-03 | Create and publish questionnaires | Text, rating, single-select, and multi-select fields validate before publication; published revisions stay immutable |
| FR-04 | Share collection channels | A published questionnaire resolves through an opaque public token; a QR code encodes the same URL |
| FR-05 | Accept customer feedback | Valid submissions persist once under an idempotency key; invalid or unpublished forms reject submissions |
| FR-06 | Analyze bilingual feedback | Store response and sentence sentiment, aspect mentions, confidence, detected language, and model version |
| FR-07 | Score aspects | Display score out of 10 with sample size, period, and scoring version; missing evidence displays no score |
| FR-08 | Discover complaint topics | Each cluster shows frequency, a representative redacted example, run version, and unclustered coverage |
| FR-09 | Show trends and anomalies | Time series specify timezone, buckets, filters, and observation counts; insufficient samples suppress alerts |
| FR-10 | Compare segments | Branch, period, and form-answer comparisons use the same filters and disclose sample counts |
| FR-11 | Generate reports | Report includes overview, strengths, pain points, and actions; factual claims link to a fixed evidence snapshot |
| FR-12 | Export authorized data | CSV response export and report export respect tenant permissions, filters, redaction, and expiry |
| FR-13 | Support Arabic and English UI | Language switching covers navigation, forms, charts, dates, and RTL layouts |
| FR-14 | Provide grounded Q&A later | Answer only from authorized evidence and analytics, cite evidence, and abstain when unsupported |
| FR-15 | Suggest surveys later | Business type and goal produce editable suggestions; a human publishes the final form |
| FR-16 | Forecast later | Forecasts disclose horizon, uncertainty, data sufficiency, and performance against a naive baseline |
| FR-17 | Delete customer data | Deletion removes or invalidates raw text, embeddings, excerpts, exports, and affected derived artifacts |

## Proposed operating constraints

- Initial submission limits: 50 questions per questionnaire, 20,000 characters per text answer, and 256 KiB JSON request bodies.
- Arabic scope: Modern Standard Arabic, Egyptian, and Gulf dialects, plus English and mixed-language feedback. Other languages receive an explicit unsupported or uncertain status.
- UTC timestamps in storage; each workspace chooses a reporting timezone. Bucket boundaries follow that timezone.
- Customer contact fields are opt-in and unnecessary for analytics. Public forms explain purpose and retention.
- Role checks apply to every request and background task. Public tokens grant submission access only.

## Proposed quality targets

These are acceptance targets to validate on a documented reference environment, not measured performance claims.

| Area | Initial target and measurement |
| --- | --- |
| API | p95 under 500 ms for ordinary reads at 20 concurrent authenticated users, excluding AI and exports |
| Collection | p95 submission acknowledgement under 1 second at 10 submissions/second |
| Pipeline | Analyze 1,000 short feedback responses within 10 minutes on the selected reference hardware |
| Reliability | Retry transient jobs without duplicate outputs; persist failures with a visible retry action |
| Accessibility | Keyboard operation, visible focus, text alternatives, and review against WCAG 2.2 AA |
| Sentiment | Macro F1 at least 0.80 on a held-out set; publish results by language and dialect |
| ABSA | Aspect/polarity pair F1 at least 0.70; include error analysis and slice counts |
| Reports | Every published factual claim has valid evidence; human usefulness average at least 4/5 |
| Recovery | Proposed RPO 24 hours and RTO 4 hours, demonstrated with a restore exercise |

Do not hide weak dialect performance behind a global metric. Revisit targets after establishing dataset quality and baseline results.

## Evaluation and acceptance

Use public Arabic review datasets whose licenses permit the intended use, together with consented real feedback annotated by the team. Split by business/source and near-duplicate group to prevent leakage. Keep the final test set frozen. Business analysts and AI engineers agree on annotation guidance and adjudicate disagreements.

Business owners review reports for correctness, usefulness, and actionability. Load tests measure pipeline throughput at increasing input sizes. Each delivery stage records its test environment, dataset/model versions, known limitations, and acceptance results.

## Explicit exclusions from the first release

Payments, CRM automation, automatic execution of recommendations, arbitrary web scraping, native mobile apps, and custom model training for every tenant are outside the initial scope.

## Decisions to resolve

| Decision | Accountable role | Required before |
| --- | --- | --- |
| Framework/provider selection and hosting budget | Backend lead and project owner | Executable foundation |
| Dataset licenses, consent, and retention periods | Business analysts and project owner | Real data ingestion |
| LLM provider, data region, and permitted external text | AI lead and project owner | External inference |
| Final aspect taxonomy and dialect coverage | AI engineers and business analysts | Evaluation freeze |
| Thresholds, reference hardware, and supported capacity | Backend and AI leads | Performance acceptance |
| Project license and external contributor policy | Project owner | External distribution |
