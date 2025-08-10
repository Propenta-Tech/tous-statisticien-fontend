// ==============================================
// COMPOSANT SPINNER - TOUS STATISTICIEN ACADEMY
// ==============================================
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { SpinnerProps } from '@/types/components';

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      className,
      size = 'md',
      color = 'primary',
      label,
      ...props
    },
    ref
  ) => {
    // Classes de taille
    const sizeClasses = {
      xs: 'w-4 h-4',
      sm: 'w-5 h-5',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-10 h-10',
      '2xl': 'w-12 h-12',
    };

    // Classes de couleur selon la charte TSA
    const colorClasses = {
      primary: 'text-primary-navy',
      secondary: 'text-primary-gold',
      success: 'text-green-600',
      danger: 'text-accent-red',
      warning: 'text-yellow-600',
      info: 'text-blue-600',
      dark: 'text-gray-800',
      light: 'text-gray-400',
      navy: 'text-primary-navy',
      gold: 'text-primary-gold',
    };

    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center', className)}
        role="status"
        aria-label={label || 'Chargement en cours...'}
        {...props}
      >
        <svg
          className={cn(
            'animate-spin',
            sizeClasses[size],
            colorClasses[color]
          )}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        
        {label && (
          <span className="ml-2 text-sm text-gray-600">
            {label}
          </span>
        )}
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

// Variantes de spinner pour différents usages
const SpinnerDots = React.forwardRef<HTMLDivElement, SpinnerProps>(
  (
    {
      className,
      size = 'md',
      color = 'primary',
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      xs: 'w-1 h-1',
      sm: 'w-1.5 h-1.5',
      md: 'w-2 h-2',
      lg: 'w-2.5 h-2.5',
      xl: 'w-3 h-3',
      '2xl': 'w-4 h-4',
    };

    const colorClasses = {
      primary: 'bg-primary-navy',
      secondary: 'bg-primary-gold',
      success: 'bg-green-600',
      danger: 'bg-accent-red',
      warning: 'bg-yellow-600',
      info: 'bg-blue-600',
      dark: 'bg-gray-800',
      light: 'bg-gray-400',
      navy: 'bg-primary-navy',
      gold: 'bg-primary-gold',
    };

    return (
      <div
        ref={ref}
        className={cn('flex space-x-1', className)}
        role="status"
        aria-label="Chargement en cours..."
        {...props}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'rounded-full animate-pulse',
              sizeClasses[size],
              colorClasses[color]
            )}
            style={{
              animationDelay: `${i * 0.15}s`,
              animationDuration: '0.9s',
            }}
          />
        ))}
      </div>
    );
  }
);

SpinnerDots.displayName = 'SpinnerDots';

// Spinner circulaire avec progression
const SpinnerProgress = React.forwardRef<
  HTMLDivElement,
  SpinnerProps & { progress?: number }
>(
  (
    {
      className,
      size = 'md',
      color = 'primary',
      progress = 0,
      label,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      xs: 'w-4 h-4',
      sm: 'w-5 h-5',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-10 h-10',
      '2xl': 'w-12 h-12',
    };

    const colorClasses = {
      primary: 'text-primary-navy',
      secondary: 'text-primary-gold',
      success: 'text-green-600',
      danger: 'text-accent-red',
      warning: 'text-yellow-600',
      info: 'text-blue-600',
      dark: 'text-gray-800',
      light: 'text-gray-400',
      navy: 'text-primary-navy',
      gold: 'text-primary-gold',
    };

    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div
        ref={ref}
        className={cn('inline-flex items-center', className)}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || `Progression: ${progress}%`}
        {...props}
      >
        <svg
          className={cn(sizeClasses[size], colorClasses[color])}
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            className="opacity-25"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300 ease-in-out"
            transform="rotate(-90 50 50)"
          />
        </svg>
        
        {label && (
          <span className="ml-2 text-sm text-gray-600">
            {label}
          </span>
        )}
      </div>
    );
  }
);

SpinnerProgress.displayName = 'SpinnerProgress';

// Spinner pour overlay/loading screen
const SpinnerOverlay = React.forwardRef<
  HTMLDivElement,
  SpinnerProps & { 
    visible?: boolean;
    backdrop?: boolean;
    children?: React.ReactNode;
  }
>(
  (
    {
      className,
      size = 'lg',
      color = 'primary',
      label = 'Chargement en cours...',
      visible = true,
      backdrop = true,
      children,
      ...props
    },
    ref
  ) => {
    if (!visible) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center',
          backdrop && 'bg-black/50 backdrop-blur-sm',
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-xl">
          <Spinner size={size} color={color} />
          {label && (
            <p className="text-sm text-gray-600 text-center max-w-xs">
              {label}
            </p>
          )}
          {children}
        </div>
      </div>
    );
  }
);

SpinnerOverlay.displayName = 'SpinnerOverlay';

// Export des composants
export { 
  Spinner, 
  SpinnerDots, 
  SpinnerProgress, 
  SpinnerOverlay 
};

export default Spinner;