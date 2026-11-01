// Translates between our feedback and the AI service contract. No database, no network: pure functions,
// so every rule here has a unit test (test/aiAdapter.test.js).
//
//  request : feedback text -> chunks of <= 2000 characters -> batches of <= 10 texts / ~60 KB
//  response: mentions (aspect words + positions) -> verified aspects with evidence quote, category, score
//
// Offsets in the contract are END-EXCLUSIVE CODE-POINT offsets into the text we sent. JavaScript strings
// are UTF-16, so every offset is converted through code-point arrays (Array.from).

const { categorise } = require("./aspectCategories");

const MAX_TEXT = 2000; // contract: one text is 1..2000 code points
const MAX_ITEMS = 10; // contract: 1..10 texts per request
const MAX_BODY_BYTES = 60000; // contract: 64 KiB body, keep a margin for keys and escaping
const MAX_EVIDENCE = 200;
const POLARITIES = ["positive", "negative", "neutral"];
const SENTIMENTS = ["positive", "negative", "neutral", "mixed"];

const round2 = (n) => Math.round(n * 100) / 100;
const cp = (text) => Array.from(String(text || ""));

// ---------- request ----------

// Cut at a paragraph, then a sentence end, then a space; hard cut only if there is none. Text is never altered:
// every chunk is an exact slice, and `offset` says where it starts (in code points) in the full text.
const SENTENCE_END = new Set([".", "!", "?", "؟", "۔", "\n"]);

const chunkText = (text, max = MAX_TEXT) => {
  const chars = cp(text);
  const chunks = [];
  let pos = 0;

  while (pos < chars.length) {
    let end = Math.min(pos + max, chars.length);

    if (end < chars.length) {
      const floor = pos + Math.floor(max / 2);
      let cut = -1;
      for (let i = end; i > floor && cut < 0; i -= 1) if (chars[i - 1] === "\n" && chars[i - 2] === "\n") cut = i;
      for (let i = end; i > floor && cut < 0; i -= 1) if (SENTENCE_END.has(chars[i - 1])) cut = i;
      for (let i = end; i > floor && cut < 0; i -= 1) if (/\s/.test(chars[i - 1])) cut = i;
      if (cut > 0) end = cut;
    }

    const slice = chars.slice(pos, end).join("");
    if (slice.trim()) chunks.push({ text: slice, offset: pos });
    pos = end;
  }
  return chunks;
};

// Request ids must match [A-Za-z0-9_-]{1,64}. A Mongo _id is 24 hex characters, so "f<_id>" is unique across
// businesses (the visible #1248 is only unique per business, which would collide in a mixed batch).
const requestId = (feedbackId, index) => (index === 0 ? `f${feedbackId}` : `f${feedbackId}_${index}`);

// doc: { _id, feedbackText }  ->  { feedbackId, chunks: [{ id, text, offset }] }
const planFeedback = (doc) => {
  const feedbackId = String(doc._id);
  const chunks = chunkText(doc.feedbackText).map((c, i) => ({ id: requestId(feedbackId, i), text: c.text, offset: c.offset }));
  return { feedbackId, chunks };
};

// Keeps all chunks of one feedback in the same request when they fit.
const packBatches = (plans, { maxItems = MAX_ITEMS, maxBytes = MAX_BODY_BYTES } = {}) => {
  const batches = [];
  let current = { plans: [], count: 0, bytes: 0 };

  for (const plan of plans) {
    const count = plan.chunks.length;
    if (count === 0) continue;
    const bytes = plan.chunks.reduce((sum, c) => sum + Buffer.byteLength(JSON.stringify({ id: c.id, text: c.text })) + 1, 0);

    if (current.plans.length && (current.count + count > maxItems || current.bytes + bytes > maxBytes)) {
      batches.push(current);
      current = { plans: [], count: 0, bytes: 0 };
    }
    current.plans.push(plan);
    current.count += count;
    current.bytes += bytes;
  }
  if (current.plans.length) batches.push(current);
  return batches;
};

