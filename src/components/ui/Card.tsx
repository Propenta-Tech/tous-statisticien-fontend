// ==============================================
// COMPOSANT CARD - TOUS STATISTICIEN ACADEMY
// ==============================================

'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { CardProps } from '@/types/components';

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      className,
      title,
      subtitle,
      headerActions,
      footer,
      variant = 'default',
      padding = 'md',
      hoverable = false,
      clickable = false,
      onClick,
      ...props
    },
    ref
  ) => {
    // Classes de base
    const baseClasses = [
      'bg-white',
      'border',
      'transition-all',
      'duration-200',
    ];

    // Variantes
    const variantClasses = {
      default: [
        'border-gray-200',
        'rounded-lg',
        'shadow-sm',
      ],
      outlined: [
        'border-gray-300',
        'rounded-lg',
        'shadow-none',
      ],
      elevated: [
        'border-gray-200',
        'rounded-lg',
        'shadow-md',
      ],
      filled: [
        'border-transparent',
        'rounded-lg',
        'bg-gray-50',
        'shadow-none',
      ],
    };

    // Padding
    const paddingClasses = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    // États interactifs
    const interactiveClasses = {
      hoverable: hoverable && [
        'hover:shadow-lg',
        'hover:border-gray-300',
        'hover:-translate-y-0.5',
      ],
      clickable: (clickable || onClick) && [
        'cursor-pointer',
        'hover:shadow-md',
        'hover:border-primary-navy/30',
        'active:scale-[0.98]',
      ],
    };

    // Classes finales
    const cardClasses = cn(
      baseClasses,
      variantClasses[variant],
      padding !== 'none' ? paddingClasses[padding] : '',
      interactiveClasses.hoverable,
      interactiveClasses.clickable,
      className
    );

    // Gestion du clic
    const handleClick = () => {
      if (clickable || onClick) {
        onClick?.();
      }
    };

    // Header (titre + actions)
    const renderHeader = () => {
      if (!title && !subtitle && !headerActions) return null;

      return (
        <div className={cn(
          'flex items-start justify-between',
          padding !== 'none' && 'mb-4'
        )}>
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
          {headerActions && (
            <div className="flex-shrink-0 ml-4">
              {headerActions}
            </div>
          )}
        </div>
      );
    };

    // Footer
    const renderFooter = () => {
      if (!footer) return null;

      return (
        <div className={cn(
          'pt-4',
          'mt-4',
          'border-t',
          'border-gray-200'
        )}>
          {footer}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cardClasses}
        onClick={handleClick}
        {...props}
      >
        {/* Header */}
        {renderHeader()}

        {/* Content */}
        <div className={cn(
          padding === 'none' && (title || subtitle || headerActions) && 'mt-4'
        )}>
          {children}
        </div>

        {/* Footer */}
        {renderFooter()}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Composants sous-parties pour plus de flexibilité
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight text-gray-900', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-600', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4 mt-4 border-t border-gray-200', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };