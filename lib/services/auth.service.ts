import { createClientClient } from '@/lib/clients/supabase.client';
import type { User, AuthError } from '@supabase/supabase-js';

/**
 * Translate Supabase auth errors to user-friendly messages
 * Preserves technical error details in console for debugging
 */
function translateAuthError(error: AuthError): Error {
  // Log technical error details for debugging
  console.error('Auth error:', {
    message: error.message,
    status: error.status,
    name: error.name,
  });

  // Map common Supabase auth errors to user-friendly messages
  const errorMessage = error.message || '';
  
  if (errorMessage.includes('User already registered') || errorMessage.includes('already registered')) {
    return new Error('An account with this email already exists. Please sign in instead.');
  }
  
  if (errorMessage.includes('Invalid login credentials') || errorMessage.includes('Invalid credentials')) {
    return new Error('Invalid email or password. Please try again.');
  }
  
  if (errorMessage.includes('Email not confirmed') || errorMessage.includes('email_not_confirmed')) {
    return new Error('Please check your email and confirm your account.');
  }
  
  if (errorMessage.includes('Password should be at least') || errorMessage.includes('Password is too short')) {
    return new Error('Password must be at least 8 characters long.');
  }
  
  if (errorMessage.includes('Email rate limit exceeded')) {
    return new Error('Too many requests. Please try again later.');
  }
  
  // Generic fallback for unknown errors
  return new Error(errorMessage || 'An error occurred. Please try again.');
}

/**
 * Auth service
 * Handles authentication operations
 */
export class AuthService {
  private client = createClientClient();

  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || '',
        },
      },
    });

    if (error) {
      throw translateAuthError(error);
    }

    return data;
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw translateAuthError(error);
    }

    return data;
  }

  /**
   * Sign out
   */
  async signOut() {
    const { error } = await this.client.auth.signOut();

    if (error) {
      throw error;
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
    } = await this.client.auth.getUser();

    return user;
  }

  /**
   * Get current session
   */
  async getSession() {
    const {
      data: { session },
    } = await this.client.auth.getSession();

    return session;
  }

  /**
   * Get auth client (for use in components)
   */
  getClient() {
    return this.client;
  }
}

