# Local AI API validation — 2026-10-28

Baseline: main `fdff2ab`; implementation branch `feat/local-ai-apis`.

The later [summary-provider routing](summary-providers.md) supersedes this
report's local-summary production eligibility: Qwen summaries are now comparison
only, with Gemini/Groq/Ollama awaiting actual comparison and reviewed acceptance.
The historical measurements below are preserved; none measure the new adapters.
This delivery adds callable contracts/adapters, not accepted model quality or an
AI product UI. No customer database, data migration or production deployment was
used for validation.

## Actual supplied models

Initial delivery prepared ignored local packages under `.local/models` using the supplied Qwen
directory and `D:/bert models/drive-download-20261027T231609Z-1-001.zip`.
No new weights were downloaded; `training_args.bin` was not loaded.

| Package                      | Artifact fingerprint                                               |
| ---------------------------- | ------------------------------------------------------------------ |
| Qwen2.5-1.5B                 | `ed5d3a229a34423b3034c026c1af7c4da0006f548aa52c37e51f940260bbe7fd` |
| aspect_extractor_mdeberta_v2 | `9cad4b4f9e7fa7500db00051b006d48abbbda99a54c60f89f9416c8aa328f9b4` |
| deberta_absa_finetuned_v2    | `67d913fe2a02ab0dc6b52840463c11802b033a175eb70b7411b5cfb6e9e26185` |

Fingerprints cover alias, adapter, input convention and declared file hashes;
individual file SHA-256 values remain in local manifests. Runtime acceptance
profiles additionally cover device, dependencies, prompts, schemas and thresholds.

Qwen actual smoke: RTX 3050 Laptop GPU (4 GB), PyTorch `2.11.0+cu128`,
Transformers `4.57.1`, float16 generation, 4 CPU threads, input bound 4,096 tokens,
output bound 768, deterministic decoding. This used an existing private CUDA
evaluation environment, not the project's default CPU wheel. The application
does not depend on that private environment. Portable optional dependency install
was also exercised independently.

Frozen synthetic fixture SHA-256:
`d9667bdee50d6accec616f5213f3c00a29b8f0201d0c822bee4d0e29670f7e94`.

| Capability         | Passing outputs / attempted                    | Decision                                        |
| ------------------ | ---------------------------------------------- | ----------------------------------------------- |
| Summaries          | 0 / 3 (EN, AR, injection case)                 | Unaccepted                                      |
| Reports            | 0 / 2 (EN, AR)                                 | Unaccepted                                      |
| Survey suggestions | 0 / 2 (EN, AR)                                 | Unaccepted                                      |
| Evidence answers   | 3 / 4 (EN, AR, unsupported-revenue abstention) | Unaccepted: English supported-answer case fails |

Total wall time for those 11 serial cases: 60.117 seconds including first load.
The eight rejected outputs fail strict JSON/schema/source-quotation validation;
they are not successful inference responses. The three valid answer cases also
match the declared answered/abstention status. A capability must pass its whole
assessment, not a selected successful example. No generative capability was
enabled. Private report: `.local/ai-assessment/final-smoke.json`.

Both DeBERTa models load locally on CPU after adapting v5-exported special-token
list metadata to the pinned tokenizer loader, while verifying vocabulary IDs are
unchanged. Diagnostics extracted food/service spans in one English and one
Arabic example. Both hypothetical pair orders predicted positive food/negative
service; **this cannot establish which order was used in training**. The API
at that point reported `unverified_input_format`, not accepted analysis. Private
diagnostics: `.local/ai-assessment/deberta-diagnostics.json`. This is not a
sentiment/ABSA benchmark or calibrated accuracy claim.

## Automated checks

- Python suite (23 tests) and Ruff check/format: passed. Coverage includes mixed derivation,
  original Unicode offsets, unknown/blank/duplicate fields, artifact hashes/path
  traversal/shard indexes, citations/language, auth/body limits, shared worker
  reuse, cancellation, busy rejection, timeout and crash recovery.
- Backend suites: passed, using isolated MongoDB replica sets and synthetic
  identities. AI tests use a real local HTTP upstream fixture, not customer data;
  cover browser/Bearer/session revocation, owner business context, byte limits,
  rate limits, safe invalid/upstream errors, timeout and redirect refusal.
- Full web suites (185 Vitest cases plus dev-server test), lint, Vite build and
  proxy lifecycle test: passed.
- Account/browser suite: passed for persistence, failed-save rollback, password
  reset, EN/AR/mobile/preview, real TOTP/recovery and email confirmation/replay.
  No product UI or tracked reference screenshots were changed.
- Frozen pnpm install and uv lock/sync are checked as part of final delivery.
  Core Python tests also run without heavy optional inference dependencies.

`docker compose --profile ai config --quiet` can validate configuration using a
synthetic JWT key without printing secrets. Actual image/runtime validation is
limited: Docker Desktop's Linux-engine named pipe is unavailable on this machine.
No container/GPU success or real Atlas/SMTP acceptance is claimed.

Independent code review identified Arabic IPC byte expansion and synchronous
first-load hashing. Both were reproduced with failing regressions, fixed and
rechecked: IPC preserves UTF-8 with separate bounded envelope headroom, and
readiness verification is serialized off the ASGI event loop. The generated
OpenAPI now declares the private header. Setup command paths were checked under
the actual `uv --directory` working directory. An authenticated probe against
the prepared packages returned capability status 200 and safe analysis 503
without starting an unaccepted worker.

