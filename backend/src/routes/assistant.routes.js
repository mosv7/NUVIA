const express = require('express');
const rateLimit = require('express-rate-limit');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const { requireBusinessId } = require('../services/surveyAccess');
const { handleError } = require('../utils/errors');
const { contextQuery, answerBody } = require('../validations/assistant.validation');
const controller = require('../controllers/assistant.controller');
const router = express.Router();
router.use(authenticate, authenticate.authorize('owner'));
router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  try {
    requireBusinessId(req.user);
    next();
  } catch (error) {
    handleError(res, error);
  }
});
const limiter = (limit) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit,
    keyGenerator: (req) => req.user.id,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      message: 'Too many assistant requests',
      error: { code: 'AI_RATE_LIMITED', message: 'Too many assistant requests' },
    },
  });
router.get('/context', limiter(120), contextQuery, validate, controller.context);
router.post('/answers', limiter(30), ...answerBody, validate, controller.answer);
module.exports = router;
