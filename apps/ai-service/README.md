# Local AI service

Authenticated FastAPI operations provide model-independent contracts for aspect/sentiment analysis, extractive summaries/reports, survey suggestions and evidence-only answers. Node in `backend/` is the public authorization boundary. Python never accesses MongoDB. See [API integration](../../docs/api/ai.md).

**Supplied capabilities remain unavailable pending acceptance.** Qwen loads on CUDA but failed complete capability checks. The owner confirmed aspect-first sentiment inputs; that order is configured locally. The follow-up DeBERTa assessment passed 6/8 cases but failed both mixed cases at the unchanged threshold, so analysis remains unaccepted for quality reasons. A working API contract does not mean accepted model quality. See [measured validation](../../docs/development/local-ai-validation.md).

## Setup

From repository root (Python >=3.11, uv 0.12.15):

```sh
uv sync --project apps/ai-service --locked --extra inference
uv run --directory apps/ai-service python scripts/prepare_models.py --qwen-source app/models/qwen2.5-1.5b --bert-zip "D:/bert models/drive-download-20261027T231609Z-1-001.zip" --destination ../../.local/models --polarity-input-format aspect_review_pair_v1
pnpm dev:ai
```

Preparation refuses existing destinations; skip it in this already-prepared checkout. Other machines need their own authorized artifacts; no download occurs. Packages are hash-checked safetensors/tokenizer/config files; `training_args.bin` is never loaded. Qwen files use hard links when possible: do not edit either copy in place; prepare replacements into a new root.

Add private `AI_SERVICE_TOKEN` (random hex, >=32 characters), `AI_SERVICE_URL` and model settings from `.env.example` to the existing root `.env`, preserving all other secrets/database settings. Python development reads AI keys only; process environment wins. Production uses environment only. `pnpm dev` remains web/backend; run Python separately. Ordinary product development does not need Python or inference dependencies.

CPU is the portable default. `AI_DEVICE=cuda` moves generation only to CUDA; both DeBERTa models remain on CPU to avoid competing for a 4 GB GPU. CUDA needs a compatible PyTorch build/driver; installing the platform's default locked wheel does not establish GPU support. The pre-existing CUDA evaluation environment was used for diagnostics, not made a portable dependency.

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

## Checks and operation

```sh
pnpm test:ai
uv run --directory apps/ai-service ruff check .
uv run --directory apps/ai-service ruff format --check .
uv run --directory apps/ai-service python -m scripts.export_contracts
```

Tests need no weights. Export regenerates Node JSON schemas and internal OpenAPI; format generated JSON with Prettier. One supervised serial child reuses loaded models across interfaces and is retired on timeout/cancellation; no queue is retained. Restart after model/config changes. Liveness is not model readiness; use authenticated `/api/v1/capabilities`. `/docs` describes internal transport, not browser endpoints.

Optional Docker: prepare the model root, set a private token and `AI_INFERENCE=true`, and run the explicit AI compose profile. Weights are mounted read-only at `/models`, never copied into images. Missing dependencies/mounts/assessments do not make inference ready. No container/GPU or production deployment acceptance is claimed.
