"use client";

import React, { useEffect } from 'react';
import { AuthProvider } from '@/lib/auth/context';
import { Toaster } from 'sonner';
import { useUiStore } from '@/store/uiStore';

export function Providers({ children }: { children: React.ReactNode }) {
  const { theme } = useUiStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <AuthProvider>
      {children}
      <Toaster richColors position="top-center" />
    </AuthProvider>
  );
}


