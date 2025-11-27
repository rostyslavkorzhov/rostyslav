'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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
        <div className='text-center'>Loading...</div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className='container mx-auto px-5 py-16'>
        <div className='text-center'>Brand not found</div>
      </div>
    );
  }

  const pages = brand.pages || [];

  return (
    <div className='container mx-auto px-5 py-16'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-8'>
          <h1 className='text-title-h1 text-text-strong-950 mb-2'>{brand.name}</h1>
          <p className='text-paragraph-md text-text-sub-600'>
            {brand.category} • {brand.country}
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {pages
            .filter((p) => p.is_current)
            .map((page) => {
              const thumbnailUrl = page.desktop_screenshot_url || page.mobile_screenshot_url;
              return (
                <Link key={page.id} href={`/pages/${page.id}`}>
                  <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 overflow-hidden hover:shadow-lg transition-shadow'>
                    {thumbnailUrl && (
                      <div className='aspect-video relative bg-bg-weak-50'>
                        <Image
                          src={thumbnailUrl}
                          alt={`${brand.name} ${page.page_type} page`}
                          fill
                          className='object-cover'
                          unoptimized
                        />
                      </div>
                    )}
                    <div className='p-4'>
                      <h3 className='text-title-h4 text-text-strong-950 capitalize'>
                        {page.page_type}
                      </h3>
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

