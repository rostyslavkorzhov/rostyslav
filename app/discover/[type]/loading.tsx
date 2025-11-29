import { LoadingState } from '@/components/ui/loading-state';
import { PageContainer } from '@/components/page-container';

export default function Loading() {
  return (
    <PageContainer>
      <LoadingState message='Loading pages...' />
    </PageContainer>
  );
}

