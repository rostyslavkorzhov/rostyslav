import { createClientClient } from '@/lib/clients/supabase.client';
import type { User } from '@supabase/supabase-js';

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
      throw error;
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
      throw error;
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

