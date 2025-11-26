/**
 * Base application error class
 * Extends Error with HTTP status code and optional error code
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    
    // Maintains proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}

/**
 * Common error types for consistent error handling
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(400, message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', details?: unknown) {
    super(404, message, 'NOT_FOUND', details);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized', details?: unknown) {
    super(401, message, 'UNAUTHORIZED', details);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden', details?: unknown) {
    super(403, message, 'FORBIDDEN', details);
    this.name = 'ForbiddenError';
  }
}

export class ExternalApiError extends AppError {
  constructor(
    message: string,
    public service: string,
    details?: unknown
  ) {
    super(502, message, 'EXTERNAL_API_ERROR', details);
    this.name = 'ExternalApiError';
  }
}

export class ConfigurationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(500, message, 'CONFIGURATION_ERROR', details);
    this.name = 'ConfigurationError';
  }
}

