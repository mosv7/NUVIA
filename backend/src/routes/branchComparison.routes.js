const express = require('express');
const router = express.Router();
const branchComparisonController = require('../controllers/branchComparison.controller');
const overviewAuth = require('../middlewares/overviewAuth.middleware');

router.use(overviewAuth);

router.get('/', branchComparisonController.getBranchComparison);

module.exports = router;