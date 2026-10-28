# Local AI APIs and replaceable model providers

Date: 2026-10-28
Status: revised against main `fdff2ab3d90f85b77309af10ac4dbee6c83ded52`;
approved by the user on 2026-10-28; implementation on `feat/local-ai-apis`.

## Intent and agreed scope

Provide integration-ready APIs for the existing local Qwen2.5-1.5B model and the
two supplied DeBERTa models. Keep capability contracts independent of model names
so a compatible stronger model can replace Qwen without changing API consumers.
The user chose APIs rather than UI integration and chose to derive `mixed` from
opposing aspect sentiments rather than retrain a four-class classifier.

Node remains the public authorization boundary. Python owns inference only and
does not read or write MongoDB. Existing screens, survey collection, analytics
persistence, vector retrieval, training, billing and deployment are outside this
change. Answers from supplied evidence are not a claim of implemented RAG.

## Current evidence and constraints

- The active checkout is `main` at `fdff2ab`, matching `origin/main` after the
  requested pull. `backend/` is the sole public backend; the removed `apps/api`
  must not be recreated. Sources are CommonJS `.js`, not the former ESM `.mjs`.
  Preserve the pre-existing `.gitignore` edit and local Qwen weights. Implement
  later on a descriptive task branch based on this updated main, checking for
  newer remote changes before starting.
- Python currently exposes liveness only. Node has no AI transport or routes.
- Node now has business/branch/survey/template/settings APIs, publishing state,
  device sessions and second-factor sign-in. Registration signs in directly;
  email verification is unavailable. Public survey reads exist, but public
  response submission and live analytics remain unfinished. AI APIs must not
  require the removed verification flow or bypass device-session revocation.
- Qwen weights and tokenizer exist under
  `apps/ai-service/app/models/qwen2.5-1.5b` (approximately 3.1 GB of weights).
- `D:/bert models/drive-download-20261027T231609Z-1-001.zip` contains
  `aspect_extractor_mdeberta_v2` (BIO token classification) and
  `deberta_absa_finetuned_v2` (Negative, Neutral, Positive sequence
  classification). Configurations alone do not establish the ABSA input pairing
  or supported language quality.
- Existing cookie-session, exact Origin/CSRF and owner isolation must apply.
  Do not change configured databases or publish weights in Git/images.

## Approaches

1. Independent copies of Qwen for each capability: simple isolation but duplicates
   model memory and complicates replacement. Rejected in favor of the user's
   request for one model with multiple interfaces.
2. One shared generation runtime, capability-specific contracts, prompts and
   validators, plus dedicated aspect/sentiment adapters: selected direction.
   Model replacement is configuration-only for already-supported runtime families;
   another model format or architecture may require a new adapter and validation.
3. Native four-class sentiment training versus derived mixed: the user selected
   derived mixed. No new classifier head or fabricated fourth probability.

## Proposed external contract

All public routes live under `/api/ai`. Reuse
`backend/src/middlewares/auth.middleware.js` and `authorize('owner')`; support
the existing cookie and explicit Bearer session mechanisms. `authenticate`
resolves the owner's current business from MongoDB and validates the persisted
device session and token version. Require a current business using the existing
`requireBusinessId` behavior (409 when there is none). Do not accept owner or
business IDs from request bodies, URL parameters or stale JWT business claims.
These routes process explicitly supplied transient inputs and do not imply saved
customer responses exist. Evidence IDs are opaque identifiers local to a request,
not proof that a record exists in the database. Server-generated request IDs
identify transport calls and are separate from evidence IDs.

Cookie-authenticated POSTs pass through `requireBrowserCsrf`, already mounted on
`/api` in `backend/app.js`. Preserve its existing explicit Bearer behavior; a
Bearer credential still needs to pass `authenticate`, including session
revocation checks. Do not introduce verification gating, a separate JWT verifier,
another session store, a workspace-ID route or `/api/v1` compatibility aliases.

| Method | Suffix                | Input                                              | Result                                                                |
| ------ | --------------------- | -------------------------------------------------- | --------------------------------------------------------------------- |
| GET    | `/capabilities`       | none                                               | configured provider identities, capability readiness and safe reasons |
| POST   | `/analyze`            | bounded list of `{id,text}`                        | aspect spans, aspect polarity, derived overall sentiment and coverage |
| POST   | `/summaries`          | bounded list of `{id,text}`, locale                | structured summary with exact cited excerpts                          |
| POST   | `/reports`            | bounded evidence texts, locale, optional objective | qualitative strengths, problems and suggested actions with citations  |
| POST   | `/survey-suggestions` | industry, objective, locale, requested count       | validated editable questions; no survey is created or published       |
| POST   | `/answers`            | question, locale, bounded evidence list            | cited answer or explicit insufficient-evidence response               |

