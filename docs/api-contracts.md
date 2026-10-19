# API contracts

Status: historical platform-wide v1 proposal. The implemented owner account/business/branch endpoints use same-origin cookie sessions and CSRF, documented in [Backend development](backend.md). Its catalog supersedes this proposal for that slice. Collection, analytics, jobs/reports/exports and bearer-token contracts below are not delivered. Executable integration tests cover the delivered HTTP contract; a machine-readable platform-wide OpenAPI document remains future work.

## Conventions and authorization

Base path: `/api/v1`. Requests and JSON responses use UTF-8. IDs are UUID strings unless explicitly described as opaque tokens. Timestamps use ISO 8601 UTC. Supported UI/report locales are `ar` and `en`.

Authenticated endpoints require a verified bearer token. The API resolves active workspace membership from the authenticated identity. Workspace path parameters, response IDs, filters, and evidence IDs never grant access by themselves.

Roles: owner manages workspace membership and questionnaires; analyst reads data, requests analysis/reports, and exports; viewer reads analytics and reports. Owners inherit analyst capabilities. Public tokens only allow reading a published form and submitting answers.

Use `X-Request-ID` for correlation and return a server-generated ID if missing or invalid. Collection and asynchronous creation endpoints require `Idempotency-Key` (UUID). Retain request hashes/results for 24 hours, scoped to principal, workspace/public token, method, and path. Same key and payload returns the original result; changed payload returns 409.

List pagination uses an opaque `cursor` and `limit` (default 25, maximum 100). Response: `{"items":[],"next_cursor":null}`. Stable ordering uses creation time and ID. Unknown JSON fields and invalid enum values are rejected.

## Endpoint catalog

All private paths below are prefixed by `/api/v1/workspaces/{workspace_id}`.

| Method and path | Access | Success and purpose |
| --- | --- | --- |
| GET /api/v1/me | Authenticated | 200 identity and memberships |
| POST /api/v1/workspaces | Authenticated | 201 workspace with caller as owner |
| GET /questionnaires | Owner | 200 paginated drafts and published forms |
| POST /questionnaires | Owner | 201 questionnaire draft |
| PATCH /questionnaires/{id} | Owner | 200 updated draft, with If-Match |
| POST /questionnaires/{id}/publish | Owner | 201 immutable revision and public URL |
| POST /questionnaires/{id}/unpublish | Owner | 200 deactivated public collection |
| GET /responses | Owner/analyst | 200 paginated response summaries |
| GET /responses/{id} | Owner/analyst | 200 authorized raw answers and processing status |
| DELETE /responses/{id} | Owner | 202 purge job and dependent-artifact invalidation |
| POST /analysis-runs | Owner/analyst | 202 asynchronous run |
| GET /jobs/{id} | Owner/analyst | 200 durable job status |
| GET /analytics/overview | All members | 200 completed snapshot, counts, scores, and distributions |
| GET /analytics/trends | All members | 200 time buckets and anomaly annotations |
| GET /analytics/topics | All members | 200 scoped clusters and redacted representatives |
| POST /reports | Owner/analyst | 202 report generation job |
| GET /reports/{id} | All members | 200 validated report or pending metadata |
| GET /evidence/{id} | All members | 200 redacted excerpt from an authorized retained response |
| POST /exports | Owner/analyst | 202 export job |
| GET /exports/{id} | Owner/analyst | 200 status and short-lived URL when ready |

Public paths: `GET /api/v1/public/questionnaires/{token}` returns published question definitions; `POST /api/v1/public/questionnaires/{token}/responses` returns 201 only after durable persistence. Invalid, expired, or unpublished tokens return 404.

Membership administration, conversational Q&A, survey suggestions, and forecasts require separate contracts before their implementation.

## Questionnaire payload

Draft creation example:

```json
{
  "title": "Tell us about your visit",
  "locale": "en",
  "questions": [
    {"id": "q_service", "type": "text", "label": "How was the service?", "required": true},
    {"id": "q_rating", "type": "rating", "label": "Overall rating", "required": false, "min": 1, "max": 5}
  ]
}
```

Question IDs are stable strings within a revision. Types are `text`, `rating`, `single_select`, and `multi_select`. Select fields define unique option IDs. Limits: 50 questions, 20,000 characters per text answer, 256 KiB request body. Validate nonempty labels, unique IDs, rating ranges, and select options before publication.

