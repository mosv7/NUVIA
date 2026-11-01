# Connected Groq assistant

The owner selected Groq after reviewing local Qwen versus hosted answers. Preserve the approved assistant page and floating panel. Connect both to owner-scoped stored feedback, with branch/date controls, explicit empty/unavailable states and original feedback evidence. No account, survey, summary or ABSA redesign.

## Approaches and decision

Local Qwen reuses weights but has unaccepted evidence-answer quality. Hosted Groq with `openai/gpt-oss-120b` provides structured selection over retrieved evidence; this is the selected approach. An unrestricted database/tool agent adds unnecessary access and factual risk. The server alone retrieves data and computes counts.

## Contract and responsibilities

Node exposes GET `/api/ai/assistant/context?branchId=&from=&to=` and POST `/api/ai/assistant/answers` with `{question,locale,branchId?,from?,to?,previousQuestion?}`. Both require the current owner/business, active device and existing session rules; POST uses exact Origin/CSRF and owner rate limits. Unknown fields and foreign branches are rejected. `previousQuestion` is optional bounded user context, never model instructions.

Context returns owned branch choices and deterministic scoped metrics: total responses, written responses, analysis statuses, sentiment counts and most-mentioned negative aspects from stored analysis. Missing/unaccepted analysis remains distinguished; confidence is never satisfaction. Answers return `{status,items:[{text,citations:[{id,quote,responseId,number}]}],metrics,coverage,provenance}` in the normal `{data}` envelope. `coverage` states bounded retrieval and corpus counts. Claims preserve the existing exact-source extractive answers contract; the UI introduces them as relevant customer evidence, not exhaustive conclusions or causal explanations. Metrics are separate server-computed facts. An empty corpus/no textual evidence bypasses inference.

Node retrieves at most 500 recent written responses within the selected business/branch/UTC-day range, ranks using normalized question terms and stored negative-aspect labels, and sends at most 10 source excerpts of <=2000 Unicode code points to the existing authenticated Python `/api/v1/answers`. English/Arabic generic overview questions may use recent evidence, explicitly marked as a sample. No embeddings/vector database, no schema/index migration. Source IDs are server-mapped; revalidate source quotes and current ownership when mapping citations. Strip email, phone and explicitly stored respondent name before egress; never send respondent objects, secrets or business/account records. Customer text/question are untrusted data. No arbitrary Mongo queries, writes or model tool execution.

Python adds independently configured Groq answers routing: `AI_ASSISTANT_PROVIDER=disabled|groq` (disabled by default), `AI_ASSISTANT_MODEL=openai/gpt-oss-120b`, optional `AI_ASSISTANT_API_KEY` falling back only to the existing Python Groq key, bounded output tokens. Keep summary configuration and DeBERTa/local operations unchanged. Explicit Groq selection may run with baseline provenance (`quality_accepted=false`); it never manufactures reviewed acceptance or inherits permission from global local baseline mode. Reuse strict `answers` schema and semantic source validation in Python and Node. Keys never reach browser/local model worker. TLS on, fixed Groq endpoint, no redirects, retries or fallback, finite byte/token/deadline limits, cancellation and busy rejection.

## UI and evidence navigation

Reuse existing assistant geometry, assets, shared ProductProvider/date/branch controls and HTTP transport. Add a shared connected conversation hook for both surfaces. Abort/reset on workspace, scope, locale, close/unmount/new conversation; suppress stale replies. Render pending/error/retry/empty/insufficient-evidence and experimental-quality notices in EN/AR. Preserve draft on failures and forbid duplicate submits. Connected evidence opens an owner-protected feedback detail view; previews retain their sample behavior. Conversation stays in memory, no claimed persistence. No raw HTML/Markdown execution.

## Verification and limits

Use isolated MongoDB replicas, synthetic identities and fake local HTTP upstreams. Cover auth/CSRF/owner isolation, filters/privacy, forged citations, numeric metrics, bounded retrieval, failure/cancel and stale UI completion; Python covers configuration, strict wire/schema, no local worker secret leakage and summary isolation. Browser-check desktop/narrow EN/AR, complete ask/evidence navigation, keyboard close/focus and empty/unavailable. Live Groq smoke uses fabricated data only, if an existing private key is available; distinguish provider success from representative semantic quality acceptance. No configured customer database writes or production deployment. Push a task branch/open PR per repo rules; merge requires an explicit request for this new feature.
