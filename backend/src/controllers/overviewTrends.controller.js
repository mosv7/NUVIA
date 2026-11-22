const CustomerResponse = require('../models/customerResponse.model');
const mongoose = require('mongoose');

exports.getTrendsAndSignals = async (req, res) => {
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

   // Weekly data aggregation
    const weeklyPipeline = [
      { $match: matchStage },
      { $unwind: '$analysis.aspects' },
      { $match: { 'analysis.aspects.name': targetAspect } },
      {
        $group: {
          _id: {
            year: { $year: '$submittedAt' },
            week: { $week: '$submittedAt' }
          },
          totalResponsesInPeriod: { $sum: 1 },
          aspectMentions: { $sum: 1 },
          avgScore: { $avg: '$analysis.aspects.score' },
          minDate: { $min: '$submittedAt' },
          maxDate: { $max: '$submittedAt' }
        }
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } }
    ];

    const weeklyData = await CustomerResponse.aggregate(weeklyPipeline);

    let totalMentionsSum = 0;
    let scoresSum = 0;
    
    const formattedWeeklyBreakdown = weeklyData.map((item) => {
      totalMentionsSum += item.aspectMentions;
      scoresSum += item.avgScore;

      const options = { month: 'short', day: 'numeric' };
      const startStr = item.minDate ? new Date(item.minDate).toLocaleDateString('en-US', options) : '';
      const endStr = item.maxDate ? new Date(item.maxDate).toLocaleDateString('en-US', options) : '';

      return {
        weekRange: `${startStr} - ${endStr}`,
        totalResponses: item.totalResponsesInPeriod,
        aspectMentions: item.aspectMentions,
        score: Number(item.avgScore.toFixed(1))
      };
    });

    const periodAspectScore = weeklyData.length > 0 ? Number((scoresSum / weeklyData.length).toFixed(1)) : 0;
    const latestWeeklyScore = weeklyData.length > 0 ? Number(weeklyData[weeklyData.length - 1].avgScore.toFixed(1)) : 0;
    const previousWeeklyScore = weeklyData.length > 1 ? Number(weeklyData[weeklyData.length - 2].avgScore.toFixed(1)) : latestWeeklyScore;
    const scoreDiff = Number((latestWeeklyScore - previousWeeklyScore).toFixed(1));

    // --- Generating actual values ​​for Signals & Anomalies based on real-world data ---
    let anomalyStatus = "No anomaly";
    let anomalyMessage = "Performance is stable across all recorded weeks.";
    
    let forecastStatus = "Stable";
    let forecastMessage = "Expected to remain consistent based on recent trends.";

    let riskStatus = "Low Risk";
    let riskMessage = "Aspect score is within healthy limits.";

    if (weeklyData.length >= 2) {
      // Anomaly check (if a sudden drop of more than 1.5 points occurs within a single week)
      if (scoreDiff <= -1.5) {
        anomalyStatus = "Anomaly Detected";
        anomalyMessage = `Sharp drop of ${Math.abs(scoreDiff)} pts recorded in the latest week.`;
      }

      // Forecasting based on the latest trend
      if (scoreDiff > 0) {
        forecastStatus = "Upward Trend";
        forecastMessage = "Customer satisfaction is expected to rise next week.";
      } else if (scoreDiff < 0) {
        forecastStatus = "Downward Trend";
        forecastMessage = "Caution advised; satisfaction shows a declining pattern.";
      }
    }

    // Evaluate risk based on the latest assessment (e.g., if below 5, consider it at risk)
    if (latestWeeklyScore > 0 && latestWeeklyScore < 5) {
      riskStatus = "At Risk";
      riskMessage = `Current score (${latestWeeklyScore}) is below acceptable satisfaction threshold.`;
    } else if (latestWeeklyScore === 0 && periodAspectScore === 0) {
      riskStatus = "No Data";
      riskMessage = "Insufficient data points to evaluate risk assessment.";
    }

    res.status(200).json({
      success: true,
      data: {
        selectedAspect: targetAspect,
        summary: {
          periodAspectScore: `${periodAspectScore} / 10`,
          latestWeeklyScore: `${latestWeeklyScore} / 10`,
          scoreChangePts: `${scoreDiff > 0 ? '+' : ''}${scoreDiff} pts`,
          totalMentionsInPeriod: totalMentionsSum
        },
        trendsOverview: formattedWeeklyBreakdown.map(w => ({
          period: w.weekRange,
          score: w.score,
          mentions: w.aspectMentions
        })),
        weeklyBreakdown: formattedWeeklyBreakdown,
        signalsAndAnomalies: {
          anomalyDetection: { 
            status: anomalyStatus, 
            message: anomalyMessage 
          },
          satisfactionForecast: { 
            status: forecastStatus, 
            message: forecastMessage 
          },
          atRiskAspects: { 
            status: riskStatus, 
            message: riskMessage 
          }
        }
      }
    });

  } catch (error) {
    console.error('Error in getTrendsAndSignals:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};