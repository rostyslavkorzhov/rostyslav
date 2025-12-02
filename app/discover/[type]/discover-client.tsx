'use client';

import { useCallback } from 'react';
import { useQueryStates, parseAsNativeArrayOf, parseAsString } from 'nuqs';
import { PageGrid } from '@/components/gallery/page-grid';
import { PageGridSkeleton } from '@/components/gallery/page-grid-skeleton';
import { DiscoverFilters } from '@/components/gallery/discover-filters';
import { PageContainer } from '@/components/page-container';
import { ErrorState } from '@/components/ui/error-state';
import * as Alert from '@/components/ui/alert';
import { RiErrorWarningLine } from '@remixicon/react';
import { usePages } from '@/hooks/use-pages';
import type { Category, ViewType, PageTypeSlug } from '@/types';

interface DiscoverClientProps {
  type: PageTypeSlug;
  categories: Category[];
}

export function DiscoverClient({ type, categories }: DiscoverClientProps) {
  // nuqs handles URL params with instant updates (no startTransition delay)
  // Using parseAsNativeArrayOf for individual params: ?category=food&category=beauty (cleaner URLs)
  // Using 'category' (singular) in URL to match industry standards (Mobbin, Land-book pattern)
  const [{ view, categories: categorySlugs }, setFilters] = useQueryStates(
    {
      view: parseAsString.withDefault('mobile'),
      categories: parseAsNativeArrayOf(parseAsString).withDefault([]),
    },
    {
      urlKeys: {
        categories: 'category', // Use 'category' in URL instead of 'categories'
      },
    }
  );

  // SWR handles client-side data fetching with caching
  const { data, isLoading, error, mutate } = usePages({
    page_type_slug: type,
    view: view as ViewType,
    category_slugs: categorySlugs.length > 0 ? categorySlugs : undefined,
    limit: 20,
    offset: 0,
  });

  // Instant filter updates - no transition delay
  const handleViewChange = useCallback(
    (newView: ViewType) => {
      setFilters({ view: newView });
    },
    [setFilters]
  );

  const handleCategoriesChange = useCallback(
    (newCategories: string[]) => {
      setFilters({ categories: newCategories.length > 0 ? newCategories : null });
    },
    [setFilters]
  );

  const pageTypeName = type.charAt(0).toUpperCase() + type.slice(1);
  const pages = data?.data || [];
  const hasMore = data?.hasMore || false;
  const totalCount = data?.count || 0;

  return (
    <PageContainer>
      <div className='mb-8 text-center'>
        <h1 className='text-title-h1 text-text-strong-950 mb-4'>
          Discover {pageTypeName} Pages
        </h1>
        <p className='text-paragraph-lg text-text-sub-600'>
          Browse {pageTypeName.toLowerCase()} pages from top e-commerce brands
        </p>
      </div>

      <DiscoverFilters
        view={view as ViewType}
        selectedCategories={categorySlugs}
        categories={categories}
        onViewChange={handleViewChange}
        onCategoriesChange={handleCategoriesChange}
      />

      {isLoading && !data ? (
        <PageGridSkeleton count={8} />
      ) : error && !data ? (
        // Only show full error state if there's no previous data
        <ErrorState
          message="Failed to load pages. Please try again."
          onRetry={() => mutate()}
        />
      ) : (
        <>
          {/* Show error banner if there's an error but previous data exists */}
          {error && data && (
            <Alert.Root
              variant='lighter'
              status='error'
              size='small'
              className='mb-6'
            >
              <Alert.Icon as={RiErrorWarningLine} />
              <div className='flex items-center justify-between flex-1'>
                <p className='text-paragraph-sm text-text-sub-600'>
                  Failed to refresh pages. Showing previous results.
                </p>
                <button
                  onClick={() => mutate()}
                  className='text-label-sm text-primary-base hover:text-primary-hover underline ml-4'
                >
                  Retry
                </button>
              </div>
            </Alert.Root>
          )}
          <PageGrid pages={pages} />
          {hasMore && (
            <div className='mt-8 text-center'>
              <p className='text-label-sm text-text-sub-600'>
                Showing {pages.length} of {totalCount} pages
              </p>
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}
