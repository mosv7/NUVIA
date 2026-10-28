# Local AI API validation — 2026-10-28

Baseline: main `fdff2ab`; implementation branch `feat/local-ai-apis`.
This delivery adds callable contracts/adapters, not accepted model quality or an
AI product UI. No customer database, data migration or production deployment was
used for validation.

## Actual supplied models

Prepared ignored local packages under `.local/models` using the supplied Qwen
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
therefore reports `unverified_input_format`, not accepted analysis. Private
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

Establish DeBERTa training input format from its training/evaluation source, then
run the declared assessment. For Qwen use an improved compatible model or improve
interfaces with a separate frozen evaluation set; do not weaken source/tenant
validators to make smoke results appear successful. Keep failed and unassessed
capabilities unavailable. See [setup/replacement](../../apps/ai-service/README.md)
and [public API](../api/ai.md). Existing analytics/response collection/RAG work is
outside this API-only delivery.
