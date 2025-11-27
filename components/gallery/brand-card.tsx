'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { BrandWithPages } from '@/types';

interface BrandCardProps {
  brand: BrandWithPages;
}

export function BrandCard({ brand }: BrandCardProps) {
  // Find a home page (prefer desktop, fallback to mobile)
  const homePageDesktop = brand.pages?.find(
    (p) => (p as any).page_type?.slug === 'home' && (p as any).view === 'desktop'
  );
  const homePageMobile = brand.pages?.find(
    (p) => (p as any).page_type?.slug === 'home' && (p as any).view === 'mobile'
  );
  const homePage = homePageDesktop || homePageMobile;
  const thumbnailUrl = homePage?.screenshot_url || null;

  // Get category name from relation
  const categoryName = (brand as any).category?.name || '';

  return (
    <Link href={`/brands/${brand.slug}`}>
      <div className='group rounded-lg border border-stroke-soft-200 bg-bg-white-0 overflow-hidden hover:shadow-regular-md transition-shadow'>
        {thumbnailUrl && (
          <div className='aspect-video relative bg-bg-weak-50'>
            <Image
              src={thumbnailUrl}
              alt={`${brand.name} homepage`}
              fill
              className='object-cover'
              unoptimized
            />
          </div>
        )}
        <div className='p-4'>
          <h3 className='text-title-h4 text-text-strong-950 mb-1'>{brand.name}</h3>
          <p className='text-label-sm text-text-sub-600'>{categoryName}</p>
        </div>
      </div>
    </Link>
  );
}

