const express = require('express');

const authenticate = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const v = require('../validations/branch.validation');
const branch = require('../controllers/branch.controller');

const router = express.Router();

const canRead = authorize('owner', 'manager', 'viewer');
const canWrite = authorize('owner'); // adding branches affects the plan, so owner only

router.use(authenticate);

// (/summary must stay above /:id)
router.get('/summary', canRead, branch.getSummary);
router.get('/', canRead, v.listQuery, validate, branch.list);
router.post('/', canWrite, v.branchFields, validate, branch.create);

router.get('/:id', canRead, v.branchId, validate, branch.getById);
router.get('/:id/history', canRead, v.branchId, validate, branch.getHistory);
router.put('/:id', canWrite, v.branchId, v.branchFields, validate, branch.update);
router.post('/:id/archive', canWrite, v.branchId, validate, branch.archive);

module.exports = router;
