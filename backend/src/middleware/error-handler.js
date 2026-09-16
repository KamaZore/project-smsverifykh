import logger from "../utils/logger.js";

export default function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl}`, {
      statusCode,
      message,
      stack: err.stack,
    });
  } else {
    logger.warn(`${req.method} ${req.originalUrl} - ${message}`);
  }

  const response = {
    success: false,
    error: {
      title: err.name || "Error",
      message,
      ...(err.details && { details: err.details }),
    },
  };

  res.status(statusCode).json(response);
}
