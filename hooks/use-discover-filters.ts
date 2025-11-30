'use client';

import { parseAsString, parseAsArrayOf, useQueryStates } from 'nuqs';

/**
 * URL state parsers for discover page filters
 * Defines the schema for filter parameters in the URL
 */
export const filtersParsers = {
  view: parseAsString.withDefault('mobile'),
  categories: parseAsArrayOf(parseAsString, ',').withDefault([]),
};

/**
 * Hook to manage discover page filter state via URL parameters
 * Uses nuqs for shallow URL updates (no full page navigation)
 *
 * @returns Tuple of [filters, setFilters] where:
 *   - filters: Current filter values from URL
 *   - setFilters: Function to update filters (updates URL instantly)
 *
 * @example
 * const [filters, setFilters] = useDiscoverFilters();
 * setFilters({ view: 'desktop' }); // URL updates instantly
 * setFilters({ categories: ['electronics', 'fashion'] });
 */
export function useDiscoverFilters() {
  return useQueryStates(filtersParsers, {
    shallow: true, // Don't trigger server navigation
    history: 'replace', // Replace history entry, don't push
  });
}

