const accepted = require('../services/acceptedAnalysis');
const CustomerResponse = require('../models/customerResponse.model');
const mongoose = require('mongoose');

exports.getTrendsAndSignals = async (req, res) => {
  try {
    const { businessId } = req.user;
    const { branchId, surveyId, startDate, endDate, aspectName, lang } = req.query;

    const matchStage = {
      businessId: new mongoose.Types.ObjectId(businessId),
      ...accepted,
    };

    if (branchId && branchId !== 'all') {
      matchStage.branchId = new mongoose.Types.ObjectId(branchId);
    }
    if (surveyId) {
      matchStage.surveyId = new mongoose.Types.ObjectId(surveyId);
    }
    if (startDate || endDate) {
      matchStage.submittedAt = {};
      if (startDate) matchStage.submittedAt.$gte = new Date(startDate);
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setUTCHours(23, 59, 59, 999);
        matchStage.submittedAt.$lte = endDateTime;
      }
    }
    if (lang && lang !== 'all') {
      matchStage.$or = [{ language: lang }, { declaredLanguage: lang }];
    }

    const scored = { 'analysis.aspects.score': { $type: 'number' } };
    let targetAspect = aspectName;
    if (!targetAspect) {
      const [mostMentioned] = await CustomerResponse.aggregate([
        { $match: matchStage },
        { $unwind: '$analysis.aspects' },
        { $match: scored },
        { $group: { _id: '$analysis.aspects.name', mentions: { $sum: 1 } } },
        { $sort: { mentions: -1, _id: 1 } },
        { $limit: 1 },
      ]);
      targetAspect = mostMentioned?._id ?? null;
    }

    const eligibleAspect = { 'analysis.aspects.name': targetAspect, ...scored };
    const weeklyData = targetAspect
      ? await CustomerResponse.aggregate([
          { $match: { ...matchStage, 'analysis.aspects.name': targetAspect } },
          { $unwind: '$analysis.aspects' },
          { $match: eligibleAspect },
          {
            $group: {
              _id: {
                week: { $dateTrunc: { date: '$submittedAt', unit: 'week', startOfWeek: 'monday' } },
                response: '$_id',
              },
              aspectMentions: { $sum: 1 },
              scoreTotal: { $sum: '$analysis.aspects.score' },
              minDate: { $min: '$submittedAt' },
              maxDate: { $max: '$submittedAt' },
            },
          },
          {
            $group: {
              _id: '$_id.week',
              responseCount: { $sum: 1 },
              aspectMentions: { $sum: '$aspectMentions' },
              scoreTotal: { $sum: '$scoreTotal' },
              minDate: { $min: '$minDate' },
              maxDate: { $max: '$maxDate' },
            },
          },
          { $sort: { _id: 1 } },
        ])
      : [];

    let totalMentionsSum = 0;
    let scoresSum = 0;

    const formattedWeeklyBreakdown = weeklyData.map((item) => {
      totalMentionsSum += item.aspectMentions;
      scoresSum += item.scoreTotal;

      const options = { month: 'short', day: 'numeric', timeZone: 'UTC' };
      const startStr = item.minDate
        ? new Date(item.minDate).toLocaleDateString('en-US', options)
        : '';
      const endStr = item.maxDate
        ? new Date(item.maxDate).toLocaleDateString('en-US', options)
        : '';

      return {
        weekRange: `${startStr} - ${endStr}`,
        totalResponses: item.responseCount,
        aspectMentions: item.aspectMentions,
        score: Number((item.scoreTotal / item.aspectMentions).toFixed(2)),
      };
    });

    const latest = formattedWeeklyBreakdown.at(-1);
    const previous = formattedWeeklyBreakdown.at(-2);
    const periodAspectScore = totalMentionsSum
      ? Number((scoresSum / totalMentionsSum).toFixed(2))
      : null;
    const latestWeeklyScore = latest?.score ?? null;
    const scoreDiff =
      latest && previous ? Number((latest.score - previous.score).toFixed(2)) : null;
    const unavailable = {
      status: 'Unavailable',
      message: 'Requires a validated assessment method.',
    };

    res.status(200).json({
      success: true,
      data: {
        selectedAspect: targetAspect,
        summary: {
          periodAspectScore,
          latestWeeklyScore,
          scoreChangePts: scoreDiff,
          totalMentionsInPeriod: totalMentionsSum,
        },
        trendsOverview: formattedWeeklyBreakdown.map((w) => ({
          period: w.weekRange,
          score: w.score,
          mentions: w.aspectMentions,
        })),
        weeklyBreakdown: formattedWeeklyBreakdown,
        signalsAndAnomalies: {
          anomalyDetection: unavailable,
          satisfactionForecast: unavailable,
          atRiskAspects: unavailable,
        },
      },
    });
  } catch (error) {
    console.error('Error in getTrendsAndSignals:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
