export class AppError extends Error {
  status: number;
  code: string;
  details?: any;

  constructor(
    message: string,
    status = 400,
    code = "BAD_REQUEST",
    details?: any
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found", details?: any) {
    super(message, 404, "NOT_FOUND", details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", details?: any) {
    super(message, 401, "UNAUTHORIZED", details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", details?: any) {
    super(message, 403, "FORBIDDEN", details);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", details?: any) {
    super(message, 409, "CONFLICT", details);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request", details?: any) {
    super(message, 400, "BAD_REQUEST", details);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", details?: any) {
    super(message, 422, "VALIDATION_ERROR", details);
  }
}