const toTexts = (batch) => batch.plans.flatMap((p) => p.chunks.map((c) => ({ id: c.id, text: c.text })));

// ---------- evidence ----------

// Clause boundaries: punctuation, plus "but / however / لكن / بس" which split opinions about different things.
const CLAUSE_BREAK = /[.!?؟۔\n,;،؛]|\b(?:but|however|although|though|yet)\b|(?<=^|\s)(?:لكن|لكنه|لكنها|ولكن|بس)(?=\s|$)/giu;

// The clause around the aspect word, as an exact slice of the chunk text, so the owner can see WHY.
// `start`/`end` are code-point offsets inside `text`. `others` are the other aspect words of the same text
// ([[start, end], ...]): an English "and" between two aspect words also splits them
// ("The flat white was lovely and the team was welcoming" -> two evidence quotes).
const evidenceAround = (text, start, end, others = []) => {
  const chars = cp(text);
  const toU = (n) => chars.slice(0, n).join("").length;
  const startU = toU(start);
  const endU = toU(end);
  const otherU = others.filter(([s, e]) => e <= start || s >= end).map(([s, e]) => [toU(s), toU(e)]);

  const breaks = [];
  for (const match of text.matchAll(CLAUSE_BREAK)) breaks.push({ from: match.index, to: match.index + match[0].length });
  for (const match of text.matchAll(/\band\b/gi)) {
    const from = match.index;
    const to = from + match[0].length;
    const splits = (to <= startU && otherU.some(([, e]) => e <= from)) || (from >= endU && otherU.some(([s]) => s >= to));
    if (splits) breaks.push({ from, to });
  }
  breaks.sort((a, b) => a.from - b.from);

  let left = 0;
  let right = text.length;
  for (const b of breaks) {
    if (b.to <= startU) left = b.to;
    else if (b.from >= endU) {
      right = b.from;
      break;
    }
  }

  let from = left;
  let to = right;
  if (to - from > MAX_EVIDENCE) {
    from = Math.max(left, startU - 80);
    to = Math.min(right, endU + 100);
    const head = text.slice(from, startU).search(/\s/);
    if (from > left && head >= 0) from += head + 1;
    const tail = text.slice(endU, to).lastIndexOf(" ");
    if (to < right && tail >= 0) to = endU + tail;
  }

  const trimmed = text.slice(from, to).trim();
  return trimmed || text.slice(startU, endU);
};

// ---------- response ----------

const deriveSentiment = (polarities) => {
  const set = new Set(polarities);
  if (set.has("positive") && set.has("negative")) return "mixed";
  for (const label of ["positive", "negative", "neutral"]) if (set.has(label)) return label;
  return null;
};

// The service's "score" is the model's confidence (0..1) in the polarity it picked. The screens show a signed
// number, so positive -> +c, negative -> -c, neutral -> 0. The unsigned value is kept as `confidence`.
const signedScore = (polarity, confidence) => {
  if (polarity === "positive") return round2(confidence);
  if (polarity === "negative") return round2(-confidence);
  return 0;
};

const isMention = (m) =>
  m &&
  typeof m === "object" &&
  typeof m.text === "string" &&
  Number.isInteger(m.start) &&
  Number.isInteger(m.end) &&
  POLARITIES.includes(m.sentiment) &&
  typeof m.score === "number" &&
  m.score >= 0 &&
  m.score <= 1 &&
  typeof m.accepted === "boolean";

