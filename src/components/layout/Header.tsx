"use client";

import React from 'react';
import { useUiStore } from '@/store/uiStore';
import { useAuth } from '@/lib/auth/context';
import { Menu, Bell, Sun, Moon } from 'lucide-react';

export const Header: React.FC = () => {
  const { toggleSidebar, theme, toggleTheme } = useUiStore();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/10 border-b border-white/20">
      <div className="h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-white/10 text-white md:hidden">
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden md:block">
            <h1 className="text-sm sm:text-base font-medium text-white/90">Bienvenue{user ? `, ${user.firstName}` : ''}</h1>
            <p className="text-xs text-white/60">Tous Statisticien Academy</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center">
            <input
              placeholder="Rechercher..."
              className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            />
          </div>
          <button className="p-2 rounded-lg hover:bg-white/10">
            <Bell className="w-5 h-5 text-white" />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/10" onClick={toggleTheme}>
            {theme === 'light' ? <Sun className="w-5 h-5 text-white" /> : <Moon className="w-5 h-5 text-white" />}
          </button>
          <div className="ml-1 w-8 h-8 rounded-full bg-amber-400 text-primary-navy font-bold grid place-items-center">
            {user?.firstName?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export {};
