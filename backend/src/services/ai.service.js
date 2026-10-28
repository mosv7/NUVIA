const { callService, readConfig } = require('../integrations/ai-service/client');
const { operations } = require('../integrations/ai-service/contracts');

async function execute(operation, payload, options) {
  if (operation === 'capabilities' && !readConfig()) {
    return {
      schema_version: '1',
      capabilities: Object.fromEntries(
        operations.map((op) => [
          op,
          {
            ready: false,
            reason: 'service_not_configured',
            models: [],
            profile: '0'.repeat(64),
          },
        ]),
      ),
    };
  }
  return callService(operation, payload, options);
}

module.exports = { execute };
