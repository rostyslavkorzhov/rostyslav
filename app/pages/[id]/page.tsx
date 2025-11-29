import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageService } from '@/lib/services';
import { NotFoundError } from '@/lib/errors/app-error';
import { PageDetailClient } from './page-client';

interface PageDetailProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageDetailProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const pageService = getPageService();
    const { page } = await pageService.getPageById(id);

    return {
      title: `${page.brand.name} - ${page.page_type.name}`,
      description: `View ${page.brand.name}'s ${page.page_type.name} page`,
    };
  } catch (error) {
    return {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.',
    };
  }
}

export default async function PageDetail({ params }: PageDetailProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  try {
    const pageService = getPageService();
    const { page, siblingPage } = await pageService.getPageById(id);

    if (!page) {
      notFound();
    }

    return <PageDetailClient page={page} siblingPage={siblingPage || null} />;
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }
}
