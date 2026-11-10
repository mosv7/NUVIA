const express = require('express');

const sentimentAuth = require('../middlewares/overviewAuth.middleware');
const sentimentController = require('../controllers/overviewSentiment.controller');

const router = express.Router();

// Protect all sentiment endpoints
router.use(sentimentAuth);

// Sentiment analytics
router.get('/summary', sentimentController.getSummary);
router.get('/trends', sentimentController.getTrends);

// Customer responses
router.get('/responses', sentimentController.getResponses);
router.get('/responses/:responseId', sentimentController.getResponseAnalysis);

module.exports = router;