'use client';

import useSWR from 'swr';
import { getPageQueries } from '@/lib/clients';
import type { PageFilters, PageWithRelations } from '@/types';

interface PagesResult {
  data: PageWithRelations[];
  count: number;
  hasMore: boolean;
}

/**
 * Client-side hook for fetching pages with filters
 * Uses SWR for caching and revalidation
 */
export function usePages(filters: PageFilters) {
  // Create a stable key from filters for SWR caching
  const key = ['pages', filters.page_type_slug, filters.view, filters.category_slugs?.join(',') || ''];

  return useSWR<PagesResult>(
    key,
    async () => {
      const queries = getPageQueries();
      return queries.listPagesByType(filters);
    },
    {
      // Keep previous data while fetching new data (smoother UX)
      keepPreviousData: true,
      // Revalidate on focus for fresh data
      revalidateOnFocus: false,
      // Don't revalidate on reconnect (user-initiated filters)
      revalidateOnReconnect: false,
    }
  );
}

