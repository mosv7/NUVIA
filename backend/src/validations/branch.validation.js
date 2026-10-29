const { body, param, query } = require("express-validator");

const branchId = param("id").isMongoId().withMessage("Invalid branch id");

const listQuery = [
  query("status").optional().isIn(["active", "archived", "all"]).withMessage("status must be active, archived or all"),
  query("search").optional().isString().isLength({ max: 100 }).withMessage("Search is too long"),
];

// Add Branch / Edit Branch: all four fields are marked * in the design.
const requiredText = (field, label, max) =>
  body(field)
    .isString().withMessage(`Enter the ${label}`)
    .bail()
    .trim()
    .notEmpty().withMessage(`Enter the ${label}`)
    .isLength({ max }).withMessage(`The ${label} must be at most ${max} characters`);

const branchFields = [
  requiredText("name", "branch name", 150),
  requiredText("country", "country", 100),
  requiredText("city", "city", 100),
  requiredText("address", "street address", 255),
];

module.exports = { branchId, listQuery, branchFields };
