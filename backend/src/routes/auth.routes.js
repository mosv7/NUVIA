const express = require('express');

const authController = require('../controllers/auth.controller');
const authenticate = require('../middlewares/auth.middleware');
const rateLimit = require('express-rate-limit');
const passwordResetController = require('../controllers/passwordReset.controller');
const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  verifyResetTokenValidation,
  resetPasswordValidation,
} = require('../validations/auth.validation');
const validate = require('../middlewares/validation.middleware');

const router = express.Router();
router.get('/session', authController.getSession);
router.post('/logout', authenticate, authController.logout);

// limit abuse of the email-sending / token endpoints
const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts, please try again later' },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
});
router.post('/register', loginLimiter, registerValidation, validate, authController.register);

router.post('/login', loginLimiter, loginValidation, validate, authController.login);

router.post(
  '/forgot-password',
  resetLimiter,
  forgotPasswordValidation,
  validate,
  passwordResetController.forgotPassword,
);

router.post(
  '/verify-reset-token',
  resetLimiter,
  verifyResetTokenValidation,
  validate,
  passwordResetController.verifyResetToken,
);

router.post(
  '/reset-password',
  resetLimiter,
  resetPasswordValidation,
  validate,
  passwordResetController.resetPassword,
);

const settingsController = require('../controllers/settings.controller');
const settingsValidation = require('../validations/settings.validation');
router.post(
  '/login/2fa',
  loginLimiter,
  settingsValidation.loginTwoFactor,
  validate,
  settingsController.loginTwoFactor,
);
router.post(
  '/confirm-email',
  resetLimiter,
  settingsValidation.confirmEmail,
  validate,
  settingsController.confirmEmail,
);

router.get('/me', authenticate, authController.getMe);

module.exports = router;
