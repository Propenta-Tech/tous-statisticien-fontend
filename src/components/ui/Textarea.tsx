// ==============================================
// COMPOSANT TEXTAREA - TOUS STATISTICIEN ACADEMY
// ==============================================

'use client';

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TextareaProps } from '@/types/components';

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
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
      rows = 4,
      cols,
      resize = 'vertical',
      onChange,
      onBlur,
      onFocus,
      maxLength,
      autoFocus,
      id,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue || '');

    // ID pour l'accessibilité
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    // Gestion de la valeur
    const currentValue = value !== undefined ? value : internalValue;

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
      sm: ['text-sm', 'px-3', 'py-2'],
      md: ['text-sm', 'px-4', 'py-2.5'],
      lg: ['text-base', 'px-4', 'py-3'],
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

    // Classes de redimensionnement
    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
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
    const textareaClasses = cn(
      baseClasses,
      sizeClasses[size],
      stateClasses[state],
      resizeClasses[resize],
      className
    );

    // Gestion des événements
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    };

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.();
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.();
    };

    // Calcul du nombre de caractères
    const characterCount = currentValue?.toString().length || 0;

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
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

        {/* Container pour le textarea */}
        <div className="relative">
          {/* Textarea */}
          <textarea
            ref={ref}
            id={textareaId}
            className={textareaClasses}
            placeholder={placeholder}
            value={currentValue}
            disabled={disabled}
            readOnly={readonly}
            required={required}
            autoFocus={autoFocus}
            rows={rows}
            cols={cols}
            maxLength={maxLength}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />

          {/* Indicateur d'erreur */}
          {error && (
            <div className="absolute top-2 right-2">
              <AlertCircle className="w-4 h-4 text-accent-red" />
            </div>
          )}
        </div>

        {/* Footer avec compteur et messages */}
        <div className="mt-1.5 flex items-center justify-between">
          <div className="flex-1">
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

          {/* Compteur de caractères */}
          {maxLength && (
            <div className="flex-shrink-0 ml-2">
              <span
                className={cn(
                  'text-xs',
                  characterCount > maxLength * 0.9
                    ? characterCount >= maxLength
                      ? 'text-accent-red'
                      : 'text-yellow-600'
                    : 'text-gray-500'
                )}
              >
                {characterCount}
                {maxLength && `/${maxLength}`}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };