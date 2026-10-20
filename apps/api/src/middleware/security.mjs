import { requireCsrf } from '../modules/auth/sessions.mjs';
export const csrfMiddleware = (deps) => async (req, _res, next) => {
  await requireCsrf(req, deps);
  next();
};
