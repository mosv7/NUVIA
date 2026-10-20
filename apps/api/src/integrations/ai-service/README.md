# Future AI integration

This is the intended boundary for Node-to-FastAPI transport, timeouts and error translation. No AI integration is implemented. The health-only scaffold lives in `apps/ai-service`; its liveness response does not establish analysis readiness.

Do not expose Node database credentials to the AI service or have the browser call it directly. Define authenticated internal requests, owner-scoped inputs, versioned outputs, retries and failure states before enabling a real pipeline.
