const Question = require("../models/questions.model");
const QuestionOption = require("../models/questionOptions.model");
const { fail } = require("../utils/errors");
const { isChoiceType, normalizeSettings } = require("../utils/questionRules");
const surveyStats = require("./surveyStats.service");
const { requireBusinessId, getOwnedSurvey, assertEditable, touchSurvey } = require("./surveyAccess");

const MAX_QUESTIONS = 50;

/* ---------- shape returned to the frontend ---------- */

const toOptionDTO = (o) => ({
  id: o._id,
  order: o.order,
  label: { en: o.label?.en || "", ar: o.label?.ar || "" },
});

const toQuestionDTO = (q, options = []) => ({
  id: q._id,
  order: q.order,
  type: q.type,
  isRequired: q.isRequired,
  questionTextEn: q.questionTextEn || "",
  questionTextAr: q.questionTextAr || "",
  settings: q.settings || {},
  options: options.map(toOptionDTO),
});

// All questions of a survey with their options, in display order.
const loadQuestions = async (surveyId) => {
  const questions = await Question.find({ surveyId: surveyId }).sort({ order: 1, _id: 1 }).lean();
  if (questions.length === 0) return [];

  const options = await QuestionOption.find({ questionId: { $in: questions.map((q) => q._id) } })
    .sort({ order: 1, _id: 1 })
    .lean();

  const byQuestion = new Map();
  options.forEach((o) => {
    const key = String(o.questionId);
    if (!byQuestion.has(key)) byQuestion.set(key, []);
    byQuestion.get(key).push(o);
  });

  return questions.map((q) => toQuestionDTO(q, byQuestion.get(String(q._id)) || []));
};

const loadQuestion = async (questionId) => {
  const question = await Question.findById(questionId).lean();
  const options = await QuestionOption.find({ questionId }).sort({ order: 1, _id: 1 }).lean();
  return toQuestionDTO(question, options);
};

/* ---------- options ---------- */

const cleanLabel = (label = {}) => ({
  en: typeof label.en === "string" ? label.en.trim() : "",
  ar: typeof label.ar === "string" ? label.ar.trim() : "",
});

// Makes the stored options equal to `incoming`, in that order.
//   { id, label }  -> existing option is updated (its id stays the same, so answers keep pointing to it)
//   { label }      -> new option
//   missing        -> deleted
const syncOptions = async (questionId, incoming) => {
  const existing = await QuestionOption.find({ questionId }).select("_id").lean();
  const existingIds = new Set(existing.map((o) => String(o._id)));
  const keep = new Set();
  const ops = [];

  incoming.forEach((opt, index) => {
    const label = cleanLabel(opt.label);

    if (opt.id && existingIds.has(String(opt.id))) {
      keep.add(String(opt.id));
      ops.push({ updateOne: { filter: { _id: opt.id, questionId }, update: { $set: { label, order: index } } } });
    } else {
      ops.push({ insertOne: { document: { questionId, label, order: index } } });
    }
  });

  const removed = [...existingIds].filter((id) => !keep.has(id));
  if (removed.length) ops.push({ deleteMany: { filter: { _id: { $in: removed } } } });

  if (ops.length) await QuestionOption.bulkWrite(ops);
};

/* ---------- bulk create (templates, duplicate survey) ---------- */

// specs: [{ type, isRequired, questionTextEn, questionTextAr, settings, options: [{ label }] }]
const createQuestionsFromSpecs = async (surveyId, specs) => {
  if (specs.length === 0) return;

  const questions = await Question.insertMany(
    specs.map((spec, index) => ({
      surveyId: surveyId,
      type: spec.type,
      isRequired: spec.isRequired === true,
      questionTextEn: spec.questionTextEn || "",
      questionTextAr: spec.questionTextAr || "",
      settings: normalizeSettings(spec.type, spec.settings),
      order: index,
    }))
  );

  const optionDocs = [];
  questions.forEach((question, i) => {
    if (!isChoiceType(question.type)) return;
    (specs[i].options || []).forEach((opt, order) => {
      optionDocs.push({ questionId: question._id, label: cleanLabel(opt.label), order });
    });
  });

  if (optionDocs.length) await QuestionOption.insertMany(optionDocs);
};

/* ---------- endpoints ---------- */

const addQuestion = async (user, surveyId, body) => {
  const businessId = requireBusinessId(user);
  const survey = await getOwnedSurvey(businessId, surveyId);
  assertEditable(survey);

  const count = await Question.countDocuments({ surveyId: survey._id });
  if (count >= MAX_QUESTIONS) throw fail(`A survey can have at most ${MAX_QUESTIONS} questions`, 409);

  const last = await Question.findOne({ surveyId: survey._id }).sort({ order: -1 }).select("order").lean();

  const question = await Question.create({
    surveyId: survey._id,
    type: body.type,
    isRequired: body.isRequired === true,
    questionTextEn: body.questionTextEn,
    questionTextAr: body.questionTextAr,
    settings: normalizeSettings(body.type, body.settings),
    order: last ? last.order + 1 : 0,
  });

  if (isChoiceType(question.type) && Array.isArray(body.options)) {
    await syncOptions(question._id, body.options);
  }

  await touchSurvey(survey._id);
  return loadQuestion(question._id);
};

