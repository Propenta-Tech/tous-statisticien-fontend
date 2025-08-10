// ==============================================
// COMPOSANT SELECT - TOUS STATISTICIEN ACADEMY
// ==============================================
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SelectProps, SelectOption } from '@/types/components';
import { useClickOutside } from '@/hooks/useClickOutside';

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      className,
      options = [],
      value,
      onChange,
      placeholder = 'Sélectionner une option...',
      disabled = false,
      error,
      label,
      required = false,
      searchable = false,
      clearable = false,
      multiple = false,
      size = 'md',
      variant = 'default',
      loading = false,
      createable = false,
      maxHeight = '200px',
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    
    const selectRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Fermer le select au clic extérieur
    useClickOutside(selectRef, () => {
      setIsOpen(false);
      setSearchQuery('');
      setHighlightedIndex(-1);
    });

    // Focus sur l'input de recherche à l'ouverture
    useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, [isOpen, searchable]);

    // Filtrer les options selon la recherche
    const filteredOptions = React.useMemo(() => {
      let filtered = options;
      
      if (searchQuery && searchable) {
        filtered = options.filter(option =>
          option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (option.description?.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      // Ajouter option pour créer si createable
      if (createable && searchQuery && !filtered.some(opt => opt.label.toLowerCase() === searchQuery.toLowerCase())) {
        filtered = [
          {
            value: searchQuery,
            label: `Créer "${searchQuery}"`,
            isCreatable: true,
          },
          ...filtered,
        ];
      }

      return filtered;
    }, [options, searchQuery, searchable, createable]);

    // Gérer la sélection
    const handleSelect = (option: SelectOption) => {
      if (option.disabled) return;

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
      setHighlightedIndex(-1);
    };

    // Vider la sélection
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange?.(multiple ? [] : undefined);
    };

    // Navigation au clavier
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          if (isOpen && highlightedIndex >= 0) {
            handleSelect(filteredOptions[highlightedIndex]);
          } else {
            setIsOpen(!isOpen);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSearchQuery('');
          setHighlightedIndex(-1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex(prev => 
              prev < filteredOptions.length - 1 ? prev + 1 : 0
            );
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (isOpen) {
            setHighlightedIndex(prev => 
              prev > 0 ? prev - 1 : filteredOptions.length - 1
            );
          }
          break;
        case 'Backspace':
          if (multiple && Array.isArray(value) && value.length > 0 && !searchQuery) {
            e.preventDefault();
            const newValues = [...value];
            newValues.pop();
            onChange?.(newValues);
          }
          break;
      }
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
      sm: 'px-3 py-1.5 text-sm min-h-[2rem]',
      md: 'px-3 py-2 text-sm min-h-[2.5rem]',
      lg: 'px-4 py-2.5 text-base min-h-[3rem]',
    };

    // Classes selon la variante
    const variantClasses = {
      default: 'border-gray-300 bg-white hover:border-gray-400 focus-within:border-primary-navy focus-within:ring-primary-navy/20',
      filled: 'border-gray-200 bg-gray-50 hover:bg-gray-100 focus-within:bg-white focus-within:border-primary-navy',
      ghost: 'border-transparent bg-transparent hover:bg-gray-50 focus-within:bg-white focus-within:border-gray-300',
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
      <div className={cn('relative', className)} ref={selectRef}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-accent-red ml-1">*</span>}
          </label>
        )}

        {/* Select Container */}
        <div
          ref={ref}
          className={cn(
            'relative w-full cursor-pointer border rounded-md shadow-sm transition-all duration-200',
            'flex items-center gap-2',
            sizeClasses[size],
            variantClasses[variant],
            disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
            error && 'border-accent-red focus-within:border-accent-red focus-within:ring-accent-red/20',
            isOpen && !error && 'border-primary-navy ring-2 ring-primary-navy/20'
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          {...props}
        >
          {/* Tags pour sélection multiple */}
          {multiple && Array.isArray(value) && value.length > 0 && (
            <div className="flex flex-wrap gap-1 flex-1 min-w-0">
              {value.slice(0, 3).map((val) => {
                const option = options.find(opt => opt.value === val);
                return (
                  <span
                    key={val}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-primary-navy/10 text-primary-navy"
                  >
                    {option?.label || val}
                    <button
                      type="button"
                      className="ml-1 hover:bg-primary-navy/20 rounded-full p-0.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newValues = value.filter(v => v !== val);
                        onChange?.(newValues);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
              {value.length > 3 && (
                <span className="px-2 py-0.5 text-xs text-gray-500">
                  +{value.length - 3} autres
                </span>
              )}
            </div>
          )}

          {/* Texte affiché pour sélection simple ou placeholder */}
          {(!multiple || !hasValue) && (
            <span className={cn(
              'block truncate flex-1',
              !hasValue && 'text-gray-500'
            )}>
              {getDisplayText()}
            </span>
          )}

          {/* Actions à droite */}
          <div className="flex items-center gap-1">
            {loading && (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-primary-navy rounded-full animate-spin" />
            )}
            
            {clearable && hasValue && !disabled && (
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
                onClick={handleClear}
              >
                <X className="w-4 h-4" />
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
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-primary-navy"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}

            {/* Liste des options */}
            <div
              ref={listRef}
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
                  {searchQuery ? 'Aucun résultat trouvé' : 'Aucune option disponible'}
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <div
                    key={option.value}
                    role="option"
                    aria-selected={isSelected(option.value)}
                    className={cn(
                      'relative cursor-pointer select-none py-2 pl-3 pr-9 text-sm transition-colors duration-150',
                      'hover:bg-gray-100 focus:bg-gray-100',
                      highlightedIndex === index && 'bg-gray-100',
                      isSelected(option.value) && 'bg-primary-navy/10 text-primary-navy',
                      option.disabled && 'opacity-50 cursor-not-allowed',
                      option.isCreatable && 'italic text-primary-navy'
                    )}
                    onClick={() => !option.disabled && handleSelect(option)}
                  >
                    <div className="flex items-center">
                      {option.icon && (
                        <option.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <span className={cn(
                          'block truncate',
                          isSelected(option.value) && 'font-medium'
                        )}>
                          {option.label}
                        </span>
                        
                        {option.description && (
                          <span className="block text-xs text-gray-500 truncate mt-0.5">
                            {option.description}
                          </span>
                        )}
                      </div>
                    </div>

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

Select.displayName = 'Select';

export default Select;