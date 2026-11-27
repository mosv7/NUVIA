const accepted = require('../services/acceptedAnalysis');
const CustomerResponse = require('../models/customerResponse.model');
const Branch = require('../models/branch.model');
const mongoose = require('mongoose');

exports.getBranchComparison = async (req, res) => {
  try {
    const { businessId } = req.user;
    const { branchIds, surveyId, startDate, endDate, lang } = req.query;

    const matchStage = { businessId: new mongoose.Types.ObjectId(businessId) };

    if (branchIds && branchIds !== 'all') {
      const idsArray = branchIds.split(',').map((id) => new mongoose.Types.ObjectId(id.trim()));
      matchStage.branchId = { $in: idsArray };
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

    // 1. Total number of responses
    const totalResponses = await CustomerResponse.countDocuments(matchStage);

    // 2. Detailed analysis of aspects at the level of each branch
    const aspectAnalysisPipeline = [
      { $match: { ...matchStage, ...accepted } },
      { $unwind: '$analysis.aspects' },
      {
        $group: {
          _id: {
            branchId: '$branchId',
            aspectName: '$analysis.aspects.name',
          },
          avgScore: { $avg: '$analysis.aspects.score' },
          totalMentions: { $sum: 1 },
          positiveCount: {
            $sum: {
              $cond: [{ $eq: ['$analysis.aspects.polarity', 'positive'] }, 1, 0],
            },
          },
          negativeCount: {
            $sum: {
              $cond: [{ $eq: ['$analysis.aspects.polarity', 'negative'] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'branches',
          localField: '_id.branchId',
          foreignField: '_id',
          as: 'branchInfo',
        },
      },
      { $unwind: '$branchInfo' },
      {
        $project: {
          branchId: '$_id.branchId',
          branchName: '$branchInfo.name',
          aspectName: '$_id.aspectName',
          score: { $round: ['$avgScore', 1] },
          totalMentions: 1,
          positiveCount: 1,
          negativeCount: 1,
          positivePercentage: {
            $cond: [
              { $gt: ['$totalMentions', 0] },
              {
                $round: [
                  {
                    $multiply: [{ $divide: ['$positiveCount', '$totalMentions'] }, 100],
                  },
                  1,
                ],
              },
              0,
            ],
          },
        },
      },
      { $sort: { branchName: 1, aspectName: 1 } },
    ];

    const aspectScoresByBranch = await CustomerResponse.aggregate(aspectAnalysisPipeline);

    // 3. Overview of branches
    const branchesList = await Branch.find({
      businessId: new mongoose.Types.ObjectId(businessId),
      ...(matchStage.branchId && { _id: matchStage.branchId }),
    });

    const branchesOverviewPromises = branchesList.map(async (branch) => {
      const branchMatch = { ...matchStage, branchId: branch._id };
      const branchTotalReviews = await CustomerResponse.countDocuments(branchMatch);

      const branchAspects = await CustomerResponse.aggregate([
        { $match: { ...branchMatch, ...accepted } },
        { $unwind: '$analysis.aspects' },
        {
          $group: {
            _id: null,
            totalAspects: { $sum: 1 },
            positiveAspects: {
              $sum: {
                $cond: [{ $eq: ['$analysis.aspects.polarity', 'positive'] }, 1, 0],
              },
            },
          },
        },
      ]);

      let positivePercentage = null;
      if (branchAspects.length > 0 && branchAspects[0].totalAspects > 0) {
        positivePercentage = Number(
          ((branchAspects[0].positiveAspects / branchAspects[0].totalAspects) * 100).toFixed(1),
        );
      }

      const status = positivePercentage === null ? 'Insufficient data' : 'Available';

      return {
        branchId: branch._id,
        branchName: branch.name,
        positivePercentage,
        totalReviews: branchTotalReviews,
        status,
      };
    });

    const branchesOverview = await Promise.all(branchesOverviewPromises);
    const activeBranches = branchesOverview.filter((b) => b.totalReviews > 0);

    const totalPositivesSum = aspectScoresByBranch.reduce(
      (acc, curr) => acc + curr.positiveCount,
      0,
    );
    const totalMentionsSum = aspectScoresByBranch.reduce(
      (acc, curr) => acc + curr.totalMentions,
      0,
    );
    const overallPositiveSentiment =
      totalMentionsSum > 0 ? Number(((totalPositivesSum / totalMentionsSum) * 100).toFixed(1)) : 0;

    const validPercentages = activeBranches.flatMap((b) =>
      b.positivePercentage === null ? [] : [b.positivePercentage],
    );
    const maxSentiment = validPercentages.length > 0 ? Math.max(...validPercentages) : 0;
    const minSentiment = validPercentages.length > 0 ? Math.min(...validPercentages) : 0;
    const sentimentGap =
      validPercentages.length >= 2 ? Number((maxSentiment - minSentiment).toFixed(1)) : null;

    // --- 4. Generating insightful "Notable Differences": What distinguishes each branch from the others ---
    const notableDifferences = [];

    // Organizing data for each branch, along with its various aspects
    const branchAspectsMap = new Map();
    aspectScoresByBranch.forEach((item) => {
      if (!branchAspectsMap.has(item.branchId)) {
        branchAspectsMap.set(item.branchId, { name: item.branchName, aspects: [] });
      }
      branchAspectsMap
        .get(item.branchId)
        .aspects.push({ aspectName: item.aspectName, score: item.score });
    });

    // For each branch, we identify its strongest aspect (the highest score)
    for (const { name: branchName, aspects } of branchAspectsMap.values()) {
      if (aspects.length > 0) {
        // Sort the branch aspects in descending order based on the score
        aspects.sort((a, b) => b.score - a.score);
        const bestAspect = aspects[0];

        notableDifferences.push({
          title: `${branchName} has its highest average in ${bestAspect.aspectName}`,
          description: `${branchName} achieves its highest score in ${bestAspect.aspectName} with ${bestAspect.score}.`,
        });
      }
    }

    // If there is not enough data to generate specific insights, we provide a general message
    if (notableDifferences.length === 0 && activeBranches.length > 0) {
      notableDifferences.push({
        title: 'Performance Overview',
        description: 'Awaiting more aspect evaluations to display specific branch highlights.',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        summary: {
          responsesInSelectedBranches: totalResponses,
          overallPositiveSentiment:
            overallPositiveSentiment === null ? null : overallPositiveSentiment + '%',
          positiveSentimentGap: sentimentGap === null ? null : sentimentGap + ' pts',
          branchesComparedCount: activeBranches.length,
        },
        aspectScoresByBranch,
        branchesOverview: branchesOverview.sort(
          (a, b) => b.positivePercentage - a.positivePercentage,
        ),
        notableDifferences,
      },
    });
  } catch (error) {
    console.error('Error in getBranchComparison:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
