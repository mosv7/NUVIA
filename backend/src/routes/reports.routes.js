const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, param, query } = require('express-validator');
const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const controller = require('../controllers/reports.controller');

const router = express.Router();
router.use((_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
router.use(authenticate, authenticate.authorize('owner'));

const validDay = (value) =>
  typeof value === 'string' &&
  /^\d{4}-\d{2}-\d{2}$/u.test(value) &&
  Number.isFinite(Date.parse(`${value}T00:00:00.000Z`)) &&
  new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value;

const noQuery = query().custom((value) => Object.keys(value).length === 0);
const generationFields = ['from', 'to', 'locale', 'objective', 'reportName'];
const generationBody = (requireDates) =>
  body()
    .custom((value) => {
      if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
      if (Object.keys(value).some((key) => !generationFields.includes(key))) return false;
      if (requireDates || 'from' in value || 'to' in value) {
        if (!validDay(value.from) || !validDay(value.to) || value.from > value.to) return false;
      }
      if ('locale' in value && !['en', 'ar'].includes(value.locale)) return false;
      for (const [key, max] of [
        ['reportName', 150],
        ['objective', 1000],
      ]) {
        if (!(key in value)) continue;
        if (typeof value[key] !== 'string' || !value[key].trim() || [...value[key]].length > max)
          return false;
      }
      return true;
    })
    .withMessage('Invalid report request. Provide both dates as YYYY-MM-DD or omit both.');
const generateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  keyGenerator: (req) => req.user.id,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many report requests' },
});

router.get(
  '/',
  query().custom((value) => Object.keys(value).every((key) => ['page', 'limit'].includes(key))),
  query('page').optional().isString().bail().isInt({ min: 1, max: 100000 }),
  query('limit').optional().isString().bail().isInt({ min: 1, max: 100 }),
  validate,
  controller.list,
);
router.get('/:id', noQuery, param('id').isMongoId(), validate, controller.detail);
router.post(
  '/',
  noQuery,
  generationBody(false),
  validate,
  generateLimiter,
  controller.generateSaved,
);
router.post(
  '/generate',
  noQuery,
  generationBody(true),
  validate,
  generateLimiter,
  controller.generate,
);

module.exports = router;
