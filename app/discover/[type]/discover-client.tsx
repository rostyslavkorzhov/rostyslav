'use client';

import { useCallback, useState, useTransition, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PageGrid } from '@/components/gallery/page-grid';
import { DiscoverFilters } from '@/components/gallery/discover-filters';
import { PageContainer } from '@/components/page-container';
import type { PageWithRelations, Category, ViewType, PageTypeSlug } from '@/types';

interface DiscoverClientProps {
  type: PageTypeSlug;
  initialPages: PageWithRelations[];
  initialCount: number;
  initialHasMore: boolean;
  categories: Category[];
  initialView: ViewType;
  initialSelectedCategories: string[];
}

export function DiscoverClient({
  type,
  initialPages,
  initialCount,
  initialHasMore,
  categories,
  initialView,
  initialSelectedCategories,
}: DiscoverClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Optimistic state for immediate UI updates
  const [optimisticView, setOptimisticView] = useState<ViewType>(initialView);
  const [optimisticCategories, setOptimisticCategories] = useState<string[]>(
    initialSelectedCategories
  );

  // Sync optimistic state with URL when it changes (after server update)
  useEffect(() => {
    const urlView = (searchParams.get('view') || initialView) as ViewType;
    const urlCategories = searchParams.get('categories')
      ? searchParams.get('categories')!.split(',').map((s) => s.trim())
      : initialSelectedCategories;

    setOptimisticView(urlView);
    setOptimisticCategories(urlCategories);
  }, [searchParams, initialView, initialSelectedCategories]);

  // Update URL when filters change
  const updateFilters = useCallback(
    (newView?: ViewType, newCategories?: string[]) => {
      const params = new URLSearchParams(searchParams.toString());

      if (newView !== undefined) {
        params.set('view', newView);
        setOptimisticView(newView);
      }

      if (newCategories !== undefined) {
        if (newCategories.length === 0) {
          params.delete('categories');
        } else {
          params.set('categories', newCategories.join(','));
        }
        setOptimisticCategories(newCategories);
      }

      // Use startTransition to mark navigation as non-urgent
      // This allows React to update the UI immediately before navigation
      startTransition(() => {
        router.replace(`/discover/${type}?${params.toString()}`);
      });
    },
    [router, searchParams, type]
  );

  // Stable callbacks for filter changes
  const handleViewChange = useCallback(
    (newView: ViewType) => {
      updateFilters(newView);
    },
    [updateFilters]
  );

  const handleCategoriesChange = useCallback(
    (newCategories: string[]) => {
      updateFilters(undefined, newCategories);
    },
    [updateFilters]
  );

  const pageTypeName = type.charAt(0).toUpperCase() + type.slice(1);

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
        view={optimisticView}
        selectedCategories={optimisticCategories}
        categories={categories}
        onViewChange={handleViewChange}
        onCategoriesChange={handleCategoriesChange}
      />

      <PageGrid pages={initialPages} />
      {initialHasMore && (
        <div className='mt-8 text-center'>
          <p className='text-label-sm text-text-sub-600'>
            Showing {initialPages.length} of {initialCount} pages
          </p>
        </div>
      )}
    </PageContainer>
  );
}

