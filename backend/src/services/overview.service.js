const mongoose = require('mongoose');
const Branch = require('../models/branch.model');
const CustomerResponse = require('../models/customerResponse.model');
// const CustomerResponse = require('../models/customerResponse.model');
const Survey = require('../models/survey.model');
const Report = require('../models/report.model');

const getBranches = async (businessId) => {
  return Branch.find({ businessId }).select('_id name status').sort({ name: 1 }).lean();
};

const getOverviewMetrics = async (businessId, filters = {}) => {
  const { branchId, startDate, endDate } = filters;

  const match = {
    businessId: new mongoose.Types.ObjectId(businessId),
  };

  if (branchId && branchId !== 'all') {
    match.branchId = new mongoose.Types.ObjectId(branchId);
  }

  if (startDate || endDate) {
    match.submittedAt = {};

    if (startDate) {
      match.submittedAt.$gte = new Date(startDate);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setUTCHours(23, 59, 59, 999);
      match.submittedAt.$lte = end;
    }
  }

  // Get active surveys
  const surveyMatch = {
    businessId: new mongoose.Types.ObjectId(businessId),
    status: 'live',
  };

  if (branchId && branchId !== 'all') {
    surveyMatch.branchIds = new mongoose.Types.ObjectId(branchId);
  }

  const [activeSurveys, stats] = await Promise.all([
    Survey.countDocuments(surveyMatch),

    CustomerResponse.aggregate([
      { $match: match },
      {
        $facet: {
          responses: [{ $count: 'total' }],

          sentiment: [
            {
              $match: {
                'analysis.overallSentiment': {
                  $in: ['positive', 'neutral', 'negative'],
                },
              },
            },
            {
              $group: {
                _id: null,
                analyzed: { $sum: 1 },
                positive: {
                  $sum: {
                    $cond: [{ $eq: ['$analysis.overallSentiment', 'positive'] }, 1, 0],
                  },
                },
              },
            },
          ],

          satisfaction: [
            { $unwind: '$answers' },
            {
              $match: {
                'answers.type': 'rating',
                'answers.rating': { $type: 'number' },
                'answers.ratingMax': { $gt: 0 },
              },
            },
            {
              $group: {
                _id: null,
                average: {
                  $avg: {
                    $multiply: [
                      {
                        $divide: ['$answers.rating', '$answers.ratingMax'],
                      },
                      5,
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    ]),
  ]);

  const totalResponses = stats[0]?.responses[0]?.total || 0;
  const sentiment = stats[0]?.sentiment[0];
  const satisfaction = stats[0]?.satisfaction[0];

  // Temporary estimated indicator, not a true completion rate
  const estimatedCompletionRate =
    activeSurveys > 0 ? Math.min(Math.round((totalResponses / activeSurveys) * 100), 100) : null;

  return {
    totalResponses,

    positiveSentiment: sentiment
      ? Math.round((sentiment.positive / sentiment.analyzed) * 100)
      : null,

    customerSatisfaction: satisfaction ? Number(satisfaction.average.toFixed(1)) : null,

    estimatedCompletionRate,

    activeSurveys,
  };
};

const getResponseTrends = async (businessId, filters = {}) => {
  const { branchId, startDate, endDate } = filters;

  // Default: last 30 days
  const end = endDate ? new Date(`${endDate}T23:59:59.999Z`) : new Date();

  const start = startDate ? new Date(`${startDate}T00:00:00.000Z`) : new Date(end);

  if (!startDate) {
    start.setUTCDate(start.getUTCDate() - 29);
    start.setUTCHours(0, 0, 0, 0);
  }

  const match = {
    businessId: new mongoose.Types.ObjectId(businessId),
    submittedAt: {
      $gte: start,
      $lte: end,
    },
  };

  if (branchId && branchId !== 'all') {
    match.branchId = new mongoose.Types.ObjectId(branchId);
  }

  const results = await CustomerResponse.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$submittedAt',
            timezone: 'UTC',
          },
        },

        responses: { $sum: 1 },

        positive: {
          $sum: {
            $cond: [{ $eq: ['$analysis.overallSentiment', 'positive'] }, 1, 0],
          },
        },

        neutral: {
          $sum: {
            $cond: [{ $eq: ['$analysis.overallSentiment', 'neutral'] }, 1, 0],
          },
        },

        negative: {
          $sum: {
            $cond: [{ $eq: ['$analysis.overallSentiment', 'negative'] }, 1, 0],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Fill days that have no responses with zero
  const resultsMap = new Map(results.map((item) => [item._id, item]));

  const trends = [];

  const current = new Date(start);
  current.setUTCHours(0, 0, 0, 0);

  const lastDay = new Date(end);
  lastDay.setUTCHours(0, 0, 0, 0);

  while (current <= lastDay) {
    const date = current.toISOString().slice(0, 10);
    const item = resultsMap.get(date);

    trends.push({
      date,
      responses: item?.responses || 0,
      positive: item?.positive || 0,
      neutral: item?.neutral || 0,
      negative: item?.negative || 0,
    });

    current.setUTCDate(current.getUTCDate() + 1);
  }

  return trends;
};

const getSentimentDistribution = async (businessId, filters = {}) => {
  const { branchId, startDate, endDate } = filters;

  const match = {
    businessId: new mongoose.Types.ObjectId(businessId),
    'analysis.overallSentiment': {
      $in: ['positive', 'neutral', 'negative'],
    },
  };

  if (branchId && branchId !== 'all') {
    match.branchId = new mongoose.Types.ObjectId(branchId);
  }

  if (startDate || endDate) {
    match.submittedAt = {};

    if (startDate) {
      match.submittedAt.$gte = new Date(`${startDate}T00:00:00.000Z`);
    }

    if (endDate) {
      match.submittedAt.$lte = new Date(`${endDate}T23:59:59.999Z`);
    }
  }

  const results = await CustomerResponse.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$analysis.overallSentiment',
        count: { $sum: 1 },
      },
    },
  ]);

  const counts = {
    positive: 0,
    neutral: 0,
    negative: 0,
  };

  results.forEach((item) => {
    counts[item._id] = item.count;
  });

  const totalAnalyzed = counts.positive + counts.neutral + counts.negative;

  const percentage = (count) => (totalAnalyzed > 0 ? Math.round((count / totalAnalyzed) * 100) : 0);

  return {
    totalAnalyzed,

    positive: {
      count: counts.positive,
      percentage: percentage(counts.positive),
    },

    neutral: {
      count: counts.neutral,
      percentage: percentage(counts.neutral),
    },

    negative: {
      count: counts.negative,
      percentage: percentage(counts.negative),
    },
  };
};

const getAspectScores = async (businessId, filters = {}) => {
  const { branchId, startDate, endDate } = filters;

  const match = {
    businessId: new mongoose.Types.ObjectId(businessId),
  };

  if (branchId && branchId !== 'all') {
    match.branchId = new mongoose.Types.ObjectId(branchId);
  }

  if (startDate || endDate) {
    match.submittedAt = {};

    if (startDate) {
      match.submittedAt.$gte = new Date(`${startDate}T00:00:00.000Z`);
    }

    if (endDate) {
      match.submittedAt.$lte = new Date(`${endDate}T23:59:59.999Z`);
    }
  }

  const results = await CustomerResponse.aggregate([
    {
      $match: match,
    },

    {
      $unwind: '$analysis.aspects',
    },

    {
      $match: {
        'analysis.aspects.name': {
          $type: 'string',
          $ne: '',
        },
      },
    },

    {
      $group: {
        _id: {
          $toLower: {
            $trim: {
              input: '$analysis.aspects.name',
            },
          },
        },

        totalMentions: {
          $sum: 1,
        },

        averageScore: {
          $avg: '$analysis.aspects.score',
        },

        positive: {
          $sum: {
            $cond: [
              {
                $eq: ['$analysis.aspects.polarity', 'positive'],
              },
              1,
              0,
            ],
          },
        },

        neutral: {
          $sum: {
            $cond: [
              {
                $eq: ['$analysis.aspects.polarity', 'neutral'],
              },
              1,
              0,
            ],
          },
        },

        negative: {
          $sum: {
            $cond: [
              {
                $eq: ['$analysis.aspects.polarity', 'negative'],
              },
              1,
              0,
            ],
          },
        },
      },
    },

    {
      $project: {
        _id: 0,
        aspectName: '$_id',
        totalMentions: 1,
        averageScore: {
          $round: ['$averageScore', 2],
        },
        positive: 1,
        neutral: 1,
        negative: 1,
      },
    },

    {
      $sort: {
        totalMentions: -1,
      },
    },
  ]);

  return results;
};

const getNextActions = async (businessId) => {
  const report = await Report.findOne({
    business: businessId,
  })
    .select('suggestedActions reportName createdAt')
    .sort({ createdAt: -1 })
    .lean();

  if (!report) {
    return {
      reportName: null,
      actions: [],
    };
  }

  return {
    reportName: report.reportName,
    actions: report.suggestedActions || [],
  };
};

module.exports = {
  getBranches,
  getOverviewMetrics,
  getResponseTrends,
  getSentimentDistribution,
  getAspectScores,
  getNextActions,
};
