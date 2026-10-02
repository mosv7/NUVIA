# AI pipeline

Status: proposed scientific and engineering plan. No models have been trained, selected, benchmarked, or deployed.

## Goals and scope

Analyze Arabic and English feedback, including Egyptian and Gulf dialects and code switching. Preserve aspect-level differences such as positive food feedback alongside negative service feedback. Produce traceable measurements first, then generate recommendations from those measurements.

Core stages are preprocessing, sentiment, aspect extraction/polarity, clustering, aggregation, anomaly analysis, and report synthesis. Conversational analytics, survey suggestions, and forecasting are later extensions.

## Processing stages

| Stage | Input | Output and constraints |
| --- | --- | --- |
| Capture | Immutable response and questionnaire revision | Run input membership with workspace and source IDs |
| Privacy | Original answers | Redacted text and redaction version; remove identifiers before external inference |
| Preprocess | Redacted text | Language/dialect confidence, normalized text, sentence boundaries, offset mapping |
| Representation | Versioned normalized sentences | Model-specific contextual embeddings |
| Sentiment | Response and sentences | Positive, negative, neutral, or mixed labels and calibrated confidence |
| ABSA | Sentences | Aspect spans, canonical aspect IDs, polarity, confidence, and evidence references |
| Clustering | Complaint sentence embeddings | Tenant-scoped clusters, representatives, counts, and unclustered items |
| Aggregation | Accepted labels and captured response set | Aspect scores, coverage, sentiment distribution, and segment/time buckets |
| Trends | Comparable time buckets | Changes and anomalies with data sufficiency and uncertainty |
| Report | Fixed analytics snapshot and redacted evidence | Validated structured report with citations |

Persist versions and outputs so a result can be reproduced without silently using today's model.

## Preprocessing

Keep original text restricted. Normalize Unicode and Arabic character variants conservatively; record transformations. Remove diacritics only in the model input representation. Preserve negation, emoji, punctuation, and words that affect polarity. Do not translate all Arabic into English as a default preprocessing step.

Language/dialect detection is probabilistic. Code-switched sentences may need multilingual models rather than forced single-language routing. Unsupported or empty inputs receive an exclusion reason. Low-confidence predictions remain visible as uncertain and are excluded from aggregate scoring according to a versioned threshold.

## Models and annotation

Compare a simple classical baseline with pretrained transformer sentiment/ABSA models. Use Python, PyTorch, Hugging Face Transformers, sentence embeddings, and scikit-learn as proposed in the source document. Choose models after checking licenses, dialect coverage, latency, memory, and evaluation results.

Annotation units include response sentiment, sentence sentiment, aspect span, canonical aspect, and polarity. Allow mixed sentiment and multiple aspects per sentence. Define neutral, mixed, sarcasm, negation, and implicit-aspect handling in a written annotation guide.

At least two annotators label the adjudication sample independently. Record agreement and resolve conflicts. Separate business/source groups, near duplicates, and time periods across train/validation/test where practical. Freeze the test set before tuning. Customer data is not training data by default.

## Proposed aspect score definition

This initial formula is a transparent baseline, not a calibrated satisfaction measure:

1. Map positive polarity to 1, neutral and mixed to 0.5, and negative to 0.
2. Exclude unsupported and below-threshold mentions; record the excluded count.
3. For each response/aspect pair, average the accepted mention values. This stops verbose responses dominating an aspect.
4. Score = 10 × mean of response/aspect values within the selected snapshot/filter.
5. Round only for display. Report contributing response count, mention count, exclusion count, and scoring version.

Use null for an aspect with no accepted observations. Proposed minimum for publishing an aspect score is five distinct responses; below that return an insufficient-data reason. A neutral-only result scores 5 under this formula; it must not be described as a validated customer satisfaction rating.

Do not confuse form star ratings with text-derived aspect scores. Display and aggregate them separately. Never combine scoring versions without explicitly reprocessing the data.

## Clusters, trends, and forecasting

Cluster complaint sentences within one workspace and analysis run. Maintain an outlier/unclustered category and deterministic representative selection. Deduplicate near-identical responses for evaluation; use distinct response counts in business frequency claims. Recompute clusters as versioned outputs rather than pretending cluster IDs are stable across model changes.

Time buckets use the workspace timezone. Compare the same aspect definition, model/scoring version, and segment filters. Proposed anomaly gate: at least 20 scored responses in both comparison windows. Display sample sizes and method assumptions; association does not establish the cause of a change.

Evaluate forecasting only after sufficient historical coverage. Use time-ordered validation, naive baselines, MAE or another appropriate documented metric, and uncertainty intervals. Hide predictions when history is insufficient.

## Report generation and grounding

Provide the LLM with an immutable snapshot, allowed metrics, redacted evidence IDs/excerpts, requested locale, and a versioned output schema. Expected sections: overall situation, strengths, ranked pain points, and prioritized recommended actions.

Treat feedback and retrieved excerpts as untrusted content. Prompt instructions must separate system rules from evidence; no tools can execute customer-provided instructions. Restrict the provider to the minimum context and an approved retention/data-region policy.

Validate output schema, cited evidence existence and tenant ownership, period/filter consistency, numerical claims against metrics, and source availability. Reject unsupported facts or regenerate within a bounded retry limit. Mark recommendations as suggestions and avoid invented causal explanations.

Reports become ready only after validation. If validation fails, show failed status and keep the last valid report. Removal of evidence invalidates dependent reports until rebuilt.

## Conversational extension

Authorize the workspace before retrieval. Retrieve only retained tenant-scoped evidence from the selected period and approved embedding version. Include computed analytics for numerical questions; do not let a language model invent counts from a handful of snippets.

Answers cite authorized evidence and state when coverage is inadequate. Conversation history never broadens access. Test adversarial questions, prompt injection, unsupported claims, and cross-tenant retrieval before enabling the assistant.

## Evaluation plan

| Component | Evaluation |
| --- | --- |
| Sentiment | Accuracy, precision, recall, macro F1, confusion matrix, calibration, language/dialect slices |
| ABSA | Aspect extraction F1, polarity F1, joint aspect/polarity F1, implicit-aspect errors |
| Clustering | Silhouette where applicable, outlier coverage, human coherence, stability across runs |
| Trends/anomalies | Backtests or injected shifts, false-alert rate, sample-size sensitivity |
| Reports | Claim traceability, numerical consistency, owner correctness/usefulness/actionability ratings |
| Q&A | Retrieval relevance, grounded answer correctness, abstention quality, isolation/injection tests |
| System | Throughput, stage latency, queue delay, memory, cost per 1,000 responses |

Initial acceptance targets are in [Requirements](requirements.md). Publish dataset provenance/licenses, split method, annotation agreement, exact model versions, evaluation scripts, hardware, and failures alongside results.

## Reproducibility and operations

Version preprocessing, redaction, taxonomy, embeddings, model artifacts, thresholds, clustering configuration, scoring, prompt, and report schema. Save artifact hashes and seeds where relevant. Store private datasets outside Git; commit manifests and synthetic fixtures.

Monitor language mix, exclusion rate, confidence distribution, drift, job failures, and report validation failures without logging raw text. New model versions run against the frozen evaluation set and a reviewed staging sample before rollout. Rollback switches the approved model alias; historical reports retain their original versions.
