'use client';

import Image from 'next/image';
import Link from 'next/link';
import { EmptyState } from '@/components/ui/empty-state';
import type { PageWithRelations } from '@/types';

interface PageGridProps {
  pages: PageWithRelations[];
}

export function PageGrid({ pages }: PageGridProps) {
  if (pages.length === 0) {
    return (
      <EmptyState
        title='No pages found'
        description='Try adjusting your filters to see more results.'
      />
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
      {pages.map((page) => (
        <Link key={page.id} href={`/pages/${page.id}`}>
          <div className='group rounded-lg border border-stroke-soft-200 bg-bg-white-0 overflow-hidden hover:shadow-regular-md transition-shadow'>
            {page.screenshot_url && (
              <div className='aspect-video relative bg-bg-weak-50'>
                <Image
                  src={page.screenshot_url}
                  alt={`${page.brand.name} ${page.page_type.name} page (${page.view})`}
                  fill
                  className='object-cover'
                />
              </div>
            )}
            <div className='p-4'>
              <h3 className='text-title-h4 text-text-strong-950 mb-1'>
                {page.brand.name}
              </h3>
              <div className='flex items-center gap-2 text-label-sm text-text-sub-600'>
                <span>{page.page_type.name}</span>
                <span>•</span>
                <span className='capitalize'>{page.view}</span>
                {page.month && (
                  <>
                    <span>•</span>
                    <span>{page.month}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

