/**
 * Client module exports
 * Provides singleton instances of all API clients
 */
import { URLBoxClient } from './urlbox.client';
import { createClientClient, BrandQueries, PageQueries } from './supabase.client';
import { getServerClient } from './supabase-server';

// Singleton instances
let urlboxClient: URLBoxClient | null = null;
let brandQueries: BrandQueries | null = null;
let pageQueries: PageQueries | null = null;
let serverBrandQueries: BrandQueries | null = null;
let serverPageQueries: PageQueries | null = null;

/**
 * Get or create URLBox client instance
 */
export function getURLBoxClient(): URLBoxClient {
  if (!urlboxClient) {
    urlboxClient = new URLBoxClient();
  }
  return urlboxClient;
}

/**
 * Get or create Brand queries instance (client-side)
 */
export function getBrandQueries(): BrandQueries {
  if (!brandQueries) {
    const client = createClientClient();
    brandQueries = new BrandQueries(client);
  }
  return brandQueries;
}

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
 * Get or create Brand queries instance (server-side)
 * Uses service role key to bypass RLS
 */
export function getServerBrandQueries(): BrandQueries {
  if (!serverBrandQueries) {
    const client = getServerClient();
    serverBrandQueries = new BrandQueries(client);
  }
  return serverBrandQueries;
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
export { URLBoxClient } from './urlbox.client';
export { createClientClient, getClient, BrandQueries, PageQueries } from './supabase.client';
export { getServerClient, createServerClient } from './supabase-server';

