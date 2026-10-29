const express = require("express");
const rateLimit = require("express-rate-limit");
const { param, query } = require("express-validator");

const validate = require("../middlewares/validation.middleware");
const publicSurvey = require("../controllers/publicSurvey.controller");
const responseController = require("../controllers/response.controller");
const responseValidation = require("../validations/response.validation");

const router = express.Router();

// Stricter than reads: one real customer submits once. Still allows a whole café behind one Wi-Fi IP.
const submitLimiter = rateLimit({ windowMs: 60 * 1000, limit: Number(process.env.SUBMIT_RATE_LIMIT) || 30, standardHeaders: true, legacyHeaders: false });

// Generous: a café full of customers can share one IP.
const readLimiter = rateLimit({ windowMs: 60 * 1000, limit: 120, standardHeaders: true, legacyHeaders: false });

// No authenticate here: customers open these from a link or QR code.
router.get(
  "/surveys/:shortCode",
  readLimiter,
  param("shortCode").isString().trim().isLength({ min: 1, max: 40 }).withMessage("Invalid survey code"),
  query("branch").optional().isString().trim().isLength({ max: 150 }).withMessage("Invalid branch"),
  validate,
  publicSurvey.getSurvey
);

// A customer sends their answers. Analysis is queued in the background; the reply is just the thank-you message.
router.post("/surveys/:shortCode/responses", submitLimiter, responseValidation.submitResponse, validate, responseController.submit);

module.exports = router;
