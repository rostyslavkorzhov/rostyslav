import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/clients/supabase-server';
import { handleError } from '@/lib/errors/error-handler';

export const dynamic = 'force-dynamic';

/**
 * GET /api/auth/callback
 * Handle Supabase auth callback
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (code) {
      const supabase = createServerClient();
      await supabase.auth.exchangeCodeForSession(code);
    }

    // Redirect to home page
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    return handleError(error);
  }
}

