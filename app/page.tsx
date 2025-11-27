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
          let errorData: unknown = null;
          let rawResponseText = '';
          
          try {
            rawResponseText = await response.text();
            if (rawResponseText) {
              try {
                errorData = JSON.parse(rawResponseText);
                // Check if errorData has the expected structure
                if (errorData && typeof errorData === 'object' && 'error' in errorData) {
                  errorMessage = String((errorData as { error?: string }).error) || errorMessage;
                } else if (errorData && typeof errorData === 'object') {
                  // Check if it's an empty object
                  const hasKeys = Object.keys(errorData).length > 0;
                  if (!hasKeys) {
                    errorData = null; // Treat empty object as no data
                  }
                }
              } catch {
                // If JSON parsing fails, use the text as error message
                errorMessage = rawResponseText || errorMessage;
              }
            }
          } catch {
            // If reading response fails, use status text
            errorMessage = `${errorMessage}: ${response.statusText} (${response.status})`;
          }
          
          // Build error log object
          const errorLog: Record<string, unknown> = {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
          };
          
          // Only include error data if it exists and has content
          if (errorData !== null) {
            errorLog.error = errorData;
          } else if (rawResponseText) {
            errorLog.rawResponse = rawResponseText;
          } else {
            errorLog.error = 'No error details available';
          }
          
          console.error('API Error:', errorLog);
          
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
