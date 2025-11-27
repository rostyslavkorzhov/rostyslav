import type { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireAdmin } from '@/lib/utils/auth';
import { handleError } from '@/lib/errors/error-handler';

/**
 * Route handler type for Next.js App Router
 */
type RouteHandler = (
  request: NextRequest,
  context?: any
) => Promise<NextResponse>;

/**
 * Higher-order function to wrap route handlers with authentication requirement
 * Returns 401 if user is not authenticated
 */
export function withAuth(handler: RouteHandler): RouteHandler {
  return async (request: NextRequest, context?: any) => {
    try {
      // Require authentication - throws UnauthorizedError if not authenticated
      await requireAuth(request);

      // Call the original handler
      return handler(request, context);
    } catch (error) {
      return handleError(error);
    }
  };
}

/**
 * Higher-order function to wrap route handlers with admin requirement
 * Returns 401 if user is not authenticated
 * Returns 403 if user is authenticated but not an admin
 */
export function withAdmin(handler: RouteHandler): RouteHandler {
  return async (request: NextRequest, context?: any) => {
    try {
      // Require admin - throws UnauthorizedError or ForbiddenError if not authorized
      await requireAdmin(request);

      // Call the original handler
      return handler(request, context);
    } catch (error) {
      return handleError(error);
    }
  };
}

