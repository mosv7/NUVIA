# Summary Providers Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement inline.

**Goal:** Prepare three summary adapters, config routing and a reviewable Qwen comparison.
**Architecture:** Internal Python adapters share the current validated wire contract.
**Tech Stack:** FastAPI, httpx, pytest; existing protected Express transport.
**Spec:** ../specs/2026-10-28-summary-providers.md

## Global constraints

Keep ABSA local, Node public, .env private, and Qwen summaries comparison-only.
No real remote calls before credentials are supplied and execution requested.

## Review focus

- Missing credentials, model changes and failed assessment must block production.
- Hostile quotations, foreign citations, truncation and redirects must fail safely.
- API secrets must never reach local model workers or artifacts.
- Cancellation and slow response streams must release the summary busy guard.
- Incomplete or altered comparison results must not permit promotion.

## Tasks

1. Add failing settings/adapter tests; implement runtime httpx dependency,
   explicit settings and bounded provider adapters. Verify mocked request shapes,
   status/body/citation limits, cancellation and safe errors.
2. Add failing routing tests; implement summary readiness/profile selection and
   reviewed acceptance, leaving local analysis routing unchanged. Verify no
   weight dependency for remote summaries and no Qwen fallback/secrets in worker.
3. Add failing comparison/promotion tests; implement dry-run CLI, synthetic
   fixtures, blinded ratings and strict promotion. Verify failures and ties
   cannot win, and profile/result tampering invalidates promotion.
4. Align .env.example, Compose and developer/API docs; run Python/Ruff, generated
   contract compatibility, backend tests, infra config and formatting checks.
   Review final branch; report unavailable live-provider acceptance explicitly.

## Ledger

- Ruling: work on a separate task branch in the current checkout, preserving
  existing private runtime/artifacts; no new worktree or secret copying needed.
- Ruling: no model defaults are guessed; each model is selected in .env.
- Completed tasks 1-4. Python64 and Ruff passed; generated wire schemas are
  unchanged. Backend20, web185, proxy, Compose config3, formatting, lint and
  build passed. Independent review found no blocker; its config-switching
  suggestion is covered by retained accepted profiles and a regression test.
- Dry run performed with no provider requests/inference. No live comparison,
  winner, production acceptance or deployment is claimed. Existing private
  environment values were preserved; missing summary placeholders were added.
