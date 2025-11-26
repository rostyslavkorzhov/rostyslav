import { NextResponse } from 'next/server';
import { AppError } from './app-error';
import { createErrorResponse } from './error-responses';

/**
 * Convert an error to a standardized HTTP response
 */
export function handleError(error: unknown): NextResponse {
  // If it's already an AppError, use its properties
  if (error instanceof AppError) {
    return NextResponse.json(
      createErrorResponse(error.message, error.code, error.details),
      { status: error.statusCode }
    );
  }

  // If it's a standard Error, return 500
  if (error instanceof Error) {
    console.error('Unhandled error:', error);
    return NextResponse.json(
      createErrorResponse(
        error.message || 'Internal server error',
        'INTERNAL_ERROR'
      ),
      { status: 500 }
    );
  }

  // Unknown error type
  console.error('Unknown error type:', error);
  return NextResponse.json(
    createErrorResponse('Internal server error', 'UNKNOWN_ERROR'),
    { status: 500 }
  );
}

/**
 * Wrapper for async route handlers that automatically handles errors
 */
export function withErrorHandler<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleError(error);
    }
  };
}

