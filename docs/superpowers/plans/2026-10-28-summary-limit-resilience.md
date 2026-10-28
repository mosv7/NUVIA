# Summary Comparison Rate-Limit Resilience

**Goal:** Select account-visible summary models and finish/resume comparisons
within each provider's request/token quotas, without changing production retry
behavior, local ABSA or summary acceptance policy.

**Design:** Keep one HTTP attempt in the provider adapter. Attach only safe,
structured retry metadata to transient failures. The comparison CLI owns
bounded backoff, server-directed cooldowns, independent provider pacing, atomic
checkpoints and explicit resume. No fallback model, evidence truncation or
schema weakening. A daily quota pauses that provider, not the entire comparison.
Pending rows cannot be promoted; completed outputs are reused without requests.

**Selected candidates:** Account model-list requests returned 200 for Gemini,
Groq and Ollama. Use `gemini-3.5-flash-lite`, `openai/gpt-oss-120b` and
`gemma4:31b` at the official Ollama cloud origin. Respect cloud's lack of native
structured-output support by omitting `format`, retaining strict local parsing,
schema and evidence validation. Keep Qwen as comparison-only baseline.

**Steps (inline execution, TDD):**

1. Test and implement retry metadata: numeric/date Retry-After, Gemini RetryInfo,
   Groq reset durations, transient versus permanent errors, Ollama cloud request
   compatibility. Keep error bodies and keys out of logs/artifacts.
2. Test and implement comparison policy, pacing, bounded waits/retries,
   checkpoints, process locking and resume integrity. Persist every result and
   cooldown; do not repeat completed/terminal rows or silently change models.
3. Expose validated `.env`/CLI settings and `--resume`, document quotas and
   immutable output semantics. Configure selected models privately, preserving
   all credentials and database/security settings.
4. Run targeted/full Python/Ruff, Node/infra checks; use the six-case synthetic
   smoke to exercise all four candidates. Report actual quota/dependency/output
   limits without claiming a production winner. Independent final review, then
   update the existing PR15 and verify its current checks.

**Constraints:** Maximum four attempts per pending case per explicit invocation,
120 seconds maximum automatic wait, 900 seconds invocation budget by default.
Per-provider RPM/TPM pacing is configurable and approximate, never an assertion
of an account's actual tier. Long server delays are saved rather than shortened.
Cloud provider calls are authorized for this comparison by the owner's supplied
keys and instruction; use only bundled synthetic evidence in the smoke.

## Completion ledger

- Implemented tasks 1-4 with failing-first regression checks. Python93 and Ruff
  passed; backend20, Compose config3, lint and formatting passed. Public schemas
  and local ABSA settings/weights are unchanged.
- Independent review found a crash between two checkpoint replacements. Fixed
  results-authoritative recovery of missing/stale ungraded review sheets;
  protected human ratings, exact saved inputs/rows/profiles and cooldowns.
- Model list/auth probes returned 200. Final six-case synthetic run completed:
  Gemini6/6, Ollama6/6, Groq5/6, Qwen5/6 valid schema/source results. Invalid
  outputs were not retried. Completed resume preserved checkpoint hash and made
  no model/provider requests. No actual 429 occurred; retry behavior is covered
  by deterministic tests, not claimed as live quota exhaustion.
- No semantic production ranking/acceptance/deployment was performed. Keys,
  outputs and private state stay ignored. Only selected model IDs, summary
  output budget and missing comparison policy values were changed privately.
