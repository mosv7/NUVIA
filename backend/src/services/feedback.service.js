// Everything the Feedbacks list and Feedback details screens read. Reads stored data only: these
// functions never call the AI service (the worker does that, in the background).

const CustomerResponse = require("../models/customerResponse.model");
const Branch = require("../models/branch.model");
const Survey = require("../models/survey.model");
const { fail } = require("../utils/errors");
const { toCsv } = require("../utils/csv");
const { requireBusinessId, oid } = require("./surveyAccess");
const worker = require("./analysisWorker.service");
const { safeMessage } = require("../integrations/ai/client");

const FINAL = new Set(["completed", "partial", "failed", "skipped"]);
const RANGE_DAYS = { "7d": 7, "30d": 30, "90d": 90 };
const DAY_MS = 24 * 60 * 60 * 1000;
const EXPORT_LIMIT = 5000;

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Dates are UTC days (see "Known limits" in the doc).
const startOfDay = (iso) => new Date(`${iso}T00:00:00.000Z`);

// Query string -> MongoDB filter, always scoped to the caller's business. Pure, so it is unit tested.
const buildFilter = (businessId, q = {}, now = new Date()) => {
  const filter = { businessId: oid(businessId) };

  const range = q.range || "30d";
  if (q.from || q.to) {
    filter.submittedAt = {};
    if (q.from) filter.submittedAt.$gte = startOfDay(q.from);
    if (q.to) filter.submittedAt.$lt = new Date(startOfDay(q.to).getTime() + DAY_MS); // the whole "to" day
  } else if (RANGE_DAYS[range]) {
    filter.submittedAt = { $gte: new Date(now.getTime() - RANGE_DAYS[range] * DAY_MS) };
  }

  if (q.sentiment) filter["analysis.overallSentiment"] = q.sentiment;
  if (q.language) filter.language = q.language;
  if (q.aspect) filter["analysis.aspects.name"] = String(q.aspect);
  if (q.branchId) filter.branchId = oid(q.branchId);
  if (q.surveyId) filter.surveyId = oid(q.surveyId);

  const search = String(q.search || "").trim();
  if (search) {
    const or = [{ feedbackText: { $regex: escapeRegex(search), $options: "i" } }];
    if (/^#?\d{1,9}$/.test(search)) or.push({ number: Number(search.replace("#", "")) }); // "#1248" or "1248"
    filter.$or = or;
  }
  return filter;
};

const sortOf = (sort) => (sort === "oldest" ? { submittedAt: 1, _id: 1 } : { submittedAt: -1, _id: -1 });

const preview = (text) => {
  const flat = String(text || "").replace(/\s+/g, " ").trim();
  return flat.length > 120 ? `${flat.slice(0, 117).trimEnd()}...` : flat;
};

const namesById = async (Model, ids) => {
  const rows = ids.length ? await Model.find({ _id: { $in: ids } }).select("name").lean() : [];
  return new Map(rows.map((r) => [String(r._id), { id: String(r._id), name: r.name }]));
};

const unique = (list) => [...new Set(list)];

// ---------- list ----------

const list = async (user, q) => {
  const businessId = requireBusinessId(user);
  const filter = buildFilter(businessId, q);
  const limit = Math.min(Math.max(Number(q.limit) || 8, 1), 50);
  const page = Math.max(Number(q.page) || 1, 1);
  const skip = (page - 1) * limit;

  const [total, rows, anyResponse] = await Promise.all([
    CustomerResponse.countDocuments(filter),
    CustomerResponse.find(filter)
      .select("number feedbackText submittedAt language branchId surveyId analysis.status analysis.overallSentiment analysis.aspects.name")
      .sort(sortOf(q.sort))
      .skip(skip)
      .limit(limit)
      .lean(),
    CustomerResponse.exists({ businessId: oid(businessId) }),
  ]);

  const [branches, surveys] = await Promise.all([
    namesById(Branch, unique(rows.map((r) => String(r.branchId)))),
    namesById(Survey, unique(rows.map((r) => String(r.surveyId)))),
  ]);

  const items = rows.map((r) => ({
    id: String(r._id),
    number: r.number,
    displayId: `#${r.number}`,
    preview: preview(r.feedbackText),
    hasText: Boolean(r.feedbackText),
    submittedAt: r.submittedAt,
    language: r.language,
    sentiment: r.analysis?.overallSentiment || null, // null while pending / failed / skipped: show "Analysing..." or "-"
    analysisStatus: r.analysis?.status || "pending",
    aspects: unique((r.analysis?.aspects || []).map((a) => a.name)),
    branch: branches.get(String(r.branchId)) || null,
    survey: surveys.get(String(r.surveyId)) || null,
  }));

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      from: items.length ? skip + 1 : 0,
      to: skip + items.length,
    },
    hasAnyResponses: Boolean(anyResponse),
  };
};

