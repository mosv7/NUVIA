const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/overviewAnalytics.controller');
const overviewAuth = require('../middlewares/overviewAuth.middleware');



router.use(overviewAuth);

router.get('/aspect-score-comparison', analyticsController.getAspectScoreComparison);
router.get('/aspect-trend', analyticsController.getAspectTrend);
router.get('/aspect-based', analyticsController.getAspectAnalysis);
router.get('/aspect-feedbacks', analyticsController.getAspectFeedbacksList);
router.get('/aspect-sentiment-breakdown', analyticsController.getAspectSentimentBreakdown);

module.exports = router;