const CustomerResponse = require('../models/customerResponse.model');
const mongoose = require('mongoose');

exports.getAspectScoreComparison = async (req, res) => {
  try {
    const { businessId } = req.user;
    const { branchId, surveyId, startDate, endDate, lang } = req.query; // We added lang here

    const matchStage = { businessId: new mongoose.Types.ObjectId(businessId) };

   // 1. Filtering branches
    if (branchId && branchId !== 'all') {
      matchStage.branchId = new mongoose.Types.ObjectId(branchId);
    }

   // 2. Filtering the questionnaire
    if (surveyId) {
      matchStage.surveyId = new mongoose.Types.ObjectId(surveyId);
    }

   // 3. Date filtering (Start & End Date)
    if (startDate || endDate) {
      matchStage.submittedAt = {};
      if (startDate) matchStage.submittedAt.$gte = new Date(startDate);
      if (endDate) {
       // We set the end date to include the very end of the day
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        matchStage.submittedAt.$lte = endDateTime;
      }
    }

    // 4. Filtering languages ​​(lang) – whether detected or declared
    if (lang && lang !== 'all') {
      matchStage.$or = [{ language: lang }, { declaredLanguage: lang }];
    }

    const pipeline = [
      { $match: matchStage },
      { $unwind: '$analysis.aspects' },
      {
        $group: {
          _id: '$analysis.aspects.name',
          totalMentions: { $sum: 1 },
          avgScore: { $avg: '$analysis.aspects.score' },
          positiveCount: {
            $sum: { $cond: [{ $eq: ['$analysis.aspects.polarity', 'positive'] }, 1, 0] },
          },
          negativeCount: {
            $sum: { $cond: [{ $eq: ['$analysis.aspects.polarity', 'negative'] }, 1, 0] },
          },
          neutralCount: {
            $sum: { $cond: [{ $eq: ['$analysis.aspects.polarity', 'neutral'] }, 1, 0] },
          },
        },
      },
      { $sort: { avgScore: -1 } },
    ];

    const aspectsData = await CustomerResponse.aggregate(pipeline);

    // Calculating sentiment share percentages
    const formattedComparison = aspectsData.map((item) => {
      const total = item.totalMentions || 1;// To avoid division by zero
      return {
        name: item._id,
        score: Number(item.avgScore.toFixed(1)),
        mentions: item.totalMentions,
        sentimentShare: {
          positive: Math.round((item.positiveCount / total) * 100),
          negative: Math.round((item.negativeCount / total) * 100),
          neutral: Math.round((item.neutralCount / total) * 100),
        },
      };
    });

    res.status(200).json({
      success: true,
      data: formattedComparison,
    });
  } catch (error) {
    console.error('Error in getAspectScoreComparison:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getAspectAnalysis = async (req, res) => {
  try {
    const { businessId } = req.user;
    const { branchId, surveyId, startDate, endDate, selectedAspect } = req.query;

    const matchStage = { businessId: new mongoose.Types.ObjectId(businessId) };

    if (branchId && branchId !== 'all') {
      matchStage.branchId = new mongoose.Types.ObjectId(branchId);
    }
    if (surveyId) {
      matchStage.surveyId = new mongoose.Types.ObjectId(surveyId);
    }
    if (startDate || endDate) {
      matchStage.submittedAt = {};
      if (startDate) matchStage.submittedAt.$gte = new Date(startDate);
      if (endDate) matchStage.submittedAt.$lte = new Date(endDate);
    }

   // 1. Gathering data to compare all aspects
    const pipeline = [
      { $match: matchStage },
      { $unwind: '$analysis.aspects' },
      {
        $group: {
          _id: '$analysis.aspects.name',
          totalMentions: { $sum: 1 },
          avgScore: { $avg: '$analysis.aspects.score' },
          positiveCount: {
            $sum: { $cond: [{ $eq: ['$analysis.aspects.polarity', 'positive'] }, 1, 0] },
          },
          negativeCount: {
            $sum: { $cond: [{ $eq: ['$analysis.aspects.polarity', 'negative'] }, 1, 0] },
          },
          neutralCount: {
            $sum: { $cond: [{ $eq: ['$analysis.aspects.polarity', 'neutral'] }, 1, 0] },
          },
        },
      },
      { $sort: { totalMentions: -1, avgScore: -1 } },
    ];

    const aspectsData = await CustomerResponse.aggregate(pipeline);

    const totalAspectMentions = aspectsData.reduce((acc, curr) => acc + curr.totalMentions, 0);
    const totalAspectsAnalyzed = aspectsData.length;
    let highestAspect = aspectsData.length > 0 ? aspectsData[0] : null;

    // 2. Determining the aspect for which details are requested (Selected Aspect)
    // If the user hasn't specified a particular aspect, we take the first one as default, or the one sent in the Query
    let targetAspectName = selectedAspect;
    if (!targetAspectName && aspectsData.length > 0) {
      targetAspectName = aspectsData[0]._id;
    }

    let selectedAspectDetails = null;
    let selectedAspectFeedbacks = [];

    if (targetAspectName) {
      // Finding statistics for the selected aspect
      const foundAspect = aspectsData.find((a) => a._id === targetAspectName);
      selectedAspectDetails = foundAspect || null;

      // Fetching feedbacks related to this aspect only for display at the bottom
      const feedbackQuery = {
        ...matchStage,
        'analysis.aspects.name': targetAspectName,
      };

      const rawFeedbacks = await CustomerResponse.find(feedbackQuery)
        .select('number branchId submittedAt language feedbackText analysis.aspects respondent')
        .sort({ submittedAt: -1 })
        .limit(10); // Fetching the last 10 feedbacks as an example

      selectedAspectFeedbacks = rawFeedbacks.map((item) => {
        // Extracting details of the matching aspect within this Feedback
        const matchedAspect = item.analysis.aspects.find((a) => a.name === targetAspectName);
        return {
          feedbackNumber: item.number,
          submittedAt: item.submittedAt,
          language: item.language,
          feedbackText: item.feedbackText,
          aspectDetails: matchedAspect,
        };
      });
    }

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalAspectsAnalyzed,
          totalAspectMentions,
          highestAspect: highestAspect
            ? { name: highestAspect._id, score: highestAspect.avgScore }
            : null,
        },
        selectedAspect: {
          details: selectedAspectDetails,
        },
      },
    });
  } catch (error) {
    console.error('Error in getAspectAnalysis:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getAspectTrend = async (req, res) => {
  try {
    const { businessId } = req.user;
    const { branchId, surveyId, startDate, endDate, aspectName, lang } = req.query;

    // The default aspect is 'Speed' or any aspect specified by the user
    const targetAspect = aspectName || 'Speed';

    const matchStage = {
      businessId: new mongoose.Types.ObjectId(businessId),
      'analysis.aspects.name': targetAspect,
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
        endDateTime.setHours(23, 59, 59, 999);
        matchStage.submittedAt.$lte = endDateTime;
      }
    }
    if (lang && lang !== 'all') {
      matchStage.$or = [{ language: lang }, { declaredLanguage: lang }];
    }

    const pipeline = [
      { $match: matchStage },
      { $unwind: '$analysis.aspects' },
      // We select only the target side
      { $match: { 'analysis.aspects.name': targetAspect } },
      {
        $group: {
          // Gathering data by week or date (e.g., week and year or day)
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$submittedAt' },
          },
          avgScore: { $avg: '$analysis.aspects.score' },
          mentionsCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // Sorting in ascending order by date to plot the line correctly
    ];

    const trendData = await CustomerResponse.aggregate(pipeline);

    // Formatting the data to be ready for charting libraries like Chart.js or Recharts
    const formattedTrend = trendData.map((item) => ({
      date: item._id,
      score: Number(item.avgScore.toFixed(1)),
      mentions: item.mentionsCount,
    }));

    res.status(200).json({
      success: true,
      data: {
        aspectName: targetAspect,
        trend: formattedTrend,
      },
    });
  } catch (error) {
    console.error('Error in getAspectTrend:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getAspectFeedbacksList = async (req, res) => {
  try {
    const { businessId } = req.user;
    const { branchId, surveyId, startDate, endDate, aspectName, lang, limit = 3 } = req.query;

    const targetAspect = aspectName || 'Speed';

    const matchStage = { 
      businessId: new mongoose.Types.ObjectId(businessId),
      'analysis.aspects.name': targetAspect
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
        endDateTime.setHours(23, 59, 59, 999);
        matchStage.submittedAt.$lte = endDateTime;
      }
    }
    if (lang && lang !== 'all') {
      matchStage.$or = [
        { language: lang },
        { declaredLanguage: lang }
      ];
    }

    // Determining the limit based on the user's request (if they requested all feedbacks or a specific number like 3)
    let queryLimit = limit === 'all' ? 0 : Number(limit);

    const totalCount = await CustomerResponse.countDocuments(matchStage);

    const query = CustomerResponse.find(matchStage)
      .select('number branchId submittedAt language declaredLanguage feedbackText analysis.aspects respondent')
      .sort({ submittedAt: -1 });

    if (queryLimit > 0) {
      query.limit(queryLimit);
    }

    const rawFeedbacks = await query.exec();

    const formattedFeedbacks = rawFeedbacks.map(item => {
      const matchedAspect = item.analysis.aspects.find(a => a.name === targetAspect);
      
      return {
        feedbackId: item._id,
        number: item.number,
        submittedAt: item.submittedAt,
        language: item.language,
        feedbackText: item.feedbackText,
        sentiment: matchedAspect ? matchedAspect.polarity : 'neutral', // positive, negative, neutral, mixed
        evidence: matchedAspect ? matchedAspect.evidence : null
      };
    });

    res.status(200).json({
      success: true,
      data: {
        aspectName: targetAspect,
        totalFeedbacks: totalCount,
        feedbacks: formattedFeedbacks
      }
    });

  } catch (error) {
    console.error('Error in getAspectFeedbacksList:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};


exports.getAspectSentimentBreakdown = async (req, res) => {
  try {
    const { businessId } = req.user;
    const { branchId, surveyId, startDate, endDate, aspectName, lang } = req.query;

    const targetAspect = aspectName || 'Speed';

    const matchStage = { 
      businessId: new mongoose.Types.ObjectId(businessId),
      'analysis.aspects.name': targetAspect
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
        endDateTime.setHours(23, 59, 59, 999);
        matchStage.submittedAt.$lte = endDateTime;
      }
    }
    if (lang && lang !== 'all') {
      matchStage.$or = [
        { language: lang },
        { declaredLanguage: lang }
      ];
    }

    const pipeline = [
      { $match: matchStage },
      { $unwind: '$analysis.aspects' },
      { $match: { 'analysis.aspects.name': targetAspect } },
      {
        $group: {
          _id: '$analysis.aspects.polarity', // positive, negative, neutral
          count: { $sum: 1 }
        }
      }
    ];

    const results = await CustomerResponse.aggregate(pipeline);

    // Calculating totals and percentages for each sentiment
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralMixedCount = 0;

    results.forEach(item => {
      if (item._id === 'positive') positiveCount = item.count;
      else if (item._id === 'negative') negativeCount = item.count;
      else if (item._id === 'neutral' || item._id === 'mixed') neutralMixedCount += item.count;
    });

    const totalMentions = positiveCount + negativeCount + neutralMixedCount || 1;

    res.status(200).json({
      success: true,
      data: {
        aspectName: targetAspect,
        totalMentions,
        sentiments: {
          positive: {
            count: positiveCount,
            percentage: Math.round((positiveCount / totalMentions) * 100)
          },
          negative: {
            count: negativeCount,
            percentage: Math.round((negativeCount / totalMentions) * 100)
          },
          neutralOrMixed: {
            count: neutralMixedCount,
            percentage: Math.round((neutralMixedCount / totalMentions) * 100)
          }
        }
      }
    });

  } catch (error) {
    console.error('Error in getAspectSentimentBreakdown:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};