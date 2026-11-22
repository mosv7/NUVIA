const express = require('express');
const router = express.Router();
const trendsController = require('../controllers/overviewTrends.controller');
const authenticate = require('../middlewares/auth.middleware');

router.use(authenticate);

router.get('/', trendsController.getTrendsAndSignals);

module.exports = router;