const express = require('express');

const authenticate = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const v = require('../validations/feedback.validation');
const feedback = require('../controllers/feedback.controller');

const router = express.Router();

const canRead = authorize('owner', 'manager', 'viewer');
const canRetry = authorize('owner', 'manager');

router.use(authenticate);

// (/filters and /export must stay above /:id)
router.get('/filters', canRead, feedback.filters);
router.get('/export', canRead, v.filterQuery, validate, feedback.exportCsv);
router.get('/', canRead, v.listQuery, validate, feedback.list);

router.get('/:id', canRead, v.feedbackId, validate, feedback.getById);
router.get('/:id/analysis', canRead, v.feedbackId, validate, feedback.getAnalysis);
router.post('/:id/analysis/retry', canRetry, v.feedbackId, validate, feedback.retry);

module.exports = router;
