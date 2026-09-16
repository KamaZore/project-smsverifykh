export class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad Request", details = null) {
    super(message, 400, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", details = null) {
    super(message, 401, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", details = null) {
    super(message, 403, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found", details = null) {
    super(message, 404, details);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = "Too Many Requests", details = null) {
    super(message, 429, details);
  }
}

export class BadServiceError extends AppError {
  constructor(message = "BAD_SERVICE", details = null) {
    super(message, 200, details);
  }
}

export class BadCountryError extends AppError {
  constructor(message = "BAD_COUNTRY", details = null) {
    super(message, 200, details);
  }
}

export class BadKeyError extends AppError {
  constructor(message = "BAD_KEY", details = null) {
    super(message, 401, details);
  }
}

export class BadActionError extends AppError {
  constructor(message = "BAD_ACTION", details = null) {
    super(message, 200, details);
  }
}

export class BadNumberError extends AppError {
  constructor(message = "BAD_NUMBER", details = null) {
    super(message, 200, details);
  }
}

export class BadStatusError extends AppError {
  constructor(message = "BAD_STATUS", details = null) {
    super(message, 200, details);
  }
}

export class FullNumberError extends AppError {
  constructor(message = "FULL_NUMBER", details = null) {
    super(message, 200, details);
  }
}

export class NoNumbersError extends AppError {
  constructor(message = "NO_NUMBERS", details = null) {
    super(message, 200, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", details = null) {
    super(message, 409, details);
  }
}
