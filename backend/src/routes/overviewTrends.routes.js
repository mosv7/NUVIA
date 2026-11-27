const express = require('express');
const router = express.Router();
const trendsController = require('../controllers/overviewTrends.controller');
const overviewAuth = require('../middlewares/overviewAuth.middleware');

router.use(overviewAuth);

router.get('/', trendsController.getTrendsAndSignals);

module.exports = router;