// One result item (one chunk) -> verified mentions with global offsets.
// A mention is dropped (and counted) when it is malformed or its text is not at the stated position.
const readChunk = (item, chunk) => {
  if (!item || typeof item !== "object" || !Array.isArray(item.mentions)) return { error: true };
  if (item.sentiment !== null && !SENTIMENTS.includes(item.sentiment)) return { error: true };

  const chars = cp(chunk.text);
  const valid = [];
  let dropped = 0;

  for (const m of item.mentions) {
    if (m && m.accepted === false) continue; // below the service's own 0.7 threshold: not an aspect
    if (!isMention(m) || m.start < 0 || m.end <= m.start || m.end > chars.length || chars.slice(m.start, m.end).join("") !== m.text) {
      dropped += 1;
      continue;
    }
    valid.push(m);
  }

  const spans = valid.map((m) => [m.start, m.end]);
  const mentions = valid.map((m) => ({
    term: m.text,
    polarity: m.sentiment,
    confidence: round2(m.score),
    start: chunk.offset + m.start,
    end: chunk.offset + m.end,
    evidence: evidenceAround(chunk.text, m.start, m.end, spans),
  }));
  return { mentions, dropped };
};

const safeStrings = (value, max = 5) =>
  Array.isArray(value) ? value.filter((v) => typeof v === "string").slice(0, max).map((v) => v.slice(0, 100)) : [];

const readProvenance = (provenance) => {
  const p = provenance && typeof provenance === "object" ? provenance : {};
  return {
    qualityStatus: ["accepted", "baseline", "unavailable"].includes(p.quality_status) ? p.quality_status : "unavailable",
    qualityAccepted: p.quality_accepted === true,
    models: safeStrings(p.models, 3),
    profile: typeof p.profile === "string" ? p.profile.slice(0, 64) : undefined,
    methodVersion: typeof p.method_version === "string" ? p.method_version.slice(0, 50) : undefined,
    warnings: safeStrings(p.warnings, 5),
  };
};

// Items of one response, indexed by id. Returns null when the envelope is not usable.
const indexItems = (envelope) => {
  const items = envelope?.result?.items;
  if (!Array.isArray(items)) return null;
  const byId = new Map();
  for (const item of items) if (item && typeof item.id === "string") byId.set(item.id, item);
  return byId;
};

// plan: { feedbackId, chunks }, byId: Map from indexItems. -> { ok: true, analysis } | { ok: false, code }
const buildAnalysis = (plan, byId, provenance) => {
  const mentions = [];
  let dropped = 0;

  for (const chunk of plan.chunks) {
    const read = readChunk(byId.get(chunk.id), chunk);
    if (read.error) return { ok: false, code: "AI_MALFORMED" };
    mentions.push(...read.mentions);
    dropped += read.dropped;
  }

  mentions.sort((a, b) => a.start - b.start);

  // One row per (aspect, polarity): "wait" and "25 minutes" are one complaint about Wait time.
  const rows = [];
  for (const m of mentions) {
    const { name } = categorise(m.term);
    const row = {
      name,
      term: m.term,
      evidence: m.evidence,
      polarity: m.polarity,
      score: signedScore(m.polarity, m.confidence),
      confidence: m.confidence,
      start: m.start,
      end: m.end,
    };
    const same = rows.findIndex((r) => r.name === name && r.polarity === m.polarity);
    if (same < 0) rows.push(row);
    else if (row.confidence > rows[same].confidence) rows[same] = row;
  }

  const overallSentiment = deriveSentiment(mentions.map((m) => m.polarity));
  const analysis = {
    status: dropped > 0 ? "partial" : "completed",
    overallSentiment: overallSentiment || undefined,
    reason: overallSentiment ? undefined : "insufficient_evidence",
    aspects: rows,
    droppedAspects: dropped || undefined,
    provenance: readProvenance(provenance),
  };
  return { ok: true, analysis };
};

module.exports = {
  MAX_TEXT,
  MAX_ITEMS,
  chunkText,
  requestId,
  planFeedback,
  packBatches,
  toTexts,
  evidenceAround,
  deriveSentiment,
  signedScore,
  readChunk,
  readProvenance,
  indexItems,
  buildAnalysis,
};
