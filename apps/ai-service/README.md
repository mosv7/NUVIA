# Local AI service

Authenticated FastAPI operations provide model-independent contracts for aspect/sentiment analysis, extractive summaries/reports, survey suggestions and evidence-only answers. Node in `backend/` is the public authorization boundary. Python never accesses MongoDB. See [API integration](../../docs/api/ai.md).

**Explicit baseline mode now enables all five configured APIs.** The owner requested `AI_BASELINE_MODE=true` for analysis, summaries, reports, survey suggestions and evidence answers. This is configured locally; results/capabilities expose `quality_status:"baseline"`, `quality_accepted:false` and warnings. The mode changes eligibility, not assessed model quality. With the flag absent/false, unassessed capabilities still remain unavailable. See [measured validation](../../docs/development/local-ai-validation.md).

## Setup

From repository root (Python >=3.11, uv 0.12.15):

```sh
uv sync --project apps/ai-service --locked --extra inference
uv run --directory apps/ai-service python scripts/prepare_models.py --qwen-source app/models/qwen2.5-1.5b --bert-zip "D:/bert models/drive-download-20261027T231609Z-1-001.zip" --destination ../../.local/models --polarity-input-format aspect_review_pair_v1
pnpm dev:ai
```

Preparation refuses existing destinations; skip it in this already-prepared checkout. Other machines need their own authorized artifacts; no download occurs. Packages are hash-checked safetensors/tokenizer/config files; `training_args.bin` is never loaded. Qwen files use hard links when possible: do not edit either copy in place; prepare replacements into a new root.

Add private `AI_SERVICE_TOKEN` (random hex, >=32 characters), `AI_SERVICE_URL` and model settings from `.env.example` to the existing root `.env`, preserving all other secrets/database settings. Python development reads AI keys only; process environment wins. Production uses environment only. `pnpm dev` remains web/backend; run Python separately. Ordinary product development does not need Python or inference dependencies.

Set `AI_BASELINE_MODE=true` to opt in for all configured operations. The flag is
server-side only; callers cannot change it. Hash/dependency/input-format checks,
authentication, body/token/resource limits, exact evidence validation and Node
output validation remain mandatory. Invalid output returns 502 rather than a
successful fabricated response. The 0.7 mention threshold is unchanged.

CPU is the portable default. `AI_DEVICE=cuda` moves generation only to CUDA; both DeBERTa models remain on CPU to avoid competing for a 4 GB GPU. CUDA needs a compatible PyTorch build/driver; installing the platform's default locked wheel does not establish GPU support. The pre-existing CUDA evaluation environment was used for diagnostics, not made a portable dependency.

`pnpm dev:ai` now honors optional private `AI_PYTHON_EXECUTABLE` so an existing
compatible CUDA environment can run the same service; empty uses `uv`. This
checkout selects its existing CUDA interpreter and device in private `.env`.
Auto-reload is opt-in with `pnpm dev:ai -- --reload`; ordinary startup runs one
server/worker owner. No path to a private environment is committed.

## Replacement and acceptance

`AI_MODEL_ROOT` contains `generation/`, `aspect/`, `polarity/`, each with `manifest.json`, local safetensors and tokenizer/config files. Acceptance lives separately in root `acceptance.json`. Transformers loads offline with `trust_remote_code=False`. The v5 exported DeBERTa special-token list is adapted to the pinned v4 interface, with a vocabulary-ID equality check.

For supported architectures, prepare a new root/alias, restart Python, then assess it. New formats such as GGUF need a new adapter; API consumers stay unchanged. Acceptance is bound to artifact hashes, schemas, prompts, device, thresholds and runtime library versions. Replacements do not inherit acceptance. There is no automatic download or provider fallback.

The owner confirmed **aspect first, review second** for these supplied polarity weights. Their local manifest now uses `aspect_review_pair_v1`; preparation can record this with `--polarity-input-format aspect_review_pair_v1`. The legacy `review_aspect_pair_v1` order is still supported for models explicitly configured that way. Unspecified orders stay unavailable; changing order changes the fingerprint and invalidates prior acceptance. This records owner-provided metadata, not recovered training source or a quality guarantee. A few correct diagnostic predictions cannot establish training input order independently.

```sh
uv run --directory apps/ai-service python -m scripts.smoke_models --model-root ../../.local/models --device cpu --output ../../.local/ai-assessment/smoke.json
uv run --directory apps/ai-service python -m scripts.inspect_aspects --model-root ../../.local/models --output ../../.local/ai-assessment/deberta.json
```

For analysis only, add `--operations analyze` to the smoke command. Analysis now
uses the separately frozen eight-case `analysis-aspect-first-v1.json` fixture,
covering positive, negative, neutral and mixed in both languages. Every required
aspect must have the expected accepted polarity as well as the expected overall
sentiment; valid JSON alone does not pass this assessment.

Committed synthetic Arabic/English smoke fixtures declare checks before inference. Scripts record outputs/timings; they never auto-enable a capability. All fixtures for an operation must pass structural, semantic, language, injection and abstention review. Then, and only then, record that operation in private `acceptance.json` as `{"profile":"<exact current profile>","passed":true,"reviewed":true}`, retaining the assessment evidence. Copying flags without assessment is unsupported. Smoke examples are not a broad benchmark or calibrated accuracy result.

Baseline operation does **not** write passing acceptance records. It uses compact
capability-specific prompts (`baseline-extractive-v1`) and allows a single whole
JSON Markdown fence to be unwrapped before the same schema/source validators.
Surrounding prose is rejected. `smoke_models --baseline` reproduces this mode;
without it, the original assessment prompts remain selected.

## Checks and operation

```sh
pnpm test:ai
uv run --directory apps/ai-service ruff check .
uv run --directory apps/ai-service ruff format --check .
uv run --directory apps/ai-service python -m scripts.export_contracts
```

Tests need no weights. Export regenerates Node JSON schemas and internal OpenAPI; format generated JSON with Prettier. One supervised serial child reuses loaded models across interfaces and is retired on timeout/cancellation; no queue is retained. Restart after model/config changes. Liveness is not model readiness; use authenticated `/api/v1/capabilities`. `/docs` describes internal transport, not browser endpoints.

Optional Docker: the base `docker compose --profile ai up --build -d` starts without model files or a private host mount. For inference, prepare the model root, set a private token and `AI_INFERENCE=true`, then run `docker compose -f compose.yaml -f compose.ai-models.yaml --profile ai up --build -d`. Only this explicit override mounts weights read-only at `/models`; missing paths are refused, and weights are never copied into images. Missing dependencies/models/assessments do not make strict-mode inference ready. See [infrastructure](../../infra/README.md) for configuration checks and current CI evidence.