Do not accept arbitrary model paths, URLs, provider choices or generation options
from callers. Reject duplicate IDs, blank texts, unknown fields and oversized
inputs. Proposed initial bounds: 10 evidence texts per request, 2,000 characters
per text, 20,000 total text characters, 1,000 characters per question/objective,
and 5-10 survey questions. Node currently uses `express.json()` with its default
100 KiB limit, not the removed API's 32 KB limit. For AI operations enforce a
64 KiB UTF-8 serialized JSON body limit on Node and Python, including metadata
and escaping, without changing other routes. Because the global JSON parser runs
first, a later `express.json({limit: ...})` alone cannot enforce a stricter AI
limit: use bounded raw-body length capture in the existing parser or an
AI-specific parser mounted before it. Keep global CSRF/auth ordering intact and
do not store/log raw request bodies beyond request processing. Document that byte
limits can reject a character-valid request. Reject excess token context before
inference instead of silently truncating it. The builder
may tighten bounds based on measured model memory and latency and must document
the final values in OpenAPI and Node validation.

Use versioned response schemas with `schema_version`, `request_id`, provider/model
provenance and method/prompt versions. Wrap Node success results as `{data: ...}`
like the current business/settings controllers; preserve existing session DTOs.
Classification responses include model
probabilities as uncalibrated scores, not guaranteed accuracy. Public responses
omit local paths and authentication secrets. Shared public DTOs belong in
`packages/shared-types`; no Python model or persistence schema is exported there.

Reports in this scope are evidence-based qualitative drafts, not persisted
analytics reports. Do not accept caller-supplied analytics as verified database
facts or generate percentages, trends, forecasts or causal claims from them.
When a count is useful, calculate it deterministically over the supplied evidence
and explicitly identify its scope. Future stored analytics require a separate
Node-authorized immutable snapshot contract.

## Internal service contract and security

Expose the same capability operations under Python's `/api/v1` to the Node
transport with a private service credential from environment configuration.
Capabilities and inference require that credential. Liveness remains public and
never claims all capabilities are ready. Readiness is capability-specific.
Bind local development to loopback; do not enable browser CORS. Production
transport must use a trusted private channel or HTTPS; never disable TLS checks.

Node resolves the current owner's business before contacting Python. Transport uses a fixed configured
base URL, authenticated requests, bounded response sizes, request IDs, strict
response validation and cancellation. It never follows redirects with service
credentials or performs automatic expensive inference retries. Return the normal
Node error envelope, including validation, busy, unavailable, timeout and invalid
provider-output cases, without internal exception details. Existing backend
errors do not have a universal `request_id` envelope: AI failures should return
`{message, error:{code,message}, request_id}` while preserving the optional fields
in `ApiErrorBody`. Add `request_id?: string` to that public DTO during
implementation; it does not currently declare request IDs. Do not rewrite
unrelated route errors. Validation returns
400 and existing `{message,errors:[{field,message}]}`; add a safe AI error code
and request ID where applicable. Preserve global CSRF/auth error behavior (403,
401/503 respectively). Specify 429 for owner rate limits or worker busy, 503 for
missing/unaccepted capabilities, 504 for bounded inference timeout, and 502 for
invalid upstream schemas/output. No-business errors remain 409. Missing AI configuration
leaves the existing web/API operational and capabilities unavailable.

Add a route-specific authenticated-owner rate limiter using the existing
`express-rate-limit` dependency, applied before inference (initially 30 generation
or analysis requests per 15 minutes per owner; capability reads separately at
120 per 15 minutes). Worker concurrency limits remain necessary across owners.
Limit retries with `Retry-After` where meaningful; do not change existing auth or
settings limiters. Match the worker deadline to Node transport and documented
Vite/nginx proxy deadlines, so timeout behavior does not depend on defaults.

Requests contain only their authorized current input/evidence. No previous
request or other owner's text enters prompts or responses. Do not log raw inputs,
model generations, service credentials or mailbox/config contents.

## Placement and configuration on the current backend

- Mount `backend/src/routes/ai.routes.js` in `backend/app.js` at `/api/ai`.
  Reuse CommonJS controllers/services/`express-validator` validations and the
  existing validation middleware; explicitly reject unknown fields in new AI
  contracts. Do not add Zod, an ESM product backend or a parallel app factory.
- Place Node-to-Python transport in `backend/src/integrations/ai-service/` and
  public orchestration in the existing `backend/src/controllers` and `services`
  layers. Keep database models untouched: inference is transient in this scope.
- Backend startup already loads root `.env` using `dotenv` outside production.
  Read AI settings through a focused CommonJS configuration module using that
  established environment; do not restore removed private Atlas credential-file
  loading. Missing AI settings disable AI only. A configured malformed service
  URL/credential must fail closed for AI rather than alter product/database setup.
