'use client';

import * as React from 'react';
import * as Button from '@/components/ui/button';
import * as Badge from '@/components/ui/badge';
import * as SegmentedControl from '@/components/ui/segmented-control';
import * as Dropdown from '@/components/ui/dropdown';
import {
  RiExternalLinkLine,
  RiDownloadLine,
  RiLinksLine,
  RiInformationLine,
} from '@remixicon/react';

interface ScreenshotData {
  brand: { name: string; icon?: string; description: string };
  page: { type: string };
  category: { name: string };
  personalMessage?: { author: string; text: string };
  screenshot: { imageUrl: string; pageUrl: string; uploadDate: string; resolution: string };
  navigation: { breadcrumbs: string[]; currentView: 'section' | 'fullpage' };
}

// Static data matching the screenshot example
const screenshotData: ScreenshotData = {
  brand: {
    name: 'Skims',
    description:
      'Solutions oriented brand creating the next generation of underwear, loungewear and shapewear.',
  },
  page: {
    type: 'PDP',
  },
  category: {
    name: 'Home Goods',
  },
  personalMessage: {
    author: 'Ros',
    text: 'Hey! Ros here. I designed and built Pitchworthy with the mission to democratize access to advise for founders. Because startups are hard.',
  },
  screenshot: {
    imageUrl: 'https://via.placeholder.com/1920x1200/ffffff/000000?text=Casper+Product+Page',
    pageUrl: 'https://casper.com/products/cooling-hybrid-mattress',
    uploadDate: 'Nov 17, 2025',
    resolution: '1920x1200',
  },
  navigation: {
    breadcrumbs: ['Home', 'Product', 'About'],
    currentView: 'section',
  },
};

