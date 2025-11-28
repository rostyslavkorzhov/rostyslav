'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { PageGrid } from '@/components/gallery/page-grid';
import { DiscoverFilters } from '@/components/gallery/discover-filters';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageContainer } from '@/components/page-container';
import type { PageWithRelations, Category, ViewType, PageTypeSlug } from '@/types';

const VALID_TYPES: PageTypeSlug[] = ['product', 'home', 'about'];

export default function DiscoverPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const type = params.type as string;

  const [pages, setPages] = useState<PageWithRelations[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Validate type - moved after hooks
  const isValidType = VALID_TYPES.includes(type as PageTypeSlug);

  // Get filters from URL
  const view = (searchParams.get('view') || 'mobile') as ViewType;
  const categorySlugsParam = searchParams.get('categories');
  const selectedCategories = categorySlugsParam
    ? categorySlugsParam.split(',').map((s) => s.trim())
    : [];

  // Update URL when filters change
  const updateFilters = useCallback(
    (newView?: ViewType, newCategories?: string[]) => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (newView !== undefined) {
        params.set('view', newView);
      }
      
      if (newCategories !== undefined) {
        if (newCategories.length === 0) {
          params.delete('categories');
        } else {
          params.set('categories', newCategories.join(','));
        }
      }
      
      router.push(`/discover/${type}?${params.toString()}`);
    },
    [router, searchParams, type]
  );

  // Load categories
  useEffect(() => {
    if (!isValidType) return;
    
    async function loadCategories() {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.data || []);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    }
    loadCategories();
  }, [isValidType]);

  // Load pages
  useEffect(() => {
    if (!isValidType) return;
    
    async function loadPages() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        queryParams.set('view', view);
        if (selectedCategories.length > 0) {
          queryParams.set('categories', selectedCategories.join(','));
        }

        const response = await fetch(`/api/discover/${type}?${queryParams.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to load pages');
        }

        const data = await response.json();
        setPages(data.data || []);
        setCount(data.count || 0);
        setHasMore(data.hasMore || false);
      } catch (error) {
        console.error('Failed to load pages:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPages();
  }, [type, view, selectedCategories.join(','), isValidType]);

  // Show error for invalid type
  if (!isValidType) {
    return (
      <PageContainer>
        <ErrorState
          title='Invalid page type'
          message='Page type must be product, home, or about.'
        />
      </PageContainer>
    );
  }

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
        view={view}
        selectedCategories={selectedCategories}
        categories={categories}
        onViewChange={(newView) => updateFilters(newView)}
        onCategoriesChange={(newCategories) => updateFilters(undefined, newCategories)}
      />

      {loading ? (
        <LoadingState message='Loading pages...' />
      ) : (
        <>
          <PageGrid pages={pages} />
          {hasMore && (
            <div className='mt-8 text-center'>
              <p className='text-label-sm text-text-sub-600'>
                Showing {pages.length} of {count} pages
              </p>
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}

