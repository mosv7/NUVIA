const express = require('express');

const authenticate = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const { updateBusiness } = require('../validations/business.validation');
const business = require('../controllers/business.controller');

const router = express.Router();

router.use(authenticate);

// Business profile + Edit business profile. Only the owner can edit.
router.get('/', authorize('owner', 'manager', 'viewer'), business.getProfile);
router.put('/', authorize('owner'), updateBusiness, validate, business.updateProfile);

module.exports = router;
