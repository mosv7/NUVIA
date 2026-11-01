const nodemailer = require('nodemailer');
const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');

const port = Number(process.env.SMTP_PORT) || 587;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port,
  secure: port === 465, // true only for 465, STARTTLS otherwise
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail = async ({ to, subject, html, text }) => {
  if (process.env.MAIL_MODE === 'file' && process.env.NODE_ENV !== 'production') {
    const directory =
      process.env.MAIL_FILE_DIRECTORY || path.resolve(__dirname, '../../../.local/mail');
    await fs.mkdir(directory, { recursive: true });
    const filename = path.join(directory, `${Date.now()}-${crypto.randomUUID()}.json`);
    await fs.writeFile(filename, JSON.stringify({ to, subject, html, text }, null, 2), {
      mode: 0o600,
    });
    return;
  }
  if (!process.env.SMTP_HOST || !process.env.MAIL_FROM)
    throw new Error('Mail delivery is not configured');
  return transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
    text,
  });
};

module.exports = { sendMail, transporter };