export default function ScreenshotViewerPage() {
  const [currentView, setCurrentView] = React.useState<'section' | 'fullpage'>(
    screenshotData.navigation.currentView,
  );

  const handleVisitPage = () => {
    window.open(screenshotData.screenshot.pageUrl, '_blank');
  };

  const handleDownloadPng = () => {
    // Placeholder for download functionality
    console.log('Download PNG');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(screenshotData.screenshot.pageUrl);
      // Could show a toast notification here
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className='container mx-auto flex-1 px-5 py-8'>
      <div className='mx-auto max-w-7xl'>
        {/* Header Section */}
        <div className='mb-8'>
          {/* Brand/Page/Category Row */}
          <div className='mb-8 grid grid-cols-1 gap-8 md:grid-cols-3'>
            {/* Brand */}
            <div>
              <div className='mb-3 flex items-center gap-3'>
                <Badge.Root
                  variant='filled'
                  color='gray'
                  size='medium'
                  square
                  className='h-10 w-10 bg-bg-strong-950 text-text-white-0'
                >
                  SKIMS
                </Badge.Root>
                <span className='text-paragraph-sm text-text-sub-600'>Brand</span>
              </div>
              <h1 className='text-title-h2 text-text-strong-950'>
                {screenshotData.brand.name}
              </h1>
            </div>

            {/* Page */}
            <div>
              <div className='mb-3'>
                <span className='text-paragraph-sm text-text-sub-600'>Page</span>
              </div>
              <h2 className='text-title-h2 text-text-strong-950'>
                {screenshotData.page.type}
              </h2>
            </div>

            {/* Category */}
            <div>
              <div className='mb-3'>
                <span className='text-paragraph-sm text-text-sub-600'>Category</span>
              </div>
              <h2 className='text-title-h2 text-text-strong-950'>
                {screenshotData.category.name}
              </h2>
            </div>
          </div>

          {/* Description Row */}
          <div className='grid grid-cols-1 gap-6 border-t border-stroke-soft-200 pt-6 md:grid-cols-2'>
            <div>
              <p className='text-paragraph-md text-text-sub-600'>
                {screenshotData.brand.description}
              </p>
            </div>
            {screenshotData.personalMessage && (
              <div>
                <p className='text-paragraph-md text-text-sub-600'>
                  {screenshotData.personalMessage.text}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Controls Section */}
        <div className='mb-8 flex flex-col items-start justify-between gap-4 border-t border-stroke-soft-200 pt-6 md:flex-row md:items-center'>
          <div className='flex flex-col items-start gap-4 md:flex-row md:items-center'>
            {/* Breadcrumb Navigation */}
            <div className='text-center text-paragraph-md text-text-strong-950 md:text-left'>
              {screenshotData.navigation.breadcrumbs.join(' / ')}
            </div>

            {/* Segmented Control */}
            <SegmentedControl.Root
              value={currentView}
              onValueChange={(value) =>
                setCurrentView(value as 'section' | 'fullpage')
              }
            >
              <SegmentedControl.List>
                <SegmentedControl.Trigger value='section'>
                  Section
                </SegmentedControl.Trigger>
                <SegmentedControl.Trigger value='fullpage'>
                  Full page
                </SegmentedControl.Trigger>
              </SegmentedControl.List>
            </SegmentedControl.Root>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-2'>
            <Button.Root variant='neutral' mode='stroke' size='small'>
              <Button.Icon as={RiInformationLine} />
              info
            </Button.Root>
            <Button.Root variant='neutral' mode='stroke' size='small'>
              Explore site
            </Button.Root>
          </div>
        </div>

        {/* Main Content Area */}
        <div className='relative'>
          {/* Screenshot Image Container */}
          <div className='relative overflow-hidden rounded-2xl border border-stroke-soft-200 bg-bg-white-0 shadow-regular-md'>
            <div className='relative' style={{ paddingBottom: '62.5%' }}>
              <img
                src={screenshotData.screenshot.imageUrl}
                alt='Website Screenshot'
                className='absolute inset-0 h-full w-full object-contain'
                style={{ border: 'none' }}
              />
            </div>

            {/* Action Menu and Metadata Overlay - positioned on right side */}
            <div className='absolute right-4 top-4 z-10 flex flex-col gap-3'>
              {/* Dropdown Menu */}
              <Dropdown.Root>
                <Dropdown.Trigger asChild>
                  <Button.Root
                    variant='neutral'
                    mode='filled'
                    size='small'
                    className='bg-bg-strong-950 text-text-white-0 shadow-regular-md hover:bg-bg-surface-800'
                  >
                    Actions
                  </Button.Root>
                </Dropdown.Trigger>
                <Dropdown.Content
                  align='end'
                  className='!bg-bg-strong-950 !text-text-white-0 !ring-stroke-soft-200 w-48'
                >
                  <Dropdown.Item
                    onClick={handleVisitPage}
                    className='!text-text-white-0 data-[highlighted]:!bg-bg-surface-800'
                  >
                    <Dropdown.ItemIcon
                      as={RiExternalLinkLine}
                      className='!text-text-white-0'
                    />
                    Visit page
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={handleDownloadPng}
                    className='!text-text-white-0 data-[highlighted]:!bg-bg-surface-800'
                  >
                    <Dropdown.ItemIcon as={RiDownloadLine} className='!text-text-white-0' />
                    Download png
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={handleCopyLink}
                    className='!text-text-white-0 data-[highlighted]:!bg-bg-surface-800'
                  >
                    <Dropdown.ItemIcon as={RiLinksLine} className='!text-text-white-0' />
                    Copy link
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown.Root>

              {/* Metadata Box */}
              <div className='rounded-xl bg-bg-strong-950 p-4 text-text-white-0 shadow-regular-md'>
                <div className='space-y-3'>
                  <div>
                    <div className='mb-1 text-paragraph-xs text-text-soft-400'>
                      Upload date
                    </div>
                    <div className='text-paragraph-sm text-text-white-0'>
                      {screenshotData.screenshot.uploadDate}
                    </div>
                  </div>
                  <div>
                    <div className='mb-1 text-paragraph-xs text-text-soft-400'>
                      Resolution
                    </div>
                    <div className='text-paragraph-sm text-text-white-0'>
                      {screenshotData.screenshot.resolution}
                    </div>
                  </div>
                  <div>
                    <div className='mb-1 text-paragraph-xs text-text-soft-400'>
                      Sections
                    </div>
                    <Button.Root
                      variant='neutral'
                      mode='ghost'
                      size='small'
                      className='h-auto px-0 py-0 text-left text-paragraph-sm text-text-white-0 hover:text-text-soft-400'
                    >
                      Navigation
                    </Button.Root>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

