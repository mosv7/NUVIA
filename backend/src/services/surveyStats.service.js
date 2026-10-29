// Everything the survey and branch screens need from customer RESPONSES lives here.
// The other services (and the screens) already call these functions.
//
// Still placeholders, because they need data we don't record yet:
//   - getShareStats.qrScans / linkVisits   -> needs a "survey opened" event on the public GET
//   - getMonthlyStats.completionRate        -> needs "started" vs "submitted" events
//   - getBranchHistory.speedScore           -> needs a decision on which aspect means "speed"

const CustomerResponse = require("../models/customerResponse.model");
const Branch = require("../models/branch.model");
const { oid } = require("./surveyAccess");

const countsBy = async (field, ids) => {
  const counts = new Map();
  ids.forEach((id) => counts.set(String(id), 0));
  if (ids.length === 0) return counts;

  const rows = await CustomerResponse.aggregate([
    { $match: { [field]: { $in: ids.map(oid) } } },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
  ]);
  rows.forEach((r) => counts.set(String(r._id), r.count));
  return counts;
};

// Map of surveyId -> number of responses.
const getResponseCounts = (surveyIds) => countsBy("surveyId", surveyIds);

// True when customers already answered this survey. Used to protect data in live surveys
// (a question with answers cannot be deleted or change type).
const hasResponses = async (surveyId) => Boolean(await CustomerResponse.exists({ surveyId }));

const monthStart = (offset = 0) => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + offset, 1));
};

// Cards on top of "Manage surveys". null = not enough data to compare (shown as "-").
const getMonthlyStats = async (businessId) => {
  const [current, previous] = await Promise.all([
    CustomerResponse.countDocuments({ businessId, submittedAt: { $gte: monthStart(0) } }),
    CustomerResponse.countDocuments({ businessId, submittedAt: { $gte: monthStart(-1), $lt: monthStart(0) } }),
  ]);

  return {
    responsesThisMonth: {
      value: current,
      changePercent: previous > 0 ? Math.round(((current - previous) / previous) * 1000) / 10 : null,
    },
    completionRate: { value: 0, changePoints: null }, // see note at the top
  };
};

// "Know which branch the feedback is for" + the two numbers at the bottom of Share.
const getShareStats = async (surveyId) => ({
  qrScans: 0,
  linkVisits: 0,
  total: await CustomerResponse.countDocuments({ surveyId }),
});

// ---- Business > Branches screens ----

// Map of branchId -> number of responses collected at that branch.
const getBranchResponseCounts = (branchIds) => countsBy("branchId", branchIds);

// Cards on top of the Branches page. `byArchivedBranches` is what "Archived responses" shows.
const getResponseTotals = async (businessId) => {
  const archived = await Branch.find({ businessId, status: "archived" }).select("_id").lean();
  const [total, byArchivedBranches] = await Promise.all([
    CustomerResponse.countDocuments({ businessId }),
    archived.length ? CustomerResponse.countDocuments({ businessId, branchId: { $in: archived.map((b) => b._id) } }) : 0,
  ]);
  return { total, byActiveBranches: total - byArchivedBranches, byArchivedBranches };
};

// "Archived branch details" page: historical numbers for one branch.
// Scores are out of 10, sentiment is a percentage. null = no data yet.
const getBranchHistory = async (branchId) => {
  const match = { branchId: oid(branchId) };
  const since = new Date(Date.now() - 12 * 7 * 24 * 3600 * 1000);

  const [earlierResponses, sentiment, aspects, weekly] = await Promise.all([
    CustomerResponse.countDocuments(match),
    CustomerResponse.aggregate([
      { $match: { ...match, "analysis.overallSentiment": { $exists: true } } },
      { $group: { _id: null, analysed: { $sum: 1 }, positive: { $sum: { $cond: [{ $eq: ["$analysis.overallSentiment", "positive"] }, 1, 0] } } } },
    ]),
    CustomerResponse.aggregate([
      { $match: match },
      { $unwind: "$analysis.aspects" },
      { $match: { "analysis.aspects.score": { $ne: null } } },
      { $group: { _id: "$analysis.aspects.name", avg: { $avg: "$analysis.aspects.score" } } },
      { $sort: { _id: 1 } },
    ]),
    CustomerResponse.aggregate([
      { $match: { ...match, submittedAt: { $gte: since } } },
      { $group: { _id: { $dateTrunc: { date: "$submittedAt", unit: "week", startOfWeek: "monday" } }, responses: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
  ]);

  return {
    earlierResponses,
    positiveSentiment: sentiment[0] ? Math.round((sentiment[0].positive / sentiment[0].analysed) * 100) : null,
    speedScore: null,
    // -1..+1 from the AI mapped to 0..10
    aspectScores: aspects.map((a) => ({ aspect: a._id, score: Math.round((a.avg + 1) * 50) / 10 })),
    weeklyResponses: weekly.map((w) => ({ weekStart: w._id.toISOString().slice(0, 10), responses: w.responses })),
  };
};

module.exports = {
  getResponseCounts,
  hasResponses,
  getMonthlyStats,
  getShareStats,
  getBranchResponseCounts,
  getResponseTotals,
  getBranchHistory,
};
