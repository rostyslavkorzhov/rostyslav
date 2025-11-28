import { type NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@/lib/clients/supabase-middleware';
import { isAdmin } from '@/lib/utils/auth';

export async function proxy(request: NextRequest) {
  // Create response to allow cookie updates
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client for proxy
  const supabase = createMiddlewareClient(request, response);

  // Refresh auth token - required for Server Components
  // This ensures the session is valid and up-to-date
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!user) {
      // Not authenticated - redirect to login with return URL
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(user);
    if (!userIsAdmin) {
      // Authenticated but not admin - redirect to home with error message
      const homeUrl = new URL('/', request.url);
      homeUrl.searchParams.set('error', 'access_denied');
      return NextResponse.redirect(homeUrl);
    }

    // User is authenticated and is admin - allow access
    return response;
  }

  // Redirect authenticated users away from auth pages
  if (pathname === '/login' || pathname === '/signup') {
    if (user) {
      // User is authenticated - redirect to discover page (or admin for admins)
      const userIsAdmin = await isAdmin(user);
      const redirectUrl = userIsAdmin ? '/admin' : '/discover/home';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // For all other routes, just refresh the session and continue
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

