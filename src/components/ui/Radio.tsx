// ==============================================
// COMPOSANTS CHECKBOX & RADIO - TOUS STATISTICIEN ACADEMY
// ==============================================
'use client';

import React from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CheckboxProps, RadioProps } from '@/types/components';

// ============================================
// COMPOSANT CHECKBOX
// ============================================
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      checked,
      onChange,
      indeterminate = false,
      disabled = false,
      error,
      label,
      description,
      required = false,
      size = 'md',
      variant = 'default',
      ...props
    },
    ref
  ) => {
    // Classes selon la taille
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    // Classes selon la variante
    const variantClasses = {
      default: {
        base: 'border-gray-300 text-primary-navy focus:ring-primary-navy/20',
        checked: 'bg-primary-navy border-primary-navy',
        disabled: 'bg-gray-100 border-gray-200',
      },
      filled: {
        base: 'border-gray-300 text-white focus:ring-primary-navy/20',
        checked: 'bg-primary-navy border-primary-navy',
        disabled: 'bg-gray-100 border-gray-200',
      },
      outlined: {
        base: 'border-2 border-primary-navy bg-transparent text-primary-navy focus:ring-primary-navy/20',
        checked: 'bg-transparent border-primary-navy',
        disabled: 'border-gray-200 bg-gray-50',
      },
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.checked, e);
    };

    return (
      <div className={cn('flex items-start', className)}>
        {/* Container pour le checkbox */}
        <div className="relative flex items-center">
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
          
          {/* Checkbox visuel */}
          <div
            className={cn(
              'relative flex items-center justify-center rounded border-2 transition-all duration-200',
              'focus-within:ring-2 focus-within:ring-offset-2 cursor-pointer',
              sizeClasses[size],
              disabled
                ? variantClasses[variant].disabled
                : checked || indeterminate
                ? variantClasses[variant].checked
                : variantClasses[variant].base,
              error && 'border-accent-red focus-within:ring-accent-red/20',
              !disabled && 'hover:border-primary-navy/60'
            )}
            onClick={() => !disabled && onChange?.(!checked, {} as any)}
          >
            {/* Icône */}
            {checked && !indeterminate && (
              <Check
                className={cn(
                  'transition-all duration-200',
                  size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5',
                  variant === 'outlined' ? 'text-primary-navy' : 'text-white'
                )}
              />
            )}
            
            {indeterminate && (
              <Minus
                className={cn(
                  'transition-all duration-200',
                  size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5',
                  variant === 'outlined' ? 'text-primary-navy' : 'text-white'
                )}
              />
            )}
          </div>
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
                onClick={() => !disabled && onChange?.(!checked, {} as any)}
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
          <div className="w-full">
            <p className="mt-1 text-xs text-accent-red">
              {error}
            </p>
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// ============================================
// COMPOSANT RADIO
// ============================================
const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className,
      checked,
      onChange,
      disabled = false,
      error,
      label,
      description,
      required = false,
      size = 'md',
      variant = 'default',
      name,
      value,
      ...props
    },
    ref
  ) => {
    // Classes selon la taille
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    // Classes selon la variante
    const variantClasses = {
      default: {
        base: 'border-gray-300 focus:ring-primary-navy/20',
        checked: 'border-primary-navy',
        disabled: 'bg-gray-100 border-gray-200',
      },
      filled: {
        base: 'border-gray-300 focus:ring-primary-navy/20',
        checked: 'border-primary-navy bg-primary-navy/10',
        disabled: 'bg-gray-100 border-gray-200',
      },
      outlined: {
        base: 'border-2 border-gray-300 focus:ring-primary-navy/20',
        checked: 'border-primary-navy',
        disabled: 'border-gray-200 bg-gray-50',
      },
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value, e);
    };

    return (
      <div className={cn('flex items-start', className)}>
        {/* Container pour le radio */}
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            className="sr-only"
            {...props}
          />
          
          {/* Radio visuel */}
          <div
            className={cn(
              'relative flex items-center justify-center rounded-full border-2 transition-all duration-200',
              'focus-within:ring-2 focus-within:ring-offset-2 cursor-pointer',
              sizeClasses[size],
              disabled
                ? variantClasses[variant].disabled
                : checked
                ? variantClasses[variant].checked
                : variantClasses[variant].base,
              error && 'border-accent-red focus-within:ring-accent-red/20',
              !disabled && 'hover:border-primary-navy/60'
            )}
            onClick={() => !disabled && onChange?.(value, {} as any)}
          >
            {/* Point central */}
            {checked && (
              <div
                className={cn(
                  'rounded-full bg-primary-navy transition-all duration-200',
                  size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-3 h-3' : 'w-2.5 h-2.5'
                )}
              />
            )}
          </div>
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
                onClick={() => !disabled && onChange?.(value, {} as any)}
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
          <div className="w-full">
            <p className="mt-1 text-xs text-accent-red">
              {error}
            </p>
          </div>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

// ============================================
// COMPOSANT RADIO GROUP
// ============================================
interface RadioGroupProps {
  className?: string;
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
  }>;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      className,
      name,
      value,
      onChange,
      options = [],
      orientation = 'vertical',
      size = 'md',
      variant = 'default',
      disabled = false,
      error,
      label,
      required = false,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn('radio-group', className)} {...props}>
        {/* Label du groupe */}
        {label && (
          <div className="mb-3">
            <span className={cn(
              'text-sm font-medium text-gray-700',
              error && 'text-accent-red'
            )}>
              {label}
              {required && <span className="text-accent-red ml-1">*</span>}
            </span>
          </div>
        )}

        {/* Options */}
        <div className={cn(
          'flex',
          orientation === 'horizontal' ? 'flex-row space-x-6' : 'flex-col space-y-3'
        )}>
          {options.map((option) => (
            <Radio
              key={option.value}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              disabled={disabled || option.disabled}
              label={option.label}
              description={option.description}
              size={size}
              variant={variant}
              error={error && value === option.value ? error : undefined}
            />
          ))}
        </div>

        {/* Message d'erreur global */}
        {error && (
          <p className="mt-2 text-xs text-accent-red">
            {error}
          </p>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

// ============================================
// CHECKBOX GROUP
// ============================================
interface CheckboxGroupProps {
  className?: string;
  name?: string;
  value?: string[];
  onChange?: (values: string[]) => void;
  options: Array<{
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
  }>;
  orientation?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  max?: number;
  min?: number;
}

const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      className,
      name,
      value = [],
      onChange,
      options = [],
      orientation = 'vertical',
      size = 'md',
      variant = 'default',
      disabled = false,
      error,
      label,
      required = false,
      max,
      min,
      ...props
    },
    ref
  ) => {
    const handleCheckboxChange = (optionValue: string, checked: boolean) => {
      const newValues = checked
        ? [...value, optionValue]
        : value.filter(v => v !== optionValue);

      // Validation des limites
      if (max && newValues.length > max) return;
      if (min && !checked && newValues.length < min) return;

      onChange?.(newValues);
    };

    const isIndeterminate = value.length > 0 && value.length < options.length;
    const isAllSelected = value.length === options.length;

    return (
      <div ref={ref} className={cn('checkbox-group', className)} {...props}>
        {/* Label du groupe avec sélection tous/aucun */}
        {label && (
          <div className="mb-3 flex items-center justify-between">
            <span className={cn(
              'text-sm font-medium text-gray-700',
              error && 'text-accent-red'
            )}>
              {label}
              {required && <span className="text-accent-red ml-1">*</span>}
            </span>
            
            {options.length > 1 && (
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={(checked) => {
                  const newValues = checked 
                    ? options.filter(opt => !opt.disabled).map(opt => opt.value)
                    : [];
                  onChange?.(newValues);
                }}
                label="Tout sélectionner"
                size="sm"
                disabled={disabled}
              />
            )}
          </div>
        )}

        {/* Options */}
        <div className={cn(
          'flex',
          orientation === 'horizontal' ? 'flex-row flex-wrap gap-6' : 'flex-col space-y-3'
        )}>
          {options.map((option) => {
            const isChecked = value.includes(option.value);
            const isDisabled = disabled || option.disabled || 
              (max && !isChecked && value.length >= max);

            return (
              <Checkbox
                key={option.value}
                name={name}
                checked={isChecked}
                onChange={(checked) => handleCheckboxChange(option.value, checked)}
                disabled={isDisabled}
                label={option.label}
                description={option.description}
                size={size}
                variant={variant}
              />
            );
          })}
        </div>

        {/* Informations et erreurs */}
        <div className="mt-2 space-y-1">
          {(min || max) && (
            <p className="text-xs text-gray-500">
              {min && max && min === max
                ? `Sélectionnez exactement ${min} option(s)`
                : min && max
                ? `Sélectionnez entre ${min} et ${max} option(s)`
                : min
                ? `Sélectionnez au moins ${min} option(s)`
                : max
                ? `Sélectionnez au maximum ${max} option(s)`
                : null}
            </p>
          )}
          
          {error && (
            <p className="text-xs text-accent-red">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }
);

CheckboxGroup.displayName = 'CheckboxGroup';

// Hook pour gérer les groupes
const useCheckboxGroup = (initialValues: string[] = []) => {
  const [values, setValues] = React.useState<string[]>(initialValues);

  const toggle = (value: string) => {
    setValues(prev => 
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const selectAll = (options: string[]) => {
    setValues(options);
  };

  const selectNone = () => {
    setValues([]);
  };

  return {
    values,
    setValues,
    toggle,
    selectAll,
    selectNone,
    isSelected: (value: string) => values.includes(value),
    isAllSelected: (options: string[]) => options.every(opt => values.includes(opt)),
    isNoneSelected: values.length === 0,
  };
};

export { 
  Checkbox, 
  Radio, 
  RadioGroup, 
  CheckboxGroup, 
  useCheckboxGroup 
};

export default Checkbox;