Return an ETag on draft reads/writes. PATCH requires `If-Match`; missing preconditions return 428 and stale revisions return 412. Published revisions cannot be edited; subsequent draft edits produce a new revision on publication.

## Public submission

```json
{
  "questionnaire_revision_id": "b15ca5d4-c98e-4ae2-9b78-1f2de5b106ce",
  "answers": [
    {"question_id": "q_service", "value": "Great food, but the service was slow."},
    {"question_id": "q_rating", "value": 3}
  ]
}
```

The server resolves workspace, branch, and active revision from the token and rejects revision mismatch with 409. Reject duplicate, unknown, or missing required question IDs. Text values are strings, rating values are bounded integers, single-select values are option IDs, and multi-select values are unique arrays of option IDs.

The payload contains no trusted workspace ID or customer identity. Return:

```json
{
  "response_id": "3fb1ba7a-6f75-48bf-b31f-c960e75817bc",
  "processing_status": "queued",
  "received_at": "2026-10-03T09:00:00Z"
}
```

Public callers cannot poll private job or response endpoints. Apply rate limiting per token and client address, with a privacy-conscious retention policy.

## Analysis and job lifecycle

Analysis creation accepts `{"filters":{"from":"2026-09-01T00:00:00Z","to":"2026-10-01T00:00:00Z"},"pipeline_version":"approved-default"}`. Resolve the approved alias to immutable versions when creating the run. Filter semantics are start-inclusive and end-exclusive. Capture response membership at run creation; later arrivals do not silently change a run.

Return 202 with `{"job_id":"<uuid>","status":"queued"}` and a Location header for the private job endpoint. Job fields include `id`, `kind`, `status`, `progress`, `attempts`, `created_at`, `completed_at`, `result_id`, and safe `error`.

States: `queued -> running -> succeeded`; transient failure returns to `queued` up to three attempts; permanent or exhausted failure becomes `failed`. Progress is informational. Failed jobs never appear as completed analytics.

## Analytics semantics

Shared filters: `from`, `to`, `branch_id`, `questionnaire_id`, and documented segment question/option IDs. Reject filters that reference another workspace. Period boundaries are UTC instants; requested day/week/month buckets use the workspace reporting timezone. Responses include timezone and resolved bounds.

Overview fields: `snapshot_id`, `analysis_run_id`, `as_of`, `filters`, `response_count`, `analyzed_count`, `excluded_count`, `sentiment_counts`, and `aspects`.

Aspect objects contain `aspect_id`, `label`, `score` (0–10 or null), `response_count`, `mention_count`, and `scoring_version`. Mixed polarity remains an explicit label. Insufficient evidence yields null and a reason, never zero. Scores follow [AI pipeline](ai-pipeline.md).

If no completed snapshot exists, return 200 with `availability:"pending"`, null snapshot ID, and empty analytics. Otherwise identify `availability:"ready"` or `"stale"`. Do not mix results from different scoring versions in one snapshot.

## Reports and exports

Report creation: `{"snapshot_id":"<uuid>","locale":"ar"}`. Persist an immutable evidence snapshot. Ready report payloads include status, source snapshot, model/prompt versions, generation timestamp, overview, strengths, pain points, actions, and evidence references. Distinguish measured facts from model recommendations.

Export creation: `{"kind":"responses_csv","filters":{}}` or `{"kind":"report_pdf","report_id":"<uuid>"}`. Worker rechecks membership and deletion state. Download links expire after 15 minutes; files expire after 24 hours by proposed default. Private storage never exposes predictable public URLs.

## Error envelope

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more answers are invalid.",
    "details": [{"field": "answers[1].value", "reason": "outside_rating_range"}]
  },
  "request_id": "req_01"
}
```

| Status | Meaning |
| --- | --- |
| 400 | Malformed JSON or query syntax |
| 401 | Missing or invalid identity |
| 403 | Insufficient role for an otherwise accessible workspace |
| 404 | Missing resource, hidden foreign-tenant resource, or unavailable public token |
| 409 | Idempotency conflict, publication conflict, or revision mismatch |
| 412 / 428 | Stale / missing draft precondition |
| 413 | Payload too large |
| 422 | Schema or business validation failure |
| 429 | Rate limit exceeded; include Retry-After |
| 503 | Required infrastructure unavailable; include Retry-After when known |

Never expose stack traces, provider credentials, raw model prompts, or foreign-tenant resource details. Breaking changes require a new API version; additive changes require contract and consumer review.