const updateQuestion = async (user, surveyId, questionId, body) => {
  const businessId = requireBusinessId(user);
  const survey = await getOwnedSurvey(businessId, surveyId);
  assertEditable(survey);

  const question = await Question.findOne({ _id: questionId, surveyId: survey._id });
  if (!question) throw fail("Question not found", 404);

  if (body.type !== undefined && body.type !== question.type) {
    if (await surveyStats.hasResponses(survey._id)) {
      throw fail("This question already has answers, so its type can't be changed", 409);
    }
    question.type = body.type;
    question.settings = normalizeSettings(body.type, body.settings); // fresh settings for the new type
    if (!isChoiceType(body.type)) await QuestionOption.deleteMany({ questionId: question._id });
  } else if (body.settings !== undefined) {
    question.settings = normalizeSettings(question.type, body.settings);
  }

  if (body.questionTextEn !== undefined) question.questionTextEn = body.questionTextEn;
  if (body.questionTextAr !== undefined) question.questionTextAr = body.questionTextAr;
  if (body.isRequired !== undefined) question.isRequired = body.isRequired;
  question.markModified("settings");
  await question.save();

  if (isChoiceType(question.type) && Array.isArray(body.options)) {
    await syncOptions(question._id, body.options);
  }

  await touchSurvey(survey._id);
  return loadQuestion(question._id);
};

const deleteQuestion = async (user, surveyId, questionId) => {
  const businessId = requireBusinessId(user);
  const survey = await getOwnedSurvey(businessId, surveyId);
  assertEditable(survey);

  const question = await Question.findOne({ _id: questionId, surveyId: survey._id });
  if (!question) throw fail("Question not found", 404);

  if (await surveyStats.hasResponses(survey._id)) {
    throw fail("This survey already has responses, so its questions can't be deleted", 409);
  }

  await QuestionOption.deleteMany({ questionId: question._id });
  await question.deleteOne();
  await touchSurvey(survey._id);
};

// The copy goes right after the original.
const duplicateQuestion = async (user, surveyId, questionId) => {
  const businessId = requireBusinessId(user);
  const survey = await getOwnedSurvey(businessId, surveyId);
  assertEditable(survey);

  const original = await Question.findOne({ _id: questionId, surveyId: survey._id }).lean();
  if (!original) throw fail("Question not found", 404);

  const count = await Question.countDocuments({ surveyId: survey._id });
  if (count >= MAX_QUESTIONS) throw fail(`A survey can have at most ${MAX_QUESTIONS} questions`, 409);

  await Question.updateMany(
    { surveyId: survey._id, order: { $gt: original.order } },
    { $inc: { order: 1 } }
  );

  const copy = await Question.create({
    surveyId: survey._id,
    type: original.type,
    isRequired: original.isRequired,
    questionTextEn: original.questionTextEn,
    questionTextAr: original.questionTextAr,
    settings: original.settings,
    order: original.order + 1,
  });

  const options = await QuestionOption.find({ questionId: original._id }).sort({ order: 1, _id: 1 }).lean();
  if (options.length) {
    await QuestionOption.insertMany(
      options.map((o, order) => ({ questionId: copy._id, label: o.label, order }))
    );
  }

  await touchSurvey(survey._id);
  return loadQuestion(copy._id);
};

// orderedIds must list every question of the survey exactly once.
const reorderQuestions = async (user, surveyId, orderedIds) => {
  const businessId = requireBusinessId(user);
  const survey = await getOwnedSurvey(businessId, surveyId);
  assertEditable(survey);

  const existing = await Question.find({ surveyId: survey._id }).select("_id").lean();
  const existingIds = new Set(existing.map((q) => String(q._id)));
  const incoming = orderedIds.map(String);

  const sameSet =
    incoming.length === existingIds.size &&
    new Set(incoming).size === incoming.length &&
    incoming.every((id) => existingIds.has(id));

  if (!sameSet) throw fail("orderedIds must contain every question of this survey exactly once", 400);

  await Question.bulkWrite(
    incoming.map((id, index) => ({ updateOne: { filter: { _id: id }, update: { $set: { order: index } } } }))
  );

  await touchSurvey(survey._id);
  return loadQuestions(survey._id);
};

module.exports = {
  loadQuestions,
  createQuestionsFromSpecs,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  duplicateQuestion,
  reorderQuestions,
};
