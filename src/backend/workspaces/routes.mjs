import { Router } from 'express';
import { z, parse, name, locale, uuid } from '../http/validation.mjs';
import { requireVerifiedUser } from '../auth/sessions.mjs';
import { csrfMiddleware } from '../http/security.mjs';
import {
  getWorkspace,
  saveWorkspace,
  completeSetup,
  listBranches,
  createBranch,
  updateBranch,
} from './service.mjs';
const timezone = z
  .string()
  .max(100)
  .refine((value) => {
    try {
      new Intl.DateTimeFormat('en', { timeZone: value });
      return true;
    } catch {
      return false;
    }
  });
export function workspaceRoutes(deps) {
  const router = Router();
  router.use(async (req, _res, next) => {
    req.user = await requireVerifiedUser(req, deps);
    next();
  });
  router.use(async (req, res, next) => {
    if (!['GET', 'HEAD'].includes(req.method)) return csrfMiddleware(deps)(req, res, next);
    next();
  });
  router.get('/workspace', async (req, res) => res.json(await getWorkspace(req.user.id, deps)));
  router.put('/workspace', async (req, res) =>
    res.json(
      await saveWorkspace(
        req.user.id,
        parse(
          z
            .object({
              businessName: name,
              industry: name,
              locale: locale.default('en'),
              reportingTimezone: timezone.default('Africa/Cairo'),
            })
            .strict(),
          req.body,
        ),
        deps,
      ),
    ),
  );
  router.put('/workspace/setup', async (req, res) =>
    res.json(
      await completeSetup(
        req.user.id,
        parse(
          z
            .object({ branchType: z.enum(['single', 'multiple']), branchName: name.optional() })
            .strict(),
          req.body,
        ),
        deps,
      ),
    ),
  );
  router.get('/workspaces/:id/branches', async (req, res) => {
    const query = parse(
      z.object({ includeArchived: z.enum(['true', 'false']).optional() }).strict(),
      req.query,
    );
    res.json(
      await listBranches(
        req.user.id,
        uuid(req.params.id),
        { includeArchived: query.includeArchived === 'true' },
        deps,
      ),
    );
  });
  router.post('/workspaces/:id/branches', async (req, res) =>
    res
      .status(201)
      .json(
        await createBranch(
          req.user.id,
          uuid(req.params.id),
          parse(z.object({ name }).strict(), req.body),
          deps,
        ),
      ),
  );
  router.patch('/workspaces/:id/branches/:branchId', async (req, res) =>
    res.json(
      await updateBranch(
        req.user.id,
        uuid(req.params.id),
        uuid(req.params.branchId),
        parse(
          z
            .object({
              name: name.optional(),
              archived: z.boolean().optional(),
              isPrimary: z.literal(true).optional(),
            })
            .strict()
            .refine((value) => Object.keys(value).length > 0),
          req.body,
        ),
        deps,
      ),
    ),
  );
  return router;
}
