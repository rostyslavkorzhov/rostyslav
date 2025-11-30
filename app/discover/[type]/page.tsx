import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/clients/supabase-server';
import { DiscoverFilters } from '@/components/gallery/discover-filters';
import { PageGridServer } from './page-grid-server';
import { PageGridSkeleton } from '@/components/gallery/page-grid-skeleton';
import { PageContainer } from '@/components/page-container';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { PageTypeSlug } from '@/types';

const VALID_TYPES: PageTypeSlug[] = ['product', 'home', 'about'];

async function getCategories() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Failed to load categories:', error);
    return [];
  }

  return data || [];
}

interface Props {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ view?: string; categories?: string }>;
}

export default async function DiscoverPage({ params, searchParams }: Props) {
  const { type } = await params;
  const { view = 'mobile', categories = '' } = await searchParams;

  // Validate page type
  if (!VALID_TYPES.includes(type as PageTypeSlug)) {
    notFound();
  }

  const categoriesData = await getCategories();
  const categoryList = categories ? categories.split(',').filter(Boolean) : [];

  // Create stable key for Suspense boundary
  // Sorting ensures consistent keys regardless of selection order
  const filterKey = `${view}-${categoryList.sort().join(',')}`;

  const pageTypeName = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <NuqsAdapter>
      <PageContainer>
        {/* Header - stable, never re-renders on filter change */}
        <div className='mb-8 text-center'>
          <h1 className='text-title-h1 text-text-strong-950 mb-4'>
            Discover {pageTypeName} Pages
          </h1>
          <p className='text-paragraph-lg text-text-sub-600'>
            Browse {pageTypeName.toLowerCase()} pages from top e-commerce brands
          </p>
        </div>

        {/* Filters - client component with nuqs */}
        <DiscoverFilters categories={categoriesData} />

        {/* Results - isolated Suspense boundary */}
        <Suspense key={filterKey} fallback={<PageGridSkeleton />}>
          <PageGridServer
            type={type as PageTypeSlug}
            view={view}
            categories={categoryList}
          />
        </Suspense>
      </PageContainer>
    </NuqsAdapter>
  );
}
