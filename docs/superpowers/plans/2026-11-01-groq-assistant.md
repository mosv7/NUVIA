# Groq Assistant Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship an owner-scoped assistant on the approved UI, with Groq-selected exact feedback evidence and database-computed metrics.

**Architecture:** Node owns retrieval, privacy, authorization and metrics. Python adds independently configured Groq routing to the existing answers contract. Shared React conversation state connects the existing page and panel, with owned feedback evidence navigation.

**Tech Stack:** Existing CommonJS Express/Mongoose, Python/FastAPI/httpx, React/Vite JSX, pnpm 11.25.0, uv 0.12.15.

**Spec:** `docs/superpowers/specs/2026-11-01-groq-assistant-design.md`.

## Global constraints

- `backend/` is the only public API; Python never reads/writes MongoDB.
- Preserve EN/AR, RTL, mobile and approved design. No new dependencies unless needed.
- Keep summaries and DeBERTa independent; no acceptance bypass, automatic fallback or synthetic connected replies.
- Test with isolated replicas/synthetic data; never mutate configured customer data or expose secrets.
- No direct main push/merge for this feature.

## Review focus

- Foreign/stale source IDs never become evidence links.
- Arabic/emoji source offsets and privacy redaction preserve exact citations.
- Empty/pending/unaccepted analysis never becomes fabricated neutral/positive counts.
- Closing/changing scope while a request runs never restores stale private replies.
- Groq errors, output truncation and prompt injection preserve unavailable/insufficient states.

## Task 1: Independent Groq answers transport

Files: Python settings, new assistant provider, AiService routing, Python tests, compose/dev forwarding as required.

Interface: existing `/api/v1/answers`, unchanged AnswerRequest/AnswerResult; settings in spec; baseline provenance until independent reviewed assessment.

- [ ] Write/run failing tests for independent config, strict schema/citations, cancellation/HTTP limits and local-worker secret isolation.
- [ ] Implement provider and service routing without changing summaries/local operations.
- [ ] Run pytest and Ruff; report actual evidence.

## Task 2: Owned retrieval and assistant API

Files: new backend assistant route/controller/service/validation, app composition, backend tests, public shared DTO declarations.

Interfaces: endpoints and response shapes in spec; `callService('answers', {texts,locale,question}, {signal})`; source map enriches validated citations with responseId/number. Context metrics: `{totalResponses,writtenResponses,analysisStatuses,sentiments,negativeAspects}`; coverage: `{candidateLimit:500,candidatesScanned,evidenceCount,sampled:true}`.

- [ ] Write/run failing isolated tests for scope/metrics/privacy/citations/limits and auth/CSRF.
- [ ] Implement bounded relevance retrieval, privacy scrubbing, strict source mapping and context metrics.
- [ ] Run backend tests/lint and report contracts to UI implementer.

## Task 3: Connected existing UI and owned evidence detail

Files: shared assistant API/hook/result controls in `features/ai-analysis`, existing Assistant.jsx and AssistantScreen.jsx, route integration, feedback detail consumer and focused web tests.

- [ ] Write/run failing UI tests for real transport, scope reset/cancel, locale, source navigation and empty/error states.
- [ ] Connect both assistant surfaces preserving preview markup and existing controls; enable real assistant route.
- [ ] Add owned feedback detail read view for citation destinations.
- [ ] Verify browser interactions desktop/narrow EN/AR and record screenshots outside tracked references.

## Task 4: Integration, review and delivery

- [ ] Align README, API, architecture, module boundaries, DESIGN and `.env.example` with actual delivered behavior.
- [ ] Run format/lint/test/build, backend/proxy/accounts and Python/Ruff checks.
- [ ] Run synthetic-only real Groq smoke when configured; report quality limits.
- [ ] Independent whole-branch review, fix findings, rerun affected checks.
- [ ] Focused commits, guarded task-branch push and PR; report CI and remaining limits.
