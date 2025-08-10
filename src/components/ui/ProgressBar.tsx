// ==============================================
// COMPOSANT PROGRESSBAR - TOUS STATISTICIEN ACADEMY
// ==============================================
'use client';

import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProgressBarProps } from '@/types/components';

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      label,
      showPercentage = true,
      showValue = false,
      size = 'md',
      color = 'primary',
      variant = 'default',
      animated = false,
      striped = false,
      status,
      icon,
      ...props
    },
    ref
  ) => {
    // Normaliser la valeur entre 0 et 100
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const displayValue = Math.round(percentage);

    // Classes selon la taille
    const sizeClasses = {
      xs: 'h-1',
      sm: 'h-2',
      md: 'h-3',
      lg: 'h-4',
      xl: 'h-6',
    };

    // Classes selon la couleur
    const colorClasses = {
      primary: 'bg-primary-navy',
      secondary: 'bg-primary-gold',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      danger: 'bg-red-500',
      info: 'bg-blue-500',
      gray: 'bg-gray-500',
    };

    // Classes selon le statut
    const getStatusColor = () => {
      if (status === 'success') return 'bg-green-500';
      if (status === 'warning') return 'bg-yellow-500';
      if (status === 'error') return 'bg-red-500';
      return colorClasses[color];
    };

    // Icône selon le statut
    const getStatusIcon = () => {
      if (icon) return icon;
      if (status === 'success') return CheckCircle;
      if (status === 'warning') return AlertCircle;
      if (status === 'error') return AlertCircle;
      if (percentage < 100) return Clock;
      return CheckCircle;
    };

    const StatusIcon = getStatusIcon();

    return (
      <div
        ref={ref}
        className={cn('progress-container', className)}
        {...props}
      >
        {/* En-tête avec label et pourcentage */}
        {(label || showPercentage || showValue || StatusIcon) && (
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              {StatusIcon && (
                <StatusIcon className={cn(
                  'w-4 h-4 mr-2',
                  status === 'success' && 'text-green-500',
                  status === 'warning' && 'text-yellow-500',
                  status === 'error' && 'text-red-500',
                  !status && 'text-gray-500'
                )} />
              )}
              {label && (
                <span className="text-sm font-medium text-gray-700">
                  {label}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {showValue && (
                <span className="text-sm text-gray-600">
                  {value} / {max}
                </span>
              )}
              {showPercentage && (
                <span className="text-sm font-medium text-gray-700">
                  {displayValue}%
                </span>
              )}
            </div>
          </div>
        )}

        {/* Barre de progression */}
        <div
          className={cn(
            'progress-track w-full bg-gray-200 rounded-full overflow-hidden',
            sizeClasses[size],
            variant === 'square' && 'rounded-none',
            variant === 'rounded' && 'rounded-full'
          )}
        >
          <div
            className={cn(
              'progress-fill h-full transition-all duration-300 ease-out',
              getStatusColor(),
              striped && 'bg-stripes',
              animated && 'animate-progress',
              variant === 'gradient' && 'bg-gradient-to-r from-primary-navy to-primary-gold'
            )}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-label={label}
          />
        </div>

        {/* Texte centré dans la barre (pour les grandes tailles) */}
        {size === 'xl' && (showPercentage || showValue) && (
          <div className="relative -mt-6 flex items-center justify-center">
            <span className="text-xs font-medium text-white mix-blend-difference">
              {showValue ? `${value}/${max}` : `${displayValue}%`}
            </span>
          </div>
        )}
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

// Barre de progression circulaire
const CircularProgress = React.forwardRef<
  HTMLDivElement,
  ProgressBarProps & { 
    size?: number;
    strokeWidth?: number;
    showText?: boolean;
  }
>(
  (
    {
      className,
      value = 0,
      max = 100,
      color = 'primary',
      size: circleSize = 120,
      strokeWidth = 8,
      showText = true,
      label,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (circleSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const colorClasses = {
      primary: 'stroke-primary-navy',
      secondary: 'stroke-primary-gold',
      success: 'stroke-green-500',
      warning: 'stroke-yellow-500',
      danger: 'stroke-red-500',
      info: 'stroke-blue-500',
      gray: 'stroke-gray-500',
    };

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex items-center justify-center', className)}
        {...props}
      >
        <svg
          width={circleSize}
          height={circleSize}
          className="transform -rotate-90"
        >
          {/* Cercle de fond */}
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200"
          />
          
          {/* Cercle de progression */}
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn(
              'transition-all duration-300 ease-out',
              colorClasses[color]
            )}
          />
        </svg>

        {/* Texte centré */}
        {showText && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">
              {Math.round(percentage)}%
            </span>
            {label && (
              <span className="text-xs text-gray-600 text-center">
                {label}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

CircularProgress.displayName = 'CircularProgress';

// Barre de progression par étapes
const StepProgress = React.forwardRef<
  HTMLDivElement,
  {
    className?: string;
    steps: Array<{
      id: string;
      label: string;
      description?: string;
      completed?: boolean;
      current?: boolean;
    }>;
    orientation?: 'horizontal' | 'vertical';
    size?: 'sm' | 'md' | 'lg';
  }
>(
  (
    {
      className,
      steps = [],
      orientation = 'horizontal',
      size = 'md',
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: {
        circle: 'w-6 h-6 text-xs',
        text: 'text-xs',
        spacing: orientation === 'horizontal' ? 'space-x-4' : 'space-y-4',
      },
      md: {
        circle: 'w-8 h-8 text-sm',
        text: 'text-sm',
        spacing: orientation === 'horizontal' ? 'space-x-6' : 'space-y-6',
      },
      lg: {
        circle: 'w-10 h-10 text-base',
        text: 'text-base',
        spacing: orientation === 'horizontal' ? 'space-x-8' : 'space-y-8',
      },
    };

    const isHorizontal = orientation === 'horizontal';

    return (
      <div
        ref={ref}
        className={cn(
          'step-progress',
          isHorizontal ? 'flex items-center' : 'flex flex-col',
          sizeClasses[size].spacing,
          className
        )}
        {...props}
      >
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          
          return (
            <div
              key={step.id}
              className={cn(
                'step flex items-center',
                !isHorizontal && 'flex-col text-center',
                isHorizontal && !isLast && 'flex-1'
              )}
            >
              {/* Cercle avec numéro/check */}
              <div className="relative flex items-center">
                <div
                  className={cn(
                    'flex items-center justify-center rounded-full border-2 font-medium',
                    sizeClasses[size].circle,
                    step.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : step.current
                      ? 'bg-primary-navy border-primary-navy text-white'
                      : 'bg-white border-gray-300 text-gray-500'
                  )}
                >
                  {step.completed ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Ligne de connexion */}
                {!isLast && (
                  <div
                    className={cn(
                      isHorizontal
                        ? 'absolute left-full top-1/2 h-0.5 w-full -translate-y-1/2'
                        : 'absolute top-full left-1/2 w-0.5 h-6 -translate-x-1/2',
                      step.completed
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    )}
                  />
                )}
              </div>

              {/* Labels */}
              <div className={cn(
                isHorizontal ? 'ml-3' : 'mt-2',
                !isHorizontal && 'text-center'
              )}>
                <div className={cn(
                  'font-medium',
                  sizeClasses[size].text,
                  step.completed
                    ? 'text-green-700'
                    : step.current
                    ? 'text-primary-navy'
                    : 'text-gray-500'
                )}>
                  {step.label}
                </div>
                
                {step.description && (
                  <div className={cn(
                    'text-gray-600 mt-1',
                    size === 'sm' ? 'text-xs' : 'text-sm'
                  )}>
                    {step.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

StepProgress.displayName = 'StepProgress';

// Hook pour gérer la progression
const useProgress = (initialValue: number = 0, max: number = 100) => {
  const [value, setValue] = React.useState(initialValue);
  
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const increment = (amount: number = 1) => {
    setValue(prev => Math.min(prev + amount, max));
  };
  
  const decrement = (amount: number = 1) => {
    setValue(prev => Math.max(prev - amount, 0));
  };
  
  const reset = () => setValue(0);
  const complete = () => setValue(max);
  
  const isComplete = value >= max;
  const isEmpty = value <= 0;

  return {
    value,
    setValue,
    percentage,
    increment,
    decrement,
    reset,
    complete,
    isComplete,
    isEmpty,
  };
};

export { 
  ProgressBar, 
  CircularProgress, 
  StepProgress, 
  useProgress 
};

export default ProgressBar;