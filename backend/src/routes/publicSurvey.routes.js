const express = require("express");
const rateLimit = require("express-rate-limit");
const { param, query } = require("express-validator");

const validate = require("../middlewares/validation.middleware");
const publicSurvey = require("../controllers/publicSurvey.controller");

const router = express.Router();

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

module.exports = router;
