// ==============================================
// COMPOSANT BADGE - TOUS STATISTICIEN ACADEMY
// ==============================================

'use client';

import React from 'react';
import { X, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BadgeProps } from '@/types/components';

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      className,
      variant = 'solid',
      color = 'primary',
      size = 'md',
      rounded = false,
      removable = false,
      onRemove,
      icon: Icon,
      ...props
    },
    ref
  ) => {
    // Classes de base
    const baseClasses = [
      'inline-flex',
      'items-center',
      'font-medium',
      'transition-all',
      'duration-200',
      'border',
    ];

    // Classes de taille
    const sizeClasses = {
      xs: ['text-xs', 'px-1.5', 'py-0.5', 'gap-1'],
      sm: ['text-xs', 'px-2', 'py-1', 'gap-1'],
      md: ['text-sm', 'px-2.5', 'py-1', 'gap-1.5'],
      lg: ['text-sm', 'px-3', 'py-1.5', 'gap-2'],
    };

    // Classes de forme
    const shapeClasses = rounded ? 'rounded-full' : 'rounded-md';

    // Variantes et couleurs selon la charte TSA
    const colorVariants = {
      primary: {
        solid: [
          'bg-primary-navy',
          'text-white',
          'border-primary-navy',
        ],
        outline: [
          'bg-transparent',
          'text-primary-navy',
          'border-primary-navy',
        ],
        subtle: [
          'bg-primary-navy/10',
          'text-primary-navy',
          'border-primary-navy/20',
        ],
        ghost: [
          'bg-transparent',
          'text-primary-navy',
          'border-transparent',
        ],
      },
      secondary: {
        solid: [
          'bg-primary-gold',
          'text-primary-navy',
          'border-primary-gold',
        ],
        outline: [
          'bg-transparent',
          'text-primary-gold',
          'border-primary-gold',
        ],
        subtle: [
          'bg-primary-gold/10',
          'text-primary-gold',
          'border-primary-gold/20',
        ],
        ghost: [
          'bg-transparent',
          'text-primary-gold',
          'border-transparent',
        ],
      },
      success: {
        solid: [
          'bg-green-600',
          'text-white',
          'border-green-600',
        ],
        outline: [
          'bg-transparent',
          'text-green-600',
          'border-green-600',
        ],
        subtle: [
          'bg-green-50',
          'text-green-700',
          'border-green-200',
        ],
        ghost: [
          'bg-transparent',
          'text-green-600',
          'border-transparent',
        ],
      },
      danger: {
        solid: [
          'bg-accent-red',
          'text-white',
          'border-accent-red',
        ],
        outline: [
          'bg-transparent',
          'text-accent-red',
          'border-accent-red',
        ],
        subtle: [
          'bg-red-50',
          'text-red-700',
          'border-red-200',
        ],
        ghost: [
          'bg-transparent',
          'text-accent-red',
          'border-transparent',
        ],
      },
      warning: {
        solid: [
          'bg-yellow-500',
          'text-white',
          'border-yellow-500',
        ],
        outline: [
          'bg-transparent',
          'text-yellow-600',
          'border-yellow-500',
        ],
        subtle: [
          'bg-yellow-50',
          'text-yellow-700',
          'border-yellow-200',
        ],
        ghost: [
          'bg-transparent',
          'text-yellow-600',
          'border-transparent',
        ],
      },
      info: {
        solid: [
          'bg-blue-600',
          'text-white',
          'border-blue-600',
        ],
        outline: [
          'bg-transparent',
          'text-blue-600',
          'border-blue-600',
        ],
        subtle: [
          'bg-blue-50',
          'text-blue-700',
          'border-blue-200',
        ],
        ghost: [
          'bg-transparent',
          'text-blue-600',
          'border-transparent',
        ],
      },
      dark: {
        solid: [
          'bg-gray-800',
          'text-white',
          'border-gray-800',
        ],
        outline: [
          'bg-transparent',
          'text-gray-800',
          'border-gray-800',
        ],
        subtle: [
          'bg-gray-100',
          'text-gray-800',
          'border-gray-200',
        ],
        ghost: [
          'bg-transparent',
          'text-gray-800',
          'border-transparent',
        ],
      },
      light: {
        solid: [
          'bg-gray-200',
          'text-gray-800',
          'border-gray-200',
        ],
        outline: [
          'bg-transparent',
          'text-gray-600',
          'border-gray-300',
        ],
        subtle: [
          'bg-gray-50',
          'text-gray-600',
          'border-gray-100',
        ],
        ghost: [
          'bg-transparent',
          'text-gray-600',
          'border-transparent',
        ],
      },
      navy: {
        solid: [
          'bg-primary-navy',
          'text-white',
          'border-primary-navy',
        ],
        outline: [
          'bg-transparent',
          'text-primary-navy',
          'border-primary-navy',
        ],
        subtle: [
          'bg-primary-navy/10',
          'text-primary-navy',
          'border-primary-navy/20',
        ],
        ghost: [
          'bg-transparent',
          'text-primary-navy',
          'border-transparent',
        ],
      },
      gold: {
        solid: [
          'bg-primary-gold',
          'text-primary-navy',
          'border-primary-gold',
        ],
        outline: [
          'bg-transparent',
          'text-primary-gold',
          'border-primary-gold',
        ],
        subtle: [
          'bg-primary-gold/10',
          'text-primary-gold',
          'border-primary-gold/20',
        ],
        ghost: [
          'bg-transparent',
          'text-primary-gold',
          'border-transparent',
        ],
      },
    };

    // Classes finales
    const badgeClasses = cn(
      baseClasses,
      sizeClasses[size],
      shapeClasses,
      colorVariants[color][variant],
      removable && 'pr-1',
      className
    );

    // Taille des icônes selon la taille du badge
    const iconSize = {
      xs: 'w-3 h-3',
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-4 h-4',
    };

    // Gestion de la suppression
    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove?.();
    };

    return (
      <span
        ref={ref}
        className={badgeClasses}
        {...props}
      >
        {/* Icône */}
        {Icon && (
          <Icon className={iconSize[size]} />
        )}

        {/* Contenu */}
        {children && <span>{children}</span>}

        {/* Bouton de suppression */}
        {removable && (
          <button
            type="button"
            onClick={handleRemove}
            className={cn(
              'ml-1 flex-shrink-0 rounded-full p-0.5',
              'hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-offset-1',
              'transition-colors duration-150',
              variant === 'solid' && [
                color === 'primary' && 'hover:bg-white/20 focus:ring-white/50',
                color === 'secondary' && 'hover:bg-primary-navy/20 focus:ring-primary-navy/50',
                color === 'success' && 'hover:bg-white/20 focus:ring-white/50',
                color === 'danger' && 'hover:bg-white/20 focus:ring-white/50',
                color === 'warning' && 'hover:bg-white/20 focus:ring-white/50',
                color === 'info' && 'hover:bg-white/20 focus:ring-white/50',
                color === 'dark' && 'hover:bg-white/20 focus:ring-white/50',
                color === 'light' && 'hover:bg-gray-800/20 focus:ring-gray-800/50',
              ]
            )}
          >
            <X className={cn(
              iconSize[size],
              'flex-shrink-0'
            )} />
          </button>
        )}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };