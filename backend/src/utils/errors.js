// Shared error helpers for the survey modules.
//   throw fail("Survey not found", 404);
//   throw fail("Survey is not ready to publish", 422, [{ field: "questions", message: "..." }]);
const fail = (message, statusCode = 400, errors) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (errors) error.errors = errors;
  return error;
};

// Known errors (made with fail) keep their message and status code.
// Mongoose validation problems become 400. Anything else is a bug: log it, hide the details.
const handleError = (res, error) => {
  if (error.statusCode) {
    const body = { message: error.message };
    if (error.errors) body.errors = error.errors;
    return res.status(error.statusCode).json(body);
  }

  if (error.name === "ValidationError" || error.name === "CastError") {
    return res.status(400).json({ message: error.message });
  }

  console.error(error);
  return res.status(500).json({ message: "Something went wrong, please try again" });
};

module.exports = { fail, handleError };
