'use client';

import { BrandCard } from './brand-card';
import type { BrandWithPages } from '@/types';

interface BrandGridProps {
  brands: BrandWithPages[];
}

export function BrandGrid({ brands }: BrandGridProps) {
  if (brands.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-text-sub-600'>No brands found</p>
      </div>
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

