const express = require('express');

const authenticate = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/auth.middleware');
const survey = require('../controllers/survey.controller');

const router = express.Router();

router.get('/', authenticate, authorize('owner', 'manager', 'viewer'), survey.listTemplates);

module.exports = router;
