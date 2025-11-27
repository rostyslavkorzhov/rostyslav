'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { LoadingState } from '@/components/ui/loading-state';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?redirect=/admin');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <LoadingState />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className='flex min-h-screen'>
      {/* Sidebar */}
      <aside className='w-64 border-r border-stroke-soft-200 bg-bg-white-0'>
        <div className='p-6'>
          <h2 className='text-title-h3 text-text-strong-950 mb-6'>Admin</h2>
          <nav className='space-y-2'>
            <Link
              href='/admin'
              className='block rounded-lg px-4 py-2 text-text-sub-600 hover:bg-bg-weak-50'
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className='flex-1 p-8'>{children}</main>
    </div>
  );
}

