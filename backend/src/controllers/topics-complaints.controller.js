const CustomerResponse = require('../models/customerResponse.model');
const mongoose = require('mongoose');

exports.getTopicsAndComplaints = async (req, res) => {
  try {
    const { businessId } = req.user;
    const { branchId, surveyId, startDate, endDate, lang, selectedTopic, onlyComplaints } = req.query;

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

    // Collecting data and calculating the negatives and positives for each topic
    const pipeline = [
      { $match: matchStage },
      { $unwind: '$analysis.aspects' },
      {
        $group: {
          _id: '$analysis.aspects.name',
          totalMentions: { $sum: 1 },
          avgScore: { $avg: '$analysis.aspects.score' },
          negativeMentions: {
            $sum: { $cond: [{ $eq: ['$analysis.aspects.polarity', 'negative'] }, 1, 0] }
          },
          positiveMentions: {
            $sum: { $cond: [{ $eq: ['$analysis.aspects.polarity', 'positive'] }, 1, 0] }
          },
          sampleEvidence: { $first: '$analysis.aspects.evidence' },
          isBeyondSurvey: { $first: '$analysis.aspects.isEmerging' }
        }
      },
      { $sort: { totalMentions: -1, avgScore: -1 } }
    ];

    let topicsData = await CustomerResponse.aggregate(pipeline);

    // If a request is made to filter for negative complaints only via the query (onlyComplaints=true)
    if (onlyComplaints === 'true') {
      topicsData = topicsData.filter(t => t.negativeMentions > 0);
    }

    const totalTopicsCount = topicsData.length;
    const totalMentionsSum = topicsData.reduce((acc, curr) => acc + curr.totalMentions, 0);

   // 1. The most frequently occurring topic in general
    const mostFrequent = topicsData.length > 0 ? topicsData[0] : null;
    const mostFrequentTopicName = mostFrequent ? mostFrequent._id : null;
    const mostFrequentPercentage = (mostFrequent && totalMentionsSum > 0)
      ? Number(((mostFrequent.totalMentions / totalMentionsSum) * 100).toFixed(1))
      : 0;

    // 2. Filter the selectedComplaintCluster card to include the top actual negative topic (complaint)
    const complaintTopics = topicsData.filter(t => t.negativeMentions > 0);
    const topComplaint = complaintTopics.length > 0 ? complaintTopics[0] : null;

    const targetComplaintName = selectedTopic || (topComplaint ? topComplaint._id : mostFrequentTopicName);
    const selectedComplaintData = topicsData.find(t => t._id === targetComplaintName);
    
    const selectedComplaintMentions = selectedComplaintData ? selectedComplaintData.negativeMentions || selectedComplaintData.totalMentions : 0;
    const selectedComplaintPercentage = (selectedComplaintData && totalMentionsSum > 0)
      ? Number(((selectedComplaintMentions / totalMentionsSum) * 100).toFixed(1))
      : 0;

    const beyondSurveyCount = topicsData.filter(t => t.isBeyondSurvey === true).length;

    res.status(200).json({
      success: true,
      data: {
        summary: {
          recurringTopicClusters: totalTopicsCount,
          mostFrequentTopic: {
            name: mostFrequentTopicName,
            mentions: mostFrequent ? mostFrequent.totalMentions : 0,
            percentage: mostFrequentPercentage
          },
          selectedComplaintCluster: {
            name: targetComplaintName,
            mentions: selectedComplaintMentions,
            percentage: selectedComplaintPercentage
          },
          beyondSurveyOptions: beyondSurveyCount
        },
        topics: topicsData.map(item => ({
          topicName: item._id,
          mentions: item.totalMentions,
          negativeMentions: item.negativeMentions,
          positiveMentions: item.positiveMentions,
          score: Number(item.avgScore.toFixed(1)),
          evidence: item.sampleEvidence,
          isBeyondSurvey: item.isBeyondSurvey || false
        }))
      }
    });

  } catch (error) {
    console.error('Error in getTopicsAndComplaints:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

exports.getSelectedTopicDetails = async (req, res) => {
  try {
    const { businessId } = req.user;
    const { branchId, surveyId, startDate, endDate, topicName, lang } = req.query;

    const matchStage = { 
      businessId: new mongoose.Types.ObjectId(businessId)
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

    // 1. Determine the required aspect (if not provided by the user, dynamically select the most frequently occurring topic)
    let targetTopic = topicName;

    if (!targetTopic) {
      const topTopicPipeline = [
        { $match: matchStage },
        { $unwind: '$analysis.aspects' },
        {
          $group: {
            _id: '$analysis.aspects.name',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ];

      const topTopicResult = await CustomerResponse.aggregate(topTopicPipeline);
      
      if (topTopicResult.length > 0) {
        targetTopic = topTopicResult[0]._id;
      }
    }

  // If there is no data or topics available at all
    if (!targetTopic) {
      return res.status(200).json({
        success: true,
        data: {
          topicName: null,
          totalTopicResponses: 0,
          branchDistribution: [],
          relatedFeedbacks: []
        }
      });
    }

    // Adding the topic filter to the match stage
    const topicMatchStage = {
      ...matchStage,
      'analysis.aspects.name': targetTopic
    };

   // 2. Calculate the total number of replies related to this topic
    const totalTopicResponses = await CustomerResponse.countDocuments(topicMatchStage);

    // 3. Aggregating the distribution of branches
    const branchPipeline = [
      { $match: topicMatchStage },
      {
        $group: {
          _id: '$branchId',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'branches',
          localField: '_id',
          foreignField: '_id',
          as: 'branchInfo'
        }
      },
      { $unwind: '$branchInfo' },
      {
        $project: {
          branchId: '$_id',
          branchName: '$branchInfo.name',
          city: '$branchInfo.city',
          address: '$branchInfo.address',
          count: 1,
          percentage: {
            $cond: [
              { $gt: [totalTopicResponses, 0] },
              { $round: [{ $multiply: [{ $divide: ['$count', totalTopicResponses] }, 100] }, 1] },
              0
            ]
          }
        }
      },
      { $sort: { count: -1 } }
    ];

    const branchDistribution = await CustomerResponse.aggregate(branchPipeline);

    // 4. Fetching the related feedbacks with details
    const rawFeedbacks = await CustomerResponse.find(topicMatchStage)
      .select('number branchId submittedAt language declaredLanguage feedbackText analysis.aspects')
      .populate('branchId', 'name city address')
      .sort({ submittedAt: -1 })
      .limit(5);

    const relatedFeedbacks = rawFeedbacks.map(item => {
      const aspect = item.analysis.aspects.find(a => a.name === targetTopic);
      return {
        feedbackId: item._id,
        number: item.number,
        submittedAt: item.submittedAt,
        language: item.language || item.declaredLanguage,
        location: item.branchId ? {
          branchName: item.branchId.name,
          city: item.branchId.city,
          address: item.branchId.address
        } : null,
        feedbackText: item.feedbackText,
        polarity: aspect ? aspect.polarity : 'neutral',
        evidence: aspect ? aspect.evidence : null
      };
    });

    res.status(200).json({
      success: true,
      data: {
        topicName: targetTopic,
        totalTopicResponses,
        branchDistribution: branchDistribution.map(b => ({
          branchId: b.branchId,
          branchName: b.branchName,
          location: b.city ? `${b.branchName} - ${b.city}` : b.branchName,
          count: b.count,
          percentage: b.percentage
        })),
        relatedFeedbacks
      }
    });

  } catch (error) {
    console.error('Error in getSelectedTopicDetails:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};