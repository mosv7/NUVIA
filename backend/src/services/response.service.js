// A customer submits a survey (no login). Stores the response and queues the AI analysis.
// The customer only ever gets the thank-you message back: analysis happens afterwards, in the background.

const Survey = require("../models/survey.model");
const Branch = require("../models/branch.model");
const CustomerResponse = require("../models/customerResponse.model");
const Counter = require("../models/counter.model");
const { fail } = require("../utils/errors");
const { detectLanguage } = require("../utils/language");
const { loadQuestions } = require("./question.service");
const MAX_TEXT_TOTAL = 10000;

const requiredError = (question) => ({ field: `answers.${question.id}`, message: "This question is required" });
const invalid = (question, message) => ({ field: `answers.${question.id}`, message });

// Turns one submitted answer into what we store, or returns { error } / { skip: true } (left empty).
const normalizeAnswer = (q, input) => {
  const base = { questionId: q.id, type: q.type, questionTextEn: q.questionTextEn, questionTextAr: q.questionTextAr };

  switch (q.type) {
    case "short_text":
    case "long_text": {
      const text = typeof input.value === "string" ? input.value.trim() : "";
      if (input.value != null && typeof input.value !== "string") return { error: invalid(q, "Answer must be text") };
      if (!text) return { skip: true };
      const max = q.settings?.maxLength || (q.type === "short_text" ? 200 : 1000);
      if (text.length > max) return { error: invalid(q, `Answer is too long (max ${max} characters)`) };
      return { answer: { ...base, text } };
    }
    case "rating": {
      if (input.value == null) return { skip: true };
      const max = q.settings?.stars || 5;
      if (!Number.isInteger(input.value) || input.value < 1 || input.value > max) return { error: invalid(q, `Rating must be between 1 and ${max}`) };
      return { answer: { ...base, rating: input.value, ratingMax: max } };
    }
    case "yes_no": {
      if (input.value == null) return { skip: true };
      if (typeof input.value !== "boolean") return { error: invalid(q, "Answer must be yes or no") };
      return { answer: { ...base, yesNo: input.value } };
    }
    case "dropdown":
    case "multiple_choice": {
      const ids = Array.isArray(input.optionIds) ? [...new Set(input.optionIds.map(String))] : [];
      if (ids.length === 0) return { skip: true };
      const single = q.type === "dropdown" || !q.settings?.allowMultiple;
      if (single && ids.length > 1) return { error: invalid(q, "Choose only one option") };
      const chosen = ids.map((id) => q.options.find((o) => String(o.id) === id));
      if (chosen.some((o) => !o)) return { error: invalid(q, "Invalid option") };
      return { answer: { ...base, choices: chosen.map((o) => ({ optionId: o.id, label: o.label })) } };
    }
    default:
      return { error: invalid(q, "Unsupported question type") };
  }
};

const normalizeAnswers = (questions, submitted) => {
  const byId = new Map(questions.map((q) => [String(q.id), q]));
  const seen = new Set();
  const errors = [];
  const answers = [];

  for (const input of submitted) {
    const key = String(input.questionId);
    const q = byId.get(key);
    if (!q) { errors.push({ field: "answers", message: "Unknown question" }); continue; }
    if (seen.has(key)) { errors.push({ field: `answers.${key}`, message: "Question answered twice" }); continue; }
    seen.add(key);

    const result = normalizeAnswer(q, input);
    if (result.error) errors.push(result.error);
    else if (result.answer) answers.push(result.answer);
  }

  questions.forEach((q) => {
    if (q.isRequired && !answers.some((a) => String(a.questionId) === String(q.id)) && !errors.some((e) => e.field === `answers.${q.id}`)) {
      errors.push(requiredError(q));
    }
  });

  if (errors.length) throw fail("Please check your answers", 400, errors);

  // Stored in the order the questions are shown, whatever order the client sent.
  const order = new Map(questions.map((q, i) => [String(q.id), i]));
  answers.sort((a, b) => order.get(String(a.questionId)) - order.get(String(b.questionId)));
  return answers;
};

const resolveBranch = async (survey, branchSlug) => {
  const branches = await Branch.find({ _id: { $in: survey.branchIds }, businessId: survey.businessId }).lean();

  if (branchSlug) {
    const branch = branches.find((b) => b.slug === String(branchSlug).toLowerCase());
    if (!branch) throw fail("Survey not found", 404);
    if (branch.status !== "active") throw fail("This branch is no longer collecting feedback", 409);
    return branch;
  }

  const active = branches.filter((b) => b.status === "active");
  if (active.length === 1) return active[0];
  throw fail("Choose a branch", 400, [{ field: "branch", message: "Choose a branch" }]);
};

const submitResponse = async (shortCode, body) => {
  const survey = await Survey.findOne({ shortCode: String(shortCode).toLowerCase() }).lean();
  if (!survey || survey.status === "draft") throw fail("Survey not found", 404);
  if (survey.status !== "live") throw fail("This survey isn't accepting responses right now", 409);

  const thanks = { thankYouMessage: survey.thankYouMessage || "" };

  // Same form sent twice (double tap, retry on a bad connection): answer like the first time, store nothing new.
  if (body.submissionId) {
    const existing = await CustomerResponse.exists({ surveyId: survey._id, submissionId: body.submissionId });
    if (existing) return { ...thanks, duplicate: true };
  }

  const branch = await resolveBranch(survey, body.branch);
  const questions = await loadQuestions(survey._id);
  const answers = normalizeAnswers(questions, body.answers || []);
  if (answers.length === 0) throw fail("Answer at least one question", 400, [{ field: "answers", message: "Answer at least one question" }]);

  const feedbackText = answers.filter((a) => a.text).map((a) => a.text).join("\n\n");
  if (feedbackText.length > MAX_TEXT_TOTAL) throw fail("Your answers are too long", 400, [{ field: "answers", message: "Your answers are too long" }]);

  const declaredLanguage = survey.languages.includes(body.language) ? body.language : undefined;

  const doc = {
    businessId: survey.businessId,
    surveyId: survey._id,
    branchId: branch._id,
    number: await Counter.next(`feedback:${survey.businessId}`),
    channel: body.channel === "qr_code" ? "qr_code" : "short_link",
    answers,
    feedbackText,
    language: detectLanguage(feedbackText, declaredLanguage || survey.defaultLanguage),
    declaredLanguage,
    submissionId: body.submissionId,
    submittedAt: new Date(),
    // No written text = nothing for the AI to read.
    analysis: feedbackText ? { status: "pending", requestedAt: new Date() } : { status: "skipped" },
  };

  if (!survey.isAnonymous && body.respondent) {
    doc.respondent = { name: body.respondent.name, email: body.respondent.email };
  }

  let created;
  try {
    created = await CustomerResponse.create(doc);
  } catch (error) {
    if (error.code === 11000 && body.submissionId) return { ...thanks, duplicate: true }; // two identical submits at once
    throw error;
  }

  return thanks;
};

module.exports = { submitResponse };
