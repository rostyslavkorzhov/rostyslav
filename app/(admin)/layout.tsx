import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@/lib/clients/supabase-server-component';
import { isAdmin } from '@/lib/utils/auth';
import { AdminLayoutClient } from './admin-layout-client';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verify authentication and admin status server-side
  const supabase = await createServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Proxy should have already redirected, but verify for defense in depth
  if (!user) {
    redirect('/login?redirect=/admin');
  }

  // Check admin status
  const userIsAdmin = await isAdmin(user);
  if (!userIsAdmin) {
    redirect('/?error=access_denied');
  }

  // User is authenticated and is admin - render the layout
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}

