import { create } from 'zustand';

type ThemeMode = 'light' | 'dark';

interface UiStoreState {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  theme: ThemeMode;
  pageTitle?: string;

  // actions
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;

  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;

  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  setPageTitle: (title: string) => void;
}

export const useUiStore = create<UiStoreState>((set, get) => ({
  isSidebarOpen: false,
  isMobileMenuOpen: false,
  theme: 'light',
  pageTitle: undefined,

  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebar: () => set({ isSidebarOpen: !get().isSidebarOpen }),

  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () => set({ isMobileMenuOpen: !get().isMobileMenuOpen }),

  setTheme: (mode) => set({ theme: mode }),
  toggleTheme: () => set({ theme: get().theme === 'light' ? 'dark' : 'light' }),
  setPageTitle: (title) => set({ pageTitle: title }),
}));
