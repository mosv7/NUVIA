const express = require("express");

const authController = require("../controllers/auth.controller");
const authenticate = require("../middlewares/auth.middleware");
const rateLimit = require("express-rate-limit");
const passwordResetController = require("../controllers/passwordReset.controller");
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  verifyResetTokenValidation,
  resetPasswordValidation,
} = require("../validations/auth.validation");
const validate = require("../middlewares/validation.middleware");

const router = express.Router();

// limit abuse of the email-sending / token endpoints
const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again later" },
});

router.post("/register", registerValidation, validate, authController.register);

router.post("/login", loginValidation, validate, authController.login);

router.post(
  "/forgot-password",
  resetLimiter,
  forgotPasswordValidation,
  validate,
  passwordResetController.forgotPassword
);

router.post(
  "/verify-reset-token",
  resetLimiter,
  verifyResetTokenValidation,
  validate,
  passwordResetController.verifyResetToken
);

router.post(
  "/reset-password",
  resetLimiter,
  resetPasswordValidation,
  validate,
  passwordResetController.resetPassword
);

router.get("/me", authenticate, authController.getMe);

module.exports = router;
