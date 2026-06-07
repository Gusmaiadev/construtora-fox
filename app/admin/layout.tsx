'use client';

import { useEffect } from 'react';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { AuthGate } from '@/components/dashboard/auth/AuthGate';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.classList.add('admin-body');
    document.body.classList.remove('site-body');
    return () => {
      document.body.classList.remove('admin-body');
    };
  }, []);

  return (
    <div className="min-h-screen bg-midnight-950 text-midnight-50">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-fox-500/10 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>
      <div className="relative">
        <AuthProvider>
          <AuthGate>{children}</AuthGate>
        </AuthProvider>
      </div>
    </div>
  );
}
