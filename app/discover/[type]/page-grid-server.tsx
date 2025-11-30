import { getPageService } from '@/lib/services';
import { PageGrid } from '@/components/gallery/page-grid';
import type { PageTypeSlug, ViewType } from '@/types';

interface PageGridServerProps {
  type: PageTypeSlug;
  view: string;
  categories: string[];
}

/**
 * Server Component that fetches and renders pages based on filter parameters
 * This component is wrapped in a Suspense boundary in the parent, so it will stream results
 * when filters change
 */
export async function PageGridServer({ type, view, categories }: PageGridServerProps) {
  const result = await getPageService().listPagesByType({
    page_type_slug: type,
    view: view as ViewType,
    category_slugs: categories.length > 0 ? categories : undefined,
    limit: 20,
    offset: 0,
  });

  return (
    <>
      <PageGrid pages={result.data} />
      {result.hasMore && (
        <div className='mt-8 text-center'>
          <p className='text-label-sm text-text-sub-600'>
            Showing {result.data.length} of {result.count} pages
          </p>
        </div>
      )}
    </>
  );
}
