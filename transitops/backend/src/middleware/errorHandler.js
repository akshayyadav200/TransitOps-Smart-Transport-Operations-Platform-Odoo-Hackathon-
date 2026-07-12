import mongoose from "mongoose";
import { isProduction } from "../config/env.js";
import { errorResponse } from "../utils/apiResponse.js";

function formatValidationErrors(error) {
  return Object.values(error.errors).map((fieldError) => ({
    field: fieldError.path,
    message: fieldError.message
  }));
}

function normalizeError(error) {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return {
      statusCode: 400,
      message: "Malformed JSON request body",
      errors: []
    };
  }

  if (error?.type === "entity.too.large") {
    return {
      statusCode: 413,
      message: "Request body is too large",
      errors: []
    };
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return {
      statusCode: 400,
      message: "Validation failed",
      errors: formatValidationErrors(error)
    };
  }

  if (error instanceof mongoose.Error.CastError) {
    return {
      statusCode: 400,
      message: "Invalid identifier",
      errors: [{ field: error.path, message: "Invalid identifier format" }]
    };
  }

  if (error?.code === 11000) {
    return {
      statusCode: 409,
      message: "Duplicate record",
      errors: Object.keys(error.keyPattern ?? {}).map((field) => ({
        field,
        message: `${field} must be unique`
      }))
    };
  }

  return {
    statusCode: error.statusCode ?? 500,
    message: error.message ?? "Internal server error",
    errors: error.errors ?? []
  };
}

export function notFoundHandler(req, _res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(error, _req, res, _next) {
  const normalized = normalizeError(error);
  const message = isProduction && normalized.statusCode >= 500 ? "Internal server error" : normalized.message;
  const errors = isProduction && normalized.statusCode >= 500 ? [] : normalized.errors;

  return errorResponse(res, {
    statusCode: normalized.statusCode,
    message,
    errors
  });
}
