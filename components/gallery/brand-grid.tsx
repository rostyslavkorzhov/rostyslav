'use client';

import { BrandCard } from './brand-card';
import { EmptyState } from '@/components/ui/empty-state';
import type { BrandWithPages } from '@/types';

interface BrandGridProps {
  brands: BrandWithPages[];
}

export function BrandGrid({ brands }: BrandGridProps) {
  if (brands.length === 0) {
    return (
      <EmptyState
        title='No brands found'
        description='Try adjusting your filters to see more results.'
      />
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {brands.map((brand) => (
        <BrandCard key={brand.id} brand={brand} />
      ))}
    </div>
  );
}

