const { setAuthCookie, clearAuthCookie } = require('../utils/browserSession');
const settings = require('../services/settings.service');
const security = require('../services/security.service');
const sessions = require('../services/session.service');
const { handleError } = require('../utils/errors');
const { clientMeta } = require('../utils/device');

// Wraps a handler: `fn(req)` returns the data (or undefined for "no content") and errors go to handleError.
const handle =
  (fn, status = 200) =>
  async (req, res) => {
    try {
      const data = await fn(req, res);
      if (res.headersSent) return;
      if (data === undefined) return res.status(204).end();
      res.status(status).json({ data });
    } catch (error) {
      handleError(res, error);
    }
  };

const ownerId = (req) => req.user.id;

module.exports = {
  // Account settings
  getAccount: handle((req) => settings.getAccount(ownerId(req))),
  updateAccount: handle((req) => settings.updateAccount(ownerId(req), req.body)),
  setAvatar: handle((req) => settings.setAvatar(ownerId(req), req.body)),
  removeAvatar: handle((req) => settings.removeAvatar(ownerId(req))),
  getAvatar: async (req, res) => {
    try {
      const { contentType, body } = await settings.getAvatar(ownerId(req));
      res.set('Content-Type', contentType).set('Cache-Control', 'private, no-store').send(body);
    } catch (error) {
      handleError(res, error);
    }
  },

  // Language & notifications
  getLanguage: handle((req) => settings.getLanguage(ownerId(req))),
  updateLanguage: handle((req) => settings.updateLanguage(ownerId(req), req.body)),
  getNotifications: handle((req) => settings.getNotifications(ownerId(req))),
  updateNotifications: handle((req) => settings.updateNotifications(ownerId(req), req.body)),

  // Account security
  getSecurity: handle((req) => security.getOverview(ownerId(req))),
  changePassword: handle(async (req, res) => {
    const result = await security.changePassword(req.user, req.body);
    setAuthCookie(res, result.token);
    return result;
  }),

  startTwoFactor: handle((req) => security.startTwoFactorSetup(ownerId(req))),
  enableTwoFactor: handle((req) => security.enableTwoFactor(ownerId(req), req.body.code)),
  disableTwoFactor: handle((req) => security.disableTwoFactor(ownerId(req), req.body)),

  listSessions: handle((req) => sessions.listSessions(ownerId(req), req.user.sid)),
  revokeSession: handle((req) =>
    sessions.revokeSession(ownerId(req), req.params.sessionId, req.user.sid),
  ),
  signOutAll: handle(async (req, res) => {
    await require('../models/businessOwner.model').updateOne(
      { _id: ownerId(req) },
      { $inc: { tokenVersion: 1 } },
    );
    await sessions.revokeAll(ownerId(req));
    clearAuthCookie(res);
  }),

  requestEmailChange: handle((req) => security.requestEmailChange(ownerId(req), req.body)),
  getPendingEmail: handle(
    async (req) => (await security.getPendingEmailChange(ownerId(req))) ?? { pendingEmail: null },
  ),
  cancelEmailChange: handle((req) => security.cancelEmailChange(ownerId(req))),

  // Public (no token): used by the login screen and by the link in the email
  confirmEmail: handle((req) => security.confirmEmailChange(req.body.token)),
  loginTwoFactor: handle(async (req, res) => {
    const result = await security.completeTwoFactorLogin({
      twoFactorToken: req.body.twoFactorToken,
      code: req.body.code,
      meta: clientMeta(req),
    });
    setAuthCookie(res, result.token);
    return result;
  }),
};
