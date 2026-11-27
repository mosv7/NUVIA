const nodemailer = require('nodemailer');
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

const port = Number(process.env.SMTP_PORT) || 587;
const secure = port === 465 || process.env.SMTP_SECURE === 'true';
const smtpPassword = () => process.env.SMTP_PASSWORD || process.env.SMTP_PASS;
const fileMailEnabled = () =>
  process.env.MAIL_MODE === 'file' && process.env.NODE_ENV !== 'production';
const smtpEnabled = () =>
  Boolean(process.env.SMTP_HOST && process.env.MAIL_FROM) &&
  Boolean(process.env.SMTP_USER) === Boolean(smtpPassword());
const mailDeliveryAvailable = () => fileMailEnabled() || smtpEnabled();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure,
  requireTLS: !secure,
  tls: { rejectUnauthorized: true },
  ...(process.env.SMTP_USER && { auth: { user: process.env.SMTP_USER, pass: smtpPassword() } }),
});

const sendMail = async ({ to, subject, html, text }) => {
  if (fileMailEnabled()) {
    const directory =
      process.env.MAIL_FILE_DIRECTORY || path.resolve(__dirname, '../../../.local/mail');
    await fs.mkdir(directory, { recursive: true });
    const filename = path.join(directory, `${Date.now()}-${crypto.randomUUID()}.json`);
    await fs.writeFile(filename, JSON.stringify({ to, subject, html, text }, null, 2), {
      mode: 0o600,
    });
    return;
  }
  if (!smtpEnabled()) throw new Error('Mail delivery is not configured');
  return transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
    text,
  });
};

module.exports = { mailDeliveryAvailable, sendMail, transporter };
