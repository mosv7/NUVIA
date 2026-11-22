
const express = require('express');

const authenticate = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/auth.middleware');
const overviewController = require('../controllers/overviewController');
const overviewAuth = require('../middlewares/overviewAuth.middleware');

const router = express.Router();

const canRead = authorize('owner', 'manager', 'viewer');

router.use(overviewAuth);

router.get('/branches', canRead, overviewController.getBranches);
router.get('/metrics', canRead, overviewController.getMetrics);
router.get('/trends', canRead, overviewController.getTrends);
router.get('/sentiment', canRead, overviewController.getSentiment);
router.get('/aspect-scores', canRead, overviewController.getAspectScores);
router.get('/next-actions', canRead, overviewController.getNextActions);

module.exports = router;
