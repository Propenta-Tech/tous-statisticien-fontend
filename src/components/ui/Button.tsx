// ==============================================
// COMPOSANT BUTTON - TOUS STATISTICIEN ACADEMY
// ==============================================

'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ButtonProps } from '@/types/components';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      fullWidth = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      type = 'button',
      href,
      target,
      as = 'button',
      onClick,
      ...props
    },
    ref
  ) => {
    // Classes de base
    const baseClasses = [
      'inline-flex',
      'items-center',
      'justify-center',
      'font-medium',
      'transition-all',
      'duration-200',
      'border',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'disabled:opacity-60',
      'disabled:cursor-not-allowed',
      'disabled:pointer-events-none',
    ];

    // Variantes de couleur selon la charte TSA
    const variantClasses = {
      primary: [
        'bg-primary-navy',
        'text-white',
        'border-primary-navy',
        'hover:bg-primary-navy/90',
        'focus:ring-primary-navy/50',
        'active:bg-primary-navy/95',
      ],
      secondary: [
        'bg-primary-gold',
        'text-primary-navy',
        'border-primary-gold',
        'hover:bg-primary-gold/90',
        'focus:ring-primary-gold/50',
        'active:bg-primary-gold/95',
      ],
      outline: [
        'bg-transparent',
        'text-primary-navy',
        'border-primary-navy',
        'hover:bg-primary-navy',
        'hover:text-white',
        'focus:ring-primary-navy/50',
      ],
      ghost: [
        'bg-transparent',
        'text-primary-navy',
        'border-transparent',
        'hover:bg-gray-100',
        'focus:ring-gray-300',
      ],
      danger: [
        'bg-accent-red',
        'text-white',
        'border-accent-red',
        'hover:bg-accent-red/90',
        'focus:ring-accent-red/50',
        'active:bg-accent-red/95',
      ],
      success: [
        'bg-green-600',
        'text-white',
        'border-green-600',
        'hover:bg-green-700',
        'focus:ring-green-500/50',
        'active:bg-green-800',
      ],
      warning: [
        'bg-yellow-600',
        'text-white',
        'border-yellow-600',
        'hover:bg-yellow-700',
        'focus:ring-yellow-500/50',
        'active:bg-yellow-800',
      ],
      info: [
        'bg-blue-600',
        'text-white',
        'border-blue-600',
        'hover:bg-blue-700',
        'focus:ring-blue-500/50',
        'active:bg-blue-800',
      ],
      link: [
        'bg-transparent',
        'text-primary-navy',
        'border-transparent',
        'hover:underline',
        'focus:ring-0',
        'p-0',
        'h-auto',
      ],
    };

    // Tailles
    const sizeClasses = {
      xs: ['text-xs', 'px-2', 'py-1', 'rounded', 'min-h-[24px]'],
      sm: ['text-sm', 'px-3', 'py-1.5', 'rounded-md', 'min-h-[32px]'],
      md: ['text-sm', 'px-4', 'py-2', 'rounded-md', 'min-h-[40px]'],
      lg: ['text-base', 'px-6', 'py-3', 'rounded-lg', 'min-h-[48px]'],
      xl: ['text-lg', 'px-8', 'py-4', 'rounded-lg', 'min-h-[56px]'],
      '2xl': ['text-xl', 'px-10', 'py-5', 'rounded-xl', 'min-h-[64px]'],
    };

    // Classes de largeur
    const widthClasses = fullWidth ? ['w-full'] : [];

    // Classes finales
    const buttonClasses = cn(
      baseClasses,
      variantClasses[variant],
      variant !== 'link' ? sizeClasses[size] : [],
      widthClasses,
      {
        'opacity-50 cursor-not-allowed': disabled || loading,
        'cursor-pointer': !disabled && !loading,
      },
      className
    );

    // Contenu du bouton
    const buttonContent = (
      <>
        {loading && (
          <svg
            className={cn(
              'animate-spin',
              size === 'xs' ? 'w-3 h-3' : 
              size === 'sm' ? 'w-4 h-4' : 
              size === 'md' ? 'w-4 h-4' :
              size === 'lg' ? 'w-5 h-5' : 'w-6 h-6',
              (LeftIcon || children) && 'mr-2'
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
        )}

        {!loading && LeftIcon && (
          <LeftIcon
            className={cn(
              size === 'xs' ? 'w-3 h-3' : 
              size === 'sm' ? 'w-4 h-4' : 
              size === 'md' ? 'w-4 h-4' :
              size === 'lg' ? 'w-5 h-5' : 'w-6 h-6',
              children && 'mr-2'
            )}
          />
        )}

        {children && <span>{children}</span>}

        {!loading && RightIcon && (
          <RightIcon
            className={cn(
              size === 'xs' ? 'w-3 h-3' : 
              size === 'sm' ? 'w-4 h-4' : 
              size === 'md' ? 'w-4 h-4' :
              size === 'lg' ? 'w-5 h-5' : 'w-6 h-6',
              children && 'ml-2'
            )}
          />
        )}
      </>
    );

    // Gestion du clic
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) {
        e.preventDefault();
        return;
      }
      onClick?.();
    };

    // Rendu conditionnel selon le type
    if (as === 'a' && href) {
      return (
        <a
          href={href}
          target={target}
          className={buttonClasses}
          onClick={onClick}
          {...(props as any)}
        >
          {buttonContent}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };