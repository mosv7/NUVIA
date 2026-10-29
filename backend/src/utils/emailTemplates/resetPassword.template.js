const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const resetPasswordEmail = ({ name, resetUrl, expiresInMinutes }) => {
  const safeName = escapeHtml(name || "there");

  const subject = "Reset your Nuvia password";

  const text = [
    `Hi ${name || "there"},`,
    "",
    "We received a request to reset your Nuvia password.",
    `Open this link to choose a new one (valid for ${expiresInMinutes} minutes):`,
    resetUrl,
    "",
    "If you didn't request this, you can safely ignore this email.",
    "",
    "Nuvia",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:#ffffff;border-radius:12px;padding:40px;">
          <tr><td style="font-size:22px;font-weight:700;color:#1d4ed8;letter-spacing:1px;padding-bottom:24px;">NUVIA</td></tr>
          <tr><td style="font-size:24px;color:#0f172a;padding-bottom:12px;">Reset your password</td></tr>
          <tr><td style="font-size:14px;line-height:22px;color:#475569;padding-bottom:24px;">
            Hi ${safeName}, we received a request to reset your password.
            Click the button below to choose a new one. This link is valid for ${expiresInMinutes} minutes.
          </td></tr>
          <tr><td style="padding-bottom:24px;">
            <a href="${resetUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;">Reset password</a>
          </td></tr>
          <tr><td style="font-size:12px;line-height:18px;color:#94a3b8;">
            If the button doesn't work, copy and paste this link into your browser:<br />
            <a href="${resetUrl}" style="color:#2563eb;word-break:break-all;">${resetUrl}</a>
            <br /><br />If you didn't request this, you can safely ignore this email.
          </td></tr>
        </table>
        <div style="font-size:12px;color:#94a3b8;padding-top:16px;">&copy; ${new Date().getFullYear()} Nuvia</div>
      </td></tr>
    </table>
  </body>
</html>`;

  return { subject, html, text };
};

module.exports = { resetPasswordEmail };
