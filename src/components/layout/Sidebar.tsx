"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useMemo } from 'react';
import { useUiStore } from '@/store/uiStore';
import { useAuth } from '@/lib/auth/context';
import {
  LayoutDashboard, BookOpenText, Boxes, PlaySquare, CheckSquare, Inbox,
  FolderKanban, Users, CreditCard, BarChart3, Settings, Home, GraduationCap,
  ClipboardList, Trophy, UserRound
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
}

function classNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar } = useUiStore();
  const { user } = useAuth();

  const role = user?.role || 'STUDENT';

  const items: SidebarItem[] = useMemo(() => {
    if (role === 'ADMIN' || role === 'FORMATEUR') {
      return [
        { label: 'Tableau de bord', href: '/dashboard/admin/dashboard', icon: LayoutDashboard },
        { label: 'Classes', href: '/dashboard/admin/classes', icon: GraduationCap },
        { label: 'Modules', href: '/dashboard/admin/modules', icon: Boxes },
        { label: 'Leçons', href: '/dashboard/admin/lectures', icon: PlaySquare },
        { label: 'Évaluations', href: '/dashboard/admin/evaluations', icon: CheckSquare },
        { label: 'Soumissions', href: '/dashboard/admin/submissions', icon: Inbox },
        { label: 'Ressources', href: '/dashboard/admin/resources', icon: FolderKanban },
        { label: 'Utilisateurs', href: '/dashboard/admin/users', icon: Users },
        { label: 'Paiements', href: '/dashboard/admin/payments', icon: CreditCard },
        { label: 'Statistiques', href: '/dashboard/admin/statistics', icon: BarChart3 },
        { label: 'Paramètres', href: '/dashboard/admin/settings', icon: Settings },
      ];
    }
    return [
      { label: 'Accueil', href: '/dashboard/student/dashboard', icon: Home },
      { label: 'Mes classes', href: '/dashboard/student/classes', icon: GraduationCap },
      { label: 'Mes évaluations', href: '/dashboard/student/evaluations', icon: ClipboardList },
      { label: 'Mes résultats', href: '/dashboard/student/results', icon: Trophy },
      { label: 'Mon profil', href: '/dashboard/student/profile', icon: UserRound },
    ];
  }, [role]);

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={classNames(
          'fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity',
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeSidebar}
      />

      <aside
        className={classNames(
          'fixed z-50 md:z-20 inset-y-0 left-0 w-72 transform transition-transform duration-300 md:translate-x-0',
          'bg-white/10 backdrop-blur-xl border-r border-white/20 text-white',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="h-16 flex items-center px-4 border-b border-white/20">
          <Link href="/" className="font-semibold tracking-wide flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.7)]" />
            Tous Statisticien
          </Link>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
          {items.map(({ label, href, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={classNames(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  active ? 'bg-amber-400 text-primary-navy shadow-glow' : 'hover:bg-white/10 text-white'
                )}
                onClick={closeSidebar}
              >
                <Icon className={classNames('w-5 h-5', active && 'text-primary-navy')} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
