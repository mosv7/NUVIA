const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const wrap = (title, bodyHtml) => `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:32px 16px;"><tr><td align="center">
    <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:#ffffff;border-radius:12px;padding:40px;">
      <tr><td style="font-size:22px;font-weight:700;color:#1d4ed8;letter-spacing:1px;padding-bottom:24px;">NUVIA</td></tr>
      <tr><td style="font-size:24px;color:#0f172a;padding-bottom:12px;">${title}</td></tr>
      ${bodyHtml}
    </table>
  </td></tr></table>
</body></html>`;

// Sent to the NEW address: click to confirm.
const confirmEmailMessage = ({ name, confirmUrl, expiresInHours }) => {
  const subject = 'Confirm your new Nuvia email address';
  const text = [
    `Hi ${name || 'there'},`,
    '',
    'Confirm this email address to use it for signing in to Nuvia:',
    confirmUrl,
    '',
    `The link expires in ${expiresInHours} hours. Until you confirm, your current address stays active.`,
    "If you didn't ask for this, ignore this email.",
  ].join('\n');
  const html = wrap(
    'Confirm your new email',
    `<tr><td style="font-size:14px;line-height:22px;color:#475569;padding-bottom:24px;">Hi ${escapeHtml(name || 'there')}, confirm this address to use it for signing in. The link expires in ${expiresInHours} hours. Until then your current address stays active.</td></tr>
     <tr><td style="padding-bottom:24px;"><a href="${confirmUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;">Confirm email</a></td></tr>
     <tr><td style="font-size:12px;line-height:18px;color:#94a3b8;">If you didn't ask for this, you can ignore this email.</td></tr>`,
  );
  return { subject, html, text };
};

// Sent to the OLD address after the change went through (security notice).
const emailChangedNotice = ({ name, newEmail }) => {
  const subject = 'Your Nuvia email address was changed';
  const text = `Hi ${name || 'there'},\n\nThe sign-in email on your Nuvia account was changed to ${newEmail}.\nIf this wasn't you, reset your password right away and contact support.`;
  const html = wrap(
    'Your email address was changed',
    `<tr><td style="font-size:14px;line-height:22px;color:#475569;">Hi ${escapeHtml(name || 'there')}, the sign-in email on your Nuvia account was changed to <b>${escapeHtml(newEmail)}</b>. If this wasn't you, reset your password right away and contact support.</td></tr>`,
  );
  return { subject, html, text };
};

module.exports = { confirmEmailMessage, emailChangedNotice };
