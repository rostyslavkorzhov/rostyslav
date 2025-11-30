import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/clients/supabase-server';
import { DiscoverClient } from './discover-client';
import type { PageTypeSlug } from '@/types';

const VALID_TYPES: PageTypeSlug[] = ['product', 'home', 'about'];

interface DiscoverPageProps {
  params: Promise<{ type: string }>;
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

export default async function DiscoverPage({ params }: DiscoverPageProps) {
  const { type } = await params;

  // Validate page type
  if (!VALID_TYPES.includes(type as PageTypeSlug)) {
    notFound();
  }

  // Only fetch categories on the server (static data)
  // Pages are fetched client-side with SWR based on filter state
  const categoriesData = await getCategories();

  return (
    <DiscoverClient
      type={type as PageTypeSlug}
      categories={categoriesData}
    />
  );
}
