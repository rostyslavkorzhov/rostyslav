'use client';

import { EmptyState } from '@/components/ui/empty-state';
import { PageCard } from './page-card';
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
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      {pages.map((page) => (
        <PageCard key={page.id} page={page} />
      ))}
    </div>
  );
}

