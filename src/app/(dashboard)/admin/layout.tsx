import React from 'react';
import { AdminGuard } from '@/lib/auth/guards';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      {children}
    </AdminGuard>
  );
}
