// ==============================================
// COMPOSANT TABS - TOUS STATISTICIEN ACADEMY
// ==============================================
'use client';

import React, { useState, useEffect } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TabsProps, TabItem } from '@/types/components';

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      className,
      items = [],
      defaultTab,
      activeTab,
      onTabChange,
      orientation = 'horizontal',
      variant = 'default',
      size = 'md',
      fullWidth = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [internalActiveTab, setInternalActiveTab] = useState<string>(
      activeTab || defaultTab || items[0]?.id || ''
    );

    // Gérer les changements d'onglet externe
    useEffect(() => {
      if (activeTab !== undefined) {
        setInternalActiveTab(activeTab);
      }
    }, [activeTab]);

    const currentTab = activeTab !== undefined ? activeTab : internalActiveTab;

    const handleTabClick = (tabId: string) => {
      if (disabled) return;
      
      const tab = items.find(item => item.id === tabId);
      if (tab?.disabled) return;

      if (activeTab === undefined) {
        setInternalActiveTab(tabId);
      }
      onTabChange?.(tabId);
    };

    // Classes selon la taille
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    // Classes selon la variante
    const getVariantClasses = (isActive: boolean, isDisabled: boolean) => {
      const baseClasses = 'transition-all duration-200 font-medium relative';
      
      if (isDisabled) {
        return cn(baseClasses, 'opacity-50 cursor-not-allowed text-gray-400');
      }

      switch (variant) {
        case 'pills':
          return cn(
            baseClasses,
            'rounded-full border',
            isActive
              ? 'bg-primary-navy text-white border-primary-navy shadow-sm'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
          );
        
        case 'underline':
          return cn(
            baseClasses,
            'border-b-2 bg-transparent',
            isActive
              ? 'text-primary-navy border-primary-navy'
              : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
          );
        
        case 'card':
          return cn(
            baseClasses,
            'border rounded-t-lg bg-white',
            isActive
              ? 'text-primary-navy border-gray-300 border-b-white -mb-px'
              : 'text-gray-600 border-transparent hover:text-gray-900 bg-gray-50'
          );
        
        default: // default
          return cn(
            baseClasses,
            'rounded-md',
            isActive
              ? 'bg-primary-navy/10 text-primary-navy'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          );
      }
    };

    const activeTabContent = items.find(item => item.id === currentTab);

    const isHorizontal = orientation === 'horizontal';

    return (
      <div
        ref={ref}
        className={cn(
          'tabs-container',
          !isHorizontal && 'flex gap-4',
          className
        )}
        {...props}
      >
        {/* Navigation des onglets */}
        <div
          role="tablist"
          aria-orientation={orientation}
          className={cn(
            'tabs-nav flex',
            isHorizontal
              ? 'border-b border-gray-200'
              : 'flex-col border-r border-gray-200 min-w-[200px]',
            fullWidth && isHorizontal && 'w-full',
            variant === 'card' && isHorizontal && 'border-b-0'
          )}
        >
          {items.map((tab, index) => {
            const isActive = tab.id === currentTab;
            const isDisabled = disabled || tab.disabled;

            return (
              <button
                key={tab.id}
                role="tab"
                type="button"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                id={`tab-${tab.id}`}
                disabled={isDisabled}
                className={cn(
                  'tab-button inline-flex items-center justify-center',
                  'focus:outline-none focus:ring-2 focus:ring-primary-navy/20 focus:ring-offset-2',
                  sizeClasses[size],
                  getVariantClasses(isActive, isDisabled),
                  fullWidth && isHorizontal && 'flex-1',
                  !isHorizontal && 'w-full justify-start',
                  variant === 'pills' && (isHorizontal ? 'mr-2' : 'mb-2'),
                  variant === 'underline' && isHorizontal && '-mb-px'
                )}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.icon && (
                  <tab.icon className={cn(
                    'flex-shrink-0',
                    size === 'sm' ? 'w-4 h-4' : 'w-5 h-5',
                    tab.label && (isHorizontal ? 'mr-2' : 'mr-3')
                  )} />
                )}
                
                {tab.label && (
                  <span className="truncate">{tab.label}</span>
                )}
                
                {tab.badge && (
                  <span className={cn(
                    'ml-2 px-2 py-0.5 text-xs font-medium rounded-full',
                    isActive
                      ? 'bg-white text-primary-navy'
                      : 'bg-gray-200 text-gray-700'
                  )}>
                    {tab.badge}
                  </span>
                )}

                {tab.indicator && (
                  <div className={cn(
                    'ml-2 w-2 h-2 rounded-full',
                    typeof tab.indicator === 'string'
                      ? tab.indicator
                      : 'bg-accent-red'
                  )} />
                )}
              </button>
            );
          })}
        </div>

        {/* Contenu des onglets */}
        <div
          className={cn(
            'tabs-content flex-1',
            isHorizontal ? 'mt-4' : 'ml-4'
          )}
        >
          {activeTabContent && (
            <div
              role="tabpanel"
              id={`tabpanel-${activeTabContent.id}`}
              aria-labelledby={`tab-${activeTabContent.id}`}
              className="tab-panel focus:outline-none"
              tabIndex={0}
            >
              {typeof activeTabContent.content === 'function'
                ? activeTabContent.content()
                : activeTabContent.content}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';

// Composant TabItem pour une utilisation plus simple
const TabItem: React.FC<{
  id: string;
  label?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
  indicator?: boolean | string;
}> = ({ children, ...props }) => {
  return <div>{children}</div>;
};

// Hook personnalisé pour gérer les onglets
const useTabs = (initialTab?: string) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab || '');

  const switchTab = (tabId: string) => {
    setActiveTab(tabId);
  };

  return {
    activeTab,
    setActiveTab: switchTab,
  };
};

export { Tabs, TabItem, useTabs };
export default Tabs;