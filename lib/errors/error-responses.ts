/**
 * Standardized error response format
 */
export interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
}

/**
 * Success response format
 */
export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
}

/**
 * API response type (either success or error)
 */
export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

/**
 * Create a standardized error response object
 */
export function createErrorResponse(
  error: string,
  code?: string,
  details?: unknown
): ErrorResponse {
  const response: ErrorResponse = {
    success: false,
    error,
  };
  
  if (code) {
    response.code = code;
  }
  
  if (details !== undefined && details !== null) {
    response.details = details;
  }
  
  return response;
}

/**
 * Create a standardized success response object
 */
export function createSuccessResponse<T>(data: T): SuccessResponse<T> {
  return {
    success: true,
    data,
  };
}