- Proposed private settings: `AI_SERVICE_URL`, `AI_SERVICE_TOKEN`,
  `AI_REQUEST_TIMEOUT_MS`, plus Python model alias/path/device/worker limits.
  Document exact names in root `.env.example` and AI README during implementation.
  Python does not currently load root `.env`: define its root-relative development
  loader explicitly for AI-only keys, with process environment overriding it and
  production reading process environment only. Never pass MongoDB/JWT secrets to
  the inference worker or expose private AI settings as `VITE_*` values.
- Keep `pnpm dev` as the web/backend group; `pnpm dev:ai` starts Python separately.
  No mail worker exists. Ordinary product development must work without Python.
- Keep Docker inference optional. The current AI image copies the whole `app/`
  directory and `.dockerignore` does not exclude the local Qwen directory.
  During implementation exclude that path and model artifact extensions from
  build context, use explicit read-only model mounts for inference, and allow
  missing mounts to produce capability-unavailable status. Root resolution must
  support both checkout and `/service/app` image layout. Wire private service
  settings explicitly if updating the optional compose AI profile; `.env` is not
  automatically injected into container environments. Do not change MongoDB
  volumes or claim container/GPU acceptance without actual testing.

## Runtime and replacement boundary

Separate generation, aspect extraction and aspect-polarity adapter interfaces.
A registry resolves server-side aliases to configured adapters and versioned
artifact manifests. A generation adapter owns tokenizer/chat-template behavior;
capability interfaces own prompts, parsers and validators. The public API never
depends on Qwen-specific tags or output tokens.

Load Qwen once in a supervised serial worker, reused by all generative
capabilities. Use inference mode, bounded context/output tokens, deterministic
defaults, one active inference and explicit busy rejection rather than an
unbounded queue. Bound model loading and inference time. On timeout/cancellation
terminate and reap the worker before a subsequent request can reuse capacity.
Crashes reset readiness and allow a bounded fresh initialization. Shut down owned
processes cleanly. A disconnected caller must not leave orphaned GPU work.

The aspect pipeline likewise needs bounded execution and safe worker recovery.
Choose model residency/device allocation from measured available memory: do not
assume Qwen plus both DeBERTa models fit on the GPU. CPU execution or explicit
serialized model residency is acceptable when documented. Missing resources
produce a safe unavailable response, never unrelated process termination.

Extract the supplied archive into ignored local artifact storage using safe
relative-path checks. Load only local safetensors/tokenizers with
`trust_remote_code=False` and offline loading. Do not load `training_args.bin`.
Record artifact hashes, architecture, label mapping and preprocessing/input
conventions in manifests. Python dependencies and lockfile belong to the AI app;
heavy inference dependencies may be optional so ordinary account development
continues without model installation. Document the selected install command.

Switching an alias/path for a supported adapter preserves consumers but resets
capability acceptance until compatibility and quality checks pass. No automatic
provider fallback or model downloads. Preserve old model versions in provenance.

## Aspect sentiment and derived mixed

Use BIO token classification with tokenizer offset mapping to return exact
original-text aspect spans. Preserve Arabic, negation, punctuation and emoji;
normalization may not invalidate offsets. Deduplicate overlapping duplicate spans
without merging distinct positive and negative mentions of the same aspect.
If inputs exceed supported tokens, reject explicitly in this first version.

Determine the sentiment model's training input format from available training or
evaluation code/artifacts before enabling it. An aspect-conditioned classifier
must receive the review/context and aspect in the trained ordering/template.
Verify this with Arabic and English fixtures and actual inference. If that
convention cannot be established, expose a specific unvalidated capability
reason rather than assume a sequence classifier accepts arbitrary paired text.

Each accepted aspect mention has its exact span, positive/negative/neutral label,
uncalibrated score, model version and evidence reference. A versioned acceptance
threshold controls which predictions contribute to overall sentiment. Choose and
document a conservative operational default during implementation; it is not
calibration evidence and changing it changes the derivation version.

Derive overall sentiment deterministically from accepted mentions:

- At least one positive and one negative mention: `mixed`.
- Positive mentions with optional neutral mentions, no negative: `positive`.
- Negative mentions with optional neutral mentions, no positive: `negative`.
- All accepted mentions neutral: `neutral`.
- No accepted mentions, missing model, or unknown input convention: null overall
  label and a structured insufficient/unavailable reason, never `neutral`.

