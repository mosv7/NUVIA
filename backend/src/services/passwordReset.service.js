const crypto = require("crypto");
const bcrypt = require("bcrypt");

const BusinessOwner = require("../models/businessOwner.model");
const PasswordReset = require("../models/passwordReset.model");
const { sendMail } = require("../utils/mailer");
const { resetPasswordEmail } = require("../utils/emailTemplates/resetPassword.template");

const TTL_MINUTES = Number(process.env.RESET_TOKEN_TTL_MINUTES) || 30;

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

// Always resolves without revealing whether the email exists.
const requestReset = async ({ email }) => {
  const owner = await BusinessOwner.findOne({ email, status: "active" });

  const account = owner;
  if (!account) return;

  // one live token per email
  await PasswordReset.deleteMany({ email });

  const token = crypto.randomBytes(32).toString("hex");

  await PasswordReset.create({
    email,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + TTL_MINUTES * 60 * 1000),
  });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const { subject, html, text } = resetPasswordEmail({
    name: account.name,
    resetUrl,
    expiresInMinutes: TTL_MINUTES,
  });

  await sendMail({ to: email, subject, html, text });
};

const findValidReset = (token) =>
  PasswordReset.findOne({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() },
  });

const verifyToken = async ({ token }) => {
  const reset = await findValidReset(token);
  if (!reset) throw new Error("Reset link is invalid or has expired");
};

const resetPassword = async ({ token, password }) => {
  const reset = await findValidReset(token);
  if (!reset) throw new Error("Reset link is invalid or has expired");

  const passwordHash = await bcrypt.hash(password, 10);

  // Same email can exist as an owner and as a member in several businesses:
  // the reset applies to every active account with this email.
  await BusinessOwner.updateMany({ email: reset.email, status: "active" }, { passwordHash });

  // single use
  await PasswordReset.deleteMany({ email: reset.email });
};

module.exports = { requestReset, verifyToken, resetPassword };
