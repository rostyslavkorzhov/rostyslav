'use client';

import { useEffect, useState } from 'react';
import { BrandGrid } from '@/components/gallery/brand-grid';
import { FilterBar } from '@/components/gallery/filter-bar';
import { LoadingState } from '@/components/ui/loading-state';
import type { BrandWithPages } from '@/types';
import type { GetBrandsResponse } from '@/types/api';

export default function Home() {
  const [brands, setBrands] = useState<BrandWithPages[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<{
    category?: string;
    country?: string;
    pageType?: string;
    search?: string;
  }>({});

  useEffect(() => {
    async function loadBrands() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.category) params.set('category', filters.category);
        if (filters.country) params.set('country', filters.country);
        if (filters.pageType) params.set('page_type', filters.pageType);
        if (filters.search) params.set('search', filters.search);

        const response = await fetch(`/api/brands?${params.toString()}`);
        
        if (!response.ok) {
          // Try to parse error response
          let errorMessage = 'Failed to load brands';
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
            console.error('API Error:', {
              status: response.status,
              statusText: response.statusText,
              error: errorData,
            });
          } catch {
            // If JSON parsing fails, use status text
            errorMessage = `${errorMessage}: ${response.statusText} (${response.status})`;
            console.error('API Error:', {
              status: response.status,
              statusText: response.statusText,
            });
          }
          throw new Error(errorMessage);
        }

        const data: GetBrandsResponse = await response.json();
        setBrands(data.data);
      } catch (error) {
        console.error('Failed to load brands:', error);
        // You could set an error state here to display to the user
      } finally {
        setLoading(false);
      }
    }

    loadBrands();
  }, [filters]);

  return (
    <div className='container mx-auto flex-1 px-5 py-16'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-8 text-center'>
          <h1 className='text-title-h1 text-text-strong-950 mb-4'>
            Welcome
          </h1>
          <p className='text-paragraph-lg text-text-sub-600'>
            Let's work on this together!
          </p>
        </div>

        <FilterBar
          category={filters.category}
          country={filters.country}
          pageType={filters.pageType}
          search={filters.search}
          onFilterChange={setFilters}
        />

        {loading ? (
          <LoadingState message='Loading brands...' />
        ) : (
          <BrandGrid brands={brands} />
        )}
      </div>
    </div>
  );
}
