import type { NextRequest } from 'next/server';
import type { User } from '@supabase/supabase-js';
import { getAuthenticatedUserFromRequest } from '@/lib/clients/supabase-server-auth';
import { createServerClient } from '@/lib/clients/supabase-server';
import { UnauthorizedError, ForbiddenError } from '@/lib/errors/app-error';

/**
 * Get authenticated user from request
 * Returns null if not authenticated
 */
export async function getAuthenticatedUser(
  request: NextRequest
): Promise<User | null> {
  return getAuthenticatedUserFromRequest(request);
}

/**
 * Require authentication - throws UnauthorizedError if not authenticated
 * Returns the authenticated user
 */
export async function requireAuth(request: NextRequest): Promise<User> {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    throw new UnauthorizedError('Authentication required');
  }

  return user;
}

/**
 * Check if a user has admin privileges
 * 
 * Currently checks user metadata from JWT (user_metadata.role === 'admin')
 * To set admin role: update user metadata via Supabase Auth Admin API
 * 
 * Future enhancement: Can query auth.users.is_super_admin via database function
 * or Management API for additional verification
 */
export async function isAdmin(user: User): Promise<boolean> {
  // Check user metadata for admin role
  // This is set via: supabase.auth.admin.updateUserById(userId, { user_metadata: { role: 'admin' } })
  const metadataRole = user.user_metadata?.role;
  
  if (metadataRole === 'admin') {
    return true;
  }

  // Note: To check is_super_admin field from auth.users table, you can:
  // 1. Create a database function: CREATE FUNCTION is_user_admin(user_id uuid) RETURNS boolean
  // 2. Call it via: supabase.rpc('is_user_admin', { user_id: user.id })
  // 3. Or use Supabase Management API to query auth.users directly
  
  return false;
}

/**
 * Require admin role - throws ForbiddenError if user is not admin
 * Returns the authenticated admin user
 */
export async function requireAdmin(request: NextRequest): Promise<User> {
  // First check authentication
  const user = await requireAuth(request);

  // Then check admin status
  const userIsAdmin = await isAdmin(user);

  if (!userIsAdmin) {
    throw new ForbiddenError('Admin access required');
  }

  return user;
}

