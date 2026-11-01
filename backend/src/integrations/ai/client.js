// The only place that talks to the Python AI service. Everything else calls `analyze(texts)`.
//
// Contract (AI APIs - Backend Handoff, 29 Oct 2026):
//   POST {AI_SERVICE_URL}/api/v1/analyze   header X-AI-Service-Token   body { texts:[{id,text}] }
//   Errors come back as { error: { code } } with HTTP 400/401/413/429/502/503/504.
//
// Config (.env):
//   AI_SERVICE_URL=http://127.0.0.1:8000      empty = AI not configured (responses are saved, analysis shows "failed")
//   AI_SERVICE_TOKEN=...                      (AI_SERVICE_API_KEY is accepted as an alias)
//   AI_TIMEOUT_MS=190000                      the service itself gives up after 180 s
//   AI_MAX_RETRIES=3                          only for "busy" (429) and "unreachable"; never for other errors
//   AI_MAX_RESPONSE_BYTES=2000000

const config = () => ({
  url: String(process.env.AI_SERVICE_URL || "").replace(/\/+$/, ""),
  token: process.env.AI_SERVICE_TOKEN || process.env.AI_SERVICE_API_KEY || "",
  timeoutMs: Number(process.env.AI_TIMEOUT_MS) || 190000,
  maxRetries: process.env.AI_MAX_RETRIES === undefined ? 3 : Number(process.env.AI_MAX_RETRIES),
  maxBytes: Number(process.env.AI_MAX_RESPONSE_BYTES) || 2_000_000,
});

// Safe codes only. The owner never sees raw AI output or stack traces.
const MESSAGES = {
  AI_NOT_CONFIGURED: "The analysis service is not set up yet.",
  AI_UNAVAILABLE: "The analysis service is not available right now.",
  AI_UNREACHABLE: "The analysis service could not be reached.",
  AI_BUSY: "The analysis service is busy.",
  AI_TIMEOUT: "The analysis took too long.",
  AI_INPUT_INVALID: "This feedback could not be analysed.",
  AI_INPUT_TOO_LARGE: "This feedback is too long to analyse.",
  AI_OUTPUT_INVALID: "The analysis result was not usable.",
  AI_MALFORMED: "The analysis result was not usable.",
  INTERNAL: "Something went wrong while analysing this feedback.",
};

class AIError extends Error {
  constructor(code, status) {
    super(code);
    this.name = "AIError";
    this.code = code;
    this.status = status;
    this.retryable = code === "AI_BUSY" || code === "AI_UNREACHABLE";
  }
}

const safeMessage = (code) => MESSAGES[code] || MESSAGES.INTERNAL;

// HTTP status from the service -> our code (handoff section 09).
const mapStatus = (status) => {
  if (status === 400) return "AI_INPUT_INVALID";
  if (status === 401 || status === 503) return "AI_UNAVAILABLE";
  if (status === 413) return "AI_INPUT_TOO_LARGE";
  if (status === 429) return "AI_BUSY";
  if (status === 502) return "AI_OUTPUT_INVALID";
  if (status === 504) return "AI_TIMEOUT";
  return "AI_UNAVAILABLE";
};

const isConfigured = () => {
  const c = config();
  return Boolean(c.url && c.token);
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const postOnce = async (path, body, { signal } = {}) => {
  const c = config();
  if (!c.url || !c.token) throw new AIError("AI_NOT_CONFIGURED");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), c.timeoutMs);
  const onAbort = () => controller.abort();
  if (signal) signal.addEventListener("abort", onAbort, { once: true });

  let response;
  try {
    response = await fetch(`${c.url}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-AI-Service-Token": c.token },
      body: JSON.stringify(body),
      signal: controller.signal,
      redirect: "error",
    });
  } catch (error) {
    clearTimeout(timer);
    if (signal) signal.removeEventListener("abort", onAbort);
    if (controller.signal.aborted) throw new AIError("AI_TIMEOUT");
    throw new AIError("AI_UNREACHABLE");
  }

  try {
    const text = await response.text();
    if (Buffer.byteLength(text) > c.maxBytes) throw new AIError("AI_MALFORMED", response.status);
    if (!response.ok) throw new AIError(mapStatus(response.status), response.status);

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      throw new AIError("AI_MALFORMED", response.status);
    }
    if (!json || typeof json !== "object" || Array.isArray(json)) throw new AIError("AI_MALFORMED", response.status);
    return json;
  } catch (error) {
    if (error instanceof AIError) throw error;
    if (controller.signal.aborted) throw new AIError("AI_TIMEOUT");
    throw new AIError("AI_UNREACHABLE");
  } finally {
    clearTimeout(timer);
    if (signal) signal.removeEventListener("abort", onAbort);
  }
};

// "Busy" and "unreachable" are worth another try after a short wait. Everything else is final:
// the production endpoints make one attempt, and retrying a rejected input only repeats the rejection.
const post = async (path, body, options = {}) => {
  const { maxRetries } = config();
  const wait = options.retryDelayMs ?? 1500;
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await postOnce(path, body, options);
    } catch (error) {
      if (!(error instanceof AIError) || !error.retryable || attempt >= maxRetries) throw error;
      await sleep(wait * (attempt + 1));
    }
  }
};

// texts: [{ id, text }]  ->  the service's JSON (common envelope: { schema_version, operation, provenance, result })
const analyze = (texts, options) => post("/api/v1/analyze", { texts }, options);

module.exports = { analyze, isConfigured, AIError, safeMessage, mapStatus };
