const Survey = require("../models/survey.model");
const Question = require("../models/questions.model");
const QuestionOption = require("../models/questionOptions.model");
const Branch = require("../models/branch.model");
const Business = require("../models/business.model");
const { QUESTIONNAIRE_STATUS } = require("../models/enums");
const { getTemplates, getTemplate } = require("../data/surveyTemplates");
const { fail } = require("../utils/errors");
const { isChoiceType } = require("../utils/questionRules");
const { slugify, randomSuffix } = require("../utils/slug");
const surveyStats = require("./surveyStats.service");
const { loadQuestions, createQuestionsFromSpecs } = require("./question.service");
const { requireBusinessId, getOwnedSurvey, assertEditable, oid } = require("./surveyAccess");

const SORTS = {
  updated: { updatedAt: -1, _id: -1 },
  created: { createdAt: -1, _id: -1 },
  name: { name: 1, _id: 1 },
};

// What each status may become through PATCH /:id/status. draft -> live goes through /publish.
const TRANSITIONS = {
  draft: [],
  live: ["paused", "closed"],
  paused: ["live", "closed"],
  closed: [],
};

const toInt = (value, fallback, min, max) => {
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? fallback : Math.min(max, Math.max(min, n));
};

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* ---------- helpers ---------- */

// Filters shared by the list, the tab counts and the export. Status is added separately,
// because the tab counts (All / Live / Drafts...) ignore it.
const buildBaseFilter = (businessId, query = {}) => {
  const filter = { businessId: oid(businessId) };

  const search = typeof query.search === "string" ? query.search.trim() : "";
  if (search) filter.name = { $regex: escapeRegex(search), $options: "i" };

  if (query.branchId) filter.branchIds = oid(query.branchId);

  return filter;
};

const withStatus = (filter, status) =>
  status && status !== "all" ? { ...filter, status } : filter;

const loadBranchMap = async (businessId) => {
  const branches = await Branch.find({ businessId, status: "active" }).select("name").lean();
  return new Map(branches.map((b) => [String(b._id), b]));
};

// "All 3 branches" when the survey covers every branch, otherwise the branch names.
const toBranchSummary = (branchIds, branchMap) => {
  const items = branchIds
    .map((id) => branchMap.get(String(id)))
    .filter(Boolean)
    .map((b) => ({ id: b._id, name: b.name }));

  return { all: branchMap.size > 0 && items.length === branchMap.size, total: branchMap.size, items };
};

const questionCountsFor = async (surveyIds) => {
  const rows = await Question.aggregate([
    { $match: { surveyId: { $in: surveyIds } } },
    { $group: { _id: "$surveyId", count: { $sum: 1 } } },
  ]);
  return new Map(rows.map((r) => [String(r._id), r.count]));
};

const toListItem = (s, { questionCounts, responseCounts, branchMap }) => ({
  id: s._id,
  name: s.name,
  status: s.status,
  languages: s.languages,
  questionCount: questionCounts.get(String(s._id)) || 0,
  responseCount: responseCounts.get(String(s._id)) || 0,
  branches: toBranchSummary(s.branchIds || [], branchMap),
  shortCode: s.shortCode,
  createdAt: s.createdAt,
  updatedAt: s.updatedAt,
});

// Unique over all businesses because it is the public link: "<business-slug>-a1b2c3".
const generateShortCode = async (businessSlug) => {
  const base = slugify(businessSlug) || "survey";
  for (let i = 0; i < 5; i++) {
    const candidate = `${base}-${randomSuffix()}`;
    if (!(await Survey.exists({ shortCode: candidate }))) return candidate;
  }
  throw fail("Could not create a survey link, please try again", 500);
};

// No branchIds sent = every branch of the business.
const resolveBranchIds = async (businessId, branchIds) => {
  if (branchIds === undefined) {
    const all = await Branch.find({ businessId, status: "active" }).select("_id").lean();
    return all.map((b) => b._id);
  }

  const unique = [...new Set(branchIds.map(String))];
  const found = await Branch.countDocuments({ _id: { $in: unique }, businessId, status: "active" });
  if (found !== unique.length) throw fail("One or more branches don't exist or are archived", 400);
  return unique;
};

