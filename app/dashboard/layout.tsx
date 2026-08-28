import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/login');
  }

  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('id')
    .eq('id', user.id)
    .single();

  if (adminError || !adminUser) {
    redirect('/login');
  }

  return children;
}
