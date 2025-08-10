"use client";

import Link from 'next/link';
import React from 'react';
import { useUiStore } from '@/store/uiStore';
import { useAuth } from '@/lib/auth/context';

export interface MobileMenuItem {
  href: string;
  label: string;
}

interface MobileMenuProps {
  items?: MobileMenuItem[];
}

const defaultItems: MobileMenuItem[] = [
  { href: '/', label: 'Accueil' },
  { href: '/features', label: 'Fonctionnalités' },
  { href: '/pricing', label: 'Tarifs' },
  { href: '/about', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
];

export const MobileMenu: React.FC<MobileMenuProps> = ({ items = defaultItems }) => {
  const { isMobileMenuOpen, toggleMobileMenu } = useUiStore();
  const { isAuthenticated, user, logout } = useAuth();

  const dashboardPath = user?.role === 'ADMIN'
    ? '/dashboard/admin/dashboard'
    : user?.role === 'FORMATEUR'
      ? '/dashboard/admin/dashboard'
      : '/dashboard/student/dashboard';

  return (
    <div
      className={
        `md:hidden fixed inset-x-0 top-16 z-40 transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full pointer-events-none'
        }`
      }
    >
      <div className="px-4 pb-4 shadow-soft border-b border-white/40 backdrop-blur-xl bg-white/70">
        <div className="flex flex-col gap-1 py-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={toggleMobileMenu}
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-800 hover:bg-white/80"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="pt-2 border-t border-white/50 mt-2 grid grid-cols-2 gap-2">
          {!isAuthenticated ? (
            <>
              <Link
                href="/auth/login"
                onClick={toggleMobileMenu}
                className="w-full text-center px-4 py-2 rounded-lg text-sm font-medium text-primary-navy bg-white/80 hover:bg-white"
              >
                Se connecter
              </Link>
              <Link
                href="/auth/register/step-1"
                onClick={toggleMobileMenu}
                className="w-full text-center px-4 py-2 rounded-lg text-sm font-medium bg-amber-400 text-primary-navy shadow-glow hover:bg-amber-500"
              >
                S'inscrire
              </Link>
            </>
          ) : (
            <>
              <Link
                href={dashboardPath}
                onClick={toggleMobileMenu}
                className="w-full text-center px-4 py-2 rounded-lg text-sm font-medium bg-primary-navy text-white hover:bg-slate-700"
              >
                Dashboard
              </Link>
              <button
                onClick={() => { logout(); toggleMobileMenu(); }}
                className="w-full text-center px-4 py-2 rounded-lg text-sm font-medium text-gray-800 bg-white/80 hover:bg-white"
              >
                Déconnexion
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

