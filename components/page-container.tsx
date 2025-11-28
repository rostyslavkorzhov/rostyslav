import { cn } from '@/utils/cn';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-5 py-16', className)}>
      {children}
    </div>
  );
}

