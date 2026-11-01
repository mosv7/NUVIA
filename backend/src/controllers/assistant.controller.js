const { randomUUID } = require('node:crypto');
const service = require('../services/assistant.service');
const { AiError } = require('../integrations/ai-service/client');
const { handleError, fail } = require('../utils/errors');
const { resolveIdentity } = require('../middlewares/auth.middleware');

const handler = (operation) => async (req, res) => {
  const requestId = randomUUID();
  const controller = new AbortController();
  const cancel = () => {
    if (!res.writableEnded) controller.abort();
  };
  res.on('close', cancel);
  try {
    const data = await service[operation](
      req.user,
      operation === 'context' ? req.query : req.body,
      { signal: controller.signal, requestId },
    );
    const identity = await resolveIdentity(req);
    if (
      !identity ||
      identity.user.businessId !== req.user.businessId ||
      identity.user.id !== req.user.id ||
      identity.user.sid !== req.user.sid
    )
      throw fail('Sign in to continue', 401);
    if (!res.destroyed) res.set('X-Request-ID', requestId).json({ data });
  } catch (error) {
    if (res.destroyed) return;
    if (!(error instanceof AiError)) return handleError(res, error);
    const message = 'AI service temporarily unavailable';
    if (error.status === 429) res.set('Retry-After', '5');
    res
      .status(error.status)
      .set('X-Request-ID', requestId)
      .json({ message, error: { code: error.code, message }, request_id: requestId });
  } finally {
    res.removeListener('close', cancel);
  }
};
module.exports = { context: handler('context'), answer: handler('answer') };
