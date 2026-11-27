const { randomUUID } = require('node:crypto');

const Branch = require('../models/branch.model');
const CustomerResponse = require('../models/customerResponse.model');
const Report = require('../models/report.model');
const Survey = require('../models/survey.model');
const { AiError, readConfig } = require('../integrations/ai-service/client');
const { generate: generateAIReport } = require('../integrations/ai-service/reports');
const { requireBusinessId, oid } = require('./surveyAccess');
const { fail } = require('../utils/errors');

const MAX_TEXT_LENGTH = 2000;
const MAX_TEXTS_PER_REQUEST = 10;
const MAX_SURVEYS = 100;
const MAX_RESPONSES = 100;
const MAX_BATCHES = 10;
const DAY_MS = 24 * 60 * 60 * 1000;
const REPORT_LIST_FIELDS =
  'reportName periodCovered period branchesCovered language createdAt totalReviewsAnalyzed qualityStatus qualityAccepted';
const REPORT_DETAIL_FIELDS =
  REPORT_LIST_FIELDS +
  ' totalReviewsAnalyzed analyzedTextCount executiveSummary strengths problems suggestedActions evidenceBatches updatedAt';

const checkCancellation = (signal) => {
  if (signal?.aborted) throw new AiError('AI_CANCELLED', 499);
};

function splitFeedback(response) {
  const characters = [...response.feedbackText.trim()];
  const chunks = [];
  for (let start = 0; start < characters.length; start += MAX_TEXT_LENGTH) {
    const text = characters
      .slice(start, start + MAX_TEXT_LENGTH)
      .join('')
      .trim();
    if (text) chunks.push(text);
  }
  return chunks.map((text, index) => {
    const id = `${response._id}_${index}`;
    return {
      text: { id, text },
      source: {
        evidenceId: id,
        feedbackId: String(response._id),
        displayId: `#${response.number}`,
        submittedAt: response.submittedAt,
        segment: index + 1,
        segmentCount: chunks.length,
      },
    };
  });
}

async function collect(user, input, { signal, preferredLanguage } = {}) {
  const businessId = oid(requireBusinessId(user));
  const surveys = await Survey.find({ businessId, createdBy: user.id })
    .select('_id name')
    .sort({ createdAt: 1, _id: 1 })
    .limit(MAX_SURVEYS + 1)
    .lean();
  if (!surveys.length) throw fail('Create a survey before generating a report', 409);
  if (surveys.length > MAX_SURVEYS) throw fail('Too many surveys to generate a report', 422);

  const filter = {
    businessId,
    surveyId: { $in: surveys.map((survey) => survey._id) },
    feedbackText: { $type: 'string', $regex: /\S/u },
  };
  if (input.from) {
    filter.submittedAt = {
      $gte: new Date(`${input.from}T00:00:00.000Z`),
      $lt: new Date(Date.parse(`${input.to}T00:00:00.000Z`) + DAY_MS),
    };
  }
  const selected = await CustomerResponse.find(filter)
    .select('_id surveyId branchId formSnapshot.branch number feedbackText submittedAt')
    .sort({ submittedAt: -1, _id: -1 })
    .limit(MAX_RESPONSES + 1)
    .lean();
  if (selected.length > MAX_RESPONSES)
    throw fail('Too much feedback for one report. Choose a shorter date range.', 422);

  const responses = selected.filter((response) => response.feedbackText.trim());
  if (!responses.length) throw fail('No written feedback found for the selected period', 422);
  checkCancellation(signal);

  const bySurvey = new Map(surveys.map((survey) => [String(survey._id), []]));
  for (const response of responses) bySurvey.get(String(response.surveyId)).push(response);

  const skippedSurveys = [];
  const planned = [];
  let batchCount = 0;
  for (const survey of surveys) {
    const id = String(survey._id);
    const rows = bySurvey.get(id);
    if (!rows.length) {
      skippedSurveys.push({ id, name: survey.name, reason: 'no_feedback' });
      continue;
    }
    const entries = rows.flatMap(splitFeedback);
    batchCount += Math.ceil(entries.length / MAX_TEXTS_PER_REQUEST);
    if (batchCount > MAX_BATCHES)
      throw fail('Too much feedback for one report. Choose a shorter date range.', 422);
    planned.push({ survey: { id, name: survey.name }, responseCount: rows.length, entries });
  }

  const config = readConfig();
  if (!config) throw new AiError('AI_NOT_CONFIGURED');
  const locale = input.locale || (preferredLanguage === 'ar' ? 'ar' : 'en');
  const reports = [];
  for (const { survey, responseCount, entries } of planned) {
    const batches = [];
    for (let index = 0; index < entries.length; index += MAX_TEXTS_PER_REQUEST) {
      checkCancellation(signal);
      const batch = entries.slice(index, index + MAX_TEXTS_PER_REQUEST);
      const payload = { texts: batch.map((entry) => entry.text), locale };
      if (input.objective) payload.objective = input.objective.trim();
      const reply = await generateAIReport(payload, { config, signal, requestId: randomUUID() });
      batches.push({
        requestId: reply.request_id,
        provenance: reply.provenance,
        report: reply.result,
        sources: batch.map((entry) => entry.source),
      });
    }
    reports.push({ survey, responseCount, analyzedTextCount: entries.length, batches });
  }
  checkCancellation(signal);

  const period = {
    from: input.from || responses.at(-1).submittedAt.toISOString().slice(0, 10),
    to: input.to || responses[0].submittedAt.toISOString().slice(0, 10),
  };
  return { businessId, locale, period, reports, responses, skippedSurveys };
}

