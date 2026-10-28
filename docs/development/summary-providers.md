# Summary providers and comparison

Only summaries route to Gemini, Groq or Ollama. ABSA continues to use local
DeBERTa aspect extraction and polarity; no API is called for `/analyze`. The
historical 66.4 relaxed F1 was measured on frozen ABSA files, not summaries or
automatic acceptance of a changed runtime. Existing local baseline reports,
survey suggestions and evidence answers remain unchanged. Qwen summaries are
available to the comparison CLI only, never a production-provider choice.

## Configuration

Add these private values to the existing root `.env` (development). Production
reads process environment only. Process variables override the development file.

```dotenv
AI_SUMMARY_PROVIDER=disabled
AI_SUMMARY_OUTPUT_TOKENS=2048
AI_GEMINI_API_KEY=
AI_GEMINI_MODEL=
AI_GROQ_API_KEY=
AI_GROQ_MODEL=
AI_OLLAMA_URL=http://127.0.0.1:11434
AI_OLLAMA_MODEL=
AI_OLLAMA_API_KEY=
```

Supply exact model IDs enabled for your accounts; none are guessed or downloaded.
Native local Ollama needs a running server and an already-installed model;
normally it needs no API key. `AI_OLLAMA_API_KEY` optionally authenticates an
explicitly configured server. Inside a container, loopback means that container;
set the reachable Ollama URL explicitly. Compose forwards these settings without
mounting weights for remote-only summaries. Mount local weights explicitly only
for ABSA/Qwen/local generation as described in the AI README.

