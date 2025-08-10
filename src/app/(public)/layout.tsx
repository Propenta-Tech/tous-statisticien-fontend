import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GuestGuard } from '@/lib/auth/guards';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      <GuestGuard>
        <main className="pt-16">
          {children}
        </main>
      </GuestGuard>
      <Footer />
    </div>
  );
}
