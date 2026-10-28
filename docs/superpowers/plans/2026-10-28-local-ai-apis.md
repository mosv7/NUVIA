# Local AI APIs Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement task by task.

**Goal:** Deliver protected integration-ready AI endpoints with replaceable local adapters.

**Architecture:** CommonJS Node routes authorize the current owner/business and call
an authenticated FastAPI service. A supervised serial worker owns inference;
capability contracts and validators stay independent of model architectures.

**Tech Stack:** Express 5, express-validator, Python/FastAPI/Pydantic, optional
PyTorch/Transformers, safetensors, pytest and Node test runner.

**Spec:** ../specs/2026-10-28-local-ai-apis-design.md (approved 2026-10-28).

## Global constraints

- Base: main fdff2ab; work on feat/local-ai-apis. Preserve local weights/ignore edits.
- /api/ai public; /api/v1 internal; no UI, training, MongoDB inference writes or RAG.
- 64 KiB body, 10 texts, 2,000 characters/text, 20,000 total; no silent truncation.
- Mixed derives only from accepted opposing aspect mentions within one review.
- No automatic downloads/fallback; unassessed capabilities stay unavailable.

## Review focus

- Unicode offsets and byte limits must survive Arabic/emoji (tasks 1/3).
- Old/revoked sessions cannot call inference (task 3).
- Failed/cancelled model work must not occupy GPU capacity indefinitely (task 2).
- A replacement model cannot inherit another model's acceptance (tasks 1/2).
- Citations from a previous request and injected instructions are rejected (task 2).

## Task 1: Contracts, manifests and aspect pipeline

Files: app/schemas/ai.py, core/settings.py, models/artifacts.py,
models/transformers_adapter.py, pipelines/aspects.py, scripts/prepare_models.py,
tests/test_analysis.py, tests/test_artifacts.py.

Interfaces: strict operation requests/results; load_manifest(path) validates local
hashes; extract_spans(text, labels, offsets, scores); derive_sentiment(mentions).

- [ ] Write tests for mixed/neutral/unknown, Arabic offsets and unsafe artifacts.
- [ ] Run pytest; observe missing behavior fail.
- [ ] Implement contracts, preparation and model adapter with verified input format gate.
- [ ] Run focused tests and frozen Python baseline suite; commit task.

## Task 2: Shared worker, generation interfaces and internal API

Files: services/worker.py, services/ai.py, services/interfaces.py,
api/v1/ai.py, core/http.py, main.py, tests/test_ai_api.py, tests/test_worker.py.

Interfaces: Supervisor.execute(operation, payload), close(); AiService.capabilities()
and execute(operation,payload); versioned validated results with provenance.

- [ ] Write tests for auth, limits, evidence validation, busy/reuse/cancel/crash.
- [ ] Observe RED; implement supervised execution and capability-specific schemas.
- [ ] Run full Python suite/Ruff; commit task.

## Task 3: Protected public Node integration

Files: backend/src/{routes,controllers,services,validations}/ai.*.js,
backend/src/integrations/ai-service/{client,contracts}.js, backend/tests/ai.test.js,
backend/app.js, packages/shared-types/src/index.d.ts.

Interfaces: client.request(operation,payload,{signal,requestId}); strict input/output
validators; owner-scoped routes returning {data} and safe coded errors.

- [ ] Write integration tests using isolated replica sets and a real local fake HTTP upstream.
- [ ] Observe RED; implement auth reuse, limits, response validation and cancellation.
- [ ] Test browser/Bearer/revocation, foreign scope, bad upstream/body and unavailable.
- [ ] Run relevant backend suite, proxy, lint/build; commit task.

## Task 4: Actual artifacts, smoke assessment and integration documentation

Files: scripts/smoke_models.py, synthetic smoke fixtures, docs/api/ai.md,
AI/root READMEs/architecture, .env.example, .dockerignore, compose/nginx as affected.

- [ ] Freeze smoke fixtures/criteria before inference; prepare supplied local artifacts.
- [ ] Run actual models; record hashes, hardware, timing and failures without claiming broad quality.
- [ ] Bind per-capability acceptance to artifact hashes; leave failing capabilities unavailable.
- [ ] Document requests, setup, replacement, all errors and actual limitations; export OpenAPI.
- [ ] Run frozen installs, Python/backend suites, format/lint/build/proxy and focused browser checks.
- [ ] Independent whole-branch review, fix material regressions, commit/push task branch and PR.

## Execution ledger

- Setup: approved design, main remote confirmed at fdff2ab, task branch created.
- Execution: inline within the current checkout; explicit implementation authorization
  covers continuing the approved design without another plan approval round.
