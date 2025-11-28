'use client';

import { useState } from 'react';
import { LoadingState } from '@/components/ui/loading-state';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { CategoryFilter } from '@/components/gallery/category-filter';
import * as Button from '@/components/ui/button';

function ComponentShowcase({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
      <h4 className='text-title-h5 mb-6 text-text-strong-950'>{title}</h4>
      <div className='flex flex-wrap gap-4'>{children}</div>
    </div>
  );
}

const mockCategories = [
  { id: '1', name: 'Fashion', slug: 'fashion' },
  { id: '2', name: 'Electronics', slug: 'electronics' },
  { id: '3', name: 'Home & Garden', slug: 'home-garden' },
  { id: '4', name: 'Sports', slug: 'sports' },
  { id: '5', name: 'Books', slug: 'books' },
];

export function PatternsShowcase() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [hasError, setHasError] = useState(false);

  return (
    <div>
      <h3 className='text-title-h4 mb-6 text-text-strong-950'>Patterns</h3>

      <div className='space-y-8'>
        {/* Loading State */}
        <ComponentShowcase title='Loading State'>
          <div className='w-full max-w-md rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <LoadingState message='Loading data...' size='medium' />
          </div>
          <div className='w-full max-w-md rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <LoadingState message='Loading...' size='small' />
          </div>
          <div className='w-full max-w-md rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <LoadingState message='Please wait...' size='large' />
          </div>
        </ComponentShowcase>

        {/* Empty State */}
        <ComponentShowcase title='Empty State'>
          <div className='w-full max-w-md rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <EmptyState
              title='No items found'
              description='There are no items to display. Try adjusting your filters.'
            />
          </div>
          <div className='w-full max-w-md rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <EmptyState
              title='No results'
              description='Your search did not return any results.'
              action={
                <Button.Root variant='primary' size='small'>
                  Clear filters
                </Button.Root>
              }
            />
          </div>
        </ComponentShowcase>

        {/* Error State */}
        <ComponentShowcase title='Error State'>
          <div className='w-full max-w-md rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <ErrorState
              title='Failed to load'
              message='Unable to fetch data. Please check your connection and try again.'
              onRetry={() => {
                console.log('Retry clicked');
              }}
            />
          </div>
          <div className='w-full max-w-md rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <ErrorState
              message='Something unexpected happened. Please try again later.'
              onRetry={() => {
                setHasError(false);
              }}
            />
          </div>
        </ComponentShowcase>

        {/* Category Filter */}
        <ComponentShowcase title='Category Filter (Composed Component)'>
          <div className='w-full max-w-md'>
            <CategoryFilter
              categories={mockCategories}
              selectedSlugs={selectedCategories}
              onSelectionChange={setSelectedCategories}
            />
            {selectedCategories.length > 0 && (
              <div className='mt-4 text-paragraph-sm text-text-sub-600'>
                Selected: {selectedCategories.join(', ')}
              </div>
            )}
          </div>
        </ComponentShowcase>
      </div>
    </div>
  );
}
