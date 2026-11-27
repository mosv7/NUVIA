const { AiError, callService } = require('./client');
const { validateInput } = require('./contracts');

async function generate(payload, options = {}) {
  if (!validateInput('reports', payload)) throw new AiError('AI_INPUT_INVALID', 400);
  try {
    return await callService('reports', payload, options);
  } catch (error) {
    if (error instanceof AiError && error.status >= 500) {
      console.error('[AI reports] request failed', {
        requestId: options.requestId,
        status: error.status,
        code: error.code,
      });
    }
    throw error;
  }
}

module.exports = { generate };
