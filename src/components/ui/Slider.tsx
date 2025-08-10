// ==============================================
// COMPOSANT SLIDER - TOUS STATISTICIEN ACADEMY
// ==============================================
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { SliderProps } from '@/types/components';

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      value = 0,
      onChange,
      min = 0,
      max = 100,
      step = 1,
      disabled = false,
      orientation = 'horizontal',
      size = 'md',
      color = 'primary',
      showValue = true,
      showMarks = false,
      marks = [],
      label,
      error,
      required = false,
      formatValue,
      thumbLabel,
      range = false,
      ...props
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const [activeThumb, setActiveThumb] = useState<number>(0);
    const sliderRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    // Normaliser la valeur pour le range
    const normalizedValue = range 
      ? Array.isArray(value) ? value : [min, value as number]
      : Array.isArray(value) ? value[0] : value;

    const values = range ? normalizedValue as number[] : [normalizedValue as number];

    // Classes selon la taille
    const sizeClasses = {
      sm: {
        track: orientation === 'horizontal' ? 'h-1' : 'w-1',
        thumb: 'w-4 h-4',
        container: orientation === 'horizontal' ? 'h-6' : 'w-6',
      },
      md: {
        track: orientation === 'horizontal' ? 'h-2' : 'w-2',
        thumb: 'w-5 h-5',
        container: orientation === 'horizontal' ? 'h-8' : 'w-8',
      },
      lg: {
        track: orientation === 'horizontal' ? 'h-3' : 'w-3',
        thumb: 'w-6 h-6',
        container: orientation === 'horizontal' ? 'h-10' : 'w-10',
      },
    };

    // Classes selon la couleur
    const colorClasses = {
      primary: 'bg-primary-navy',
      secondary: 'bg-primary-gold',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      danger: 'bg-red-500',
      info: 'bg-blue-500',
    };

    // Calculer la position en pourcentage
    const getPercentage = (val: number) => {
      return ((val - min) / (max - min)) * 100;
    };

    // Calculer la valeur depuis la position
    const getValueFromPosition = (position: number) => {
      const percentage = orientation === 'horizontal' 
        ? position 
        : 100 - position;
      
      let newValue = min + (percentage / 100) * (max - min);
      
      // Arrondir selon le step
      if (step > 0) {
        newValue = Math.round(newValue / step) * step;
      }
      
      return Math.max(min, Math.min(max, newValue));
    };

    // Obtenir la position depuis les coordonnées
    const getPositionFromEvent = (event: MouseEvent | TouchEvent) => {
      if (!trackRef.current) return 0;
      
      const rect = trackRef.current.getBoundingClientRect();
      const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
      const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
      
      if (orientation === 'horizontal') {
        return ((clientX - rect.left) / rect.width) * 100;
      } else {
        return ((rect.bottom - clientY) / rect.height) * 100;
      }
    };

    // Gérer le changement de valeur
    const handleValueChange = useCallback((newValues: number[]) => {
      const clampedValues = newValues.map(val => Math.max(min, Math.min(max, val)));
      
      if (range) {
        // Assurer que la première valeur <= deuxième valeur
        const sortedValues = clampedValues.sort((a, b) => a - b);
        onChange?.(sortedValues);
      } else {
        onChange?.(clampedValues[0]);
      }
    }, [min, max, range, onChange]);

    // Gérer le début du drag
    const handleMouseDown = (event: React.MouseEvent, thumbIndex: number) => {
      if (disabled) return;
      
      event.preventDefault();
      setIsDragging(true);
      setActiveThumb(thumbIndex);
      
      // Si clic sur la track, déplacer le thumb le plus proche
      if (event.target === trackRef.current) {
        const position = getPositionFromEvent(event.nativeEvent);
        const newValue = getValueFromPosition(position);
        
        if (range) {
          const newValues = [...values];
          newValues[thumbIndex] = newValue;
          handleValueChange(newValues);
        } else {
          handleValueChange([newValue]);
        }
      }
    };

    // Gérer le mouvement
    const handleMouseMove = useCallback((event: MouseEvent | TouchEvent) => {
      if (!isDragging || disabled) return;
      
      event.preventDefault();
      const position = getPositionFromEvent(event);
      const newValue = getValueFromPosition(position);
      
      if (range) {
        const newValues = [...values];
        newValues[activeThumb] = newValue;
        handleValueChange(newValues);
      } else {
        handleValueChange([newValue]);
      }
    }, [isDragging, disabled, activeThumb, values, range, handleValueChange]);

    // Gérer la fin du drag
    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
      setActiveThumb(0);
    }, []);

    // Event listeners pour le drag
    useEffect(() => {
      if (isDragging) {
        const handleMove = (e: MouseEvent | TouchEvent) => handleMouseMove(e);
        const handleUp = () => handleMouseUp();
        
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleUp);
        document.addEventListener('touchmove', handleMove);
        document.addEventListener('touchend', handleUp);
        
        return () => {
          document.removeEventListener('mousemove', handleMove);
          document.removeEventListener('mouseup', handleUp);
          document.removeEventListener('touchmove', handleMove);
          document.removeEventListener('touchend', handleUp);
        };
      }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // Gérer les touches du clavier
    const handleKeyDown = (event: React.KeyboardEvent, thumbIndex: number) => {
      if (disabled) return;
      
      let newValue = values[thumbIndex];
      
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          event.preventDefault();
          newValue = Math.min(max, newValue + step);
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          event.preventDefault();
          newValue = Math.max(min, newValue - step);
          break;
        case 'Home':
          event.preventDefault();
          newValue = min;
          break;
        case 'End':
          event.preventDefault();
          newValue = max;
          break;
        case 'PageUp':
          event.preventDefault();
          newValue = Math.min(max, newValue + step * 10);
          break;
        case 'PageDown':
          event.preventDefault();
          newValue = Math.max(min, newValue - step * 10);
          break;
        default:
          return;
      }
      
      if (range) {
        const newValues = [...values];
        newValues[thumbIndex] = newValue;
        handleValueChange(newValues);
      } else {
        handleValueChange([newValue]);
      }
    };

    // Formater la valeur affichée
    const formatDisplayValue = (val: number) => {
      return formatValue ? formatValue(val) : val.toString();
    };

    const isHorizontal = orientation === 'horizontal';
    const currentSize = sizeClasses[size];

    return (
      <div
        ref={ref}
        className={cn('slider-container', className)}
        {...props}
      >
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-accent-red ml-1">*</span>}
          </label>
        )}

        {/* Valeurs affichées */}
        {showValue && (
          <div className={cn(
            'flex mb-2',
            range ? 'justify-between' : 'justify-end'
          )}>
            {range ? (
              <>
                <span className="text-sm text-gray-600">
                  {formatDisplayValue(values[0])}
                </span>
                <span className="text-sm text-gray-600">
                  {formatDisplayValue(values[1])}
                </span>
              </>
            ) : (
              <span className="text-sm font-medium text-gray-900">
                {formatDisplayValue(values[0])}
              </span>
            )}
          </div>
        )}

        {/* Container du slider */}
        <div
          ref={sliderRef}
          className={cn(
            'relative flex items-center',
            isHorizontal ? 'w-full' : 'h-48 flex-col',
            currentSize.container,
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {/* Track de fond */}
          <div
            ref={trackRef}
            className={cn(
              'relative bg-gray-200 rounded-full cursor-pointer',
              isHorizontal ? 'w-full' : 'h-full',
              currentSize.track
            )}
            onMouseDown={(e) => handleMouseDown(e, 0)}
          >
            {/* Track actif */}
            <div
              className={cn(
                'absolute rounded-full transition-all duration-150',
                colorClasses[color],
                currentSize.track
              )}
              style={{
                ...(isHorizontal ? {
                  left: `${getPercentage(range ? values[0] : min)}%`,
                  width: `${getPercentage(range ? values[1] : values[0]) - getPercentage(range ? values[0] : min)}%`,
                } : {
                  bottom: `${getPercentage(range ? values[0] : min)}%`,
                  height: `${getPercentage(range ? values[1] : values[0]) - getPercentage(range ? values[0] : min)}%`,
                })
              }}
            />

            {/* Marques */}
            {showMarks && marks.length > 0 && (
              <div className="absolute inset-0">
                {marks.map((mark, index) => (
                  <div
                    key={index}
                    className={cn(
                      'absolute w-1 h-1 bg-gray-400 rounded-full transform -translate-x-1/2',
                      isHorizontal ? '-translate-y-1/2 top-1/2' : '-translate-x-1/2 left-1/2'
                    )}
                    style={{
                      ...(isHorizontal ? {
                        left: `${getPercentage(typeof mark === 'number' ? mark : mark.value)}%`,
                      } : {
                        bottom: `${getPercentage(typeof mark === 'number' ? mark : mark.value)}%`,
                      })
                    }}
                  >
                    {typeof mark === 'object' && mark.label && (
                      <span className={cn(
                        'absolute text-xs text-gray-600 whitespace-nowrap',
                        isHorizontal 
                          ? 'top-3 left-1/2 transform -translate-x-1/2'
                          : 'left-3 top-1/2 transform -translate-y-1/2'
                      )}>
                        {mark.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Thumbs */}
            {values.map((val, index) => (
              <div
                key={index}
                className={cn(
                  'absolute bg-white border-2 rounded-full shadow-lg cursor-pointer',
                  'transform transition-all duration-150',
                  'hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  currentSize.thumb,
                  `border-${colorClasses[color].replace('bg-', '')}`,
                  colorClasses[color].replace('bg-', 'focus:ring-'),
                  isDragging && activeThumb === index && 'scale-110',
                  disabled && 'cursor-not-allowed'
                )}
                style={{
                  ...(isHorizontal ? {
                    left: `${getPercentage(val)}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  } : {
                    bottom: `${getPercentage(val)}%`,
                    left: '50%',
                    transform: 'translate(-50%, 50%)',
                  })
                }}
                tabIndex={disabled ? -1 : 0}
                role="slider"
                aria-valuenow={val}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-orientation={orientation}
                aria-label={thumbLabel || `Valeur ${index + 1}`}
                onMouseDown={(e) => handleMouseDown(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              >
                {/* Tooltip avec la valeur */}
                {isDragging && activeThumb === index && (
                  <div className={cn(
                    'absolute bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap',
                    'pointer-events-none z-10',
                    isHorizontal 
                      ? 'bottom-full mb-2 left-1/2 transform -translate-x-1/2'
                      : 'right-full mr-2 top-1/2 transform -translate-y-1/2'
                  )}>
                    {formatDisplayValue(val)}
                    <div className={cn(
                      'absolute w-1 h-1 bg-gray-900 transform rotate-45',
                      isHorizontal 
                        ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2'
                        : 'left-full top-1/2 -translate-x-1/2 -translate-y-1/2'
                    )} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Min/Max labels */}
        <div className={cn(
          'flex text-xs text-gray-500 mt-1',
          isHorizontal ? 'justify-between' : 'flex-col justify-between h-6'
        )}>
          <span>{formatDisplayValue(min)}</span>
          <span>{formatDisplayValue(max)}</span>
        </div>

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

Slider.displayName = 'Slider';

// Composant RangeSlider
const RangeSlider = React.forwardRef<HTMLDivElement, 
  Omit<SliderProps, 'range' | 'value'> & {
    value?: [number, number];
    onChange?: (value: [number, number]) => void;
  }
>(
  ({ value = [0, 100], onChange, ...props }, ref) => {
    return (
      <Slider
        ref={ref}
        {...props}
        range
        value={value}
        onChange={onChange as any}
      />
    );
  }
);

RangeSlider.displayName = 'RangeSlider';

// Hook pour gérer le slider
const useSlider = (initialValue: number | [number, number], min: number = 0, max: number = 100) => {
  const [value, setValue] = useState(initialValue);
  
  const isRange = Array.isArray(initialValue);
  
  const increment = (amount: number = 1) => {
    if (isRange) {
      const [start, end] = value as [number, number];
      setValue([
        Math.max(min, start + amount),
        Math.min(max, end + amount)
      ]);
    } else {
      setValue(prev => Math.min(max, (prev as number) + amount));
    }
  };
  
  const decrement = (amount: number = 1) => {
    if (isRange) {
      const [start, end] = value as [number, number];
      setValue([
        Math.max(min, start - amount),
        Math.min(max, end - amount)
      ]);
    } else {
      setValue(prev => Math.max(min, (prev as number) - amount));
    }
  };
  
  const reset = () => setValue(initialValue);
  
  const setToMin = () => setValue(isRange ? [min, min] : min);
  const setToMax = () => setValue(isRange ? [max, max] : max);

  return {
    value,
    setValue,
    increment,
    decrement,
    reset,
    setToMin,
    setToMax,
    isAtMin: isRange 
      ? (value as [number, number])[0] === min
      : value === min,
    isAtMax: isRange 
      ? (value as [number, number])[1] === max
      : value === max,
  };
};

// Composant StepSlider avec marques prédéfinies
const StepSlider: React.FC<{
  steps: Array<{ value: number; label: string }>;
  value: number;
  onChange: (value: number) => void;
  className?: string;
  disabled?: boolean;
}> = ({ steps, value, onChange, className, disabled }) => {
  const min = Math.min(...steps.map(s => s.value));
  const max = Math.max(...steps.map(s => s.value));
  
  return (
    <Slider
      className={className}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={1}
      disabled={disabled}
      showMarks
      marks={steps}
      formatValue={(val) => {
        const step = steps.find(s => s.value === val);
        return step?.label || val.toString();
      }}
    />
  );
};

export { 
  Slider, 
  RangeSlider, 
  StepSlider, 
  useSlider 
};

export default Slider;