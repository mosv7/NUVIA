import { requireCsrf } from '../auth/sessions.mjs';
export const csrfMiddleware = (deps) => async (req, _res, next) => {
  await requireCsrf(req, deps);
  next();
};
