/**
 * Client module exports
 * Provides singleton instances of all API clients
 */
import { createClientClient, PageQueries } from './supabase.client';
import { getServerClient } from './supabase-server';

// Singleton instances
let pageQueries: PageQueries | null = null;
let serverPageQueries: PageQueries | null = null;

/**
 * Get or create Page queries instance (client-side)
 */
export function getPageQueries(): PageQueries {
  if (!pageQueries) {
    const client = createClientClient();
    pageQueries = new PageQueries(client);
  }
  return pageQueries;
}

/**
 * Get or create Page queries instance (server-side)
 * Uses service role key to bypass RLS
 */
export function getServerPageQueries(): PageQueries {
  if (!serverPageQueries) {
    const client = getServerClient();
    serverPageQueries = new PageQueries(client);
  }
  return serverPageQueries;
}

/**
 * Export client classes and functions for direct use if needed
 */
export { createClientClient, getClient, PageQueries } from './supabase.client';
export { getServerClient, createServerClient } from './supabase-server';

