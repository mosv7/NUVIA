const crypto = require('node:crypto');

const AUTH_COOKIE = 'nuvia_auth';
const CSRF_COOKIE = 'nuvia_csrf';
const MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const appOrigin = () =>
  process.env.APP_ORIGIN ||
  (process.env.FRONTEND_URL || 'http://127.0.0.1:5173').split(',')[0].trim();
const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: MAX_AGE,
});
const setAuthCookie = (res, token) => res.cookie(AUTH_COOKIE, token, cookieOptions());
const clearAuthCookie = (res) => {
  const options = cookieOptions();
  delete options.maxAge;
  res.clearCookie(AUTH_COOKIE, options);
};
const ensureCsrfToken = (req, res) => {
  const existing = req.cookies?.[CSRF_COOKIE];
  const token =
    typeof existing === 'string' && /^[a-f0-9]{64}$/.test(existing)
      ? existing
      : crypto.randomBytes(32).toString('hex');
  res.cookie(CSRF_COOKIE, token, cookieOptions());
  return token;
};
const requireBrowserCsrf = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  // Explicit Authorization credentials are checked by each protected router.
  if (req.headers.authorization?.startsWith('Bearer ')) return next();
  // Command-line clients have no ambient cookie credentials or browser Origin.
  if (!req.get('Origin') && !req.cookies?.[AUTH_COOKIE] && !req.cookies?.[CSRF_COOKIE])
    return next();
  const cookie = req.cookies?.[CSRF_COOKIE];
  const header = req.get('X-CSRF-Token');
  if (
    req.get('Origin') !== appOrigin() ||
    typeof cookie !== 'string' ||
    typeof header !== 'string' ||
    !/^[a-f0-9]{64}$/.test(cookie) ||
    !/^[a-f0-9]{64}$/.test(header) ||
    !crypto.timingSafeEqual(Buffer.from(cookie), Buffer.from(header))
  ) {
    return res.status(403).json({
      code: 'CSRF_REJECTED',
      error: { code: 'CSRF_REJECTED', message: 'Refresh the page and try again' },
      message: 'Refresh the page and try again',
    });
  }
  next();
};
module.exports = {
  AUTH_COOKIE,
  appOrigin,
  setAuthCookie,
  clearAuthCookie,
  ensureCsrfToken,
  requireBrowserCsrf,
};
