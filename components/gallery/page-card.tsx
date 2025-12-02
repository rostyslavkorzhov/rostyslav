import Image from 'next/image';
import Link from 'next/link';
import * as Avatar from '@/components/ui/avatar';
import type { PageWithRelations } from '@/types';

interface PageCardProps {
  page: PageWithRelations;
}

export function PageCard({ page }: PageCardProps) {
  const isDesktop = page.view === 'desktop';
  const aspectRatio = isDesktop ? 'aspect-video' : 'aspect-[9/16]';

  return (
    <Link href={`/pages/${page.id}`} className='block'>
      <div className='flex flex-col'>
        {/* Grey background card with screenshot */}
        <div className='relative bg-bg-weak-50 rounded-lg p-8 overflow-hidden'>
          {page.screenshot_url && (
            <div className={`${aspectRatio} relative`}>
              <Image
                src={page.screenshot_url}
                alt={`${page.brand.name} ${page.page_type.name} page (${page.view})`}
                fill
                className='object-cover object-top'
              />
            </div>
          )}
        </div>

        {/* Brand details section */}
        <div className='mt-3 flex items-start gap-2'>
          <Avatar.Root size='40' placeholderType='company' className='!rounded-xl shrink-0'>
            {page.brand.logo_url && (
              <Avatar.Image src={page.brand.logo_url} alt={page.brand.name} className='!rounded-xl' />
            )}
          </Avatar.Root>
          <div className='flex flex-col min-w-0'>
            <span className='text-label-sm text-text-strong-950 truncate'>
              {page.brand.name}
            </span>
            <span className='text-label-sm text-text-sub-600 truncate'>
              {page.brand.category.name}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