const resolveLanguages = (languages, defaultLanguage) => {
  const list = [...new Set(languages)];
  if (defaultLanguage && !list.includes(defaultLanguage)) {
    throw fail("The default language must be one of the survey languages", 400);
  }
  return { languages: list, defaultLanguage: defaultLanguage || list[0] };
};

const fillBusinessName = (spec, businessName) => ({
  ...spec,
  questionTextEn: spec.questionTextEn?.replaceAll("{{businessName}}", businessName),
  questionTextAr: spec.questionTextAr?.replaceAll("{{businessName}}", businessName),
});

/* ---------- full survey (builder / edit screens) ---------- */

const buildSurveyDetail = async (businessId, survey) => {
  const [questions, branchMap, responseCounts] = await Promise.all([
    loadQuestions(survey._id),
    loadBranchMap(businessId),
    surveyStats.getResponseCounts([survey._id]),
  ]);

  return {
    id: survey._id,
    name: survey.name,
    message: survey.message || "",
    thankYouMessage: survey.thankYouMessage || "",
    status: survey.status,
    isAnonymous: survey.isAnonymous,
    languages: survey.languages,
    defaultLanguage: survey.defaultLanguage,
    branches: toBranchSummary(survey.branchIds || [], branchMap),
    creationMethod: survey.creationMethod,
    shortCode: survey.shortCode,
    publishedAt: survey.publishedAt || null,
    createdAt: survey.createdAt,
    updatedAt: survey.updatedAt,
    responseCount: responseCounts.get(String(survey._id)) || 0,
    questions,
  };
};

/* ---------- Manage surveys screen ---------- */

const getSummary = async (user) => {
  const businessId = requireBusinessId(user);
  const match = { businessId: oid(businessId) };

  const [totalSurveys, liveSurveys, branchCount, monthly] = await Promise.all([
    Survey.countDocuments(match),
    Survey.countDocuments({ ...match, status: "live" }),
    Branch.countDocuments({ businessId, status: "active" }),
    surveyStats.getMonthlyStats(businessId),
  ]);

  return { totalSurveys, liveSurveys, branchCount, ...monthly };
};

