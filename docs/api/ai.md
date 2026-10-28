# AI integration API

Public prefix **`/api/ai`** belongs only to `backend/`. Python's `/api/v1/*` is private service transport. All five configured operations can now run in explicit baseline mode; supplied models remain quality-unaccepted. UI integration, saved analytics, training, public response collection and RAG are outside this delivery.

## Authentication and inputs

Reuse owner cookies or explicit Bearer sessions, including persisted-device/token-version checks. Cookie POSTs require exact `Origin` and `X-CSRF-Token` from `/api/auth/session`. Require owner role and the current owned business (409 if absent). No email-verification gate or caller-selected business/owner/model path is introduced. Evidence IDs are local to the supplied request, not permissions to stored records. Results are transient.

| Method | Suffix                | Body                                           |
| ------ | --------------------- | ---------------------------------------------- |
| GET    | `/capabilities`       | none                                           |
| POST   | `/analyze`            | `{texts:[{id,text}]}`                          |
| POST   | `/summaries`          | `{texts:[{id,text}],locale}`                   |
| POST   | `/reports`            | `{texts:[{id,text}],locale,objective?:string}` |
| POST   | `/survey-suggestions` | `{industry,objective,locale,count?:5}`         |
| POST   | `/answers`            | `{texts:[{id,text}],locale,question}`          |

Locale: `ar` or `en`. Count: integer 5-10, defaults to 5. Lists: 1-10 texts. Text: 1-2,000 Unicode code points. Industry/objective/question: 1-1,000 characters. IDs: unique `[A-Za-z0-9_-]`, 1-64 characters. Unknown fields, duplicate IDs and blank strings are rejected. JSON limit: **64 KiB of UTF-8 including metadata/escaping**. Character-valid inputs can still exceed the byte limit. Excess model tokens are rejected without truncating evidence.

Limits: 30 POSTs per 15 minutes per authenticated owner across operations; 120 capability reads per owner. Python runs one model operation at a time, with busy rejection rather than a queue. Default deadlines: Python 180s, Node 190s, Vite/nginx 200s; adjust together.

## Results

Node wraps success in `{data: ...}`. Capabilities contain `schema_version:"1"` and an exact operation map. Entries contain `ready`, `reason`, safe model aliases and an acceptance `profile` (SHA-256). Reasons: `service_not_configured`, `package_unavailable`, `inference_dependencies_missing`, `unverified_input_format`, `unassessed`. Accepted entries have null reason. Unconfigured Node transport returns empty aliases and zero profiles. Process liveness is not acceptance.

Entries also contain `quality_status:"accepted"|"baseline"|"unavailable"`,
`quality_accepted` and `warnings`. `AI_BASELINE_MODE=true` enables model- and
dependency-valid operations without assessment acceptance: ready=true, reason=null,
quality_status=baseline, quality_accepted=false, with `experimental_baseline` and
`quality_not_accepted` warnings. Missing/unverified/tampered packages stay blocked.
Baseline is server configuration for all five operations, never a request field.

Inference data contains `schema_version`, `operation`, `request_id`, `provenance`, `result`. Provenance includes aliases, acceptance profile, prompt/method versions and `scores:"uncalibrated"`, never local paths/secrets.

Provenance repeats the quality status/acceptance/warnings on every successful
result. Node rejects contradictory flags. Baseline compact prompts are versioned
as `baseline-extractive-v1`; strict-mode assessment keeps `extractive-v1`.
Liveness returns analysis_available=null, baseline_enabled and capabilities_url;
it does not hash/load models or compute readiness.

- Analysis: `{items:[{id,sentiment,reason,method:"aspect_derived",coverage:"partial_aspects",mentions,contributing_ids,excluded_count}]}`. Mentions contain `{id,text,start,end,sentiment,score,extraction_score,accepted}`. Mention sentiment is positive/negative/neutral. Overall sentiment adds mixed or null.
- Summaries: `{items:[{text,citations:[{id,quote}]}]}`.
- Reports: `{strengths:[claim],problems:[claim],suggested_actions:[{suggestion,citations}]}`.
- Answers: `{status:"answered"|"insufficient_evidence",items:[claim]}`; abstention has no items.
- Survey suggestions: `{questions:[{text,type:"text"|"rating"}]}`; normalized labels must be distinct. Nothing is published/imported automatically.

Offsets are end-exclusive Unicode code-point positions in the original text. JavaScript consumers use `[...text].slice(start,end).join('')` for emoji safety. Mixed requires accepted positive and negative mentions within the **same review**. Neutral is not uncertainty: no accepted mentions yields null and `insufficient_evidence`. The default 0.7 extraction/polarity threshold is operational, not calibration. Coverage includes only found aspects; no fourth-class softmax or calibrated overall confidence is returned.

Claims are extractive: factual `text` must be part of its cited verbatim quote, which must occur in this request's evidence. Quotes preserve source language; locale governs generated questions/recommendation prose. Quotes are not translated in this version. Recommendations are labelled qualitative suggestions, not numerical forecasts/established causes. Reports are drafts over supplied text, not stored business analytics. Answers do not perform vector retrieval.

## Errors and contracts

AI transport errors: `{message,error:{code,message},request_id}` plus `X-Request-ID`. Input validation preserves `{message,errors:[{field,message}]}` (400). Existing auth/CSRF/body-parser errors retain their shapes. Node validates upstream schemas, source spans, mixed derivation, evidence membership and exact quotations before returning success. Upstream bodies and model exceptions are never relayed.

| Status    | Meaning                                                                               |
| --------- | ------------------------------------------------------------------------------------- |
| 400       | Invalid request fields                                                                |
| 401 / 403 | Invalid/revoked session / role or CSRF                                                |
| 409       | No current owned business                                                             |
| 413       | Byte or token bound exceeded                                                          |
| 429       | Owner rate limit or model busy                                                        |
| 502       | Invalid/redirected upstream or rejected model output                                  |
| 503       | Missing configuration, dependency/model, unaccepted capability or storage unavailable |
| 504       | Deadline exceeded                                                                     |

Cancellation aborts transport and retires the owned inference worker. No automatic costly retry or canned successful fallback exists. Internal service calls require private `X-AI-Service-Token`; browsers use Node, not that token.

The [internal OpenAPI](ai-openapi.json) defines exact request/result schemas. Node uses generated `backend/src/integrations/ai-service/contracts.json`; export with `uv run --directory apps/ai-service python -m scripts.export_contracts` and format JSON with Prettier. Public DTOs live in `packages/shared-types`.

See [setup/replacement](../../apps/ai-service/README.md) and [actual validation](../development/local-ai-validation.md).