The owner supplied all three keys and authorized candidate selection. Account
model-list requests returned 200. The configured candidates are
`gemini-3.5-flash-lite`, `openai/gpt-oss-120b` and `gemma4:31b` on
`https://ollama.com`. Flash-Lite targets low-cost extraction; GPT-OSS 120B is a
larger Groq production candidate; Gemma 4 is a multilingual Ollama candidate.
These are candidates, not a measured quality ranking. See official
[Gemini model](https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite),
[Groq model](https://console.groq.com/docs/model/openai/gpt-oss-120b), and
[Ollama model](https://ollama.com/library/gemma4:31b).

Runtime dependency installation: `uv sync --project apps/ai-service --locked`.
If using `AI_PYTHON_EXECUTABLE`, install the declared `httpx` dependency in that
interpreter too. Keys stay in the Python service, never browser configuration or
local model subprocess settings. Use the existing private service token/Node
transport. Public inputs and outputs are unchanged: `/api/ai/summaries` receives
`{texts:[{id,text}],locale}` and returns validated extractive claims/citations.
Quotes preserve source language; this does not enable abstractive paraphrasing.

Gemini uses its native generateContent endpoint/JSON mode; Groq uses JSON object
chat completions (strict JSON Schema for GPT-OSS, low reasoning effort) plus
local schema validation; local Ollama uses `/api/chat`
with a JSON schema and streaming disabled. See official
[Gemini REST](https://ai.google.dev/api/generate-content),
[Groq JSON mode](https://console.groq.com/docs/structured-outputs), and
[Ollama structured outputs](https://docs.ollama.com/capabilities/structured-outputs).
Ollama Cloud currently lacks native structured outputs, so its request omits
`format` and explicitly asks for plain JSON; the same strict local schema/source
validators still apply. Gemma 4 thinking is disabled for this extraction task.
The summary-only prompt further requires verbatim, case/punctuation-preserving
quotes and no Markdown. Adapter profile `summary-http-v4` includes that prompt
and protocol choice, invalidating acceptance from earlier adapter profiles.

One HTTP attempt: no retry, redirect following or fallback to Qwen/another
provider. TLS verification remains enabled. A whole-operation deadline uses
`AI_TASK_TIMEOUT_SECONDS`; responses are capped at 256 KiB. JSON/schema, exact
citations and source membership are revalidated in Python and Node. Provider
truncation is an invalid result. Remote inputs use the existing 64 KiB / text
count / character bounds, not a claim of tokenizer-equivalent input counts.
`AI_SUMMARY_OUTPUT_TOKENS` bounds external summary generation independently of
local `AI_MAX_OUTPUT_TOKENS`; changing it does not change the ABSA fingerprint.
Busy/rate-limit returns 429,
invalid output 502, unavailable/credentials 503 and timeout 504 through existing
safe errors. Upstream bodies/exceptions are not returned.

## Compare first

Adding keys/models alone sends no data
and does not approve a production provider. Default is disabled; global
`AI_BASELINE_MODE=true` cannot bypass summary acceptance.

From repository root, inspect configuration without requests/inference:

```sh
pnpm ai:compare
```

Explicitly run all four candidates on the bundled synthetic six-case fixture:

```sh
pnpm ai:compare --run
```

Use `--providers qwen,gemini,groq,ollama` to select candidates; use `--dataset`
with an absolute path for your representative EN/AR/Egyptian dataset. Inputs
are sent to selected configured providers only with `--run`. Local Qwen requires
its prepared package and optional inference dependencies; use your compatible
inference Python interpreter via `AI_PYTHON_EXECUTABLE`; the launcher honors this
same setting as `dev:ai`. Empty uses uv. The existing baseline prompt is used for Qwen; API
candidates use the current strict extractive prompt. Both share the same input,
output schema and source validation. This compares the configured systems, not
a claim of identical model tokenization or prompts.

Each new run creates a private `.local/summary-comparison/<run>/` folder:

- `results.json`: original dataset, provider/model/profile mapping, success/error
  codes, validated outputs and provider-reported token counts. It also includes
  attempt counts, safe HTTP status/retry hints, active request latency and
  separate waiting time. Rate-limit failures are infrastructure
  events, never silent successful outputs or negative quality scores. Qwen
  usage is null when unavailable, never zero or an invented estimate. Monetary
  cost is not estimated; provider usage may exclude reasoning tokens.
- `blind-review.json`: same sources and randomized candidates, without provider
  identity or latency. Fill only `ratings` with integer 1-5 for faithfulness,
  coverage and conciseness. Keep identities hidden until scoring is complete.
  An invalid Qwen output has null ratings and counts as zero automatically;
  missing dependencies/configuration/network failures cannot establish a win.

The bundled fixture declares `production_candidate:false`: it is a plumbing
smoke, never production evidence. Prepare a representative dataset with this
shape for an actual release comparison:

```json
{
  "version": 1,
  "production_candidate": true,
  "cases": [
    {
      "id": "your-case-id",
      "request": {
        "locale": "en",
        "texts": [{ "id": "r1", "text": "Your authorized review text" }]
      }
    }
  ]
}
```

Use unique case IDs, 1-100 cases, the public request bounds per case, and include
both `en` and `ar` for production review. Choose representative positive,
negative, neutral/mixed, Egyptian, negation and hostile-text cases. Merely
changing the smoke flag is not a representative quality assessment.

## Limits, checkpoints and resume

The product endpoint still makes one HTTP attempt. Only the explicit comparison
CLI retries transient 408/429/500/502/503/504 or transport timeouts. It never
retries bad credentials, invalid requests, schema/quotation failures or changes
the chosen model. Every attempt is recorded. Exponential backoff with jitter
honors numeric/date `Retry-After`, Gemini `google.rpc.RetryInfo` and Groq
request/token reset headers; server delays are never shortened to fit a budget.
Known remaining-zero reset headers also delay the next request after success.
See [Gemini retries](https://ai.google.dev/gemini-api/docs/troubleshooting),
[Groq rate headers](https://console.groq.com/docs/rate-limits), and
[Ollama errors](https://docs.ollama.com/api/errors).

The existing root .env now contains comparison-only settings:

```dotenv
AI_COMPARE_MAX_ATTEMPTS=4
AI_COMPARE_MAX_WAIT_SECONDS=120
AI_COMPARE_RUN_BUDGET_SECONDS=900
AI_COMPARE_GEMINI_RPM=4
AI_COMPARE_GEMINI_TPM=6000
AI_COMPARE_GROQ_RPM=4
AI_COMPARE_GROQ_TPM=6000
AI_COMPARE_OLLAMA_RPM=4
AI_COMPARE_OLLAMA_TPM=6000
```

Pacing is independent per provider; TPM uses a conservative byte-based estimate,
not a model tokenizer or a promise about your account tier. Exact limits depend
on the account/model and are enforced by the provider. After four transient
failures for a case, the provider pauses for the remainder of that invocation.
A delay above 120 seconds is saved immediately while other providers continue.
A daily quota may therefore leave pending cases until a later explicit resume;
changing client code cannot increase the account quota.

Each row is checkpointed atomically, including successes, attempts and provider
cooldowns. Waits yield progress in chunks no longer than 30 seconds. The invocation
budget bounds in-flight evaluation too. Cancellation preserves completed rows;
an interrupted in-flight call is recorded as uncertain and may be attempted
again after cooldown on explicit resume.

```sh
pnpm ai:compare --run --resume ABSOLUTE_RUN_DIRECTORY
```

Resume uses the saved dataset/provider list unless explicitly supplied again.
It validates the exact dataset, models, prompts and profiles, reuses successful
or terminal rows, preserves cooldown deadlines and gives pending rows a new
bounded attempt budget. A second process cannot run the same output directory.
A completed resume makes no model/provider requests. Missing/stale **ungraded**
review sheets are rebuilt from validated results after an interrupted pair
publication. Any existing human ratings are preserved; pending comparisons with
ratings or mismatched graded review files are refused.

Exit code 3 means the checkpoint is safely pending quota/time budget, not lost.
Fill ratings only after the run completes. Review digests cover the final results;
all results and evidence stay under ignored .local storage.

## Measured setup smoke — 2026-10-28

The final adapter-v4 run completed all 24 candidate/case pairs on the six
synthetic cases. Exact schema/source validation passed Gemini 6/6, Ollama 6/6,
Groq 5/6 and local Qwen 5/6. Both invalid outputs were retained, with no retry to
improve their scores. All calls used one attempt; actual 429 was not triggered
in this paced run. Simulated provider tests cover 429/reset hints, transient
errors, long quotas, budgets and resume for all three services.

This measures plumbing and extractive validity, not coverage, semantic quality
or a production winner. The earlier development run and protocol diagnostics
are preserved separately. Final private evidence is under
`.local/summary-comparison/selected-models-final-20261028T181204/`.
An explicit completed resume returned 0 and left the checkpoint hash unchanged;
no provider/model inference was repeated. No human acceptance was written and
`AI_SUMMARY_PROVIDER` remains disabled. Python93, Ruff, backend20, Compose
configuration3, lint and formatting passed locally.

## Approve, then select through config

Only a completed comparison can be promoted; pending quota/budget cases block
promotion. `complete` means all calls reached terminal outcomes, not that every
model passed quality or schema validation.

After reviewing all paired outputs for Qwen and the proposed candidate:

```sh
pnpm ai:compare promote --provider gemini --results ABSOLUTE_RUN_PATH/results.json --review ABSOLUTE_RUN_PATH/blind-review.json
```

Promotion requires matching run/review digests, complete paired cases, unchanged
sources/results, current provider profile, no failed candidate outputs, candidate
faithfulness >=4 per case, coverage/conciseness >=3, overall mean >=4/5, and a
strictly higher mean than Qwen. Ties cannot win. These are explicit review
criteria, not statistical significance or a broad quality guarantee. The command
writes the latest `summaries` record and retains accepted records by fingerprint
in `summary_profiles` in `AI_MODEL_ROOT/acceptance.json`, preserving local ABSA
and other acceptance entries. Previously reviewed provider/model configurations
can be selected again directly through config. It does not edit `.env` or deploy.

Then choose the accepted provider and restart Python:

```dotenv
AI_SUMMARY_PROVIDER=gemini
```

`groq` and `ollama` use the same setting. A new provider/model, endpoint, prompt,
schema or generation limits changes the profile and requires a fresh review.
Rotating a key does not change quality acceptance. Production capabilities show
`accepted` only for a matching reviewed profile. No compatible record yields
`unassessed`; missing configuration yields `service_not_configured`. Node APIs,
authorization and local ABSA do not change when the summary provider changes.
