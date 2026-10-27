const express = require("express");
const rateLimit = require("express-rate-limit");

const authenticate = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const v = require("../validations/settings.validation");
const c = require("../controllers/settings.controller");

const router = express.Router();

// Password / code / email-change endpoints: slow down guessing.
const sensitiveLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again later" },
});

router.use(authenticate);

// Account settings
router.get("/account", c.getAccount);
router.patch("/account", v.updateAccount, validate, c.updateAccount);
router.get("/avatar", c.getAvatar);
router.put("/avatar", express.raw({ type: ["image/png", "image/jpeg"], limit: "2mb" }), c.setAvatar);
router.delete("/avatar", c.removeAvatar);

// Language settings
router.get("/language", c.getLanguage);
router.put("/language", v.updateLanguage, validate, c.updateLanguage);

// Notification settings (email + in-app share one document; send only what changed)
router.get("/notifications", c.getNotifications);
router.put("/notifications", v.updateNotifications, validate, c.updateNotifications);

// Account security
router.get("/security", c.getSecurity);
router.post("/security/password", sensitiveLimiter, v.changePassword, validate, c.changePassword);

router.post("/security/2fa/setup", sensitiveLimiter, c.startTwoFactor);
router.post("/security/2fa/enable", sensitiveLimiter, v.enableTwoFactor, validate, c.enableTwoFactor);
router.post("/security/2fa/disable", sensitiveLimiter, v.disableTwoFactor, validate, c.disableTwoFactor);

router.get("/security/sessions", c.listSessions);
router.post("/security/sessions/sign-out-all", c.signOutAll);
router.delete("/security/sessions/:sessionId", v.sessionId, validate, c.revokeSession);

router.post("/security/email", sensitiveLimiter, v.requestEmailChange, validate, c.requestEmailChange);
router.get("/security/email/pending", c.getPendingEmail);
router.delete("/security/email/pending", c.cancelEmailChange);

// Photo larger than the limit: answer in JSON like the other endpoints.
router.use((error, req, res, next) => {
  if (error.type === "entity.too.large") return res.status(413).json({ message: "The photo must be 2 MB or smaller" });
  next(error);
});

module.exports = router;
