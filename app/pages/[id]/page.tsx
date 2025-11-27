'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import * as Button from '@/components/ui/button';
import type { PageWithRelations } from '@/types';
import type { GetPageResponse } from '@/types/api';

export default function PageDetail() {
  const params = useParams();
  const { id } = params;
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState<PageWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPage() {
      try {
        const response = await fetch(`/api/pages/${id}`);
        if (!response.ok) throw new Error('Failed to load page');

        const data: GetPageResponse = await response.json();
        setPage(data.data);
      } catch (error) {
        console.error('Failed to load page:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadPage();
    }
  }, [id]);

  if (loading) {
    return (
      <div className='container mx-auto px-5 py-16'>
        <LoadingState />
      </div>
    );
  }

  if (!page) {
    return (
      <div className='container mx-auto px-5 py-16'>
        <ErrorState
          title='Page not found'
          message='The page you are looking for does not exist or has been removed.'
        />
      </div>
    );
  }

  const screenshotUrl = page.screenshot_url;
  const categoryName = page.brand.category?.name || '';

  return (
    <div className='container mx-auto px-5 py-16'>
      <div className='mx-auto max-w-7xl'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Screenshot Viewer */}
          <div>
            <div className='mb-4'>
              <span className='text-label-sm text-text-sub-600 capitalize'>
                {page.view} view
              </span>
            </div>

            {screenshotUrl ? (
              <div className='relative rounded-lg border border-stroke-soft-200 overflow-hidden bg-bg-weak-50'>
                {!isAuthenticated && (
                  <div className='absolute inset-0 bg-overlay backdrop-blur-sm z-10 flex items-center justify-center'>
                    <div className='text-center text-static-white p-6'>
                      <p className='text-title-h5 mb-2'>Sign up to view</p>
                      <p className='text-paragraph-sm opacity-90'>
                        Create a free account to see full screenshots
                      </p>
                    </div>
                  </div>
                )}
                <Image
                  src={screenshotUrl}
                  alt={`${page.brand.name} ${page.page_type.name} page`}
                  width={1200}
                  height={800}
                  className='w-full h-auto'
                  unoptimized
                />
              </div>
            ) : (
              <div className='rounded-lg border border-stroke-soft-200 p-12 text-center text-text-sub-600'>
                Screenshot not available
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div>
            <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
              <h1 className='text-title-h1 text-text-strong-950 mb-2'>
                {page.brand.name}
              </h1>
              <p className='text-paragraph-md text-text-sub-600 mb-6'>
                {categoryName}
              </p>

              <div className='space-y-4'>
                <div>
                  <h3 className='text-label-sm font-medium text-text-strong-950 mb-1'>
                    Page Type
                  </h3>
                  <p className='text-paragraph-md text-text-sub-600'>
                    {page.page_type.name}
                  </p>
                </div>

                <div>
                  <h3 className='text-label-sm font-medium text-text-strong-950 mb-1'>
                    View
                  </h3>
                  <p className='text-paragraph-md text-text-sub-600 capitalize'>
                    {page.view}
                  </p>
                </div>

                <div>
                  <h3 className='text-label-sm font-medium text-text-strong-950 mb-1'>
                    Page URL
                  </h3>
                  <a
                    href={page.page_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-paragraph-md text-primary-base hover:underline'
                  >
                    {page.page_url}
                  </a>
                </div>

                {page.month && (
                  <div>
                    <h3 className='text-label-sm font-medium text-text-strong-950 mb-1'>
                      Captured Month
                    </h3>
                    <p className='text-paragraph-md text-text-sub-600'>
                      {page.month}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

