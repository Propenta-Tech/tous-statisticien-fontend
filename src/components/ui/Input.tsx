// ==============================================
// COMPOSANT INPUT - TOUS STATISTICIEN ACADEMY
// ==============================================

'use client';

import React, { useState } from 'react';
import { LucideIcon, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InputProps } from '@/types/components';

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      placeholder,
      value,
      defaultValue,
      error,
      hint,
      required = false,
      disabled = false,
      readonly = false,
      size = 'md',
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onRightIconClick,
      onChange,
      onBlur,
      onFocus,
      min,
      max,
      step,
      maxLength,
      pattern,
      autoComplete,
      autoFocus,
      id,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue || '');

    // ID pour l'accessibilité
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Gestion de la valeur
    const currentValue = value !== undefined ? value : internalValue;

    // Type d'input (gestion password)
    const inputType = type === 'password' && showPassword ? 'text' : type;

    // Classes de base
    const baseClasses = [
      'w-full',
      'border',
      'rounded-md',
      'bg-white',
      'transition-all',
      'duration-200',
      'placeholder:text-gray-400',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-1',
    ];

    // Classes de taille
    const sizeClasses = {
      sm: ['text-sm', 'px-3', 'py-2', 'h-9'],
      md: ['text-sm', 'px-4', 'py-2.5', 'h-11'],
      lg: ['text-base', 'px-4', 'py-3', 'h-12'],
    };

    // Classes d'état
    const stateClasses = {
      normal: [
        'border-gray-300',
        'focus:border-primary-navy',
        'focus:ring-primary-navy/20',
      ],
      error: [
        'border-accent-red',
        'focus:border-accent-red',
        'focus:ring-accent-red/20',
        'bg-red-50/50',
      ],
      disabled: [
        'bg-gray-50',
        'border-gray-200',
        'text-gray-500',
        'cursor-not-allowed',
      ],
      readonly: [
        'bg-gray-50',
        'border-gray-200',
        'cursor-default',
      ],
    };

    // Classes avec icônes
    const iconClasses = {
      left: LeftIcon ? (size === 'sm' ? 'pl-10' : size === 'md' ? 'pl-11' : 'pl-12') : '',
      right: (RightIcon || onRightIconClick || type === 'password') ? 
        (size === 'sm' ? 'pr-10' : size === 'md' ? 'pr-11' : 'pr-12') : '',
    };

    // Déterminer l'état
    const getState = () => {
      if (disabled) return 'disabled';
      if (readonly) return 'readonly';
      if (error) return 'error';
      return 'normal';
    };

    const state = getState();

    // Classes finales
    const inputClasses = cn(
      baseClasses,
      sizeClasses[size],
      stateClasses[state],
      iconClasses.left,
      iconClasses.right,
      className
    );

    // Gestion des événements
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.();
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.();
    };

    const handleRightIconClick = () => {
      if (type === 'password') {
        setShowPassword(!showPassword);
      } else {
        onRightIconClick?.();
      }
    };

    // Icône de droite (password ou custom)
    const getRightIcon = () => {
      if (type === 'password') {
        return showPassword ? EyeOff : Eye;
      }
      return RightIcon;
    };

    const RightIconComponent = getRightIcon();

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-medium mb-1.5',
              error ? 'text-accent-red' : 'text-gray-700',
              disabled && 'text-gray-400'
            )}
          >
            {label}
            {required && <span className="text-accent-red ml-1">*</span>}
          </label>
        )}

        {/* Container pour l'input et les icônes */}
        <div className="relative">
          {/* Icône de gauche */}
          {LeftIcon && (
            <div
              className={cn(
                'absolute left-0 top-0 h-full flex items-center justify-center',
                size === 'sm' ? 'w-10' : size === 'md' ? 'w-11' : 'w-12',
                disabled ? 'text-gray-400' : error ? 'text-accent-red' : 'text-gray-500'
              )}
            >
              <LeftIcon className="w-4 h-4" />
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={inputClasses}
            placeholder={placeholder}
            value={currentValue}
            disabled={disabled}
            readOnly={readonly}
            required={required}
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            min={min}
            max={max}
            step={step}
            maxLength={maxLength}
            pattern={pattern}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />

          {/* Icône de droite */}
          {RightIconComponent && (
            <button
              type="button"
              className={cn(
                'absolute right-0 top-0 h-full flex items-center justify-center',
                size === 'sm' ? 'w-10' : size === 'md' ? 'w-11' : 'w-12',
                'text-gray-500 hover:text-gray-700',
                disabled ? 'text-gray-400 cursor-not-allowed' : 'cursor-pointer',
                error && 'text-accent-red hover:text-accent-red/80'
              )}
              onClick={handleRightIconClick}
              disabled={disabled}
              tabIndex={-1}
            >
              <RightIconComponent className="w-4 h-4" />
            </button>
          )}

          {/* Indicateur d'erreur */}
          {error && !RightIconComponent && (
            <div
              className={cn(
                'absolute right-0 top-0 h-full flex items-center justify-center',
                size === 'sm' ? 'w-10' : size === 'md' ? 'w-11' : 'w-12',
                'text-accent-red'
              )}
            >
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Messages d'aide et d'erreur */}
        {(hint || error) && (
          <div className="mt-1.5">
            {error && (
              <p className="text-sm text-accent-red flex items-center">
                <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                {error}
              </p>
            )}
            {hint && !error && (
              <p className="text-sm text-gray-500">{hint}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };