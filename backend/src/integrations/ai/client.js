// Stored-response analysis uses the same authenticated, schema/source-validated transport as /api/ai.
const { callService, readConfig, AiError } = require('../ai-service/client');
const MESSAGES = {
  AI_NOT_CONFIGURED: 'The analysis service is not set up yet.',
  AI_CONFIG_INVALID: 'The analysis service is not set up yet.',
  AI_UNAVAILABLE: 'The analysis service is not available right now.',
  AI_BUSY: 'The analysis service is busy.',
  AI_TIMEOUT: 'The analysis took too long.',
  AI_CANCELLED: 'The analysis was interrupted.',
  AI_INPUT_INVALID: 'This feedback could not be analysed.',
  AI_INPUT_TOO_LARGE: 'This feedback is too long to analyse.',
  AI_OUTPUT_INVALID: 'The analysis result was not usable.',
  AI_UPSTREAM_INVALID: 'The analysis result was not usable.',
  AI_MALFORMED: 'The analysis result was not usable.',
  INTERNAL: 'Something went wrong while analysing this feedback.',
};
const safeMessage = (code) => MESSAGES[code] || MESSAGES.INTERNAL;
const analyze = (texts, options) => callService('analyze', { texts }, options);
const isConfigured = () => Boolean(readConfig());
module.exports = { analyze, isConfigured, AIError: AiError, safeMessage };
