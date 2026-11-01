const authService = require('../services/auth.service');
const { clientMeta } = require('../utils/device');
const BusinessOwner = require('../models/businessOwner.model');
const { resolveIdentity } = require('../middlewares/auth.middleware');
const { setAuthCookie, clearAuthCookie, ensureCsrfToken } = require('../utils/browserSession');
const { handleError } = require('../utils/errors');

const register = async (req, res) => {
  try {
    const { name, email, password, phone, preferredLanguage } = req.body;

    const result = await authService.register({
      name,
      email,
      password,
      phone,
      preferredLanguage,
      meta: clientMeta(req),
    });

    if (result.token) setAuthCookie(res, result.token);
    return res.status(201).json({
      message: 'Business owner registered successfully',
      data: result,
    });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'Email already exists' });
    return handleError(res, error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login({ email, password, meta: clientMeta(req) });

    if (result.token) setAuthCookie(res, result.token);
    return res.status(200).json({
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    if (error.statusCode === 401 || error.message === 'Account is not active') {
      return res.status(401).json({
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
        message: 'Invalid email or password',
      });
    }
    return handleError(res, error);
  }
};

const getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.user.id);

    return res.status(200).json({
      data: user,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  getSession: async (req, res) => {
    const csrfToken = ensureCsrfToken(req, res);
    res.set('Cache-Control', 'no-store');
    try {
      const identity = await resolveIdentity(req);
      if (!identity) {
        clearAuthCookie(res);
        return res.json({ user: null, workspace: null, csrfToken });
      }
      const workspace = await authService.getWorkspace(identity.owner);
      return res.json({
        user: authService.toUser(identity.owner, workspace?.id),
        workspace,
        csrfToken,
      });
    } catch (error) {
      return handleError(res, error);
    }
  },
  logout: async (req, res) => {
    try {
      await BusinessOwner.updateOne({ _id: req.user.id }, { $inc: { tokenVersion: 1 } });
      await require('../services/session.service').revokeAll(req.user.id);
      clearAuthCookie(res);
      res.status(204).end();
    } catch (error) {
      handleError(res, error);
    }
  },
};
