# Configurable summary providers

The owner selected Gemini, Groq and Ollama as summary candidates. Credentials
will be supplied privately later; no comparison has happened. ABSA continues to
use the existing local aspect/polarity DeBERTa pipeline without API calls. The
historical 66.4 relaxed F1 belongs to its frozen ABSA comparison, not summaries.

Use operation-specific routing inside the existing Python service, preserving
Node authorization and the extractive summary/citation contract. A global
generation-provider switch would unnecessarily change reports, answers and
surveys; duplicating public endpoints would fragment the backend. The selected
approach is a private `AI_SUMMARY_PROVIDER=disabled|gemini|groq|ollama` setting,
with independent model names/keys and an Ollama base URL. Default is disabled.
Qwen summary inference is available only to the offline comparison CLI. Existing
baseline behavior for the other generation operations remains unchanged.

No automatic provider fallback, retry, model download or evaluation network
call. One bounded HTTP attempt uses TLS verification, no redirects and a
response byte limit; failures use existing safe API errors. Secrets never enter
public metadata, comparison results or the local-model subprocess. Gemini and
Groq use fixed official origins; Ollama uses an operator-configured URL.

Production summary readiness requires a reviewed passing record for the exact
provider/model/prompt/schema/limits profile in local acceptance.json, regardless
of global baseline mode. Credentials alone do not accept quality. Selecting a
different model or provider invalidates that acceptance. Preserve local ABSA
assessment rules; do not relabel the current adapter accepted from older scores.

Provide a dry-run-first comparison CLI and synthetic EN/AR/Egyptian/mixed
fixtures. Explicit execution compares the same inputs with Qwen and the three
providers, recording validated results, failure codes, latency and token usage.
Export blinded review sheets with source evidence and separate identity mapping.
A promotion command requires complete human ratings, no failed candidate outputs, and a
strictly higher mean score than Qwen before writing an acceptance record.
Accepted profiles are retained so config can switch between reviewed candidates.
Invalid Qwen output counts as zero; unavailable baseline inference cannot prove
a win. Promotion does not select a provider or change .env. This prepares comparison;
it does not claim a winner or perform production deployment.
