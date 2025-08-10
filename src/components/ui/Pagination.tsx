// ==============================================
// COMPOSANT PAGINATION - TOUS STATISTICIEN ACADEMY
// ==============================================
'use client';

import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PaginationProps } from '@/types/components';
import Button from './Button';

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      className,
      currentPage = 1,
      totalPages = 1,
      onPageChange,
      showFirstLast = true,
      showPrevNext = true,
      showPageNumbers = true,
      maxVisiblePages = 5,
      size = 'md',
      variant = 'default',
      disabled = false,
      showInfo = true,
      totalItems,
      itemsPerPage,
      ...props
    },
    ref
  ) => {
    // Calculer les pages visibles
    const getVisiblePages = () => {
      if (totalPages <= maxVisiblePages) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      const half = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, currentPage - half);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      const pages: (number | string)[] = [];
      
      // Ajouter la première page si nécessaire
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push('...');
        }
      }

      // Ajouter les pages visibles
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Ajouter la dernière page si nécessaire
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }

      return pages;
    };

    const visiblePages = getVisiblePages();

    const handlePageChange = (page: number) => {
      if (disabled || page === currentPage || page < 1 || page > totalPages) {
        return;
      }
      onPageChange?.(page);
    };

    // Classes selon la taille
    const sizeClasses = {
      sm: 'h-8 min-w-[2rem] text-sm',
      md: 'h-9 min-w-[2.25rem] text-sm',
      lg: 'h-10 min-w-[2.5rem] text-base',
    };

    // Classes pour les boutons de page
    const getPageButtonClasses = (isActive: boolean) => {
      const baseClasses = cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-primary-navy/20 focus:ring-offset-2',
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed'
      );

      if (variant === 'outlined') {
        return cn(
          baseClasses,
          'border',
          isActive
            ? 'bg-primary-navy text-white border-primary-navy'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
        );
      }

      return cn(
        baseClasses,
        isActive
          ? 'bg-primary-navy text-white shadow-sm'
          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
      );
    };

    // Informations de pagination
    const startItem = totalItems ? (currentPage - 1) * (itemsPerPage || 10) + 1 : 0;
    const endItem = totalItems ? Math.min(currentPage * (itemsPerPage || 10), totalItems) : 0;

    if (totalPages <= 1 && !showInfo) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-between', className)}
        {...props}
      >
        {/* Informations */}
        {showInfo && (
          <div className="text-sm text-gray-700">
            {totalItems ? (
              <span>
                Affichage de <span className="font-medium">{startItem}</span> à{' '}
                <span className="font-medium">{endItem}</span> sur{' '}
                <span className="font-medium">{totalItems}</span> résultats
              </span>
            ) : (
              <span>
                Page <span className="font-medium">{currentPage}</span> sur{' '}
                <span className="font-medium">{totalPages}</span>
              </span>
            )}
          </div>
        )}

        {/* Navigation */}
        {totalPages > 1 && (
          <nav 
            className="flex items-center space-x-1"
            aria-label="Pagination"
          >
            {/* Première page */}
            {showFirstLast && (
              <Button
                variant="ghost"
                size={size}
                disabled={disabled || currentPage === 1}
                onClick={() => handlePageChange(1)}
                aria-label="Première page"
                className={cn(sizeClasses[size], 'px-2')}
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>
            )}

            {/* Page précédente */}
            {showPrevNext && (
              <Button
                variant="ghost"
                size={size}
                disabled={disabled || currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                aria-label="Page précédente"
                className={cn(sizeClasses[size], 'px-2')}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}

            {/* Numéros de page */}
            {showPageNumbers && (
              <div className="flex items-center space-x-1">
                {visiblePages.map((page, index) => {
                  if (page === '...') {
                    return (
                      <span
                        key={`ellipsis-${index}`}
                        className={cn(
                          'inline-flex items-center justify-center',
                          sizeClasses[size],
                          'text-gray-500'
                        )}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </span>
                    );
                  }

                  const pageNumber = page as number;
                  const isActive = pageNumber === currentPage;

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      className={getPageButtonClasses(isActive)}
                      onClick={() => handlePageChange(pageNumber)}
                      disabled={disabled}
                      aria-label={`Page ${pageNumber}`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Page suivante */}
            {showPrevNext && (
              <Button
                variant="ghost"
                size={size}
                disabled={disabled || currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                aria-label="Page suivante"
                className={cn(sizeClasses[size], 'px-2')}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}

            {/* Dernière page */}
            {showFirstLast && (
              <Button
                variant="ghost"
                size={size}
                disabled={disabled || currentPage === totalPages}
                onClick={() => handlePageChange(totalPages)}
                aria-label="Dernière page"
                className={cn(sizeClasses[size], 'px-2')}
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            )}
          </nav>
        )}
      </div>
    );
  }
);

Pagination.displayName = 'Pagination';

// Composant de pagination simple
const SimplePagination = React.forwardRef<
  HTMLDivElement,
  Omit<PaginationProps, 'showPageNumbers' | 'maxVisiblePages'>
>(
  (props, ref) => {
    return (
      <Pagination
        ref={ref}
        {...props}
        showPageNumbers={false}
        showFirstLast={false}
      />
    );
  }
);

SimplePagination.displayName = 'SimplePagination';

// Composant de pagination compacte
const CompactPagination = React.forwardRef<
  HTMLDivElement,
  PaginationProps & { showSelect?: boolean }
>(
  (
    {
      currentPage,
      totalPages,
      onPageChange,
      showSelect = true,
      size = 'sm',
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center space-x-2', className)}
        {...props}
      >
        {/* Bouton précédent */}
        <Button
          variant="ghost"
          size={size}
          disabled={disabled || currentPage === 1}
          onClick={() => onPageChange?.(currentPage - 1)}
          aria-label="Page précédente"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Sélecteur de page ou affichage simple */}
        {showSelect && totalPages <= 20 ? (
          <select
            value={currentPage}
            onChange={(e) => onPageChange?.(Number(e.target.value))}
            disabled={disabled}
            className={cn(
              'border border-gray-300 rounded-md px-2 py-1 text-sm',
              'focus:outline-none focus:ring-2 focus:ring-primary-navy/20 focus:border-primary-navy',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {Array.from({ length: totalPages }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-sm text-gray-700 min-w-[3rem] text-center">
            {currentPage} / {totalPages}
          </span>
        )}

        {/* Bouton suivant */}
        <Button
          variant="ghost"
          size={size}
          disabled={disabled || currentPage === totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
          aria-label="Page suivante"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }
);

CompactPagination.displayName = 'CompactPagination';

// Hook pour gérer la pagination
const usePagination = (
  totalItems: number,
  itemsPerPage: number = 10,
  initialPage: number = 1
) => {
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);
  const firstPage = () => goToPage(1);
  const lastPage = () => goToPage(totalPages);

  const getPageData = <T,>(data: T[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    getPageData,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

export { 
  Pagination, 
  SimplePagination, 
  CompactPagination, 
  usePagination 
};

export default Pagination;