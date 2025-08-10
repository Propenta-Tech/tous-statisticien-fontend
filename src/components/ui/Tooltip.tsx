// ==============================================
// COMPOSANT TOOLTIP - TOUS STATISTICIEN ACADEMY
// ==============================================
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { TooltipProps } from '@/types/components';

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      className,
      children,
      content,
      position = 'top',
      trigger = 'hover',
      delay = 200,
      disabled = false,
      arrow = true,
      maxWidth = '200px',
      variant = 'dark',
      size = 'md',
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout>();

    // Calculer la position du tooltip
    const calculatePosition = () => {
      if (!triggerRef.current || !tooltipRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const spacing = 8; // Espacement entre le trigger et le tooltip

      let x = 0;
      let y = 0;

      switch (position) {
        case 'top':
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          y = triggerRect.top - tooltipRect.height - spacing;
          break;
        case 'bottom':
          x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
          y = triggerRect.bottom + spacing;
          break;
        case 'left':
          x = triggerRect.left - tooltipRect.width - spacing;
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          break;
        case 'right':
          x = triggerRect.right + spacing;
          y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
          break;
      }

      // Ajustements pour rester dans la viewport
      const padding = 8;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Ajustement horizontal
      if (x < padding) {
        x = padding;
      } else if (x + tooltipRect.width > viewportWidth - padding) {
        x = viewportWidth - tooltipRect.width - padding;
      }

      // Ajustement vertical
      if (y < padding) {
        y = padding;
      } else if (y + tooltipRect.height > viewportHeight - padding) {
        y = viewportHeight - tooltipRect.height - padding;
      }

      setTooltipPosition({ x, y });
    };

    // Afficher le tooltip avec délai
    const showTooltip = () => {
      if (disabled) return;
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, delay);
    };

    // Cacher le tooltip
    const hideTooltip = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(false);
    };

    // Recalculer la position quand le tooltip devient visible
    useEffect(() => {
      if (isVisible) {
        calculatePosition();
        
        // Recalculer sur resize/scroll
        const handleReposition = () => calculatePosition();
        window.addEventListener('resize', handleReposition);
        window.addEventListener('scroll', handleReposition, true);
        
        return () => {
          window.removeEventListener('resize', handleReposition);
          window.removeEventListener('scroll', handleReposition, true);
        };
      }
    }, [isVisible, position]);

    // Gérer les événements selon le trigger
    const triggerEvents = React.useMemo(() => {
      if (trigger === 'hover') {
        return {
          onMouseEnter: showTooltip,
          onMouseLeave: hideTooltip,
        };
      } else if (trigger === 'click') {
        return {
          onClick: () => isVisible ? hideTooltip() : showTooltip(),
        };
      } else if (trigger === 'focus') {
        return {
          onFocus: showTooltip,
          onBlur: hideTooltip,
        };
      }
      return {};
    }, [trigger, isVisible]);

    // Classes selon la variante
    const variantClasses = {
      dark: 'bg-gray-900 text-white border-gray-700',
      light: 'bg-white text-gray-900 border-gray-200 shadow-lg',
      primary: 'bg-primary-navy text-white border-primary-navy',
      success: 'bg-green-600 text-white border-green-600',
      warning: 'bg-yellow-600 text-white border-yellow-600',
      error: 'bg-red-600 text-white border-red-600',
    };

    // Classes selon la taille
    const sizeClasses = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-3 text-base',
    };

    // Classes pour la flèche selon la position
    const getArrowClasses = () => {
      const arrowSize = 'w-2 h-2';
      const baseClasses = `absolute ${arrowSize} transform rotate-45 border`;
      
      const arrowColors = {
        dark: 'bg-gray-900 border-gray-700',
        light: 'bg-white border-gray-200',
        primary: 'bg-primary-navy border-primary-navy',
        success: 'bg-green-600 border-green-600',
        warning: 'bg-yellow-600 border-yellow-600',
        error: 'bg-red-600 border-red-600',
      };

      switch (position) {
        case 'top':
          return `${baseClasses} ${arrowColors[variant]} -bottom-1 left-1/2 -translate-x-1/2 border-t-0 border-l-0`;
        case 'bottom':
          return `${baseClasses} ${arrowColors[variant]} -top-1 left-1/2 -translate-x-1/2 border-b-0 border-r-0`;
        case 'left':
          return `${baseClasses} ${arrowColors[variant]} -right-1 top-1/2 -translate-y-1/2 border-t-0 border-r-0`;
        case 'right':
          return `${baseClasses} ${arrowColors[variant]} -left-1 top-1/2 -translate-y-1/2 border-b-0 border-l-0`;
        default:
          return '';
      }
    };

    if (!content) return <>{children}</>;

    return (
      <>
        {/* Trigger element */}
        <div
          ref={triggerRef}
          className="inline-block"
          {...triggerEvents}
        >
          {children}
        </div>

        {/* Tooltip portal */}
        {isVisible && createPortal(
          <div
            ref={tooltipRef}
            className={cn(
              'tooltip fixed z-50 rounded-md border transition-opacity duration-200',
              'pointer-events-none select-none',
              variantClasses[variant],
              sizeClasses[size],
              className
            )}
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              maxWidth,
            }}
            role="tooltip"
            {...props}
          >
            {/* Contenu */}
            {typeof content === 'string' ? (
              <div>{content}</div>
            ) : (
              content
            )}

            {/* Flèche */}
            {arrow && (
              <div className={getArrowClasses()} />
            )}
          </div>,
          document.body
        )}
      </>
    );
  }
);

Tooltip.displayName = 'Tooltip';

// Hook pour contrôler un tooltip programmatiquement
const useTooltip = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);
  const toggle = () => setIsVisible(prev => !prev);

  return {
    isVisible,
    show,
    hide,
    toggle,
  };
};

// Composant Tooltip simple avec contenu texte
const SimpleTooltip: React.FC<{
  text: string;
  children: React.ReactNode;
  position?: TooltipProps['position'];
  className?: string;
}> = ({ text, children, position = 'top', className }) => {
  return (
    <Tooltip 
      content={text} 
      position={position}
      className={className}
    >
      {children}
    </Tooltip>
  );
};

// Composant pour tooltip avec délai personnalisé
const DelayedTooltip: React.FC<TooltipProps & {
  showDelay?: number;
  hideDelay?: number;
}> = ({ 
  showDelay = 500, 
  hideDelay = 0, 
  children, 
  content, 
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const showTimeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    
    showTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, showDelay);
  };

  const handleMouseLeave = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
    }
    
    if (hideDelay > 0) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, hideDelay);
    } else {
      setIsVisible(false);
    }
  };

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      <Tooltip
        {...props}
        content={content}
        trigger="manual"
      >
        {children}
      </Tooltip>
    </div>
  );
};

export { Tooltip, SimpleTooltip, DelayedTooltip, useTooltip };
export default Tooltip;