const { validateOutput } = require('./contracts');

class AiError extends Error {
  constructor(code, status = 503) {
    super('AI service temporarily unavailable');
    this.code = code;
    this.status = status;
  }
}

function readConfig() {
  const { AI_SERVICE_URL: base, AI_SERVICE_TOKEN: token } = process.env;
  if (!base || !token) return null;
  try {
    const url = new URL(base);
    const timeout = Number(process.env.AI_REQUEST_TIMEOUT_MS || 190000);
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== '/' ||
      !/^[A-Za-z0-9_-]{32,256}$/u.test(token) ||
      !Number.isInteger(timeout) ||
      timeout < 1000 ||
      timeout > 610000
    )
      throw new Error();
    return { base: url.origin, token, timeout };
  } catch {
    throw new AiError('AI_CONFIG_INVALID');
  }
}

async function callService(operation, payload, { signal, requestId, config = readConfig() } = {}) {
  if (!config) throw new AiError('AI_NOT_CONFIGURED');
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, config.timeout);
  const cancel = () => controller.abort();
  signal?.addEventListener('abort', cancel, { once: true });
  if (signal?.aborted) controller.abort();
  try {
    const response = await fetch(`${config.base}/api/v1/${operation}`, {
      method: payload === undefined ? 'GET' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-AI-Service-Token': config.token,
        ...(requestId ? { 'X-Request-ID': requestId } : {}),
      },
      body: payload === undefined ? undefined : JSON.stringify(payload),
      signal: controller.signal,
      redirect: 'manual',
    });
    if (response.status >= 300 && response.status < 400)
      throw new AiError('AI_UPSTREAM_INVALID', 502);
    if (!response.ok) {
      await response.body?.cancel();
      const statuses = {
        400: ['AI_INPUT_INVALID', 400],
        413: ['AI_INPUT_TOO_LARGE', 413],
        429: ['AI_BUSY', 429],
        502: ['AI_OUTPUT_INVALID', 502],
        504: ['AI_TIMEOUT', 504],
      };
      const [code, status] = statuses[response.status] || ['AI_UNAVAILABLE', 503];
      throw new AiError(code, status);
    }
    if (!response.headers.get('content-type')?.includes('application/json')) {
      await response.body?.cancel();
      throw new AiError('AI_UPSTREAM_INVALID', 502);
    }
    const chunks = [];
    let size = 0;
    for await (const chunk of response.body) {
      size += chunk.length;
      if (size > 262144) {
        controller.abort();
        throw new AiError('AI_UPSTREAM_INVALID', 502);
      }
      chunks.push(chunk);
    }
    let data;
    try {
      data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
      throw new AiError('AI_UPSTREAM_INVALID', 502);
    }
    if (!validateOutput(operation, data, payload)) throw new AiError('AI_UPSTREAM_INVALID', 502);
    return data;
  } catch (error) {
    if (error instanceof AiError) throw error;
    if (timedOut) throw new AiError('AI_TIMEOUT', 504);
    if (signal?.aborted) throw new AiError('AI_CANCELLED', 499);
    throw new AiError('AI_UNAVAILABLE');
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', cancel);
  }
}

module.exports = { callService, readConfig, AiError };
