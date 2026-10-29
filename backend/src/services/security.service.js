// Account security: password, two-factor authentication, change of sign-in email.
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const QRCode = require("qrcode");

const BusinessOwner = require("../models/businessOwner.model");
const EmailChange = require("../models/emailChange.model");
const { fail } = require("../utils/errors");
const { sendMail } = require("../utils/mailer");
const { generateSecret, verifyCode, buildOtpAuthUri } = require("../utils/totp");
const { encrypt, decrypt } = require("../utils/secretBox");
const { verifyTwoFactorToken } = require("../utils/jwt");
const { confirmEmailMessage, emailChangedNotice } = require("../utils/emailTemplates/emailChange.template");
const sessions = require("./session.service");
const authService = require("./auth.service");

const EMAIL_LINK_HOURS = 24;
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("hex");

const loadOwner = async (ownerId, extraSelect = "") => {
  const owner = await BusinessOwner.findById(ownerId).select(`+passwordHash ${extraSelect}`);
  if (!owner) throw fail("Account not found", 404);
  return owner;
};

const assertPassword = async (owner, password) => {
  if (!password || !(await bcrypt.compare(password, owner.passwordHash))) {
    throw fail("Current password is incorrect", 400, [{ field: "currentPassword", message: "Current password is incorrect" }]);
  }
};

/* ---------- Account security screen ---------- */

const getOverview = async (ownerId) => {
  const owner = await loadOwner(ownerId);
  return {
    email: owner.email,
    emailVerified: owner.emailVerified,
    passwordChangedAt: owner.passwordChangedAt || owner.createdAt,
    twoFactorEnabled: owner.twoFactor.enabled,
    activeSessions: await sessions.countActive(ownerId),
  };
};

/* ---------- Change password ---------- */

const changePassword = async (user, { currentPassword, newPassword }) => {
  const owner = await loadOwner(user.id);
  await assertPassword(owner, currentPassword);

  if (await bcrypt.compare(newPassword, owner.passwordHash)) {
    throw fail("Choose a password you haven't used for this account", 400, [
      { field: "newPassword", message: "New password must be different from the current one" },
    ]);
  }

  owner.passwordHash = await bcrypt.hash(newPassword, 10);
  owner.passwordChangedAt = new Date();
  await owner.save();

  // Matches the screen: "Other sessions will be signed out. This session stays active."
  await sessions.revokeAll(owner._id, user.sid);

  return { passwordChangedAt: owner.passwordChangedAt };
};

/* ---------- Two-factor authentication ---------- */

const RECOVERY_CODE_COUNT = 10;

const newRecoveryCodes = () =>
  Array.from({ length: RECOVERY_CODE_COUNT }, () => {
    const raw = crypto.randomBytes(5).toString("hex"); // 10 hex chars
    return `${raw.slice(0, 5)}-${raw.slice(5)}`;
  });

// Step 1 of the screen: show the QR code and the manual key.
const startTwoFactorSetup = async (ownerId) => {
  const owner = await loadOwner(ownerId);
  if (owner.twoFactor.enabled) throw fail("Two-factor authentication is already on", 409);

  const secret = generateSecret();
  owner.twoFactor.pendingSecretEnc = encrypt(secret);
  await owner.save();

  const otpauthUri = buildOtpAuthUri({ secret, account: owner.email });
  return {
    account: owner.email,
    secret, // for "enter the key manually"
    otpauthUri,
    qrSvg: await QRCode.toString(otpauthUri, { type: "svg", margin: 1, errorCorrectionLevel: "M" }),
  };
};

// Step 2: the 6-digit code proves the app is set up. Returns the recovery codes ONCE.
const enableTwoFactor = async (ownerId, code) => {
  const owner = await loadOwner(ownerId, "+twoFactor.pendingSecretEnc");
  if (owner.twoFactor.enabled) throw fail("Two-factor authentication is already on", 409);
  if (!owner.twoFactor.pendingSecretEnc) throw fail("Start the setup first", 409);

  const step = verifyCode(decrypt(owner.twoFactor.pendingSecretEnc), code);
  if (step === null) throw fail("That code is not correct or has expired", 400, [{ field: "code", message: "Invalid code" }]);

  const recoveryCodes = newRecoveryCodes();
  owner.twoFactor.secretEnc = owner.twoFactor.pendingSecretEnc;
  owner.twoFactor.pendingSecretEnc = undefined;
  owner.twoFactor.enabled = true;
  owner.twoFactor.enabledAt = new Date();
  owner.twoFactor.lastUsedStep = step;
  owner.twoFactor.recoveryCodeHashes = recoveryCodes.map(sha256);
  await owner.save();

  return { enabled: true, recoveryCodes };
};

const disableTwoFactor = async (ownerId, { password, code }) => {
  const owner = await loadOwner(ownerId, "+twoFactor.secretEnc +twoFactor.recoveryCodeHashes");
  if (!owner.twoFactor.enabled) throw fail("Two-factor authentication is not on", 409);
  await assertPassword(owner, password);

  if (!(await consumeSecondFactor(owner, code))) {
    throw fail("That code is not correct or has expired", 400, [{ field: "code", message: "Invalid code" }]);
  }

  owner.twoFactor.enabled = false;
  owner.twoFactor.enabledAt = undefined;
  owner.twoFactor.secretEnc = undefined;
  owner.twoFactor.pendingSecretEnc = undefined;
  owner.twoFactor.recoveryCodeHashes = [];
  owner.twoFactor.lastUsedStep = undefined;
  await owner.save();

  return { enabled: false };
};

