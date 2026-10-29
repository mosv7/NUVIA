const { body, param } = require("express-validator");
const { isTimeZone, DISPLAY_LANGUAGES } = require("../utils/settingsOptions");
const { DATE_FORMAT, TIME_FORMAT, FEEDBACK_DELIVERY } = require("../models/enums");

const updateAccount = [
  body("name").optional().trim().isLength({ min: 2, max: 150 }).withMessage("Full name must be between 2 and 150 characters"),
  body("phone").optional({ values: "falsy" }).trim().matches(/^\+?[0-9 ()\-]{6,30}$/).withMessage("Enter a valid phone number"),
  body("country").optional({ values: "falsy" }).trim().toUpperCase().matches(/^[A-Z]{2}$/).withMessage("Country must be a 2-letter country code, e.g. EG"),
  body("jobTitle").optional().trim().isLength({ max: 100 }).withMessage("Job title must be at most 100 characters"),
];

const updateLanguage = [
  body("displayLanguage").optional().isIn(DISPLAY_LANGUAGES.map((l) => l.value)).withMessage("Unsupported display language"),
  body("region").optional().trim().toUpperCase().matches(/^[A-Z]{2}$/).withMessage("Region must be a 2-letter code, e.g. EG"),
  body("timeZone").optional().custom(isTimeZone).withMessage("Unknown time zone"),
  body("dateFormat").optional().isIn(DATE_FORMAT).withMessage("Invalid date format"),
  body("timeFormat").optional().isIn(TIME_FORMAT).withMessage("Invalid time format"),
];

const bool = (path) => body(path).optional().isBoolean({ strict: true }).withMessage(`${path} must be true or false`);

const updateNotifications = [
  bool("channels.email"), bool("channels.inApp"),
  bool("email.newFeedback"), bool("email.lowRating"), bool("email.weeklyReport"), bool("email.productNews"),
  body("email.feedbackDelivery").optional().isIn(FEEDBACK_DELIVERY).withMessage("Invalid delivery option"),
  bool("inApp.newFeedback"), bool("inApp.lowRating"), bool("inApp.reportsReady"), bool("inApp.sound"), bool("inApp.popups"),
];

// Same rule the Change password screen shows: 12+ characters with a letter, a number and a symbol.
const strongPassword = (field) =>
  body(field)
    .isString().withMessage("Password is required")
    .isLength({ min: 12, max: 64 }).withMessage("Use 12 to 64 characters")
    .matches(/[A-Za-z]/).withMessage("Include a letter")
    .matches(/\d/).withMessage("Include a number")
    .matches(/[^A-Za-z0-9]/).withMessage("Include a symbol");

const changePassword = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  strongPassword("newPassword"),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage("Passwords do not match"),
];

const code = (field = "code") => body(field).trim().notEmpty().withMessage("Enter the code");

const enableTwoFactor = [body("code").trim().matches(/^\d{6}$/).withMessage("Enter the 6-digit code")];
const disableTwoFactor = [body("password").notEmpty().withMessage("Password is required"), code()];
const loginTwoFactor = [body("twoFactorToken").notEmpty().withMessage("Token is required"), code()];

const requestEmailChange = [
  body("newEmail").trim().isEmail().withMessage("Please provide a valid email").normalizeEmail(),
  body("currentPassword").notEmpty().withMessage("Password is required"),
];
const confirmEmail = [body("token").trim().notEmpty().withMessage("Token is required")];

const sessionId = param("sessionId").isMongoId().withMessage("Invalid session id");

module.exports = {
  updateAccount, updateLanguage, updateNotifications, changePassword,
  enableTwoFactor, disableTwoFactor, loginTwoFactor, requestEmailChange, confirmEmail, sessionId,
};
