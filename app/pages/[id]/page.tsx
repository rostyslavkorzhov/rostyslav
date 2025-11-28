'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { RiSmartphoneLine, RiComputerLine } from '@remixicon/react';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { PageContainer } from '@/components/page-container';
import * as SegmentedControl from '@/components/ui/segmented-control';
import type { PageWithRelations, ViewType } from '@/types';
import type { GetPageResponse } from '@/types/api';

export default function PageDetail() {
  const params = useParams();
  const { id } = params;
  const [page, setPage] = useState<PageWithRelations | null>(null);
  const [siblingPage, setSiblingPage] = useState<PageWithRelations | null>(null);
  const [selectedView, setSelectedView] = useState<ViewType>('desktop');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPage() {
      try {
        const response = await fetch(`/api/pages/${id}`);
        if (!response.ok) throw new Error('Failed to load page');

        const data: GetPageResponse = await response.json();
        setPage(data.data);
        setSiblingPage(data.siblingPage || null);
        
        // Set default view to current page's view
        setSelectedView(data.data.view);
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
      <PageContainer>
        <LoadingState />
      </PageContainer>
    );
  }

  if (!page) {
    return (
      <PageContainer>
        <ErrorState
          title='Page not found'
          message='The page you are looking for does not exist or has been removed.'
        />
      </PageContainer>
    );
  }

  // Determine which page to display based on selected view
  const displayPage = selectedView === page.view ? page : (siblingPage || page);
  const screenshotUrl = displayPage?.screenshot_url;
  const categoryName = page.brand.category?.name || '';
  const hasBothViews = !!siblingPage;

  return (
    <PageContainer>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Screenshot Viewer */}
        <div>
          <div className='mb-4'>
            {hasBothViews ? (
              <div className='w-full max-w-xs'>
                <SegmentedControl.Root
                  value={selectedView}
                  onValueChange={(value) => setSelectedView(value as ViewType)}
                >
                  <SegmentedControl.List>
                    <SegmentedControl.Trigger value='mobile'>
                      <RiSmartphoneLine className='size-5 shrink-0' />
                      Mobile
                    </SegmentedControl.Trigger>
                    <SegmentedControl.Trigger value='desktop'>
                      <RiComputerLine className='size-5 shrink-0' />
                      Desktop
                    </SegmentedControl.Trigger>
                  </SegmentedControl.List>
                </SegmentedControl.Root>
              </div>
            ) : (
              <span className='text-label-sm text-text-sub-600 capitalize'>
                {page.view} view
              </span>
            )}
          </div>

          {screenshotUrl ? (
            <div className='relative rounded-lg border border-stroke-soft-200 overflow-hidden bg-bg-weak-50'>
              <Image
                src={screenshotUrl}
                alt={`${page.brand.name} ${page.page_type.name} page - ${selectedView} view`}
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
    </PageContainer>
  );
}

