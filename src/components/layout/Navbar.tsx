"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/context';
import { useUiStore } from '@/store/uiStore';
import { Menu, X } from 'lucide-react';
import React from 'react';
import { MobileMenu } from './MobileMenu';

interface NavbarProps {
  transparent?: boolean;
}

const navItems = [
  { href: '/', label: 'Accueil' },
  { href: '/features', label: 'Fonctionnalités' },
  { href: '/pricing', label: 'Tarifs' },
  { href: '/about', label: 'À propos' },
  { href: '/contact', label: 'Contact' },
];

function classNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export const Navbar: React.FC<NavbarProps> = ({ transparent = false }) => {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const { isMobileMenuOpen, toggleMobileMenu } = useUiStore();

  const dashboardPath = user?.role === 'ADMIN'
    ? '/dashboard/admin/dashboard'
    : user?.role === 'FORMATEUR'
      ? '/dashboard/admin/dashboard'
      : '/dashboard/student/dashboard';

  return (
    <nav className={classNames(
      'fixed top-0 inset-x-0 z-50 transition-colors duration-300',
      transparent ? 'bg-transparent' : 'backdrop-blur-lg bg-white/70 border-b border-white/30'
    )}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={toggleMobileMenu} className="md:hidden p-2 rounded-lg hover:bg-white/60">
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <Link href="/" className="inline-flex items-center gap-2 font-semibold text-primary-navy">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.7)]" />
              <span>Tous Statisticien</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={classNames(
                  'text-sm font-medium transition-colors',
                  pathname === item.href ? 'text-primary-navy' : 'text-gray-600 hover:text-primary-navy'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link href="/auth/login" className="px-4 py-2 rounded-lg text-sm font-medium text-primary-navy hover:bg-white/60">
                  Se connecter
                </Link>
                <Link href="/auth/register/step-1" className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-400 text-primary-navy shadow-glow hover:bg-amber-500">
                  S'inscrire
                </Link>
              </>
            ) : (
              <>
                <Link href={dashboardPath} className="px-4 py-2 rounded-lg text-sm font-medium bg-primary-navy text-white hover:bg-slate-700">
                  Dashboard
                </Link>
                <button onClick={() => logout()} className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-white/60">
                  Déconnexion
                </button>
              </>
            )}
          </div>
        </div>

        <MobileMenu items={navItems} />
      </div>
    </nav>
  );
};

export {};
