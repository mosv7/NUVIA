// Everything the survey screens need from customer RESPONSES lives here.
// CustomerResponse is not built yet, so these return zeros with the final shape.
// When responses exist, only this file changes: the survey, question and share services
// (and the screens) already use these functions.

// Map of surveyId -> number of responses.
const getResponseCounts = async (surveyIds) => {
  const counts = new Map();
  surveyIds.forEach((id) => counts.set(String(id), 0));
  return counts;
};

// True when customers already answered this survey. Used to protect data in live surveys
// (a question with answers cannot be deleted or change type).
const hasResponses = async (surveyId) => false; // eslint-disable-line no-unused-vars

// Cards on top of "Manage surveys". null = not enough data to compare (shown as "-").
const getMonthlyStats = async (businessId) => ({ // eslint-disable-line no-unused-vars
  responsesThisMonth: { value: 0, changePercent: null },
  completionRate: { value: 0, changePoints: null },
});

// "Know which branch the feedback is for" + the two numbers at the bottom of Share.
const getShareStats = async (surveyId) => ({ // eslint-disable-line no-unused-vars
  qrScans: 0,
  linkVisits: 0,
  total: 0,
});

// ---- Business > Branches screens ----

// Map of branchId -> number of responses collected at that branch.
const getBranchResponseCounts = async (branchIds) => {
  const counts = new Map();
  branchIds.forEach((id) => counts.set(String(id), 0));
  return counts;
};

// Cards on top of the Branches page. `byArchivedBranches` is what "Archived responses" shows.
const getResponseTotals = async (businessId) => ({ // eslint-disable-line no-unused-vars
  total: 0,
  byActiveBranches: 0,
  byArchivedBranches: 0,
});

// "Archived branch details" page: historical numbers for one branch.
// Scores are out of 10, sentiment is a percentage. null = no data yet.
const getBranchHistory = async (branchId) => ({ // eslint-disable-line no-unused-vars
  earlierResponses: 0,
  positiveSentiment: null,
  speedScore: null,
  aspectScores: [], // [{ aspect: "Service", score: 8.3 }, ...]
  weeklyResponses: [], // [{ weekStart: "2026-09-14", responses: 40 }, ...]
});

module.exports = {
  getResponseCounts,
  hasResponses,
  getMonthlyStats,
  getShareStats,
  getBranchResponseCounts,
  getResponseTotals,
  getBranchHistory,
};
