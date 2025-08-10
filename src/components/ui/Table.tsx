
// ==============================================
// COMPOSANT TABLE - TOUS STATISTICIEN ACADEMY
// ==============================================
'use client';

import React, { useState, useMemo } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronsUpDown,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TableProps, TableColumn, TableRow, TableAction } from '@/types/components';
import Button from './Button';
import Input from './Input';
import Dropdown from './Dropdown';
import Checkbox from './Checkbox';
import Badge from './Badge';
import Spinner from './Spinner';

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      columns = [],
      data = [],
      loading = false,
      selectable = false,
      sortable = true,
      searchable = false,
      searchPlaceholder = 'Rechercher...',
      onRowClick,
      onSelectionChange,
      actions = [],
      emptyMessage = 'Aucune donnée disponible',
      striped = false,
      hover = true,
      size = 'md',
      variant = 'default',
      pagination,
      filters,
      onFilterChange,
      exportable = false,
      onExport,
      ...props
    },
    ref
  ) => {
    const [sortConfig, setSortConfig] = useState<{
      key: string;
      direction: 'asc' | 'desc';
    } | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
    const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

    // Filtrage des données selon la recherche
    const filteredData = useMemo(() => {
      let filtered = data;

      // Recherche textuelle
      if (searchQuery && searchable) {
        filtered = filtered.filter(row =>
          columns.some(column => {
            const value = row[column.key];
            return String(value || '').toLowerCase().includes(searchQuery.toLowerCase());
          })
        );
      }

      // Filtres personnalisés
      if (filters && Object.keys(activeFilters).length > 0) {
        filtered = filtered.filter(row => {
          return Object.entries(activeFilters).every(([key, filterValue]) => {
            if (!filterValue) return true;
            const rowValue = row[key];
            
            if (Array.isArray(filterValue)) {
              return filterValue.includes(rowValue);
            }
            
            return String(rowValue).toLowerCase().includes(String(filterValue).toLowerCase());
          });
        });
      }

      return filtered;
    }, [data, searchQuery, columns, searchable, activeFilters, filters]);

    // Tri des données
    const sortedData = useMemo(() => {
      if (!sortConfig || !sortable) return filteredData;

      return [...filteredData].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }, [filteredData, sortConfig, sortable]);

    // Gérer le tri
    const handleSort = (key: string) => {
      if (!sortable) return;

      setSortConfig(current => {
        if (current?.key === key) {
          if (current.direction === 'asc') {
            return { key, direction: 'desc' };
          } else {
            return null; // Réinitialiser le tri
          }
        }
        return { key, direction: 'asc' };
      });
    };

    // Gérer la sélection
    const handleRowSelection = (rowId: string | number, selected: boolean) => {
      const newSelection = new Set(selectedRows);
      if (selected) {
        newSelection.add(rowId);
      } else {
        newSelection.delete(rowId);
      }
      setSelectedRows(newSelection);
      onSelectionChange?.(Array.from(newSelection));
    };

    // Sélectionner tous / Désélectionner tous
    const handleSelectAll = (selected: boolean) => {
      if (selected) {
        const allIds = sortedData.map(row => row.id).filter(id => id !== undefined);
        setSelectedRows(new Set(allIds));
        onSelectionChange?.(allIds);
      } else {
        setSelectedRows(new Set());
        onSelectionChange?.([]);
      }
    };

    // Gérer les filtres
    const handleFilterChange = (key: string, value: any) => {
      const newFilters = { ...activeFilters };
      if (value === null || value === undefined || value === '') {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      setActiveFilters(newFilters);
      onFilterChange?.(newFilters);
    };

    // Classes selon la taille
    const sizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    };

    // Classes selon la variante
    const variantClasses = {
      default: 'border border-gray-200',
      bordered: 'border-2 border-gray-300',
      minimal: 'border-0',
    };

    const isAllSelected = sortedData.length > 0 && 
      sortedData.every(row => row.id && selectedRows.has(row.id));
    const isIndeterminate = selectedRows.size > 0 && !isAllSelected;

    return (
      <div className="table-container w-full">
        {/* Barre d'outils */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          {/* Recherche et filtres */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {searchable && (
              <div className="relative">
                <Input
                  icon={Search}
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={setSearchQuery}
                  size="sm"
                  className="w-full sm:w-64"
                />
                {searchQuery && (
                  <button
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Filtres */}
            {filters && filters.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {filters.map((filter) => (
                  <div key={filter.key} className="relative">
                    {filter.type === 'select' ? (
                      <Dropdown
                        options={filter.options || []}
                        value={activeFilters[filter.key]}
                        onChange={(value) => handleFilterChange(filter.key, value)}
                        placeholder={filter.placeholder || filter.label}
                        size="sm"
                        className="w-40"
                      />
                    ) : (
                      <Input
                        placeholder={filter.placeholder || filter.label}
                        value={activeFilters[filter.key] || ''}
                        onChange={(value) => handleFilterChange(filter.key, value)}
                        size="sm"
                        className="w-32"
                      />
                    )}
                  </div>
                ))}

                {/* Bouton pour effacer les filtres */}
                {Object.keys(activeFilters).length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setActiveFilters({});
                      onFilterChange?.({});
                    }}
                    className="text-gray-500"
                  >
                    Effacer filtres
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Actions globales */}
          <div className="flex gap-2">
            {exportable && (
              <Button
                variant="outline"
                size="sm"
                icon={Download}
                onClick={() => onExport?.(sortedData)}
              >
                Exporter
              </Button>
            )}

            {selectedRows.size > 0 && actions.length > 0 && (
              <div className="flex gap-2">
                {actions.map((action, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant={action.variant || 'ghost'}
                    icon={action.icon}
                    onClick={() => action.onClick(Array.from(selectedRows))}
                    disabled={action.disabled}
                  >
                    {action.label} ({selectedRows.size})
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table
            ref={ref}
            className={cn(
              'min-w-full divide-y divide-gray-200 bg-white',
              sizeClasses[size],
              variantClasses[variant],
              className
            )}
            {...props}
          >
            {/* En-tête */}
            <thead className="bg-gray-50">
              <tr>
                {selectable && (
                  <th className="w-12 px-6 py-3 text-left">
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isIndeterminate}
                      onChange={handleSelectAll}
                      size="sm"
                    />
                  </th>
                )}
                
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                      column.sortable !== false && sortable && 'cursor-pointer hover:bg-gray-100',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right'
                    )}
                    style={{ width: column.width }}
                    onClick={() => column.sortable !== false && handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.title}</span>
                      {column.sortable !== false && sortable && (
                        <span className="flex flex-col">
                          {sortConfig?.key === column.key ? (
                            sortConfig.direction === 'asc' ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                
                {actions.length > 0 && (
                  <th className="w-16 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            {/* Corps */}
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                    className="px-6 py-12 text-center"
                  >
                    <div className="flex items-center justify-center">
                      <Spinner size="md" className="mr-3" />
                      Chargement...
                    </div>
                  </td>
                </tr>
              ) : sortedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-4">📊</div>
                      <p className="text-lg font-medium mb-2">Aucune donnée</p>
                      <p className="text-sm">{emptyMessage}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedData.map((row, rowIndex) => {
                  const isSelected = row.id && selectedRows.has(row.id);
                  
                  return (
                    <tr
                      key={row.id || rowIndex}
                      className={cn(
                        'transition-colors duration-150',
                        hover && 'hover:bg-gray-50',
                        striped && rowIndex % 2 === 1 && 'bg-gray-25',
                        isSelected && 'bg-primary-navy/5',
                        onRowClick && 'cursor-pointer'
                      )}
                      onClick={() => onRowClick?.(row)}
                    >
                      {selectable && (
                        <td className="px-6 py-4">
                          <Checkbox
                            checked={!!isSelected}
                            onChange={(checked) => {
                              if (row.id) {
                                handleRowSelection(row.id, checked);
                              }
                            }}
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                      )}
                      
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className={cn(
                            'px-6 py-4 whitespace-nowrap',
                            column.align === 'center' && 'text-center',
                            column.align === 'right' && 'text-right'
                          )}
                        >
                          {column.render
                            ? column.render(row[column.key], row)
                            : formatCellValue(row[column.key])}
                        </td>
                      ))}
                      
                      {actions.length > 0 && (
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end">
                            <Dropdown
                              options={actions.map(action => ({
                                value: action.label,
                                label: action.label,
                                icon: action.icon,
                                disabled: action.disabled
                              }))}
                              onChange={(value) => {
                                const action = actions.find(a => a.label === value);
                                if (action && row.id) {
                                  action.onClick([row.id]);
                                }
                              }}
                              trigger={
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  icon={MoreHorizontal}
                                  className="h-8 w-8 p-0"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              }
                            />
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Informations de pagination et statistiques */}
        {!loading && sortedData.length > 0 && (
          <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm text-gray-700">
              Affichage de {sortedData.length} résultat(s)
              {searchQuery && ` sur ${data.length} total`}
              {selectedRows.size > 0 && (
                <span className="ml-2 text-primary-navy font-medium">
                  • {selectedRows.size} sélectionné(s)
                </span>
              )}
            </div>

            {/* Filtres actifs */}
            {Object.keys(activeFilters).length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-500">Filtres actifs:</span>
                {Object.entries(activeFilters).map(([key, value]) => (
                  <Badge
                    key={key}
                    variant="secondary"
                    className="text-xs"
                    onRemove={() => handleFilterChange(key, null)}
                  >
                    {key}: {String(value)}
                  </Badge>
                ))}
              </div>
            )}

            {/* Pagination externe */}
            {pagination && (
              <div>
                {pagination}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

Table.displayName = 'Table';

// Fonction helper pour formater les valeurs des cellules
const formatCellValue = (value: any): React.ReactNode => {
  if (value === null || value === undefined) {
    return <span className="text-gray-400">-</span>;
  }
  
  if (typeof value === 'boolean') {
    return (
      <Badge variant={value ? 'success' : 'danger'} size="sm">
        {value ? 'Oui' : 'Non'}
      </Badge>
    );
  }
  
  if (typeof value === 'number') {
    return value.toLocaleString('fr-FR');
  }
  
  if (value instanceof Date) {
    return value.toLocaleDateString('fr-FR');
  }
  
  return String(value);
};

// Hook pour gérer la table
const useTable = <T extends Record<string, any>>() => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  const resetTable = () => {
    setSortConfig(null);
    setSelectedRows(new Set());
    setSearchQuery('');
    setFilters({});
  };

  const selectRow = (id: string | number) => {
    setSelectedRows(prev => new Set([...prev, id]));
  };

  const unselectRow = (id: string | number) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const toggleRowSelection = (id: string | number) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return {
    sortConfig,
    setSortConfig,
    selectedRows,
    setSelectedRows,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    resetTable,
    selectRow,
    unselectRow,
    toggleRowSelection,
    hasSelection: selectedRows.size > 0,
    selectionCount: selectedRows.size,
  };
};

// Composant TableCell pour les cellules personnalisées
const TableCell: React.FC<{
  className?: string;
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}> = ({ className, children, align = 'left', ...props }) => {
  return (
    <div
      className={cn(
        'table-cell',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// Composant pour afficher des données dans un format simple
const SimpleTable: React.FC<{
  data: Record<string, any>[];
  columns: { key: string; title: string }[];
  className?: string;
}> = ({ data, columns, className }) => {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCellValue(row[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { 
  Table, 
  TableCell, 
  SimpleTable, 
  useTable, 
  formatCellValue 
};

export default Table;