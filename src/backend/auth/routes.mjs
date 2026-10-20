import { Router } from 'express';
import { z, parse, name, email, password, locale, token } from '../http/validation.mjs';
import { csrfMiddleware } from '../http/security.mjs';
import { createLimiter } from '../http/rate-limits.mjs';
import { revokeSession } from './sessions.mjs';
import {
  getSessionView,
  registerOwner,
  loginOwner,
  verifyEmail,
  requestVerification,
  requestPasswordReset,
  resetPassword,
} from './service.mjs';
export function authRoutes(deps) {
  const router = Router(),
    limit = createLimiter(deps);
  router.get('/session', async (req, res) => {
    limit(`bootstrap:${req.ip}`, 120, 900000, res);
    res.json(await getSessionView(req, res, deps));
  });
  router.use(csrfMiddleware(deps));
  router.use((req, res, next) => {
    const recovery = ['/forgot-password', '/resend-verification'].includes(req.path);
    const window = recovery ? 3600000 : 900000;
    const group = recovery ? 'recovery' : 'auth';
    limit(`${group}:ip:${req.ip}`, recovery ? 20 : 60, window, res);
    if (typeof req.body?.email === 'string')
      limit(
        `${group}:email:${req.body.email.trim().toLowerCase()}`,
        recovery ? 3 : 10,
        window,
        res,
      );
    next();
  });
  router.post('/register', async (req, res) =>
    res.status(201).json(
      await registerOwner(
        parse(
          z
            .object({
              name,
              email,
              password,
              terms: z.literal(true),
              locale: locale.default('en'),
            })
            .strict(),
          req.body,
        ),
        deps,
      ),
    ),
  );
  router.post('/login', async (req, res) =>
    res.json(
      await loginOwner(
        parse(
          z
            .object({
              email,
              password: z.string().min(1).max(128),
              remember: z.boolean().default(false),
            })
            .strict(),
          req.body,
        ),
        req,
        res,
        deps,
      ),
    ),
  );
  router.post('/logout', async (req, res) => {
    await revokeSession(req, res, deps);
    res.sendStatus(204);
  });
  const address = z.object({ email, locale: locale.optional() }).strict();
  router.post('/verify-email', async (req, res) => {
    await verifyEmail(parse(z.object({ token }).strict(), req.body), deps);
    res.json({ status: 'verified' });
  });
  router.post('/resend-verification', async (req, res) => {
    await requestVerification(parse(address, req.body), deps);
    res.status(202).json({ status: 'accepted' });
  });
  router.post('/forgot-password', async (req, res) => {
    await requestPasswordReset(parse(address, req.body), deps);
    res.status(202).json({ status: 'accepted' });
  });
  router.post('/reset-password', async (req, res) => {
    await resetPassword(parse(z.object({ token, password }).strict(), req.body), deps);
    res.json({ status: 'password_changed' });
  });
  return router;
}
