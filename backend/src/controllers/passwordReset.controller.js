const service = require('../services/passwordReset.service');

const forgotPassword = async (req, res) => {
  try {
    await service.requestReset({ email: req.body.email });
  } catch (error) {
    // log it, but never tell the client (prevents email enumeration)
    console.error('forgot-password error:', error.message);
  }

  return res.status(200).json({
    message: 'If an account exists for this email, a reset link has been sent.',
  });
};

const verifyResetToken = async (req, res) => {
  try {
    await service.verifyToken({ token: req.body.token });
    return res.status(200).json({ valid: true });
  } catch (error) {
    return res.status(400).json({ valid: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    await service.resetPassword({
      token: req.body.token,
      password: req.body.password,
    });
    return res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { forgotPassword, verifyResetToken, resetPassword };
