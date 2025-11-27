'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import type { BrandWithPages } from '@/types';
import type { GetBrandResponse } from '@/types/api';

export default function BrandDetail() {
  const params = useParams();
  const { slug } = params;
  const [brand, setBrand] = useState<BrandWithPages | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBrand() {
      try {
        const response = await fetch(`/api/brands/${slug}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Failed to load brand:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
          });
          throw new Error(errorData.error || 'Failed to load brand');
        }

        const data: GetBrandResponse = await response.json();
        setBrand(data.data);
      } catch (error) {
        console.error('Failed to load brand:', error);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadBrand();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className='container mx-auto px-5 py-16'>
        <LoadingState />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className='container mx-auto px-5 py-16'>
        <ErrorState
          title='Brand not found'
          message='The brand you are looking for does not exist or has been removed.'
        />
      </div>
    );
  }

  const pages = brand.pages || [];
  const categoryName = (brand as any).category?.name || '';

  // Group pages by page type and get the most recent one of each type
  const pageMap = new Map();
  pages.forEach((page: any) => {
    const pageTypeSlug = page.page_type?.slug;
    if (pageTypeSlug) {
      const existing = pageMap.get(pageTypeSlug);
      if (!existing || new Date(page.created_at) > new Date(existing.created_at)) {
        pageMap.set(pageTypeSlug, page);
      }
    }
  });
  const uniquePages = Array.from(pageMap.values());

  return (
    <div className='container mx-auto px-5 py-16'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-8'>
          <h1 className='text-title-h1 text-text-strong-950 mb-2'>{brand.name}</h1>
          <p className='text-paragraph-md text-text-sub-600'>
            {categoryName}
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {uniquePages.map((page: any) => {
            const thumbnailUrl = page.screenshot_url;
            const pageTypeName = page.page_type?.name || 'Page';
            return (
              <Link key={page.id} href={`/pages/${page.id}`}>
                <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 overflow-hidden hover:shadow-regular-md transition-shadow'>
                  {thumbnailUrl && (
                    <div className='aspect-video relative bg-bg-weak-50'>
                      <Image
                        src={thumbnailUrl}
                        alt={`${brand.name} ${pageTypeName} page`}
                        fill
                        className='object-cover'
                        unoptimized
                      />
                    </div>
                  )}
                  <div className='p-4'>
                    <h3 className='text-title-h4 text-text-strong-950'>
                      {pageTypeName}
                    </h3>
                    <p className='text-label-sm text-text-sub-600 capitalize'>
                      {page.view}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