// A 6-digit app code, or one of the recovery codes (each works once).
// `owner` must be loaded with +twoFactor.secretEnc +twoFactor.recoveryCodeHashes.
const consumeSecondFactor = async (owner, code) => {
  const value = String(code || "").trim();

  if (/^\d{6}$/.test(value)) {
    const step = verifyCode(decrypt(owner.twoFactor.secretEnc), value, { afterStep: owner.twoFactor.lastUsedStep ?? -1 });
    if (step === null) return false;

    // Conditional update: two requests with the same code can't both win.
    const result = await BusinessOwner.updateOne(
      { _id: owner._id, $or: [{ "twoFactor.lastUsedStep": { $lt: step } }, { "twoFactor.lastUsedStep": { $exists: false } }] },
      { $set: { "twoFactor.lastUsedStep": step } }
    );
    return result.modifiedCount === 1;
  }

  if (/^[0-9a-f]{5}-[0-9a-f]{5}$/i.test(value)) {
    const hash = sha256(value.toLowerCase());
    const result = await BusinessOwner.updateOne(
      { _id: owner._id, "twoFactor.recoveryCodeHashes": hash },
      { $pull: { "twoFactor.recoveryCodeHashes": hash } }
    );
    return result.modifiedCount === 1;
  }

  return false;
};

// Second step of login when 2FA is on.
const completeTwoFactorLogin = async ({ twoFactorToken, code, meta }) => {
  let payload;
  try {
    payload = verifyTwoFactorToken(twoFactorToken);
  } catch {
    throw fail("Your sign-in expired, please enter your password again", 401);
  }

  const owner = await BusinessOwner.findById(payload.id).select("+twoFactor.secretEnc +twoFactor.recoveryCodeHashes");
  if (!owner || owner.status !== "active" || !owner.twoFactor.enabled) {
    throw fail("Your sign-in expired, please enter your password again", 401);
  }

  if (!(await consumeSecondFactor(owner, code))) throw fail("That code is not correct or has expired", 401);

  return authService.completeLogin(owner, meta);
};

/* ---------- Change email ---------- */

const requestEmailChange = async (ownerId, { newEmail, currentPassword }) => {
  const owner = await loadOwner(ownerId);
  await assertPassword(owner, currentPassword);

  if (newEmail === owner.email) {
    throw fail("That is already your email address", 400, [{ field: "newEmail", message: "That is already your email address" }]);
  }
  if (await BusinessOwner.exists({ email: newEmail })) {
    throw fail("That email address is already used by another account", 409, [{ field: "newEmail", message: "Email already in use" }]);
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + EMAIL_LINK_HOURS * 60 * 60 * 1000);

  // Also serves "Resend verification email": the old link stops working.
  await EmailChange.findOneAndUpdate(
    { ownerId },
    { ownerId, newEmail, tokenHash: sha256(token), expiresAt },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const confirmUrl = `${process.env.FRONTEND_URL.split(",")[0].trim()}/confirm-email?token=${token}`;
  try {
    await sendMail({ to: newEmail, ...confirmEmailMessage({ name: owner.name, confirmUrl, expiresInHours: EMAIL_LINK_HOURS }) });
  } catch (error) {
    console.error("Could not send email-change message:", error.message);
    await EmailChange.deleteOne({ ownerId });
    throw fail("We couldn't send the verification email, please try again", 502);
  }

  return { pendingEmail: newEmail, expiresAt };
};

const getPendingEmailChange = async (ownerId) => {
  const pending = await EmailChange.findOne({ ownerId, expiresAt: { $gt: new Date() } }).lean();
  return pending ? { pendingEmail: pending.newEmail, expiresAt: pending.expiresAt } : null;
};

const cancelEmailChange = (ownerId) => EmailChange.deleteOne({ ownerId });

// Opened from the link in the email (works from any browser: the token is the proof).
const confirmEmailChange = async (token) => {
  const pending = await EmailChange.findOne({ tokenHash: sha256(String(token)), expiresAt: { $gt: new Date() } });
  if (!pending) throw fail("This link is invalid or has expired", 400);

  if (await BusinessOwner.exists({ email: pending.newEmail, _id: { $ne: pending.ownerId } })) {
    await EmailChange.deleteOne({ _id: pending._id });
    throw fail("That email address is already used by another account", 409);
  }

  const owner = await BusinessOwner.findById(pending.ownerId);
  if (!owner) throw fail("Account not found", 404);

  const oldEmail = owner.email;
  owner.email = pending.newEmail;
  owner.emailVerified = true;
  await owner.save();
  await EmailChange.deleteOne({ _id: pending._id });

  // Security notice to the previous address. Failing to send must not undo the change.
  sendMail({ to: oldEmail, ...emailChangedNotice({ name: owner.name, newEmail: owner.email }) }).catch((e) =>
    console.error("Could not send email-changed notice:", e.message)
  );

  return { email: owner.email };
};

module.exports = {
  getOverview, changePassword,
  startTwoFactorSetup, enableTwoFactor, disableTwoFactor, completeTwoFactorLogin,
  requestEmailChange, getPendingEmailChange, cancelEmailChange, confirmEmailChange,
};
