'use client';

import { useEffect } from 'react';
import { ProjectProvider } from '@/lib/store/ProjectContext';
import { AppShell } from '@/components/dashboard/layout/AppShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.classList.add('admin-body');
    document.body.classList.remove('site-body');
    return () => {
      document.body.classList.remove('admin-body');
    };
  }, []);

  return (
    <ProjectProvider>
      <AppShell>{children}</AppShell>
    </ProjectProvider>
  );
}
