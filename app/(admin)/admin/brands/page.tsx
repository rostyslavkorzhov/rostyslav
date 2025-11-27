'use client';

import { useEffect, useState } from 'react';
import { LoadingState } from '@/components/ui/loading-state';
import * as Table from '@/components/ui/table';
import type { Brand } from '@/types';

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBrands() {
      try {
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
      <h1 className='text-title-h1 text-text-strong-950 mb-6'>Brands</h1>

      {loading ? (
        <LoadingState />
      ) : brands.length === 0 ? (
        <div className='rounded-lg border border-stroke-soft-200 p-8 text-center'>
          <p className='text-text-sub-600'>No brands found</p>
        </div>
      ) : (
        <div className='rounded-lg border border-stroke-soft-200 overflow-hidden'>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>Name</Table.Head>
                <Table.Head>Category</Table.Head>
                <Table.Head>Published</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {brands.map((brand) => {
                const categoryName = (brand as any).category?.name || 'N/A';
                return (
                  <Table.Row key={brand.id}>
                    <Table.Cell className='font-medium'>{brand.name}</Table.Cell>
                    <Table.Cell>{categoryName}</Table.Cell>
                    <Table.Cell>{brand.is_published ? 'Yes' : 'No'}</Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </div>
      )}
    </div>
  );
}

