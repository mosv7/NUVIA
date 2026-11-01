const { param, query } = require("express-validator");
const { LANGUAGE } = require("../models/enums");

const feedbackId = param("id").isMongoId().withMessage("Invalid feedback id");

const day = (field) =>
  query(field)
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage(`${field} must be YYYY-MM-DD`)
    .bail()
    .isISO8601({ strict: true })
    .withMessage(`${field} is not a valid date`);

// Shared by the list and the CSV export (same filters).
const filterQuery = [
  query("range").optional().isIn(["7d", "30d", "90d", "all"]).withMessage("range must be 7d, 30d, 90d or all"),
  day("from"),
  day("to"),
  query("sentiment").optional().isIn(["positive", "negative", "neutral", "mixed"]).withMessage("Invalid sentiment"),
  query("language").optional().isIn(LANGUAGE).withMessage("Invalid language"),
  query("aspect").optional().isString().isLength({ max: 100 }).withMessage("Invalid aspect"),
  query("branchId").optional().isMongoId().withMessage("Invalid branch"),
  query("surveyId").optional().isMongoId().withMessage("Invalid survey"),
  query("search").optional().isString().isLength({ max: 100 }).withMessage("Search is too long"),
  query("sort").optional().isIn(["newest", "oldest"]).withMessage("sort must be newest or oldest"),
];

const listQuery = [
  ...filterQuery,
  query("page").optional().isInt({ min: 1, max: 100000 }).withMessage("page must be 1 or more"),
  query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("limit must be between 1 and 50"),
];

module.exports = { feedbackId, filterQuery, listQuery };
