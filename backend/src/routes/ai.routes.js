const express = require('express');
const rateLimit = require('express-rate-limit');
const authenticate = require('../middlewares/auth.middleware');
const { authorize } = authenticate;
const validate = require('../middlewares/validation.middleware');
const { requireBusinessId } = require('../services/surveyAccess');
const { handleError } = require('../utils/errors');
const { validateOperation } = require('../validations/ai.validation');
const { operations } = require('../integrations/ai-service/contracts');
const { handler } = require('../controllers/ai.controller');
const router = express.Router();

router.use(authenticate, authorize('owner'));
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
      message: 'Too many AI requests',
      error: { code: 'AI_RATE_LIMITED', message: 'Too many AI requests' },
    },
  });
router.get('/capabilities', limiter(120), handler('capabilities'));
const inferenceLimiter = limiter(30);
for (const operation of operations) {
  router.post(
    `/${operation}`,
    inferenceLimiter,
    ...validateOperation(operation),
    validate,
    handler(operation),
  );
}
module.exports = router;
