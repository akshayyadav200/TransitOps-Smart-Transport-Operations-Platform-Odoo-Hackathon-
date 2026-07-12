export function notFound(message) {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
}

export function badRequest(message, field) {
  const error = new Error(message);
  error.statusCode = 400;
  error.errors = field ? [{ field, message }] : [];
  return error;
}

export function conflict(message, field) {
  const error = new Error(message);
  error.statusCode = 409;
  error.errors = field ? [{ field, message }] : [];
  return error;
}
