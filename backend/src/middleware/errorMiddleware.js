import { env } from "../config/env.js";

export default function errorMiddleware(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error.";

  if (err.code === 11000) {
    statusCode = 409;
    message = "A record with this information already exists.";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Database validation failed.";
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource identifier.";
  }

  if (statusCode >= 500) {
    console.error(err);
    message = "An unexpected server error occurred.";

    if (env.nodeEnv !== "production") {
      message = err.message || message;
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
}