Return `method: aspect_derived`, `coverage: partial_aspects` and contributing
mention IDs. This labels the aspects the extractor found; it does not assert
exhaustive full-text understanding. Include excluded mention counts/reasons.
Do not invent a fourth-class softmax probability or combine mention scores as a
calibrated overall confidence. Opposite polarities in separate requests/reviews
must not cause either review to become mixed. The same aspect mentioned twice
with distinct evidence and opposing sentiments can produce mixed.

## Capability acceptance and honest failures

Runtime loading, output validity and semantic quality are separate checks.
Every generation capability has its own output schema, language checks and
bounded validation. Evidence references must resolve to the exact current
request's IDs and quoted substrings; reject unsupported references and exact
quotation failures. Treat evidence as untrusted data, never executable prompt
instructions. Reject unsupported factual/numeric assertions; schema-valid output
alone does not establish grounded quality. Failed validation never becomes a
successful canned response.

Implement and document all contracts, but enable only capabilities that pass a
frozen synthetic Arabic/English smoke assessment for relevant correctness,
language, grounding and abstention. Unassessed/failing capabilities remain
unavailable with a specific reason, even if Qwen loads successfully. Report smoke
assessment limitations; no general accuracy or benchmark claims without suitable
held-out annotated evidence. The builder defines the compact fixtures and
acceptance criteria before observing outputs, then records actual results.

## Verification and delivery

Meaningful Python tests cover BIO offsets (including Arabic), polarity mappings,
all mixed aggregation branches, low-confidence/no-aspect cases, supported input
conventions, strict schemas, citation isolation, prompt injection/abstention,
unavailable providers, timeout/crash/cancellation recovery and single-load reuse.
Tests use fake adapters where weights are unnecessary and a separate opt-in
actual-model smoke command. Node tests in `backend/tests` cover browser CSRF and
Bearer authorization, revoked devices/token versions, owner-derived business
scope, no-business 409, foreign evidence isolation, unknown-field rejection,
UTF-8 byte limits, rate limits, safe transport failures, capability status and
cancellation. Use the current isolated replica-set fixtures; no old UUID
workspace models, connection-scoped `deps.models` or removed API test harness.

For implementation run `pnpm test:ai`, uv Ruff check/format, the relevant
`backend/tests` suites (`pnpm test:backend:unit`), format/lint and shared-contract
checks. Run `pnpm test:proxy` and `pnpm build` for changed composition/contracts;
run affected account/security browser regressions if shared middleware changes.
Test dependency installation against
updated locks. No UI changes or reference screenshot regeneration is needed.
Do not use shared/customer MongoDB in tests. Real inference evidence must record
model hashes, exact configuration, hardware, durations and failed capabilities in
ignored local outputs, with a sanitized tracked summary.

Update root/AI/API setup and architecture docs, implemented API contracts,
environment placeholders and readiness descriptions. Include example requests and
responses plus an OpenAPI contract suitable for future consumers. Keep model
artifacts and private output outside Git. Use a descriptive task branch without
`codex/`, inspect/stage only task changes, and check staged whitespace before
committing. Push/create a PR against main per repository delivery guidance after
verification; do not merge or push directly to main.

## Decisions left to the builder

Select compatible pinned inference dependencies, process implementation, exact
safe operational deadlines, device allocation, adapter code organization and the
compact predeclared smoke fixtures based on the supplied artifacts and machine.
Reconfirm updated-main ancestry before product edits. Document these
implementation choices and any unsupported capability; do not expand into UI,
data collection, training or database-backed analytics.

## Revision review against updated main

Reviewed source: `backend/app.js`, auth middleware, browserSession helpers,
business routes/controllers/services, `surveyAccess`, error/validation helpers,
backend server/package/tests, shared DTOs, web proxy, nginx, compose, AI Dockerfile,
AI scaffold and current root/API/architecture/module-boundary documentation.

Corrections from the original proposal: sole CommonJS backend ownership;
`/api/ai` and owner-derived business context; current cookie/Bearer/device-session
authentication without email-verification gating; present survey/settings scope;
actual request-parser behavior and explicit new AI byte bounds; existing response
and validation shapes; current config/test paths; optional Docker model exclusion
and root-relative AI configuration. The aspect-derived mixed rule and API-only
scope are unchanged. This is a design review, not evidence of working inference.

An independent builder check found no material remaining integration ambiguity;
its minor shared-error DTO request-ID omission is included above. Document-only
validation: targeted Prettier check and Git whitespace check. No runtime code or
model artifacts were modified, and no inference acceptance claim is made.

Follow-up owner clarification on 2026-10-28: the supplied polarity model takes
the aspect first, then review text. Support and configure `aspect_review_pair_v1`
without changing public APIs, while retaining the prior explicit review-first
format for other packages. This resolves the input-order question; the separate
quality gate still applies. A frozen eight-case assessment passed 6/8, so analysis
remains unaccepted at the unchanged threshold.
