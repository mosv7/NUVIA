const reports = require('../services/reports.service');
const { AiError } = require('../integrations/ai-service/client');
const { handleError, fail } = require('../utils/errors');
const { resolveIdentity } = require('../middlewares/auth.middleware');

const list = async (req, res) => {
  try {
    res.json(await reports.list(req.user, req.query));
  } catch (error) {
    handleError(res, error);
  }
};

const detail = async (req, res) => {
  try {
    const report = await reports.detail(req.user, req.params.id);
    res.json({ report });
  } catch (error) {
    handleError(res, error);
  }
};

const generationHandler = (save) => async (req, res) => {
  const controller = new AbortController();
  const cancel = () => {
    if (!res.writableEnded) controller.abort();
  };
  res.on('close', cancel);
  const assertCurrentOwner = async () => {
    const identity = await resolveIdentity(req);
    if (
      !identity ||
      identity.user.id !== req.user.id ||
      identity.user.businessId !== req.user.businessId ||
      identity.user.sid !== req.user.sid
    )
      throw fail('Sign in to continue', 401);
  };
  const options = {
    signal: controller.signal,
    preferredLanguage: req.account.preferredLanguage,
    assertCurrentOwner,
  };
  try {
    const result = save
      ? await reports.generateSaved(req.user, req.body, options)
      : await reports.generate(req.user, req.body, options);
    if (!res.destroyed) {
      await assertCurrentOwner();
      if (res.destroyed) return;
      if (save) res.status(201).json({ report: result });
      else res.json({ data: result });
    }
  } catch (error) {
    if (res.destroyed) return;
    if (error instanceof AiError) {
      if (error.status === 429) res.set('Retry-After', '5');
      const message =
        error.status === 400 || error.status === 413
          ? 'Report input exceeds supported AI limits'
          : error.message;
      return res.status(error.status).json({ message, error: { code: error.code, message } });
    }
    handleError(res, error);
  } finally {
    res.removeListener('close', cancel);
  }
};

module.exports = {
  list,
  detail,
  generateSaved: generationHandler(true),
  generate: generationHandler(false),
};
