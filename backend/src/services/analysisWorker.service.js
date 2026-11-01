// Background worker: the database is the queue.
//
//   response saved  -> analysis.status = "pending"
//   worker claims   -> "processing" (one atomic update per document, so several server instances are safe)
//   worker finishes -> "completed" | "partial" | "failed"
//
// The customer never waits for any of this. The owner screens only read what is stored here.
//
// Config (.env): AI_BATCH_SIZE=5 (feedbacks per tick), AI_POLL_MS=2000, AI_STALE_MS=300000 (a "processing" row
// older than this is put back in the queue: the server probably died mid-call).

const CustomerResponse = require("../models/customerResponse.model");
const { runBatch } = require("./analysis.service");
const { safeMessage } = require("../integrations/ai/client");

const batchSize = () => Math.min(Math.max(Number(process.env.AI_BATCH_SIZE) || 5, 1), 10);
const pollMs = () => Number(process.env.AI_POLL_MS) || 2000;
const staleMs = () => Number(process.env.AI_STALE_MS) || 5 * 60 * 1000;

let running = false; // the AI service handles one model call at a time, so we do too
let timer = null;
let sweepTimer = null;
let stopped = true;

// Takes one pending document, or returns null. findOneAndUpdate is atomic: two workers never get the same one.
const claimOne = () =>
  CustomerResponse.findOneAndUpdate(
    { "analysis.status": "pending" },
    { $set: { "analysis.status": "processing", "analysis.startedAt": new Date() }, $inc: { "analysis.attempts": 1 } },
    { sort: { "analysis.requestedAt": 1, _id: 1 }, returnDocument: "after", projection: { feedbackText: 1 } }
  ).lean();

const claim = async (limit) => {
  const docs = [];
  while (docs.length < limit) {
    const doc = await claimOne();
    if (!doc) break;
    docs.push(doc);
  }
  return docs;
};

const store = (id, result) => {
  const guard = { _id: id, "analysis.status": "processing" }; // never overwrite a retry that started meanwhile

  if (!result.ok) {
    return CustomerResponse.updateOne(guard, {
      $set: {
        "analysis.status": "failed",
        "analysis.completedAt": new Date(),
        "analysis.errorCode": result.code,
        "analysis.errorMessage": safeMessage(result.code),
      },
    });
  }

  const a = result.analysis;
  const set = {
    "analysis.status": a.status,
    "analysis.completedAt": new Date(),
    "analysis.aspects": a.aspects,
    "analysis.provenance": a.provenance,
  };
  const unset = { "analysis.errorCode": "", "analysis.errorMessage": "", "analysis.missingSections": "" };

  for (const [field, value] of [["overallSentiment", a.overallSentiment], ["reason", a.reason], ["droppedAspects", a.droppedAspects]]) {
    if (value === undefined) unset[`analysis.${field}`] = "";
    else set[`analysis.${field}`] = value;
  }
  return CustomerResponse.updateOne(guard, { $set: set, $unset: unset });
};

// Handles one round. Returns how many feedbacks it processed (0 = queue empty).
const tick = async () => {
  if (running) return 0;
  running = true;
  try {
    const docs = await claim(batchSize());
    if (docs.length === 0) return 0;

    let results;
    try {
      results = await runBatch(docs);
    } catch (error) {
      console.error("analysis worker:", error.message);
      results = docs.map((d) => ({ id: String(d._id), ok: false, code: "INTERNAL" }));
    }

    const byId = new Map(results.map((r) => [r.id, r]));
    await Promise.all(docs.map((d) => store(d._id, byId.get(String(d._id)) || { ok: false, code: "INTERNAL" })));
    return docs.length;
  } finally {
    running = false;
  }
};

const loop = async () => {
  if (stopped) return;
  let worked = 0;
  try {
    worked = await tick();
  } catch (error) {
    console.error("analysis worker:", error.message);
  }
  if (!stopped) timer = setTimeout(loop, worked ? 0 : pollMs());
  if (timer?.unref) timer.unref();
};

// Called right after a response is saved, so the analysis starts without waiting for the next poll.
const kick = () => {
  if (stopped || running) return;
  clearTimeout(timer);
  timer = setTimeout(loop, 0);
  if (timer.unref) timer.unref();
};

// Puts back work left half-done: a "processing" row nobody is working on any more.
const sweep = async () => {
  const cutoff = new Date(Date.now() - staleMs());
  const { modifiedCount } = await CustomerResponse.updateMany(
    { "analysis.status": "processing", "analysis.startedAt": { $lt: cutoff } },
    { $set: { "analysis.status": "pending" } }
  );
  if (modifiedCount) console.log(`analysis worker: re-queued ${modifiedCount} stuck feedback(s)`);
};

const start = () => {
  if (!stopped) return;
  stopped = false;
  sweep().catch((e) => console.error("analysis sweep:", e.message));
  sweepTimer = setInterval(() => sweep().catch((e) => console.error("analysis sweep:", e.message)), 60 * 1000);
  if (sweepTimer.unref) sweepTimer.unref();
  loop();
};

const stop = () => {
  stopped = true;
  clearTimeout(timer);
  clearInterval(sweepTimer);
};

module.exports = { start, stop, kick, tick, sweep };