async function generate(user, input, options) {
  const { period, reports, skippedSurveys } = await collect(user, input, options);
  return { period, surveyCount: reports.length, reports, skippedSurveys };
}

async function generateSaved(user, input, options) {
  const { businessId, locale, period, reports, responses } = await collect(user, input, options);
  const snapshotNames = new Map();
  for (const response of responses) {
    const branchId = String(response.branchId);
    const snapshot = response.formSnapshot?.branch;
    if (snapshot?.id === branchId && typeof snapshot.name === 'string' && snapshot.name.trim()) {
      snapshotNames.set(String(response._id), snapshot.name);
    }
  }
  const missingBranchIds = responses
    .filter((response) => !snapshotNames.has(String(response._id)))
    .map((response) => String(response.branchId));
  const branches = await Branch.find({ businessId, _id: { $in: [...new Set(missingBranchIds)] } })
    .select('name')
    .lean();
  const currentNames = new Map(branches.map((branch) => [String(branch._id), branch.name]));
  const branchesCovered = [
    ...new Set(
      responses
        .map(
          (response) =>
            snapshotNames.get(String(response._id)) || currentNames.get(String(response.branchId)),
        )
        .filter(Boolean),
    ),
  ];

  const strengths = [];
  const problems = [];
  const suggestedActions = [];
  const evidenceBatches = [];
  const feedbackById = new Map(responses.map((row) => [String(row._id), row]));
  for (const { survey, batches } of reports) {
    for (const { requestId, provenance, report, sources } of batches) {
      const sourceById = new Map(sources.map((source) => [source.evidenceId, source]));
      const withLinks = (claim) => ({
        ...claim,
        citations: claim.citations.map((citation) => {
          const source = sourceById.get(citation.id);
          return {
            ...citation,
            responseId: source.feedbackId,
            number: feedbackById.get(source.feedbackId).number,
          };
        }),
      });
      strengths.push(...report.strengths.map(withLinks));
      problems.push(...report.problems.map(withLinks));
      suggestedActions.push(...report.suggested_actions.map(withLinks));
      evidenceBatches.push({ surveyId: survey.id, requestId, provenance, sources });
    }
  }
  const qualityAccepted = evidenceBatches.every(({ provenance }) => provenance.quality_accepted);
  const periodCovered = period.from === period.to ? period.from : `${period.from} – ${period.to}`;
  const totalReviewsAnalyzed = responses.length;
  const executiveSummary =
    locale === 'ar'
      ? `يغطي هذا التقرير ${totalReviewsAnalyzed} من الردود النصية خلال الفترة ${periodCovered}.`
      : `This report covers ${totalReviewsAnalyzed} written responses for ${periodCovered}.`;

  checkCancellation(options?.signal);
  await options?.assertCurrentOwner?.();
  checkCancellation(options?.signal);
  const report = await Report.create({
    business: businessId,
    reportName:
      input.reportName?.trim() ||
      (locale === 'ar' ? 'تقرير تجربة العملاء' : 'Customer Experience Report'),
    periodCovered,
    period,
    language: locale,
    branchesCovered,
    totalReviewsAnalyzed,
    analyzedTextCount: reports.reduce((count, entry) => count + entry.analyzedTextCount, 0),
    executiveSummary,
    qualityStatus: qualityAccepted ? 'accepted' : 'baseline',
    qualityAccepted,
    strengths,
    problems,
    suggestedActions,
    evidenceBatches,
  });
  const view = report.toObject();
  delete view.business;
  delete view.__v;
  return view;
}

function withQuality(report) {
  // Reports saved before evidence metadata was introduced have unverified quality.
  return { qualityStatus: null, qualityAccepted: false, ...report };
}

async function list(user, input) {
  const filter = { business: requireBusinessId(user) };
  const page = Number(input.page ?? 1);
  const limit = Number(input.limit ?? 100);
  const rows = await Report.find(filter)
    .select(REPORT_LIST_FIELDS)
    .sort({ createdAt: -1, _id: -1 })
    .skip((page - 1) * limit)
    .limit(limit + 1)
    .lean();
  return {
    reports: rows.slice(0, limit).map(withQuality),
    pagination: { page, limit, hasMore: rows.length > limit },
  };
}

async function detail(user, id) {
  const report = await Report.findOne({ _id: id, business: requireBusinessId(user) })
    .select(REPORT_DETAIL_FIELDS)
    .lean();
  if (!report) throw fail('Report not found', 404);
  return withQuality(report);
}

module.exports = { generate, generateSaved, list, detail };
