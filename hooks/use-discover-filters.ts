import { parseAsString, parseAsArrayOf, useQueryStates } from 'nuqs';

/**
 * URL query parameter parsers for discover page filters
 *
 * - view: 'mobile' | 'desktop' - defaults to 'mobile'
 * - categories: array of category slugs - defaults to empty array
 */
export const discoverFiltersParsers = {
  view: parseAsString.withDefault('mobile'),
  categories: parseAsArrayOf(parseAsString, ',').withDefault([]),
};

/**
 * Hook for managing discover page filter state via URL parameters
 *
 * Uses nuqs for shallow URL updates - changes URL instantly without
 * triggering a full page navigation or server re-render.
 *
 * @example
 * ```tsx
 * const [filters, setFilters] = useDiscoverFilters();
 *
 * // Read current filters
 * console.log(filters.view);        // 'mobile' or 'desktop'
 * console.log(filters.categories);  // ['electronics', 'fashion']
 *
 * // Update single filter
 * setFilters({ view: 'desktop' });
 *
 * // Update multiple filters
 * setFilters({ view: 'mobile', categories: ['electronics'] });
 *
 * // Clear categories
 * setFilters({ categories: [] });
 * ```
 */
export function useDiscoverFilters() {
  return useQueryStates(discoverFiltersParsers, {
    shallow: true, // Don't trigger server navigation
    history: 'replace', // Replace history entry, don't push
    scroll: false, // Don't scroll to top on change
  });
}

/**
 * Type for the filter state returned by useDiscoverFilters
 */
export type DiscoverFiltersState = {
  view: string;
  categories: string[];
};

/**
 * Type for the setFilters function
 */
export type SetDiscoverFilters = (
  values: Partial<DiscoverFiltersState>
) => Promise<URLSearchParams>;

