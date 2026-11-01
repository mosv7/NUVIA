// Turns a list of feedback documents into analysis results by calling the AI service.
// No database here (the worker reads and writes), so it is easy to test with a fake `analyze`.
//
//   runBatch(docs, { analyze })  ->  [{ id, ok: true, analysis } | { id, ok: false, code }]
//
// Rules:
//   - up to 10 texts / ~60 KB per request; long feedback is split into chunks (utils/aiAdapter)
//   - one bad feedback must not fail its neighbours: if a multi-feedback request is rejected as invalid or
//     unusable, each feedback is retried alone
//   - "service down" errors stop the run: the remaining feedbacks get the same failure instead of waiting
//     for a timeout each

const adapter = require("../utils/aiAdapter");
const client = require("../integrations/ai/client");

const ISOLATE_ON = new Set(["AI_INPUT_INVALID", "AI_OUTPUT_INVALID", "AI_MALFORMED"]);
const STOP_ON = new Set(["AI_NOT_CONFIGURED", "AI_UNAVAILABLE", "AI_UNREACHABLE", "AI_TIMEOUT"]);

const codeOf = (error) => (error instanceof client.AIError ? error.code : "INTERNAL");

const runOne = async (batch, analyze) => {
  const envelope = await analyze(adapter.toTexts(batch));
  const byId = adapter.indexItems(envelope);
  if (!byId) throw new client.AIError("AI_MALFORMED");
  return batch.plans.map((plan) => ({ id: plan.feedbackId, ...adapter.buildAnalysis(plan, byId, envelope.provenance) }));
};

const runBatch = async (docs, { analyze = client.analyze } = {}) => {
  const results = [];
  const plans = [];

  for (const doc of docs) {
    const plan = adapter.planFeedback(doc);
    if (plan.chunks.length === 0) results.push({ id: plan.feedbackId, ok: false, code: "AI_INPUT_INVALID" });
    else plans.push(plan);
  }

  const batches = adapter.packBatches(plans);
  let stopped = null;

  for (const batch of batches) {
    if (stopped) {
      batch.plans.forEach((p) => results.push({ id: p.feedbackId, ok: false, code: stopped }));
      continue;
    }

    try {
      results.push(...(await runOne(batch, analyze)));
    } catch (error) {
      const code = codeOf(error);

      if (batch.plans.length > 1 && ISOLATE_ON.has(code)) {
        for (const plan of batch.plans) {
          try {
            results.push(...(await runOne({ plans: [plan] }, analyze)));
          } catch (inner) {
            results.push({ id: plan.feedbackId, ok: false, code: codeOf(inner) });
          }
        }
        continue;
      }

      if (STOP_ON.has(code)) stopped = code;
      batch.plans.forEach((p) => results.push({ id: p.feedbackId, ok: false, code }));
    }
  }
  return results;
};

module.exports = { runBatch };
