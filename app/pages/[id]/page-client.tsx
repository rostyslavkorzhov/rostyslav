'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RiSmartphoneLine, RiComputerLine } from '@remixicon/react';
import { PageContainer } from '@/components/page-container';
import * as SegmentedControl from '@/components/ui/segmented-control';
import type { PageWithRelations, ViewType } from '@/types';

interface PageDetailClientProps {
  page: PageWithRelations;
  siblingPage: PageWithRelations | null;
}

export function PageDetailClient({ page, siblingPage }: PageDetailClientProps) {
  const [selectedView, setSelectedView] = useState<ViewType>(page.view);

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

