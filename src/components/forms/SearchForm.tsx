"use client"

import React, { useState, useEffect } from 'react';
import { Search, Filter, SortAsc, SortDesc, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { DatePicker } from '@/components/ui/DatePicker';

interface SearchFormProps {
  onSearch: (searchParams: any) => void;
  onReset?: () => void;
  searchTypes?: Array<{
    value: string;
    label: string;
    filters?: Array<{
      key: string;
      label: string;
      type: 'text' | 'select' | 'checkbox' | 'date' | 'dateRange';
      options?: Array<{ value: string; label: string }>;
      placeholder?: string;
    }>;
  }>;
  defaultSearchType?: string;
  showAdvancedFilters?: boolean;
  className?: string;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  onReset,
  searchTypes = [
    {
      value: 'all',
      label: 'Tout',
      filters: []
    },
    {
      value: 'users',
      label: 'Utilisateurs',
      filters: [
        { key: 'role', label: 'Rôle', type: 'select', options: [
          { value: 'student', label: 'Étudiant' },
          { value: 'admin', label: 'Administrateur' },
          { value: 'instructor', label: 'Instructeur' }
        ]},
        { key: 'hasPaid', label: 'A payé', type: 'checkbox' },
        { key: 'country', label: 'Pays', type: 'text', placeholder: 'Entrez un pays' }
      ]
    },
    {
      value: 'classes',
      label: 'Classes',
      filters: [
        { key: 'level', label: 'Niveau', type: 'select', options: [
          { value: 'beginner', label: 'Débutant' },
          { value: 'intermediate', label: 'Intermédiaire' },
          { value: 'advanced', label: 'Avancé' }
        ]}
      ]
    },
    {
      value: 'evaluations',
      label: 'Évaluations',
      filters: [
        { key: 'type', label: 'Type', type: 'select', options: [
          { value: 'quiz', label: 'Quiz' },
          { value: 'exam', label: 'Examen' },
          { value: 'assignment', label: 'Devoir' },
          { value: 'project', label: 'Projet' }
        ]},
        { key: 'status', label: 'Statut', type: 'select', options: [
          { value: 'upcoming', label: 'À venir' },
          { value: 'active', label: 'Active' },
          { value: 'ended', label: 'Terminée' }
        ]},
        { key: 'dateFrom', label: 'Date de début', type: 'date' },
        { key: 'dateTo', label: 'Date de fin', type: 'date' }
      ]
    }
  ],
  defaultSearchType = 'all',
  showAdvancedFilters = false,
  className = '',
}) => {
  const [searchType, setSearchType] = useState(defaultSearchType);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(showAdvancedFilters);
  const [isSearching, setIsSearching] = useState(false);

  const currentSearchType = searchTypes.find(type => type.value === searchType);

  useEffect(() => {
    // Réinitialiser les filtres quand le type de recherche change
    setFilters({});
  }, [searchType]);

  const handleSearch = async () => {
    setIsSearching(true);
    
    try {
      const searchParams = {
        type: searchType,
        query: searchQuery,
        filters,
        sortBy,
        sortOrder,
      };
      
      await onSearch(searchParams);
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setFilters({});
    setSortBy('createdAt');
    setSortOrder('desc');
    onReset?.();
  };

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const removeFilter = (key: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const getSortOptions = () => {
    const baseOptions = [
      { value: 'createdAt', label: 'Date de création' },
      { value: 'updatedAt', label: 'Date de modification' }
    ];

    switch (searchType) {
      case 'users':
        return [
          ...baseOptions,
          { value: 'firstName', label: 'Prénom' },
          { value: 'lastName', label: 'Nom' },
          { value: 'email', label: 'Email' },
          { value: 'lastLogin', label: 'Dernière connexion' }
        ];
      case 'classes':
        return [
          ...baseOptions,
          { value: 'name', label: 'Nom' },
          { value: 'level', label: 'Niveau' }
        ];
      case 'evaluations':
        return [
          ...baseOptions,
          { value: 'title', label: 'Titre' },
          { value: 'startDate', label: 'Date de début' },
          { value: 'endDate', label: 'Date de fin' }
        ];
      default:
        return baseOptions;
    }
  };

  const renderFilterInput = (filter: any) => {
    switch (filter.type) {
      case 'select':
        return (
          <Select
            value={filters[filter.key] || ''}
            onChange={(value: string | number | (string | number)[]) => updateFilter(filter.key, value)} 
            options={filter.options || []}
            placeholder={filter.placeholder || `Sélectionner ${filter.label}`}
            className="w-full"
          />
        );
      
      case 'checkbox':
        return (
          <Checkbox
            checked={filters[filter.key] || false}
            onChange={(checked: boolean) => updateFilter(filter.key, checked)}
          />
        );
      
      case 'date':
        return (
          <DatePicker
            value={filters[filter.key]}
            onChange={(date: any) => updateFilter(filter.key, date)}
            placeholder={filter.placeholder || filter.label}
            className="w-full"
          />
        );
      
      case 'text':
      default:
        return (
          <Input
            type="text"
            value={filters[filter.key] || ''}
            onChange={(value: string) => updateFilter(filter.key, value)}
            placeholder={filter.placeholder || filter.label}
            className="w-full"
          />
        );
    }
  };

  const hasActiveFilters = Object.keys(filters).length > 0 || searchQuery;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      {/* En-tête avec type de recherche */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
        <Select
          value={searchType}
          onChange={(value: string | number | (string | number)[]) => setSearchType(value as string)}
          options={searchTypes.map(type => ({ value: type.value, label: type.label }))}
          className="w-48"
        />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            leftIcon={Filter}
            className={showFilters ? 'bg-primary-navy/10 text-primary-navy' : ''}
          >
            {showFilters ? 'Masquer' : 'Afficher'} les filtres
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={!hasActiveFilters}
            leftIcon={RefreshCw}
          >
            Réinitialiser
          </Button>
        </div>
      </div>

      {/* Barre de recherche principale */}
      <div 
        className="flex items-center space-x-4 mb-6"
        onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSearch()}
      >
        <div className="flex-1">
          <Input
            type="search"
            value={searchQuery}
            onChange={(value: string) => setSearchQuery(value)}
            placeholder={`Rechercher dans ${currentSearchType?.label.toLowerCase()}...`}
            leftIcon={Search}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Select
            value={sortBy}
            onChange={(value: string | number | (string | number)[]) => setSortBy(value as string)}
            options={getSortOptions()}
            className="w-48"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            leftIcon={sortOrder === 'asc' ? SortAsc : SortDesc}
          >
            {sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}
          </Button>
        </div>
        
        <Button
          variant="primary"
          onClick={handleSearch}
          loading={isSearching}
          disabled={!searchQuery && Object.keys(filters).length === 0}
        >
          Rechercher
        </Button>
      </div>

      {/* Filtres avancés */}
      {showFilters && currentSearchType?.filters && currentSearchType.filters.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Filtres avancés
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentSearchType.filters.map((filter) => (
              <div key={filter.key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {filter.label}
                </label>
                {renderFilterInput(filter)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtres actifs */}
      {hasActiveFilters && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Filtres actifs
          </h4>
          
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                <span>Recherche: "{searchQuery}"</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            
            {Object.entries(filters).map(([key, value]) => {
              if (!value || (Array.isArray(value) && value.length === 0)) return null;
              
              const filter = currentSearchType?.filters?.find(f => f.key === key);
              const displayValue = Array.isArray(value) ? value.join(', ') : String(value);
              
              return (
                <div key={key} className="flex items-center space-x-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  <span>{filter?.label || key}: {displayValue}</span>
                  <button
                    onClick={() => removeFilter(key)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
