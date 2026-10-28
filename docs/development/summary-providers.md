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

Runtime dependency installation: `uv sync --project apps/ai-service --locked`.
If using `AI_PYTHON_EXECUTABLE`, install the declared `httpx` dependency in that
interpreter too. Keys stay in the Python service, never browser configuration or
local model subprocess settings. Use the existing private service token/Node
transport. Public inputs and outputs are unchanged: `/api/ai/summaries` receives
`{texts:[{id,text}],locale}` and returns validated extractive claims/citations.
Quotes preserve source language; this does not enable abstractive paraphrasing.

Gemini uses its native generateContent endpoint/JSON mode; Groq uses JSON object
chat completions plus local schema validation; local Ollama uses `/api/chat`
with a JSON schema and streaming disabled. See official
[Gemini REST](https://ai.google.dev/api/generate-content),
[Groq JSON mode](https://console.groq.com/docs/structured-outputs), and
[Ollama structured outputs](https://docs.ollama.com/capabilities/structured-outputs).

One HTTP attempt: no retry, redirect following or fallback to Qwen/another
provider. TLS verification remains enabled. A whole-operation deadline uses
`AI_TASK_TIMEOUT_SECONDS`; responses are capped at 256 KiB. JSON/schema, exact
citations and source membership are revalidated in Python and Node. Provider
truncation is an invalid result. Remote inputs use the existing 64 KiB / text
count / character bounds, not a claim of tokenizer-equivalent input counts.
`AI_MAX_OUTPUT_TOKENS` bounds requested generation. Busy/rate-limit returns 429,
invalid output 502, unavailable/credentials 503 and timeout 504 through existing
safe errors. Upstream bodies/exceptions are not returned.

## Compare first

No live comparison has been completed. Adding keys/models alone sends no data
and does not approve a production provider. Default is disabled; global
`AI_BASELINE_MODE=true` cannot bypass summary acceptance.

From repository root, inspect configuration without requests/inference:

```sh
uv run --directory apps/ai-service python -m scripts.compare_summaries compare
```

Explicitly run all four candidates on the bundled synthetic six-case fixture:

```sh
uv run --directory apps/ai-service python -m scripts.compare_summaries compare --run
```

Use `--providers qwen,gemini,groq,ollama` to select candidates; use `--dataset`
with an absolute path for your representative EN/AR/Egyptian dataset. Inputs
are sent to selected configured providers only with `--run`. Local Qwen requires
its prepared package and optional inference dependencies; use your compatible
inference Python interpreter to execute the module if the default uv environment
has no weights/dependencies. The existing baseline prompt is used for Qwen; API
candidates use the current strict extractive prompt. Both share the same input,
output schema and source validation. This compares the configured systems, not
a claim of identical model tokenization or prompts.

Each invocation creates a new private `.local/summary-comparison/<run>/` folder:

- `results.json`: original dataset, provider/model/profile mapping, success/error
  codes, validated outputs, latency and provider-reported token counts. Qwen
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

## Approve, then select through config

After reviewing all paired outputs for Qwen and the proposed candidate:

```sh
uv run --directory apps/ai-service python -m scripts.compare_summaries promote --provider gemini --results ABSOLUTE_RUN_PATH/results.json --review ABSOLUTE_RUN_PATH/blind-review.json
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
