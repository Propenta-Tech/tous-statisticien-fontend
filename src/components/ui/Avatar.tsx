// ==============================================
// COMPOSANT AVATAR - TOUS STATISTICIEN ACADEMY
// ==============================================

'use client';

import React, { useState } from 'react';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AvatarProps } from '@/types/components';

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      alt,
      name,
      size = 'md',
      shape = 'circle',
      fallbackBg,
      online,
      onClick,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Classes de base
    const baseClasses = [
      'relative',
      'inline-flex',
      'items-center',
      'justify-center',
      'overflow-hidden',
      'bg-gray-100',
      'select-none',
      'flex-shrink-0',
    ];

    // Classes de taille
    const sizeClasses = {
      xs: ['w-6', 'h-6', 'text-xs'],
      sm: ['w-8', 'h-8', 'text-sm'],
      md: ['w-10', 'h-10', 'text-base'],
      lg: ['w-12', 'h-12', 'text-lg'],
      xl: ['w-16', 'h-16', 'text-xl'],
      '2xl': ['w-20', 'h-20', 'text-2xl'],
    };

    // Classes de forme
    const shapeClasses = {
      circle: 'rounded-full',
      square: 'rounded-lg',
    };

    // Classes d'interaction
    const interactiveClasses = onClick && [
      'cursor-pointer',
      'hover:opacity-80',
      'transition-opacity',
      'duration-200',
    ];

    // Classes finales
    const avatarClasses = cn(
      baseClasses,
      sizeClasses[size],
      shapeClasses[shape],
      interactiveClasses,
      className
    );

    // Gestion des erreurs d'image
    const handleImageError = () => {
      setImageError(true);
    };

    const handleImageLoad = () => {
      setImageLoaded(true);
    };

    // Génération des initiales
    const getInitials = (name?: string): string => {
      if (!name) return '';
      
      const parts = name.trim().split(' ');
      if (parts.length === 1) {
        return parts[0].charAt(0).toUpperCase();
      }
      
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    // Génération de couleur de fond basée sur le nom
    const getBackgroundColor = (name?: string): string => {
      if (fallbackBg) return fallbackBg;
      if (!name) return 'bg-gray-300';

      const colors = [
        'bg-red-500',
        'bg-orange-500',
        'bg-amber-500',
        'bg-yellow-500',
        'bg-lime-500',
        'bg-green-500',
        'bg-emerald-500',
        'bg-teal-500',
        'bg-cyan-500',
        'bg-sky-500',
        'bg-blue-500',
        'bg-indigo-500',
        'bg-violet-500',
        'bg-purple-500',
        'bg-fuchsia-500',
        'bg-pink-500',
        'bg-rose-500',
      ];

      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }

      return colors[Math.abs(hash) % colors.length];
    };

    // Classes de l'indicateur en ligne
    const onlineIndicatorClasses = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4',
      '2xl': 'w-5 h-5',
    };

    const initials = getInitials(name);
    const backgroundColorClass = getBackgroundColor(name);
    const shouldShowImage = src && !imageError;
    const shouldShowInitials = !shouldShowImage && initials;
    const shouldShowIcon = !shouldShowImage && !shouldShowInitials;

    return (
      <div
        ref={ref}
        className={avatarClasses}
        onClick={onClick}
        {...props}
      >
        {/* Image */}
        {shouldShowImage && (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className={cn(
              'w-full h-full object-cover',
              !imageLoaded && 'opacity-0',
              imageLoaded && 'opacity-100 transition-opacity duration-200'
            )}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}

        {/* Initiales */}
        {shouldShowInitials && (
          <div
            className={cn(
              'w-full h-full flex items-center justify-center text-white font-semibold',
              backgroundColorClass
            )}
          >
            {initials}
          </div>
        )}

        {/* Icône par défaut */}
        {shouldShowIcon && (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
            <User className={cn(
              size === 'xs' ? 'w-3 h-3' :
              size === 'sm' ? 'w-4 h-4' :
              size === 'md' ? 'w-5 h-5' :
              size === 'lg' ? 'w-6 h-6' :
              size === 'xl' ? 'w-8 h-8' : 'w-10 h-10'
            )} />
          </div>
        )}

        {/* Indicateur en ligne */}
        {online !== undefined && (
          <div
            className={cn(
              'absolute bottom-0 right-0 rounded-full border-2 border-white',
              onlineIndicatorClasses[size],
              online ? 'bg-green-500' : 'bg-gray-400'
            )}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

// Composant pour un groupe d'avatars
interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  max?: number;
  spacing?: 'sm' | 'md' | 'lg';
  showTotal?: boolean;
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  (
    {
      children,
      className,
      max = 5,
      spacing = 'md',
      showTotal = false,
      ...props
    },
    ref
  ) => {
    const spacingClasses = {
      sm: '-space-x-1',
      md: '-space-x-2',
      lg: '-space-x-3',
    };

    const childrenArray = React.Children.toArray(children);
    const visibleChildren = childrenArray.slice(0, max);
    const remainingCount = Math.max(0, childrenArray.length - max);

    return (
      <div
        ref={ref}
        className={cn('flex items-center', spacingClasses[spacing], className)}
        {...props}
      >
        {visibleChildren}
        
        {remainingCount > 0 && (
          <div className="relative inline-flex items-center justify-center w-10 h-10 text-sm font-medium text-gray-600 bg-gray-100 rounded-full border-2 border-white">
            +{remainingCount}
          </div>
        )}
        
        {showTotal && (
          <span className="ml-3 text-sm text-gray-500">
            {childrenArray.length} au total
          </span>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';

export { Avatar, AvatarGroup };