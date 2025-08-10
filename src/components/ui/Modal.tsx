// ==============================================
// COMPOSANT MODAL - TOUS STATISTICIEN ACADEMY
// ==============================================

'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModalProps } from '@/types/components';
import { Button } from './Button';

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      children,
      className,
      isOpen,
      onClose,
      title,
      size = 'md',
      centered = true,
      closeOnOverlayClick = true,
      closeOnEscape = true,
      showCloseButton = true,
      footer,
      loading = false,
      ...props
    },
    ref
  ) => {
    // Gestion de l'échappement
    useEffect(() => {
      if (!closeOnEscape || !isOpen) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [closeOnEscape, isOpen, onClose]);

    // Gestion du scroll du body
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }

      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOpen]);

    // Ne pas rendre si fermé
    if (!isOpen) return null;

    // Classes de taille
    const sizeClasses = {
      xs: 'max-w-xs',
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      full: 'max-w-full mx-4',
    };

    // Classes de positionnement
    const positionClasses = centered 
      ? 'items-center justify-center' 
      : 'items-start justify-center pt-16';

    // Gestion du clic sur l'overlay
    const handleOverlayClick = (e: React.MouseEvent) => {
      if (closeOnOverlayClick && e.target === e.currentTarget) {
        onClose();
      }
    };

    // Contenu de la modal
    const modalContent = (
      <div
        className="fixed inset-0 z-50 flex p-4"
        onClick={handleOverlayClick}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Container de la modal */}
        <div className={cn('relative flex w-full', positionClasses)}>
          {/* Modal */}
          <div
            ref={ref}
            className={cn(
              'relative',
              'bg-white',
              'rounded-lg',
              'shadow-xl',
              'max-h-[90vh]',
              'overflow-hidden',
              'flex',
              'flex-col',
              'w-full',
              sizeClasses[size],
              className
            )}
            {...props}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex-1 min-w-0">
                  {title && (
                    <h2 className="text-lg font-semibold text-gray-900 truncate">
                      {title}
                    </h2>
                  )}
                </div>
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="ml-4 flex-shrink-0 !p-1 !h-8 !w-8"
                    disabled={loading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-navy"></div>
                </div>
              ) : (
                children
              )}
            </div>

            {/* Footer */}
            {footer && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    );

    // Rendu via portal
    return createPortal(modalContent, document.body);
  }
);

Modal.displayName = 'Modal';

// Composants helper pour les footers
const ModalActions = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex items-center justify-end space-x-3', className)}
    {...props}
  >
    {children}
  </div>
);
ModalActions.displayName = 'ModalActions';

export { Modal, ModalActions };