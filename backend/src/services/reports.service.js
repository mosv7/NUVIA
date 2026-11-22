
const { randomUUID } = require('node:crypto');

const CustomerResponse = require('../models/customerResponse.model');
const Survey = require('../models/survey.model');

const {
  generate: generateAIReport,
} = require('../integrations/ai-service/reports');

const {
  requireBusinessId,
  oid,
} = require('./surveyAccess');

const { fail } = require('../utils/errors');

const MAX_TEXT_LENGTH = 2000;
const MAX_TEXTS_PER_REQUEST = 10;
const DAY_MS = 24 * 60 * 60 * 1000;

const splitFeedback = (response) => {
  const characters = [...response.feedbackText];

  const segmentCount = Math.ceil(
    characters.length / MAX_TEXT_LENGTH
  );

  return Array.from(
    { length: segmentCount },
    (_, index) => {
      const id = `${response._id}_${index}`;

      return {
        text: {
          id,
          text: characters
            .slice(
              index * MAX_TEXT_LENGTH,
              (index + 1) * MAX_TEXT_LENGTH
            )
            .join(''),
        },

        source: {
          evidenceId: id,
          feedbackId: String(response._id),
          displayId: `#${response.number}`,
          submittedAt: response.submittedAt,
          segment: index + 1,
          segmentCount,
        },
      };
    }
  );
};

const generate = async (user, input, { signal } = {}) => {
  const businessId = oid(requireBusinessId(user));
  const ownerId = oid(user.id);

  const from = new Date(
    `${input.from}T00:00:00.000Z`
  );

  const toExclusive = new Date(
    `${input.to}T00:00:00.000Z`
  ).getTime() + DAY_MS;

  if (
    Number.isNaN(from.getTime()) ||
    Number.isNaN(toExclusive)
  ) {
    throw fail('Invalid report date range', 400);
  }

  if (from.getTime() >= toExclusive - DAY_MS) {
    throw fail('Invalid report date range', 400);
  }

  const surveys = await Survey.find({
    businessId,
    createdBy: ownerId,
  })
    .select('_id name')
    .sort({ createdAt: 1, _id: 1 })
    .lean();

  if (!surveys.length) {
    throw fail(
      'Create a survey before generating a report',
      409
    );
  }

  const surveyIds = surveys.map((survey) => survey._id);

  const responses = await CustomerResponse.find({
    businessId,

    surveyId: {
      $in: surveyIds,
    },

    submittedAt: {
      $gte: from,
      $lt: new Date(toExclusive),
    },

    feedbackText: {
      $type: 'string',
      $ne: '',
    },
  })
    .select('_id surveyId number feedbackText submittedAt')
    .sort({ submittedAt: -1, _id: -1 })
    .lean();

  const responsesBySurvey = new Map(
    surveyIds.map((id) => [String(id), []])
  );

  for (const response of responses) {
    if (
      typeof response.feedbackText === 'string' &&
      response.feedbackText.trim()
    ) {
      responsesBySurvey
        .get(String(response.surveyId))
        .push(response);
    }
  }

  const locale =
    input.locale ||
    (user.preferredLanguage === 'ar' ? 'ar' : 'en');

  const reports = [];
  const skippedSurveys = [];

  for (const survey of surveys) {
    if (signal?.aborted) {
      throw new Error('Report generation was cancelled');
    }

    const surveyResponses = responsesBySurvey.get(
      String(survey._id)
    );

    if (!surveyResponses.length) {
      skippedSurveys.push({
        id: String(survey._id),
        name: survey.name,
        reason: 'no_feedback',
      });

      continue;
    }

    const entries = surveyResponses.flatMap(splitFeedback);

    const batches = [];

    for (
      let index = 0;
      index < entries.length;
      index += MAX_TEXTS_PER_REQUEST
    ) {
      if (signal?.aborted) {
        throw new Error('Report generation was cancelled');
      }

      const batch = entries.slice(
        index,
        index + MAX_TEXTS_PER_REQUEST
      );

      const reply = await generateAIReport(
        {
          texts: batch.map((entry) => entry.text),
          locale,
        },
        {
          signal,
          requestId: randomUUID(),
        }
      );

      batches.push({
        requestId: reply.request_id,
        provenance: reply.provenance,
        report: reply.result,
        sources: batch.map((entry) => entry.source),
      });
    }

    reports.push({
      survey: {
        id: String(survey._id),
        name: survey.name,
      },

      responseCount: surveyResponses.length,
      analyzedTextCount: entries.length,
      batches,
    });
  }

  if (!reports.length) {
    throw fail(
      'No feedback found for the selected date range',
      422
    );
  }

  return {
    period: {
      from: input.from,
      to: input.to,
    },

    surveyCount: reports.length,
    reports,
    skippedSurveys,
  };
};

module.exports = { generate };
