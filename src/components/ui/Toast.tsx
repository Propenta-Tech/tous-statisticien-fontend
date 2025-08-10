// ==============================================
// COMPOSANT TOAST - TOUS STATISTICIEN ACADEMY
// ==============================================
'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToastProps, ToastType } from '@/types/components';

// Types pour le système de toast
interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Store pour gérer les toasts
class ToastStore {
  private toasts: ToastItem[] = [];
  private listeners: Array<(toasts: ToastItem[]) => void> = [];

  subscribe(listener: (toasts: ToastItem[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.toasts]));
  }

  add(toast: Omit<ToastItem, 'id'>) {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastItem = {
      id,
      duration: 5000,
      ...toast,
    };

    this.toasts.push(newToast);
    this.notify();

    // Auto-remove after duration
    if (!newToast.persistent && newToast.duration) {
      setTimeout(() => {
        this.remove(id);
      }, newToast.duration);
    }

    return id;
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notify();
  }

  clear() {
    this.toasts = [];
    this.notify();
  }
}

const toastStore = new ToastStore();

// Composant Toast individuel
const Toast = React.forwardRef<HTMLDivElement, ToastProps & { onClose: () => void }>(
  (
    {
      className,
      type = 'info',
      title,
      message,
      action,
      variant = 'default',
      position = 'top-right',
      onClose,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
      // Animation d'entrée
      setTimeout(() => setIsVisible(true), 10);
    }, []);

    const handleClose = () => {
      setIsExiting(true);
      setTimeout(() => {
        onClose();
      }, 300);
    };

    // Configuration des icônes et couleurs
    const getToastConfig = () => {
      switch (type) {
        case 'success':
          return {
            icon: CheckCircle,
            iconColor: 'text-green-500',
            bgColor: variant === 'filled' ? 'bg-green-500' : 'bg-green-50',
            borderColor: 'border-green-200',
            textColor: variant === 'filled' ? 'text-white' : 'text-green-800',
          };
        case 'error':
          return {
            icon: AlertCircle,
            iconColor: 'text-red-500',
            bgColor: variant === 'filled' ? 'bg-red-500' : 'bg-red-50',
            borderColor: 'border-red-200',
            textColor: variant === 'filled' ? 'text-white' : 'text-red-800',
          };
        case 'warning':
          return {
            icon: AlertTriangle,
            iconColor: 'text-yellow-500',
            bgColor: variant === 'filled' ? 'bg-yellow-500' : 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            textColor: variant === 'filled' ? 'text-white' : 'text-yellow-800',
          };
        case 'info':
        default:
          return {
            icon: Info,
            iconColor: 'text-blue-500',
            bgColor: variant === 'filled' ? 'bg-blue-500' : 'bg-blue-50',
            borderColor: 'border-blue-200',
            textColor: variant === 'filled' ? 'text-white' : 'text-blue-800',
          };
      }
    };

    const config = getToastConfig();
    const Icon = config.icon;

    return (
      <div
        ref={ref}
        className={cn(
          'toast pointer-events-auto flex w-full max-w-sm rounded-lg shadow-lg transition-all duration-300',
          'transform-gpu',
          config.bgColor,
          config.borderColor,
          variant === 'outlined' && 'border bg-white',
          variant === 'minimal' && 'border-0 shadow-md',
          // Animations d'entrée selon la position
          position.includes('right') && [
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
            isExiting && 'translate-x-full opacity-0',
          ],
          position.includes('left') && [
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0',
            isExiting && '-translate-x-full opacity-0',
          ],
          position.includes('top') && !position.includes('left') && !position.includes('right') && [
            isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0',
            isExiting && '-translate-y-full opacity-0',
          ],
          position.includes('bottom') && !position.includes('left') && !position.includes('right') && [
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
            isExiting && 'translate-y-full opacity-0',
          ],
          className
        )}
        {...props}
      >
        <div className="flex w-full p-4">
          {/* Icône */}
          <div className="flex-shrink-0">
            <Icon className={cn(
              'h-5 w-5',
              variant === 'filled' ? 'text-white' : config.iconColor
            )} />
          </div>

          {/* Contenu */}
          <div className="ml-3 flex-1">
            <p className={cn(
              'text-sm font-medium',
              variant === 'filled' ? 'text-white' : config.textColor
            )}>
              {title}
            </p>
            
            {message && (
              <p className={cn(
                'mt-1 text-sm',
                variant === 'filled' 
                  ? 'text-white/90' 
                  : variant === 'outlined'
                  ? 'text-gray-600'
                  : config.textColor.replace('800', '700')
              )}>
                {message}
              </p>
            )}

            {/* Action */}
            {action && (
              <div className="mt-3">
                <button
                  type="button"
                  className={cn(
                    'rounded-md px-2 py-1.5 text-sm font-medium transition-colors',
                    variant === 'filled'
                      ? 'bg-white/20 text-white hover:bg-white/30'
                      : 'bg-transparent hover:bg-black/5'
                  )}
                  onClick={action.onClick}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>

          {/* Bouton de fermeture */}
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className={cn(
                'inline-flex rounded-md p-1.5 transition-colors',
                variant === 'filled'
                  ? 'text-white/70 hover:text-white hover:bg-white/20'
                  : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
              )}
              onClick={handleClose}
            >
              <span className="sr-only">Fermer</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }
);

Toast.displayName = 'Toast';

// Container pour afficher les toasts
const ToastContainer: React.FC<{
  position?: ToastProps['position'];
  className?: string;
}> = ({ 
  position = 'top-right',
  className 
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const unsubscribe = toastStore.subscribe(setToasts);
    return unsubscribe;
  }, []);

  if (toasts.length === 0) return null;

  // Classes de positionnement
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4',
  };

  return createPortal(
    <div
      className={cn(
        'toast-container fixed z-50 pointer-events-none',
        positionClasses[position],
        className
      )}
    >
      <div className="flex flex-col space-y-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            action={toast.action}
            position={position}
            onClose={() => toastStore.remove(toast.id)}
          />
        ))}
      </div>
    </div>,
    document.body
  );
};

// Hook pour utiliser les toasts
const useToast = () => {
  return {
    toast: (options: Omit<ToastItem, 'id'>) => toastStore.add(options),
    success: (title: string, message?: string, options?: Partial<ToastItem>) =>
      toastStore.add({ type: 'success', title, message, ...options }),
    error: (title: string, message?: string, options?: Partial<ToastItem>) =>
      toastStore.add({ type: 'error', title, message, ...options }),
    warning: (title: string, message?: string, options?: Partial<ToastItem>) =>
      toastStore.add({ type: 'warning', title, message, ...options }),
    info: (title: string, message?: string, options?: Partial<ToastItem>) =>
      toastStore.add({ type: 'info', title, message, ...options }),
    dismiss: (id: string) => toastStore.remove(id),
    clear: () => toastStore.clear(),
  };
};

// API de toast simple
const toast = {
  success: (title: string, message?: string, options?: Partial<ToastItem>) =>
    toastStore.add({ type: 'success', title, message, ...options }),
  error: (title: string, message?: string, options?: Partial<ToastItem>) =>
    toastStore.add({ type: 'error', title, message, ...options }),
  warning: (title: string, message?: string, options?: Partial<ToastItem>) =>
    toastStore.add({ type: 'warning', title, message, ...options }),
  info: (title: string, message?: string, options?: Partial<ToastItem>) =>
    toastStore.add({ type: 'info', title, message, ...options }),
  dismiss: (id: string) => toastStore.remove(id),
  clear: () => toastStore.clear(),
};

export { Toast, ToastContainer, useToast, toast };
export default Toast;