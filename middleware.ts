import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for protecting admin routes
 * Note: Client-side auth check in admin layout provides additional protection
 */
export async function middleware(request: NextRequest) {
  // For MVP, we rely on client-side auth check in admin layout
  // This middleware can be enhanced later with server-side session verification
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