## To activate later

The owner subsequently confirmed aspect-first input; see the follow-up below.
DeBERTa still needs a successful quality assessment before activation. For Qwen use an improved compatible model or improve
interfaces with a separate frozen evaluation set; do not weaken source/tenant
validators to make smoke results appear successful. Keep failed and unassessed
capabilities unavailable. See [setup/replacement](../../apps/ai-service/README.md)
and [public API](../api/ai.md). Existing analytics/response collection/RAG work is
outside this API-only delivery.

## Follow-up: owner-confirmed aspect-first order

On 2026-10-28 the owner specified the aspect comes first. The adapter now explicitly
supports `aspect_review_pair_v1` (aspect, review) alongside the prior
`review_aspect_pair_v1` (review, aspect). The local polarity manifest is configured
to aspect-first based on that confirmation; unspecified conventions still fail
closed. This is owner-provided metadata, not recovered training source.

Changing that metadata changes the polarity fingerprint to
`dde54adc4b72a4be6a353566d49a4ff43ea11529f12dcddc2df9a2309e9e2f12`.
No weight/tokenizer contents were modified. A separate eight-case assessment was
committed before inference, with SHA-256
`b17e2c4777a4da1d5152d88987df36b432ea2e63498a437afe8ba1bde5cccca7`.
It requires expected overall sentiment plus expected accepted aspect polarities,
with the original 0.7 threshold unchanged.

Actual run used the application's locked optional inference environment:
PyTorch `2.14.1+cpu`, Transformers `4.57.1`, 4 threads. All eight outputs passed
schema/source validation. **Six of eight passed the declared semantic checks**:
positive, negative and neutral passed in English and Arabic, while both mixed
cases failed. English `room` was correctly positive but its score 0.688 was below
threshold. Arabic `المكان` was misclassified negative at 0.633 and excluded.
Both reviews therefore retained only an accepted negative mention and returned
partial-aspect negative overall sentiment. No threshold was lowered to make the
cases pass, and no capability acceptance record was written.

Total runtime was 19.158 seconds including first load. This is eight synthetic
smoke cases, not a general accuracy estimate. Private evidence:
`.local/ai-assessment/aspect-first-assessment.json`. Current analysis reason is
`unassessed`, rather than `unverified_input_format`, when these packages and the
optional dependencies are configured. Generation remains unaccepted. Follow-up
Python suite: 27 tests passed; Ruff check/format passed.

## Owner-authorized baseline operation

The owner subsequently requested enabling the supplied models as baselines for
**all five existing operations**. This explicitly supersedes the earlier strict
eligibility decision; it does not turn failed assessments into passes.
`AI_BASELINE_MODE=true` is configured privately in this checkout. Default false
keeps the original quality gate for other installations.

Every capability/result now distinguishes ready-to-execute from quality acceptance:
`quality_status: baseline`, `quality_accepted: false`, with
`experimental_baseline` and `quality_not_accepted` warnings. Artifact hashes,
dependencies, known polarity order, authentication, request/output/evidence
validation, resource bounds and the 0.7 mention threshold remain enforced.

Baseline generation uses compact prompts (`baseline-extractive-v2`). One entire
Markdown JSON fence may be removed before normal parsing/validation; surrounding
prose remains rejected. The small model produced malformed nested report JSON,
so baseline reports use three strict internal strings (strength quote, problem
quote, suggestion). Code resolves quotes to exact current-request sources and
constructs the unchanged public report/citations before full validation. The
compact baseline can supply at most one strength and one problem per report;
unsupported sections stay empty, and invented quotations remain rejected.

An owned loopback service was started using this machine's existing CUDA Python
interpreter: Qwen on GPU, DeBERTa on CPU, with no unrelated process terminated.
`pnpm dev:ai` honors optional private `AI_PYTHON_EXECUTABLE`; empty uses uv.
Private AI URL/token/device/baseline settings were configured while preserving
unrelated environment/database/JWT values. No private paths/tokens are committed.

Actual authenticated HTTP smoke on synthetic inputs:

| Operation          | HTTP status | Seconds |
| ------------------ | ----------- | ------- |
| Analyze (Arabic)   | 200         | 12.902  |
| Summary            | 200         | 6.973   |
| Report             | 200         | 1.490   |
| Survey suggestions | 200         | 5.769   |
| Evidence answer    | 200         | 3.350   |

All capabilities reported ready in baseline mode and none reported quality
acceptance. Private evidence: `.local/ai-assessment/baseline-http.json`.
This is one structural/runtime smoke input per operation, not a claim that the
models now pass the earlier semantic assessments or work for every input.
Liveness exposes analysis_available=null and points to authenticated capabilities
instead of incorrectly claiming analysis is always unavailable.

Baseline verification: Python32, backend20, web185 plus dev-server test, lint,
format, build, frozen pnpm install and proxy lifecycle passed. Independent review
confirmed that baseline does not bypass validation and found no material issue.
Public settings/body/token contracts retain their existing protection. No UI,
collection, persistence, clustering or RAG feature was added by this opt-in.
