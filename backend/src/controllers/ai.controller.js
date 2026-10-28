const { randomUUID } = require('node:crypto');
const { execute } = require('../services/ai.service');
const { AiError } = require('../integrations/ai-service/client');

const handler = (operation) => async (req, res) => {
  const requestId = randomUUID();
  const controller = new AbortController();
  const cancel = () => {
    if (!res.writableEnded) controller.abort();
  };
  res.on('close', cancel);
  try {
    const payload = operation === 'capabilities' ? undefined : { ...req.body };
    if (operation === 'survey-suggestions') payload.count ??= 5;
    const result = await execute(operation, payload, { signal: controller.signal, requestId });
    if (!res.destroyed)
      res.set('X-Request-ID', requestId).set('Cache-Control', 'no-store').json({ data: result });
  } catch (error) {
    if (res.destroyed) return;
    const known = error instanceof AiError;
    const status = known ? error.status : 503;
    const code = known ? error.code : 'AI_UNAVAILABLE';
    const message =
      status === 400 || status === 413
        ? 'AI input exceeds supported limits'
        : 'AI service temporarily unavailable';
    if (status === 429) res.set('Retry-After', '5');
    res
      .status(status)
      .set('X-Request-ID', requestId)
      .set('Cache-Control', 'no-store')
      .json({ message, error: { code, message }, request_id: requestId });
  } finally {
    res.removeListener('close', cancel);
  }
};

module.exports = { handler };
