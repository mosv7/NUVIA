# Connected Groq assistant

The owner assistant page and floating panel query stored feedback through Node's
protected `/api/ai/assistant` boundary. Groq selects relevant exact-source quotations;
the backend computes statistics. This is bounded lexical retrieval over saved
responses, not unrestricted chat, vector search or autonomous database access.

## Configure

Keep existing private root configuration and add:

```dotenv
AI_ASSISTANT_PROVIDER=groq
AI_ASSISTANT_MODEL=openai/gpt-oss-120b
AI_ASSISTANT_API_KEY=
AI_ASSISTANT_OUTPUT_TOKENS=2048
```

An empty assistant key reuses `AI_GROQ_API_KEY` inside Python. Configure the
existing `AI_SERVICE_URL` and shared `AI_SERVICE_TOKEN` for Node/Python, and run
`pnpm dev:ai` alongside the normal web/backend flow. `scripts/dev-ai.mjs` already
forwards AI-prefixed development settings; Compose explicitly forwards the new
assistant settings to its optional AI service. Provider credentials never go to
the browser or local model worker. No local weights are needed for Groq answers.

`disabled` is the default and preserves the existing locally gated answers
operation. Explicit `groq` selection independently enables experimental answers:
`quality_status=baseline`, `quality_accepted=false`, with visible UI disclosure.
It does not enable summaries or convert local/global baseline permission into
reviewed quality. A matching independently reviewed
`acceptance.json.assistant_profiles[profile]` record is required to mark the
provider profile accepted. Synthetic plumbing smoke is not such an assessment.
Changing model/prompt/schema/limits invalidates the profile.

No automatic retries, redirects or provider/local fallback occur. The fixed TLS
Groq endpoint uses strict structured output, bounded output/response size and a
whole-operation deadline. Python and Node both validate exact-source quotations;
well-formed JSON alone does not establish correctness or semantic relevance.

## Retrieval, scope and privacy

Node derives the business from the authenticated owner and validates branch
ownership. `from`/`to` select UTC days; the final day is inclusive. Metrics cover
the entire selected scope. Sentiment and negative-aspect counts include only
completed/partial analyses with accepted provenance; pending, failed, baseline
and other unaccepted results remain separately identified.

For answers, Node examines at most 500 recent written responses and ranks
normalized Arabic/English terms. It sends at most ten relevant excerpts of at
most 2,000 Unicode code points each. General overview questions can use recent
evidence, always marked as a sample. No matching textual evidence returns
`insufficient_evidence` without a model call. Retrieval cannot promise exhaustive
semantic search across older records or cross-language synonyms.

Email/phone patterns and explicitly stored respondent names are redacted before
egress. This is a targeted privacy measure, not a general PII detector: customers
should still avoid entering sensitive information in free text. Only redacted
excerpts, the redacted question/optional prior user question and local source IDs
are sent. Names, account records and contact fields are not sent as metadata.
Links resolve through the server's source map and owned feedback APIs. Never
treat a browser-supplied evidence ID as permission to a stored response.

## Conversation and limitations

The existing page and floating panel share the same conversation behavior.
Scope, locale, workspace, closing, unmount and new conversation cancel/invalidate
pending work. Conversation is in memory only. No automatic conversation storage,
streaming, response generation retries or actions modifying the business exist.
Quotes retain source language even when UI language differs. Counts come from
MongoDB, while model answers remain extractive customer evidence; they do not
establish causes, revenue forecasts or complete complaint prevalence.

The protected source-detail destination reads real response text and stored
analysis. This does not implement the full feedback list or analytics dashboard.
Preview routes retain sample interactions and never submit evidence to Groq.

## Verification

`pnpm test:e2e:accounts` includes a synthetic assistant scenario with real browser
sessions, Node and isolated MongoDB, plus a fake authenticated Python upstream.
It covers EN/AR desktop/narrow answers, source navigation and floating-panel
Escape/focus. Backend and Python tests exercise tenant boundaries, source
validation, cancellation, limits and provider configuration independently.

An actual Groq smoke on 2026-11-01 used fabricated feedback only. English and
Arabic evidence selection and an unsupported revenue question behaved as
expected. A prompt-injection source alongside useful evidence caused safe
abstention. This is a functionality smoke, not representative quality acceptance;
the runtime remains baseline. Private synthetic metadata is kept under ignored
`.local/assistant-plan/`, without credentials or customer data.

A second smoke exercised the complete browser -> Node retrieval -> private
FastAPI -> actual Groq path with isolated synthetic accounts/MongoDB. Both EN/AR
questions returned source-bound answers with baseline provenance. No configured
customer database was used.
