export class ApiError extends Error {
  constructor(status, code, details = []) {
    super(code);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
export function errorHandler(error, req, res, _next) {
  if (res.headersSent) return;
  const duplicate = error.code === 11000;
  const unavailable = /^Mongo(?:Network|ServerSelection|TopologyClosed|NotConnected)/.test(
    error.name,
  );
  const status = error.status || (duplicate ? 409 : unavailable ? 503 : 500);
  const code =
    error instanceof ApiError
      ? error.code
      : duplicate
        ? 'CONFLICT'
        : status === 413
          ? 'PAYLOAD_TOO_LARGE'
          : status === 400
            ? 'INVALID_JSON'
            : unavailable
              ? 'SERVICE_UNAVAILABLE'
              : 'INTERNAL_ERROR';
  if (status === 503) res.set('Retry-After', '5');
  res.status(status).json({
    error: { code, message: code, details: error instanceof ApiError ? error.details : [] },
    request_id: req.requestId,
  });
}