// ---------- filter options ----------

const getFilters = async (user) => {
  const businessId = oid(requireBusinessId(user));
  const [branches, surveys, languages, aspects] = await Promise.all([
    Branch.find({ businessId }).select("name status").sort({ name: 1 }).lean(),
    Survey.find({ businessId }).select("name").sort({ name: 1 }).lean(),
    CustomerResponse.distinct("language", { businessId }),
    CustomerResponse.aggregate([
      { $match: { businessId } },
      { $unwind: "$analysis.aspects" },
      { $group: { _id: "$analysis.aspects.name", count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
      { $limit: 100 },
    ]),
  ]);

  return {
    ranges: ["7d", "30d", "90d", "all"],
    sentiments: ["positive", "neutral", "negative", "mixed"],
    languages: languages.sort(),
    aspects: aspects.map((a) => ({ name: a._id, count: a.count })),
    branches: branches.map((b) => ({ id: String(b._id), name: b.name, archived: b.status === "archived" })),
    surveys: surveys.map((s) => ({ id: String(s._id), name: s.name })),
  };
};

// ---------- details ----------

const findOwned = async (businessId, id) => {
  const doc = await CustomerResponse.findOne({ _id: id, businessId: oid(businessId) }).lean();
  if (!doc) throw fail("Feedback not found", 404);
  return doc;
};

// "Previous" = the next NEWER response, "Next response" = the next OLDER one (same order as the list, newest first).
const neighbours = async (doc) => {
  const base = { businessId: doc.businessId };
  const [newer, older] = await Promise.all([
    CustomerResponse.findOne({
      ...base,
      $or: [{ submittedAt: { $gt: doc.submittedAt } }, { submittedAt: doc.submittedAt, _id: { $gt: doc._id } }],
    })
      .sort({ submittedAt: 1, _id: 1 })
      .select("_id")
      .lean(),
    CustomerResponse.findOne({
      ...base,
      $or: [{ submittedAt: { $lt: doc.submittedAt } }, { submittedAt: doc.submittedAt, _id: { $lt: doc._id } }],
    })
      .sort({ submittedAt: -1, _id: -1 })
      .select("_id")
      .lean(),
  ]);
  return { previousId: newer ? String(newer._id) : null, nextId: older ? String(older._id) : null };
};

// Shown above the text only when the survey had exactly one written question (otherwise it is ambiguous).
const questionOf = (doc) => {
  const written = (doc.answers || []).filter((a) => a.text);
  if (written.length !== 1) return null;
  const [a] = written;
  return (doc.language === "ar" && a.questionTextAr) || a.questionTextEn || a.questionTextAr || null;
};

const getById = async (user, id) => {
  const businessId = requireBusinessId(user);
  const doc = await findOwned(businessId, id);

  const [branches, surveys, navigation] = await Promise.all([
    namesById(Branch, [doc.branchId]),
    namesById(Survey, [doc.surveyId]),
    neighbours(doc),
  ]);

  const named = Boolean(doc.respondent?.name || doc.respondent?.email);

  return {
    id: String(doc._id),
    number: doc.number,
    displayId: `#${doc.number}`,
    submittedAt: doc.submittedAt,
    language: doc.language,
    declaredLanguage: doc.declaredLanguage || null,
    channel: doc.channel, // qr_code -> "In-store QR code", short_link -> "Link"
    branch: branches.get(String(doc.branchId)) || null,
    survey: surveys.get(String(doc.surveyId)) || null,
    respondent: { anonymous: !named, name: named ? doc.respondent.name || doc.respondent.email : null },
    original: { question: questionOf(doc), text: doc.feedbackText || "", hasText: Boolean(doc.feedbackText) },
    analysisStatus: doc.analysis?.status || "pending",
    navigation,
  };
};

// ---------- analysis (the screen polls this) ----------

const toAspect = (a) => ({
  name: a.name,
  term: a.term || null,
  quote: a.evidence,
  polarity: a.polarity,
  score: a.score ?? null,
  confidence: a.confidence ?? null,
});

const getAnalysis = async (user, id) => {
  const businessId = requireBusinessId(user);
  const doc = await findOwned(businessId, id);
  const a = doc.analysis || {};
  const status = a.status || "pending";
  const aspects = (a.aspects || []).map(toAspect);
  const canRetryRole = ["owner", "manager"].includes(user.role);

  return {
    status,
    isFinal: FINAL.has(status),
    canRetry: canRetryRole && Boolean(doc.feedbackText) && (status === "failed" || status === "partial"),
    sentiment: a.overallSentiment || null,
    reason: a.reason || null, // "insufficient_evidence": the AI found no clear aspect, show "-" not Neutral
    // Not available until the AI team approves a summary provider. Hide the sentence or show a placeholder.
    summary: a.summary || null,
    summaryAvailable: Boolean(a.summary),
    aspects,
    aspectCount: aspects.length,
    // Built from the aspects, not written by the AI: each line is a real quote from the customer.
    highlights: {
      wentWell: aspects.filter((x) => x.polarity === "positive").map((x) => ({ aspect: x.name, quote: x.quote })),
      roomToImprove: aspects.filter((x) => x.polarity === "negative").map((x) => ({ aspect: x.name, quote: x.quote })),
    },
    droppedAspects: a.droppedAspects || 0,
    error: status === "failed" ? { code: a.errorCode || "INTERNAL", message: a.errorMessage || safeMessage("INTERNAL") } : null,
    provenance: a.provenance ? { qualityStatus: a.provenance.qualityStatus, qualityAccepted: a.provenance.qualityAccepted === true } : null,
    completedAt: a.completedAt || null,
  };
};

// ---------- retry ----------

const retry = async (user, id) => {
  const businessId = requireBusinessId(user);

  const result = await CustomerResponse.updateOne(
    { _id: id, businessId: oid(businessId), "analysis.status": { $in: ["failed", "partial"] }, feedbackText: { $ne: "" } },
    {
      $set: { "analysis.status": "pending", "analysis.requestedAt": new Date() },
      $unset: {
        "analysis.startedAt": "",
        "analysis.completedAt": "",
        "analysis.errorCode": "",
        "analysis.errorMessage": "",
        "analysis.missingSections": "",
        "analysis.droppedAspects": "",
        "analysis.overallSentiment": "",
        "analysis.reason": "",
        "analysis.aspects": "",
        "analysis.provenance": "",
      },
    }
  );

  if (result.matchedCount === 0) {
    const doc = await findOwned(businessId, id); // 404 for another business's id
    throw fail(`This feedback can't be retried (status: ${doc.analysis?.status || "pending"})`, 409);
  }
  worker.kick();
  return { status: "pending" };
};

// ---------- CSV export ----------

const SENTIMENT_LABEL = { positive: "Positive", negative: "Negative", neutral: "Neutral", mixed: "Mixed" };

const exportCsv = async (user, q) => {
  const businessId = requireBusinessId(user);
  const rows = await CustomerResponse.find(buildFilter(businessId, q)).sort(sortOf(q.sort)).limit(EXPORT_LIMIT).lean();

  const [branches, surveys] = await Promise.all([
    namesById(Branch, unique(rows.map((r) => String(r.branchId)))),
    namesById(Survey, unique(rows.map((r) => String(r.surveyId)))),
  ]);

  const header = ["Number", "Date (UTC)", "Branch", "Survey", "Language", "Source", "Sentiment", "Aspects", "Feedback"];
  const body = rows.map((r) => [
    r.number,
    r.submittedAt.toISOString(),
    branches.get(String(r.branchId))?.name || "",
    surveys.get(String(r.surveyId))?.name || "",
    r.language,
    r.channel === "qr_code" ? "QR code" : "Link",
    SENTIMENT_LABEL[r.analysis?.overallSentiment] || "",
    unique((r.analysis?.aspects || []).map((a) => a.name)).join("; "),
    r.feedbackText || "",
  ]);
  return toCsv(header, body);
};

module.exports = { buildFilter, list, getFilters, getById, getAnalysis, retry, exportCsv, preview, questionOf };
