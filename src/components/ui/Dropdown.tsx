// ==============================================
// COMPOSANT DROPDOWN - TOUS STATISTICIEN ACADEMY
// ==============================================
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropdownProps, DropdownOption } from '@/types/components';
import { useClickOutside } from '@/hooks/useClickOutside';

const Dropdown = React.forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      className,
      options = [],
      value,
      onChange,
      placeholder = 'Sélectionner...',
      disabled = false,
      error,
      label,
      required = false,
      searchable = false,
      multiple = false,
      maxHeight = '200px',
      loading = false,
      icon: Icon,
      clearable = false,
      size = 'md',
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Fermer le dropdown au clic extérieur
    useClickOutside(dropdownRef, () => setIsOpen(false));

    // Focus sur l'input de recherche à l'ouverture
    useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen, searchable]);

    // Filtrer les options selon la recherche
    const filteredOptions = searchable
      ? options.filter(option =>
          option.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options;

    // Gérer la sélection
    const handleSelect = (option: DropdownOption) => {
      if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        const newValues = currentValues.includes(option.value)
          ? currentValues.filter(v => v !== option.value)
          : [...currentValues, option.value];
        onChange?.(newValues);
      } else {
        onChange?.(option.value);
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    // Vider la sélection
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(multiple ? [] : '');
    };

    // Obtenir le texte affiché
    const getDisplayText = () => {
      if (multiple && Array.isArray(value)) {
        if (value.length === 0) return placeholder;
        if (value.length === 1) {
          const option = options.find(opt => opt.value === value[0]);
          return option?.label || value[0];
        }
        return `${value.length} éléments sélectionnés`;
      } else {
        const option = options.find(opt => opt.value === value);
        return option?.label || placeholder;
      }
    };

    // Classes selon la taille
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-2.5 text-base',
    };

    // Classes selon la variante
    const variantClasses = {
      default: 'border-gray-300 bg-white hover:border-gray-400 focus:border-primary-navy focus:ring-primary-navy/20',
      filled: 'border-gray-200 bg-gray-50 hover:bg-gray-100 focus:bg-white focus:border-primary-navy',
      ghost: 'border-transparent bg-transparent hover:bg-gray-50 focus:bg-white focus:border-gray-300',
    };

    const isSelected = (optionValue: string | number) => {
      if (multiple && Array.isArray(value)) {
        return value.includes(optionValue);
      }
      return value === optionValue;
    };

    const hasValue = multiple 
      ? Array.isArray(value) && value.length > 0
      : value !== undefined && value !== null && value !== '';

    return (
      <div className={cn('relative', className)} ref={dropdownRef}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-accent-red ml-1">*</span>}
          </label>
        )}

        {/* Trigger */}
        <div
          ref={ref}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          className={cn(
            'relative w-full cursor-pointer border rounded-md shadow-sm transition-colors duration-200',
            'flex items-center justify-between',
            sizeClasses[size],
            variantClasses[variant],
            disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
            error && 'border-accent-red focus:border-accent-red focus:ring-accent-red/20',
            isOpen && 'border-primary-navy ring-2 ring-primary-navy/20',
            className
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
            if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
          {...props}
        >
          <div className="flex items-center flex-1 min-w-0">
            {Icon && (
              <Icon className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            )}
            
            <span className={cn(
              'block truncate',
              !hasValue && 'text-gray-500'
            )}>
              {getDisplayText()}
            </span>
          </div>

          <div className="flex items-center">
            {clearable && hasValue && !disabled && (
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-gray-600 mr-1"
                onClick={handleClear}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            
            <ChevronDown
              className={cn(
                'w-4 h-4 text-gray-400 transition-transform duration-200',
                isOpen && 'transform rotate-180'
              )}
            />
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            {/* Barre de recherche */}
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <input
                  ref={searchInputRef}
                  type="text"
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-primary-navy"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}

            {/* Liste des options */}
            <div
              className="py-1 overflow-auto"
              style={{ maxHeight }}
              role="listbox"
            >
              {loading ? (
                <div className="px-3 py-2 text-sm text-gray-500 flex items-center">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-primary-navy rounded-full animate-spin mr-2" />
                  Chargement...
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  {searchQuery ? 'Aucun résultat' : 'Aucune option disponible'}
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    role="option"
                    aria-selected={isSelected(option.value)}
                    className={cn(
                      'relative cursor-pointer select-none py-2 pl-3 pr-9 text-sm transition-colors duration-150',
                      'hover:bg-gray-100 focus:bg-gray-100',
                      isSelected(option.value) && 'bg-primary-navy/10 text-primary-navy',
                      option.disabled && 'opacity-50 cursor-not-allowed'
                    )}
                    onClick={() => !option.disabled && handleSelect(option)}
                  >
                    <div className="flex items-center">
                      {option.icon && (
                        <option.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                      )}
                      
                      <span className={cn(
                        'block truncate',
                        isSelected(option.value) && 'font-medium'
                      )}>
                        {option.label}
                      </span>
                    </div>

                    {option.description && (
                      <span className="block text-xs text-gray-500 truncate mt-0.5">
                        {option.description}
                      </span>
                    )}

                    {isSelected(option.value) && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary-navy">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
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

Dropdown.displayName = 'Dropdown';

export default Dropdown;