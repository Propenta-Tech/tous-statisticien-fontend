import React from 'react';
import { AuthGuard } from '@/lib/auth/guards';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}
