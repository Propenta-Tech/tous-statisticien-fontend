// ==============================================
// COMPOSANT SWITCH - TOUS STATISTICIEN ACADEMY
// ==============================================
'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SwitchProps } from '@/types/components';

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      checked = false,
      onChange,
      disabled = false,
      loading = false,
      error,
      label,
      description,
      required = false,
      size = 'md',
      variant = 'default',
      showIcons = false,
      onLabel,
      offLabel,
      ...props
    },
    ref
  ) => {
    // Classes selon la taille
    const sizeClasses = {
      sm: {
        track: 'w-8 h-4',
        thumb: 'w-3 h-3',
        translate: 'translate-x-4',
        padding: 'p-0.5',
      },
      md: {
        track: 'w-11 h-6',
        thumb: 'w-5 h-5',
        translate: 'translate-x-5',
        padding: 'p-0.5',
      },
      lg: {
        track: 'w-14 h-7',
        thumb: 'w-6 h-6',
        translate: 'translate-x-7',
        padding: 'p-0.5',
      },
    };

    // Classes selon la variante
    const variantClasses = {
      default: {
        trackOn: 'bg-primary-navy',
        trackOff: 'bg-gray-200',
        trackDisabled: 'bg-gray-100',
        thumb: 'bg-white',
        thumbDisabled: 'bg-gray-300',
        focus: 'focus:ring-primary-navy/20',
      },
      success: {
        trackOn: 'bg-green-500',
        trackOff: 'bg-gray-200',
        trackDisabled: 'bg-gray-100',
        thumb: 'bg-white',
        thumbDisabled: 'bg-gray-300',
        focus: 'focus:ring-green-500/20',
      },
      warning: {
        trackOn: 'bg-yellow-500',
        trackOff: 'bg-gray-200',
        trackDisabled: 'bg-gray-100',
        thumb: 'bg-white',
        thumbDisabled: 'bg-gray-300',
        focus: 'focus:ring-yellow-500/20',
      },
      danger: {
        trackOn: 'bg-red-500',
        trackOff: 'bg-gray-200',
        trackDisabled: 'bg-gray-100',
        thumb: 'bg-white',
        thumbDisabled: 'bg-gray-300',
        focus: 'focus:ring-red-500/20',
      },
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled && !loading) {
        onChange?.(e.target.checked, e);
      }
    };

    const handleClick = () => {
      if (!disabled && !loading) {
        onChange?.(!checked, {} as any);
      }
    };

    const currentSize = sizeClasses[size];
    const currentVariant = variantClasses[variant];

    return (
      <div className={cn('flex items-start', className)}>
        {/* Switch container */}
        <div className="flex items-center">
          <div className="relative">
            {/* Input caché */}
            <input
              ref={ref}
              type="checkbox"
              checked={checked}
              onChange={handleChange}
              disabled={disabled}
              required={required}
              className="sr-only"
              {...props}
            />

            {/* Track */}
            <div
              className={cn(
                'relative inline-flex items-center rounded-full transition-all duration-200 ease-in-out cursor-pointer',
                'focus-within:ring-2 focus-within:ring-offset-2',
                currentSize.track,
                currentSize.padding,
                disabled
                  ? currentVariant.trackDisabled
                  : checked
                  ? currentVariant.trackOn
                  : currentVariant.trackOff,
                currentVariant.focus,
                error && 'ring-2 ring-accent-red/20',
                (disabled || loading) && 'cursor-not-allowed opacity-50'
              )}
              onClick={handleClick}
            >
              {/* Thumb */}
              <div
                className={cn(
                  'inline-block rounded-full shadow-lg transform transition-all duration-200 ease-in-out',
                  'flex items-center justify-center',
                  currentSize.thumb,
                  disabled ? currentVariant.thumbDisabled : currentVariant.thumb,
                  checked ? currentSize.translate : 'translate-x-0'
                )}
              >
                {/* Loading spinner */}
                {loading && (
                  <div className="w-2 h-2 border border-gray-400 border-t-transparent rounded-full animate-spin" />
                )}

                {/* Icons */}
                {!loading && showIcons && (
                  <>
                    {checked ? (
                      <Check className={cn(
                        size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-3 h-3' : 'w-2.5 h-2.5',
                        'text-green-600'
                      )} />
                    ) : (
                      <X className={cn(
                        size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-3 h-3' : 'w-2.5 h-2.5',
                        'text-gray-400'
                      )} />
                    )}
                  </>
                )}
              </div>

              {/* Labels on track */}
              {(onLabel || offLabel) && (
                <>
                  {/* On label */}
                  {onLabel && (
                    <span
                      className={cn(
                        'absolute left-1 text-xs font-medium transition-opacity duration-200',
                        size === 'sm' ? 'text-[10px]' : 'text-xs',
                        checked ? 'opacity-100 text-white' : 'opacity-0'
                      )}
                    >
                      {onLabel}
                    </span>
                  )}

                  {/* Off label */}
                  {offLabel && (
                    <span
                      className={cn(
                        'absolute right-1 text-xs font-medium transition-opacity duration-200',
                        size === 'sm' ? 'text-[10px]' : 'text-xs',
                        !checked ? 'opacity-100 text-gray-600' : 'opacity-0'
                      )}
                    >
                      {offLabel}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* External labels */}
          {(onLabel || offLabel) && !(onLabel && offLabel) && (
            <div className="ml-3">
              <span className={cn(
                'text-sm font-medium',
                disabled ? 'text-gray-400' : 'text-gray-900'
              )}>
                {checked ? onLabel : offLabel}
              </span>
            </div>
          )}
        </div>

        {/* Label et description */}
        {(label || description) && (
          <div className={cn('ml-3 flex-1', size === 'sm' && 'ml-2')}>
            {label && (
              <label
                className={cn(
                  'block font-medium cursor-pointer',
                  size === 'sm' ? 'text-sm' : 'text-base',
                  disabled ? 'text-gray-400' : 'text-gray-900',
                  error && 'text-accent-red'
                )}
                onClick={handleClick}
              >
                {label}
                {required && <span className="text-accent-red ml-1">*</span>}
              </label>
            )}
            
            {description && (
              <p className={cn(
                'mt-1 text-gray-600',
                size === 'sm' ? 'text-xs' : 'text-sm',
                disabled && 'text-gray-400'
              )}>
                {description}
              </p>
            )}
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <p className="mt-1 text-xs text-accent-red">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';

// Composant Switch simple
const SimpleSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ checked, onChange, disabled, size = 'md', className }) => {
  return (
    <Switch
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      size={size}
      className={className}
    />
  );
};

// Hook pour gérer l'état du switch
const useSwitch = (initialValue: boolean = false) => {
  const [checked, setChecked] = React.useState(initialValue);

  const toggle = () => setChecked(prev => !prev);
  const turnOn = () => setChecked(true);
  const turnOff = () => setChecked(false);

  return {
    checked,
    setChecked,
    toggle,
    turnOn,
    turnOff,
  };
};

export { Switch, SimpleSwitch, useSwitch };
export default Switch;