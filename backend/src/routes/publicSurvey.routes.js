const express = require('express');
const rateLimit = require('express-rate-limit');
const { param, query } = require('express-validator');

const validate = require('../middlewares/validation.middleware');
const publicSurvey = require('../controllers/publicSurvey.controller');
const responseController = require('../controllers/response.controller');
const responseValidation = require('../validations/response.validation');

const router = express.Router();
const submitLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

// Generous: a café full of customers can share one IP.
const readLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

// No authenticate here: customers open these from a link or QR code.
router.get(
  '/surveys/:shortCode',
  readLimiter,
  param('shortCode')
    .isString()
    .trim()
    .isLength({ min: 1, max: 40 })
    .withMessage('Invalid survey code'),
  query('branch').optional().isString().trim().isLength({ max: 150 }).withMessage('Invalid branch'),
  validate,
  publicSurvey.getSurvey,
);

// Saving feedback records a pending analysis state; no inference worker runs here.
router.post(
  '/surveys/:shortCode/responses',
  submitLimiter,
  responseValidation.submitResponse,
  validate,
  responseController.submit,
);
module.exports = router;
