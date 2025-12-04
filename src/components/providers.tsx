'use client';

import { SessionProvider } from 'next-auth/react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SidebarProvider>
        {children}
        <Toaster position="top-right" richColors />
      </SidebarProvider>
    </SessionProvider>
  );
}
