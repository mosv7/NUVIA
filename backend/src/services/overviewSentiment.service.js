const mongoose = require('mongoose');
const CustomerResponse = require('../models/customerResponse.model');

const getSentimentSummary = async (businessId, filters = {}) => {
  const match = {
    businessId: new mongoose.Types.ObjectId(businessId),
    'analysis.status': 'completed',
    'analysis.overallSentiment': {
      $in: ['positive', 'negative', 'neutral', 'mixed'],
    },
  };

  // Filter by branch
  if (filters.branchId) {
    match.branchId = new mongoose.Types.ObjectId(filters.branchId);
  }

  // Filter by language
  if (filters.language) {
    match.language = filters.language;
  }

  // Filter by date range
  if (filters.startDate || filters.endDate) {
    match.submittedAt = {};

    if (filters.startDate) {
      match.submittedAt.$gte = new Date(`${filters.startDate}T00:00:00.000Z`);
    }

    if (filters.endDate) {
      match.submittedAt.$lte = new Date(`${filters.endDate}T23:59:59.999Z`);
    }
  }

  const result = await CustomerResponse.aggregate([
    {
      $match: match,
    },
    {
      $group: {
        _id: '$analysis.overallSentiment',
        count: { $sum: 1 },
      },
    },
  ]);

  const sentiments = {
    positive: { count: 0, percentage: 0 },
    negative: { count: 0, percentage: 0 },
    neutral: { count: 0, percentage: 0 },
    mixed: { count: 0, percentage: 0 },
  };

  let totalAnalyzed = 0;

  result.forEach((item) => {
    sentiments[item._id].count = item.count;
    totalAnalyzed += item.count;
  });

  Object.keys(sentiments).forEach((key) => {
    sentiments[key].percentage =
      totalAnalyzed > 0 ? Number(((sentiments[key].count / totalAnalyzed) * 100).toFixed(1)) : 0;
  });

  return {
    totalAnalyzed,
    sentiments,
  };
};

module.exports = {
  getSentimentSummary,
};

const getSentimentTrends = async (businessId, filters = {}) => {
  const now = new Date();

  // Default period: last 30 days
  const startDate = filters.startDate
    ? new Date(`${filters.startDate}T00:00:00.000Z`)
    : new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);

  const endDate = filters.endDate ? new Date(`${filters.endDate}T23:59:59.999Z`) : now;

  const match = {
    businessId: new mongoose.Types.ObjectId(businessId),
    submittedAt: {
      $gte: startDate,
      $lte: endDate,
    },
    'analysis.status': 'completed',
    'analysis.overallSentiment': {
      $in: ['positive', 'negative', 'neutral', 'mixed'],
    },
  };

  if (filters.branchId) {
    match.branchId = new mongoose.Types.ObjectId(filters.branchId);
  }

  if (filters.language) {
    match.language = filters.language;
  }

  const result = await CustomerResponse.aggregate([
    {
      $match: match,
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$submittedAt',
            timezone: 'UTC',
          },
        },
        positive: {
          $sum: {
            $cond: [{ $eq: ['$analysis.overallSentiment', 'positive'] }, 1, 0],
          },
        },
        negative: {
          $sum: {
            $cond: [{ $eq: ['$analysis.overallSentiment', 'negative'] }, 1, 0],
          },
        },
        neutral: {
          $sum: {
            $cond: [{ $eq: ['$analysis.overallSentiment', 'neutral'] }, 1, 0],
          },
        },
        mixed: {
          $sum: {
            $cond: [{ $eq: ['$analysis.overallSentiment', 'mixed'] }, 1, 0],
          },
        },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  // Convert aggregation result into a map for quick lookup
  const trendsMap = new Map(result.map((item) => [item._id, item]));

  // Fill missing dates with zero values
  const trends = [];

  const currentDate = new Date(startDate);
  currentDate.setUTCHours(0, 0, 0, 0);

  const lastDate = new Date(endDate);
  lastDate.setUTCHours(0, 0, 0, 0);

  while (currentDate <= lastDate) {
    const dateKey = currentDate.toISOString().slice(0, 10);
    const item = trendsMap.get(dateKey);

    trends.push({
      date: dateKey,
      positive: item?.positive || 0,
      negative: item?.negative || 0,
      neutral: item?.neutral || 0,
      mixed: item?.mixed || 0,
    });

    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return {
    trends,
  };
};

const getSentimentResponses = async (businessId, filters = {}, pagination = {}) => {
  const page = Math.max(1, Number(pagination.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(pagination.limit) || 10));

  const skip = (page - 1) * limit;

  const match = {
    businessId: new mongoose.Types.ObjectId(businessId),
    'analysis.status': 'completed',
    'analysis.overallSentiment': {
      $in: ['positive', 'negative', 'neutral', 'mixed'],
    },
  };

  // Branch filter
  if (filters.branchId) {
    match.branchId = new mongoose.Types.ObjectId(filters.branchId);
  }

  // Language filter
  if (filters.language) {
    match.language = filters.language;
  }

  // Date filters
  if (filters.startDate || filters.endDate) {
    match.submittedAt = {};

    if (filters.startDate) {
      match.submittedAt.$gte = new Date(`${filters.startDate}T00:00:00.000Z`);
    }

    if (filters.endDate) {
      match.submittedAt.$lte = new Date(`${filters.endDate}T23:59:59.999Z`);
    }
  }

  const [responses, total] = await Promise.all([
    CustomerResponse.find(match)
      .select('_id number submittedAt branchId language feedbackText analysis.overallSentiment')
      .populate({
        path: 'branchId',
        select: 'name city country',
      })
      .sort({ submittedAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    CustomerResponse.countDocuments(match),
  ]);

  return {
    responses: responses.map((response) => ({
      _id: response._id,
      number: response.number,
      submittedAt: response.submittedAt,
      branch: response.branchId
        ? {
            _id: response.branchId._id,
            name: response.branchId.name,
            city: response.branchId.city,
            country: response.branchId.country,
          }
        : null,
      language: response.language,
      sentiment: response.analysis?.overallSentiment || null,
      message: response.feedbackText,
    })),

    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const getResponseAnalysis = async (businessId, responseId) => {
  if (!mongoose.Types.ObjectId.isValid(responseId)) {
    const error = new Error('Invalid response ID');
    error.statusCode = 400;
    throw error;
  }

  const response = await CustomerResponse.findOne({
    _id: responseId,
    businessId: new mongoose.Types.ObjectId(businessId),
  })
    .select(
      '_id number surveyId branchId channel formVersion formSnapshot answers feedbackText language declaredLanguage submittedAt analysis',
    )
    .populate({
      path: 'branchId',
      select: 'name city country address',
    })
    .lean();

  if (!response) {
    const error = new Error('Feedback response not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    response: {
      _id: response._id,
      number: response.number,
      channel: response.channel,
      submittedAt: response.submittedAt,

      branch: response.branchId
        ? {
            _id: response.branchId._id,
            name: response.branchId.name,
            city: response.branchId.city,
            country: response.branchId.country,
            address: response.branchId.address,
          }
        : null,

      language: response.language,
      declaredLanguage: response.declaredLanguage,
      feedbackText: response.feedbackText,
      answers: response.answers,
    },

    analysis: response.analysis || null,
  };
};


module.exports = {
  getSentimentSummary,
  getSentimentTrends,
  getSentimentResponses,
  getResponseAnalysis,
};