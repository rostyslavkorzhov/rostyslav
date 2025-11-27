'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { BrandWithPages } from '@/types';

interface BrandCardProps {
  brand: BrandWithPages;
}

export function BrandCard({ brand }: BrandCardProps) {
  const homePage = brand.pages?.find((p) => p.page_type === 'home' && p.is_current);
  const thumbnailUrl = homePage?.desktop_screenshot_url || homePage?.mobile_screenshot_url;

  return (
    <Link href={`/brands/${brand.slug}`}>
      <div className='group rounded-lg border border-stroke-soft-200 bg-bg-white-0 overflow-hidden hover:shadow-lg transition-shadow'>
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
          <p className='text-label-sm text-text-sub-600'>{brand.category}</p>
        </div>
      </div>
    </Link>
  );
}

