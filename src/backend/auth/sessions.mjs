import {
  createHash,
  randomBytes,
  hkdfSync,
  createHmac,
  timingSafeEqual,
  randomUUID,
} from 'node:crypto';
import { ApiError } from '../http/errors.mjs';
export const digest = (value) => createHash('sha256').update(value).digest('hex');
const cookieName = 'nuvia_session';
const cookieOptions = (config) => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: config.mode === 'production',
  path: '/',
});
function csrfFor(raw, config) {
  const key = hkdfSync('sha256', config.mailKey, Buffer.alloc(0), 'nuvia:csrf:v1', 32);
  return createHmac('sha256', key).update(raw).digest('hex');
}
export function userView(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    locale: user.locale,
    emailVerified: !!user.verifiedAt,
  };
}
export async function resolveSession(req, deps) {
  const raw = req.cookies?.[cookieName];
  if (!/^[a-f0-9]{64}$/.test(raw || '')) return null;
  const session = await deps.db
    .collection('sessions')
    .findOne({ digest: digest(raw), expiresAt: { $gt: deps.now() }, revokedAt: null });
  if (!session) return null;
  if (!session.userId) return { session, raw, user: null };
  const user = await deps.db
    .collection('users')
    .findOne({ _id: session.userId, credentialsVersion: session.credentialsVersion });
  return user ? { session, raw, user } : null;
}
export async function createSession(
  res,
  { userId = null, remember = false, credentialsVersion = null },
  deps,
) {
  const raw = randomBytes(32).toString('hex'),
    csrfToken = csrfFor(raw, deps.config);
  const lifetime = (remember ? 30 : 1) * 24 * 60 * 60 * 1000;
  await deps.db.collection('sessions').insertOne({
    _id: randomUUID(),
    digest: digest(raw),
    csrfDigest: digest(csrfToken),
    userId,
    credentialsVersion,
    createdAt: deps.now(),
    expiresAt: new Date(deps.now().getTime() + lifetime),
    revokedAt: null,
  });
  res.cookie(cookieName, raw, { ...cookieOptions(deps.config), maxAge: lifetime });
  return { csrfToken };
}
export async function revokeSession(req, res, deps, { clearCookie = true } = {}) {
  const raw = req.cookies?.[cookieName];
  if (raw)
    await deps.db
      .collection('sessions')
      .updateOne({ digest: digest(raw) }, { $set: { revokedAt: deps.now() } });
  if (clearCookie) res.clearCookie(cookieName, cookieOptions(deps.config));
}
export async function bootstrapSession(req, res, deps) {
  const current = await resolveSession(req, deps);
  if (current)
    return {
      user: current.user ? userView(current.user) : null,
      csrfToken: csrfFor(current.raw, deps.config),
    };
  return { user: null, ...(await createSession(res, {}, deps)) };
}
export async function requireUser(req, deps) {
  const current = await resolveSession(req, deps);
  if (!current?.user) throw new ApiError(401, 'AUTH_REQUIRED');
  return userView(current.user);
}
export async function requireVerifiedUser(req, deps) {
  const user = await requireUser(req, deps);
  if (!user.emailVerified) throw new ApiError(403, 'EMAIL_VERIFICATION_REQUIRED');
  return user;
}
export async function requireCsrf(req, deps) {
  if (req.get('Origin') !== deps.config.appOrigin) throw new ApiError(403, 'CSRF_REJECTED');
  const current = await resolveSession(req, deps);
  const received = req.get('X-CSRF-Token');
  if (
    !current ||
    !/^[a-f0-9]{64}$/.test(received || '') ||
    !timingSafeEqual(Buffer.from(digest(received)), Buffer.from(current.session.csrfDigest))
  )
    throw new ApiError(403, 'CSRF_REJECTED');
}
