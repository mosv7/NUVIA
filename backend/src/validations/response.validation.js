const { body, param } = require("express-validator");
const { LANGUAGE, CHANNEL_TYPE } = require("../models/enums");

// Shape only. Rules that depend on the question type (rating range, options, required...) are checked
// in response.service, where the survey's questions are known.
const submitResponse = [
  param("shortCode").isString().trim().isLength({ min: 1, max: 40 }).withMessage("Invalid survey code"),
  body("branch").optional({ values: "null" }).isString().trim().isLength({ max: 150 }).withMessage("Invalid branch"),
  body("language").optional({ values: "null" }).isIn(LANGUAGE).withMessage("Unsupported language"),
  body("channel").optional({ values: "null" }).isIn(CHANNEL_TYPE).withMessage("Invalid channel"),
  body("submissionId").optional({ values: "null" }).isString().trim().isLength({ min: 8, max: 64 }).withMessage("Invalid submission id"),
  body("answers").isArray({ min: 1, max: 50 }).withMessage("Send your answers"),
  body("answers.*.questionId").isMongoId().withMessage("Invalid question id"),
  body("answers.*.optionIds").optional({ values: "null" }).isArray({ max: 20 }).withMessage("optionIds must be a list"),
  body("answers.*.optionIds.*").isMongoId().withMessage("Invalid option id"),
  body("respondent").optional({ values: "null" }).isObject().withMessage("Invalid respondent"),
  body("respondent.name").optional({ values: "null" }).isString().trim().isLength({ max: 150 }).withMessage("Name is too long"),
  body("respondent.email").optional({ values: "null" }).isEmail().isLength({ max: 255 }).withMessage("Enter a valid email"),
];

module.exports = { submitResponse };
