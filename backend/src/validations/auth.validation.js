const { body } = require("express-validator");

// Shared rule: at least 8 characters, with a letter and a number
const passwordRule = (field) =>
  body(field)
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 64 })
    .withMessage("Password must be between 8 and 64 characters")
    .matches(/[A-Za-z]/)
    .withMessage("Password must include at least one letter")
    .matches(/\d/)
    .withMessage("Password must include at least one number");

const confirmationRule = () =>
  body("passwordConfirmation")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    });

const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 150 })
    .withMessage("Name must be between 2 and 150 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  passwordRule("password"),

  confirmationRule(),

  body("phone")
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage("Phone must be at most 30 characters"),

  body("preferredLanguage")
    .optional()
    .trim()
    .isLength({ min: 2, max: 10 })
    .withMessage("Preferred language must be between 2 and 10 characters"),
];

const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
];

const forgotPasswordValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
];

const verifyResetTokenValidation = [
  body("token").trim().notEmpty().withMessage("Token is required"),
];

const resetPasswordValidation = [
  body("token").trim().notEmpty().withMessage("Token is required"),
  passwordRule("password"),
  confirmationRule(),
];

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  verifyResetTokenValidation,
  resetPasswordValidation,
};