const list = async (user, query = {}) => {
  const businessId = requireBusinessId(user);
  const base = buildBaseFilter(businessId, query);
  const filter = withStatus(base, QUESTIONNAIRE_STATUS.includes(query.status) ? query.status : "all");

  const page = toInt(query.page, 1, 1, 100000);
  const limit = toInt(query.limit, 10, 1, 50);
  const sort = SORTS[query.sort] || SORTS.updated;

  const [total, surveys, statusRows, branchMap] = await Promise.all([
    Survey.countDocuments(filter),
    Survey.find(filter).sort(sort).collation({ locale: "en", strength: 2 }).skip((page - 1) * limit).limit(limit).lean(),
    Survey.aggregate([{ $match: base }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
    loadBranchMap(businessId),
  ]);

  const ids = surveys.map((s) => s._id);
  const [questionCounts, responseCounts] = await Promise.all([
    questionCountsFor(ids),
    surveyStats.getResponseCounts(ids),
  ]);

  const counts = { all: 0, draft: 0, live: 0, paused: 0, closed: 0 };
  statusRows.forEach((r) => {
    counts[r._id] = r.count;
    counts.all += r.count;
  });

  return {
    surveys: surveys.map((s) => toListItem(s, { questionCounts, responseCounts, branchMap })),
    counts,
    pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
  };
};

const csvCell = (value) => {
  let text = value == null ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`; // stops spreadsheet formula injection
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

// Same filters as the list, but every match (up to 5000) and as CSV.
const exportCsv = async (user, query = {}) => {
  const businessId = requireBusinessId(user);
  const filter = withStatus(
    buildBaseFilter(businessId, query),
    QUESTIONNAIRE_STATUS.includes(query.status) ? query.status : "all"
  );
  const sort = SORTS[query.sort] || SORTS.updated;

  const surveys = await Survey.find(filter).sort(sort).limit(5000).lean();
  const ids = surveys.map((s) => s._id);
  const [questionCounts, responseCounts, branchMap] = await Promise.all([
    questionCountsFor(ids),
    surveyStats.getResponseCounts(ids),
    loadBranchMap(businessId),
  ]);

  const header = ["Survey", "Status", "Branches", "Questions", "Languages", "Responses", "Created", "Last updated"];
  const rows = surveys.map((s) => {
    const branches = toBranchSummary(s.branchIds || [], branchMap);
    return [
      s.name,
      s.status,
      branches.all ? `All ${branches.total} branches` : branches.items.map((b) => b.name).join("; "),
      questionCounts.get(String(s._id)) || 0,
      s.languages.join("; "),
      responseCounts.get(String(s._id)) || 0,
      s.createdAt.toISOString(),
      s.updatedAt.toISOString(),
    ];
  });

  // BOM so Excel opens Arabic text correctly.
  return "\uFEFF" + [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
};

const remove = async (user, surveyId) => {
  const businessId = requireBusinessId(user);
  const survey = await getOwnedSurvey(businessId, surveyId);

  if (survey.status === "live") throw fail("Pause or close the survey before deleting it", 409);
  if (await surveyStats.hasResponses(survey._id)) {
    throw fail("This survey has responses and can't be deleted. Close it instead.", 409);
  }

  const questions = await Question.find({ surveyId: survey._id }).select("_id").lean();
  await QuestionOption.deleteMany({ questionId: { $in: questions.map((q) => q._id) } });
  await Question.deleteMany({ surveyId: survey._id });
  await survey.deleteOne();
};

const duplicate = async (user, surveyId) => {
  const businessId = requireBusinessId(user);
  const original = await getOwnedSurvey(businessId, surveyId);
  const business = await Business.findById(businessId).select("slug").lean();
  if (!business) throw fail("Business not found", 404);

  const copy = await Survey.create({
    businessId,
    name: `${original.name.slice(0, 192)} (copy)`,
    message: original.message,
    thankYouMessage: original.thankYouMessage,
    status: "draft",
    isAnonymous: original.isAnonymous,
    languages: original.languages,
    defaultLanguage: original.defaultLanguage,
    branchIds: original.branchIds,
    creationMethod: "manual",
    shortCode: await generateShortCode(business.slug),
    createdBy: user.id,
  });

  try {
    const questions = await loadQuestions(original._id);
    await createQuestionsFromSpecs(copy._id, questions);
  } catch (error) {
    await Survey.deleteOne({ _id: copy._id }); // don't leave an empty copy behind
    throw error;
  }

  return buildSurveyDetail(businessId, copy);
};

/* ---------- Create / edit survey screens ---------- */

const listTemplates = () =>
  getTemplates().map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    questionCount: t.questions.length,
    estimatedMinutes: t.estimatedMinutes,
  }));

const create = async (user, body) => {
  const businessId = requireBusinessId(user);
  const business = await Business.findById(businessId).select("name slug").lean();
  if (!business) throw fail("Business not found", 404);

  const template = body.templateId ? getTemplate(body.templateId) : null;
  if (body.templateId && !template) throw fail("Template not found", 404);

  const { languages, defaultLanguage } = resolveLanguages(body.languages || ["en"], body.defaultLanguage);
  const branchIds = await resolveBranchIds(businessId, body.branchIds);

  const survey = await Survey.create({
    businessId,
    name: body.name,
    message: body.message,
    thankYouMessage: body.thankYouMessage,
    isAnonymous: body.isAnonymous === undefined ? true : body.isAnonymous,
    languages,
    defaultLanguage,
    branchIds,
    creationMethod: template ? "template" : "manual",
    templateKey: template?.id,
    shortCode: await generateShortCode(business.slug),
    createdBy: user.id,
  });

  if (template) {
    try {
      await createQuestionsFromSpecs(
        survey._id,
        template.questions.map((q) => fillBusinessName(q, business.name))
      );
    } catch (error) {
      await Survey.deleteOne({ _id: survey._id });
      throw error;
    }
  }

  return buildSurveyDetail(businessId, survey);
};

const getById = async (user, surveyId) => {
  const businessId = requireBusinessId(user);
  const survey = await getOwnedSurvey(businessId, surveyId);
  return buildSurveyDetail(businessId, survey);
};

const update = async (user, surveyId, body) => {
  const businessId = requireBusinessId(user);
  const survey = await getOwnedSurvey(businessId, surveyId);
  assertEditable(survey);

  ["name", "message", "thankYouMessage"].forEach((field) => {
    if (body[field] !== undefined) survey[field] = body[field] === null ? "" : body[field];
  });
  if (body.isAnonymous !== undefined) survey.isAnonymous = body.isAnonymous;

  if (body.languages !== undefined || body.defaultLanguage !== undefined) {
    const languages = body.languages || survey.languages;
    // Keep the current default if it is still valid, otherwise resolveLanguages picks the first language.
    const requested = body.defaultLanguage || (languages.includes(survey.defaultLanguage) ? survey.defaultLanguage : undefined);
    const resolved = resolveLanguages(languages, requested);
    survey.languages = resolved.languages;
    survey.defaultLanguage = resolved.defaultLanguage;
  }

  if (body.branchIds !== undefined) survey.branchIds = await resolveBranchIds(businessId, body.branchIds);

  await survey.save();
  return buildSurveyDetail(businessId, survey);
};

const updateStatus = async (user, surveyId, status) => {
  const businessId = requireBusinessId(user);
  const survey = await getOwnedSurvey(businessId, surveyId);

  if (survey.status === status) return { id: survey._id, status: survey.status, updatedAt: survey.updatedAt };

  if (survey.status === "draft") throw fail("Publish the survey to make it live", 409);
  if (!TRANSITIONS[survey.status].includes(status)) {
    throw fail(`A ${survey.status} survey can't be changed to ${status}`, 409);
  }

  survey.status = status;
  await survey.save();
  return { id: survey._id, status: survey.status, updatedAt: survey.updatedAt };
};

// A survey is ready when it has branches and questions, and everything the customer will read
// is filled in for every selected language.
const findPublishProblems = (survey, questions, activeBranchCount) => {
  const problems = [];
  const langName = { en: "English", ar: "Arabic" };

  if (activeBranchCount === 0) problems.push({ field: "branchIds", message: "Choose at least one branch" });
  if (!questions.length) problems.push({ field: "questions", message: "Add at least one question" });

  questions.forEach((q, i) => {
    const n = i + 1;

    survey.languages.forEach((lang) => {
      const text = lang === "en" ? q.questionTextEn : q.questionTextAr;
      if (!text.trim()) {
        problems.push({ field: `questions[${i}].questionText`, message: `Question ${n} needs ${langName[lang]} text` });
      }
    });

    if (isChoiceType(q.type)) {
      if (q.options.length < 2) {
        problems.push({ field: `questions[${i}].options`, message: `Question ${n} needs at least 2 options` });
      }
      survey.languages.forEach((lang) => {
        if (q.options.some((o) => !o.label[lang].trim())) {
          problems.push({
            field: `questions[${i}].options`,
            message: `Question ${n} has an option without ${langName[lang]} text`,
          });
        }
      });
    }
  });

  return problems;
};

const publish = async (user, surveyId) => {
  const businessId = requireBusinessId(user);
  const survey = await getOwnedSurvey(businessId, surveyId);

  if (survey.status === "live") return buildSurveyDetail(businessId, survey); // already live: nothing to do
  if (survey.status !== "draft") throw fail(`This survey is ${survey.status}. Change its status instead.`, 409);

  const questions = await loadQuestions(survey._id);
  const activeBranchCount = await Branch.countDocuments({ _id: { $in: survey.branchIds }, businessId, status: "active" });
  const problems = findPublishProblems(survey, questions, activeBranchCount);
  if (problems.length) throw fail("The survey isn't ready to publish yet", 422, problems);

  survey.status = "live";
  survey.publishedAt = new Date();
  await survey.save();
  return buildSurveyDetail(businessId, survey);
};


module.exports = {
  getSummary,
  list,
  exportCsv,
  remove,
  duplicate,
  listTemplates,
  create,
  getById,
  update,
  updateStatus,
  publish
};