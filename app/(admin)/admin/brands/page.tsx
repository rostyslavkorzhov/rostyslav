'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import type { Brand } from '@/types';

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBrands() {
      try {
        // Fetch brands from admin API (will need to be implemented)
        // For now, using public API as placeholder
        const response = await fetch('/api/brands?limit=100');
        if (response.ok) {
          const data = await response.json();
          setBrands(data.data);
        }
      } catch (error) {
        console.error('Failed to load brands:', error);
      } finally {
        setLoading(false);
      }
    }
    loadBrands();
  }, []);

  return (
    <div>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-title-h1 text-text-strong-950'>Brands</h1>
        <Link href='/admin/brands/new'>
          <Button>Create Brand</Button>
        </Link>
      </div>

      {loading ? (
        <LoadingState />
      ) : brands.length === 0 ? (
        <div className='rounded-lg border border-stroke-soft-200 p-8 text-center'>
          <p className='text-text-sub-600 mb-4'>No brands yet</p>
          <Link href='/admin/brands/new'>
            <Button>Create your first brand</Button>
          </Link>
        </div>
      ) : (
        <div className='space-y-4'>
          {brands.map((brand) => (
            <div
              key={brand.id}
              className='rounded-lg border border-stroke-soft-200 p-4'
            >
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-title-h4 text-text-strong-950'>{brand.name}</h3>
                  <p className='text-text-sub-600'>{brand.category}</p>
                </div>
                <Link href={`/admin/brands/${brand.id}`}>
                  <Button variant='neutral' mode='stroke'>Edit</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

