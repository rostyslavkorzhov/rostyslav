import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/clients/supabase-server';
import { getPageService } from '@/lib/services';
import { DiscoverClient } from './discover-client';
import type { PageTypeSlug, ViewType } from '@/types';

const VALID_TYPES: PageTypeSlug[] = ['product', 'home', 'about'];

interface DiscoverPageProps {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ view?: string; categories?: string }>;
}

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

export default async function DiscoverPage({
  params,
  searchParams,
}: DiscoverPageProps) {
  const { type } = await params;
  const { view, categories } = await searchParams;

  // Validate page type
  if (!VALID_TYPES.includes(type as PageTypeSlug)) {
    notFound();
  }

  // Parse filters
  const viewFilter = (view || 'mobile') as ViewType;
  const categorySlugs = categories
    ? categories.split(',').map((s) => s.trim()).filter(Boolean)
    : undefined;

  // Fetch data in parallel
  const [categoriesData, pagesResult] = await Promise.all([
    getCategories(),
    getPageService().listPagesByType({
      page_type_slug: type as PageTypeSlug,
      view: viewFilter,
      category_slugs: categorySlugs,
      limit: 20,
      offset: 0,
    }),
  ]);

  return (
    <DiscoverClient
      type={type as PageTypeSlug}
      initialPages={pagesResult.data}
      initialCount={pagesResult.count}
      initialHasMore={pagesResult.hasMore}
      categories={categoriesData}
      initialView={viewFilter}
      initialSelectedCategories={categorySlugs || []}
    />
  );
}
