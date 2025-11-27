'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/use-auth';
import type { Page, Brand } from '@/types';
import type { GetPageResponse } from '@/types/api';

export default function PageDetail() {
  const params = useParams();
  const { id } = params;
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState<(Page & { brand: Brand }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

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
        <div className='text-center'>Loading...</div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className='container mx-auto px-5 py-16'>
        <div className='text-center'>Page not found</div>
      </div>
    );
  }

  const screenshotUrl =
    device === 'desktop'
      ? page.desktop_screenshot_url
      : page.mobile_screenshot_url;

  return (
    <div className='container mx-auto px-5 py-16'>
      <div className='mx-auto max-w-7xl'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Screenshot Viewer */}
          <div>
            <div className='mb-4 flex gap-2'>
              <button
                onClick={() => setDevice('desktop')}
                className={`px-4 py-2 rounded-lg ${
                  device === 'desktop'
                    ? 'bg-primary-base text-white'
                    : 'bg-bg-weak-50 text-text-sub-600'
                }`}
              >
                Desktop
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`px-4 py-2 rounded-lg ${
                  device === 'mobile'
                    ? 'bg-primary-base text-white'
                    : 'bg-bg-weak-50 text-text-sub-600'
                }`}
              >
                Mobile
              </button>
            </div>

            {screenshotUrl ? (
              <div className='relative rounded-lg border border-stroke-soft-200 overflow-hidden bg-bg-weak-50'>
                {!isAuthenticated && (
                  <div className='absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center'>
                    <div className='text-center text-white p-6'>
                      <p className='text-lg font-semibold mb-2'>Sign up to view</p>
                      <p className='text-sm opacity-90'>
                        Create a free account to see full screenshots
                      </p>
                    </div>
                  </div>
                )}
                <Image
                  src={screenshotUrl}
                  alt={`${page.brand.name} ${page.page_type} page`}
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
                {page.brand.category} • {page.brand.country}
              </p>

              <div className='space-y-4'>
                <div>
                  <h3 className='text-label-sm font-medium text-text-strong-950 mb-1'>
                    Page Type
                  </h3>
                  <p className='text-paragraph-md text-text-sub-600 capitalize'>
                    {page.page_type}
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

                {page.captured_at && (
                  <div>
                    <h3 className='text-label-sm font-medium text-text-strong-950 mb-1'>
                      Captured On
                    </h3>
                    <p className='text-paragraph-md text-text-sub-600'>
                      {new Date(page.captured_at).toLocaleDateString()}
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

