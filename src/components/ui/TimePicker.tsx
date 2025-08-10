// ==============================================
// COMPOSANT TIMEPICKER - TOUS STATISTICIEN ACADEMY
// ==============================================
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TimePickerProps } from '@/types/components';
import { useClickOutside } from '@/hooks/useClickOutside';
import Button from './Button';
import Input from './Input';

const TimePicker = React.forwardRef<HTMLDivElement, TimePickerProps>(
  (
    {
      className,
      value,
      onChange,
      placeholder = 'Sélectionner une heure',
      disabled = false,
      error,
      label,
      required = false,
      size = 'md',
      format = '24',
      showSeconds = false,
      minuteStep = 1,
      hourStep = 1,
      disabledHours = [],
      disabledMinutes = [],
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTime, setSelectedTime] = useState(() => {
      if (value) {
        const date = new Date(value);
        return {
          hours: date.getHours(),
          minutes: date.getMinutes(),
          seconds: showSeconds ? date.getSeconds() : 0,
        };
      }
      return {
        hours: 12,
        minutes: 0,
        seconds: 0,
      };
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const hoursRef = useRef<HTMLDivElement>(null);
    const minutesRef = useRef<HTMLDivElement>(null);
    const secondsRef = useRef<HTMLDivElement>(null);

    // Fermer au clic extérieur
    useClickOutside(containerRef, () => setIsOpen(false));

    // Synchroniser avec la valeur externe
    useEffect(() => {
      if (value) {
        const date = new Date(value);
        setSelectedTime({
          hours: date.getHours(),
          minutes: date.getMinutes(),
          seconds: showSeconds ? date.getSeconds() : 0,
        });
      }
    }, [value, showSeconds]);

    // Formater l'heure pour l'affichage
    const formatTime = (time: { hours: number; minutes: number; seconds: number }) => {
      let hours = time.hours;
      let period = '';

      if (format === '12') {
        period = hours >= 12 ? ' PM' : ' AM';
        hours = hours % 12 || 12;
      }

      const formattedTime = `${hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
      
      if (showSeconds) {
        return `${formattedTime}:${time.seconds.toString().padStart(2, '0')}${period}`;
      }
      
      return `${formattedTime}${period}`;
    };

    // Créer un objet Date avec l'heure sélectionnée
    const createDateWithTime = (time: { hours: number; minutes: number; seconds: number }) => {
      const date = new Date();
      date.setHours(time.hours, time.minutes, time.seconds, 0);
      return date;
    };

    // Gérer le changement d'heure
    const handleTimeChange = (type: 'hours' | 'minutes' | 'seconds', value: number) => {
      const newTime = { ...selectedTime, [type]: value };
      
      // Validation des valeurs
      if (type === 'hours') {
        newTime.hours = Math.max(0, Math.min(23, value));
      } else if (type === 'minutes') {
        newTime.minutes = Math.max(0, Math.min(59, value));
      } else if (type === 'seconds') {
        newTime.seconds = Math.max(0, Math.min(59, value));
      }

      setSelectedTime(newTime);
      onChange?.(createDateWithTime(newTime));
    };

    // Incrémenter/décrémenter une valeur
    const adjustValue = (type: 'hours' | 'minutes' | 'seconds', increment: boolean) => {
      const current = selectedTime[type];
      let step = 1;
      
      if (type === 'hours') step = hourStep;
      else if (type === 'minutes') step = minuteStep;
      
      const newValue = increment ? current + step : current - step;
      
      if (type === 'hours') {
        handleTimeChange(type, newValue < 0 ? 23 : newValue > 23 ? 0 : newValue);
      } else {
        handleTimeChange(type, newValue < 0 ? 59 : newValue > 59 ? 0 : newValue);
      }
    };

    // Générer les options d'heures
    const generateHours = () => {
      const hours = [];
      for (let i = 0; i < 24; i += hourStep) {
        if (!disabledHours.includes(i)) {
          let displayHour = i;
          if (format === '12') {
            displayHour = i % 12 || 12;
          }
          hours.push({ value: i, display: displayHour.toString().padStart(2, '0') });
        }
      }
      return hours;
    };

    // Générer les options de minutes
    const generateMinutes = () => {
      const minutes = [];
      for (let i = 0; i < 60; i += minuteStep) {
        if (!disabledMinutes.includes(i)) {
          minutes.push({ value: i, display: i.toString().padStart(2, '0') });
        }
      }
      return minutes;
    };

    // Générer les options de secondes
    const generateSeconds = () => {
      const seconds = [];
      for (let i = 0; i < 60; i++) {
        seconds.push({ value: i, display: i.toString().padStart(2, '0') });
      }
      return seconds;
    };

    // Gérer la sélection rapide
    const handleQuickSelect = (hours: number, minutes: number = 0) => {
      const newTime = { ...selectedTime, hours, minutes, seconds: 0 };
      setSelectedTime(newTime);
      onChange?.(createDateWithTime(newTime));
    };

    const displayValue = value ? formatTime(selectedTime) : '';
    const hours = generateHours();
    const minutes = generateMinutes();
    const seconds = generateSeconds();

    return (
      <div ref={containerRef} className={cn('relative', className)} {...props}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-accent-red ml-1">*</span>}
          </label>
        )}

        {/* Input */}
        <Input
          value={displayValue}
          placeholder={placeholder}
          disabled={disabled}
          error={error}
          size={size}
          icon={Clock}
          readOnly
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="cursor-pointer"
        />

        {/* Time Picker Dropdown */}
        {isOpen && (
          <div className="absolute z-50 mt-1 p-4 bg-white border border-gray-300 rounded-lg shadow-lg min-w-[280px]">
            {/* Time Display */}
            <div className="text-center mb-4">
              <div className="text-2xl font-mono font-bold text-gray-900">
                {formatTime(selectedTime)}
              </div>
            </div>

            {/* Time Selectors */}
            <div className="flex justify-center space-x-2 mb-4">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => adjustValue('hours', true)}
                  className="p-1 mb-1"
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
                
                <div
                  ref={hoursRef}
                  className="w-12 h-24 overflow-y-auto border border-gray-200 rounded text-center"
                >
                  {hours.map((hour) => (
                    <button
                      key={hour.value}
                      type="button"
                      className={cn(
                        'w-full h-8 text-sm hover:bg-gray-100 transition-colors',
                        selectedTime.hours === hour.value && 'bg-primary-navy text-white'
                      )}
                      onClick={() => handleTimeChange('hours', hour.value)}
                    >
                      {hour.display}
                    </button>
                  ))}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => adjustValue('hours', false)}
                  className="p-1 mt-1"
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
                
                <span className="text-xs text-gray-500 mt-1">H</span>
              </div>

              {/* Separator */}
              <div className="flex items-center">
                <span className="text-xl font-bold text-gray-400">:</span>
              </div>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => adjustValue('minutes', true)}
                  className="p-1 mb-1"
                >
                  <ChevronUp className="w-4 h-4" />
                </Button>
                
                <div
                  ref={minutesRef}
                  className="w-12 h-24 overflow-y-auto border border-gray-200 rounded text-center"
                >
                  {minutes.map((minute) => (
                    <button
                      key={minute.value}
                      type="button"
                      className={cn(
                        'w-full h-8 text-sm hover:bg-gray-100 transition-colors',
                        selectedTime.minutes === minute.value && 'bg-primary-navy text-white'
                      )}
                      onClick={() => handleTimeChange('minutes', minute.value)}
                    >
                      {minute.display}
                    </button>
                  ))}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => adjustValue('minutes', false)}
                  className="p-1 mt-1"
                >
                  <ChevronDown className="w-4 h-4" />
                </Button>
                
                <span className="text-xs text-gray-500 mt-1">M</span>
              </div>

              {/* Seconds */}
              {showSeconds && (
                <>
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-gray-400">:</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => adjustValue('seconds', true)}
                      className="p-1 mb-1"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    
                    <div
                      ref={secondsRef}
                      className="w-12 h-24 overflow-y-auto border border-gray-200 rounded text-center"
                    >
                      {seconds.map((second) => (
                        <button
                          key={second.value}
                          type="button"
                          className={cn(
                            'w-full h-8 text-sm hover:bg-gray-100 transition-colors',
                            selectedTime.seconds === second.value && 'bg-primary-navy text-white'
                          )}
                          onClick={() => handleTimeChange('seconds', second.value)}
                        >
                          {second.display}
                        </button>
                      ))}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => adjustValue('seconds', false)}
                      className="p-1 mt-1"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    
                    <span className="text-xs text-gray-500 mt-1">S</span>
                  </div>
                </>
              )}

              {/* AM/PM for 12-hour format */}
              {format === '12' && (
                <>
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-gray-400 mx-2"></span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex flex-col space-y-1">
                      <button
                        type="button"
                        className={cn(
                          'px-3 py-1 text-sm rounded transition-colors',
                          selectedTime.hours < 12
                            ? 'bg-primary-navy text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        )}
                        onClick={() => {
                          if (selectedTime.hours >= 12) {
                            handleTimeChange('hours', selectedTime.hours - 12);
                          }
                        }}
                      >
                        AM
                      </button>
                      
                      <button
                        type="button"
                        className={cn(
                          'px-3 py-1 text-sm rounded transition-colors',
                          selectedTime.hours >= 12
                            ? 'bg-primary-navy text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        )}
                        onClick={() => {
                          if (selectedTime.hours < 12) {
                            handleTimeChange('hours', selectedTime.hours + 12);
                          }
                        }}
                      >
                        PM
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quick Select */}
            <div className="border-t border-gray-200 pt-3">
              <div className="text-xs font-medium text-gray-500 mb-2">Sélection rapide:</div>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { label: '09:00', hours: 9, minutes: 0 },
                  { label: '12:00', hours: 12, minutes: 0 },
                  { label: '14:00', hours: 14, minutes: 0 },
                  { label: '18:00', hours: 18, minutes: 0 },
                ].map((time) => (
                  <button
                    key={time.label}
                    type="button"
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    onClick={() => handleQuickSelect(time.hours, time.minutes)}
                  >
                    {time.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const now = new Date();
                  const newTime = {
                    hours: now.getHours(),
                    minutes: now.getMinutes(),
                    seconds: showSeconds ? now.getSeconds() : 0,
                  };
                  setSelectedTime(newTime);
                  onChange?.(createDateWithTime(newTime));
                }}
              >
                Maintenant
              </Button>
              
              <div className="space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onChange?.(undefined);
                    setIsOpen(false);
                  }}
                >
                  Effacer
                </Button>
                
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  OK
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

TimePicker.displayName = 'TimePicker';

// Composant TimeRangePicker
const TimeRangePicker = React.forwardRef<HTMLDivElement, {
  className?: string;
  startTime?: Date;
  endTime?: Date;
  onChange?: (startTime?: Date, endTime?: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  format?: '12' | '24';
  showSeconds?: boolean;
}>(
  (
    {
      className,
      startTime,
      endTime,
      onChange,
      placeholder = 'Sélectionner une plage horaire',
      disabled = false,
      error,
      label,
      required = false,
      size = 'md',
      format = '24',
      showSeconds = false,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectingStart, setSelectingStart] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useClickOutside(containerRef, () => setIsOpen(false));

    const formatTime = (date: Date) => {
      let hours = date.getHours();
      let period = '';

      if (format === '12') {
        period = hours >= 12 ? ' PM' : ' AM';
        hours = hours % 12 || 12;
      }

      const formattedTime = `${hours.toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      
      if (showSeconds) {
        return `${formattedTime}:${date.getSeconds().toString().padStart(2, '0')}${period}`;
      }
      
      return `${formattedTime}${period}`;
    };

    const formatTimeRange = () => {
      if (!startTime && !endTime) return '';
      if (startTime && !endTime) return `De ${formatTime(startTime)}`;
      if (!startTime && endTime) return `Jusqu'à ${formatTime(endTime)}`;
      return `${formatTime(startTime!)} - ${formatTime(endTime!)}`;
    };

    const handleTimeSelect = (time: Date) => {
      if (selectingStart) {
        onChange?.(time, endTime);
        setSelectingStart(false);
      } else {
        onChange?.(startTime, time);
        setSelectingStart(true);
        setIsOpen(false);
      }
    };

    return (
      <div ref={containerRef} className={cn('relative', className)} {...props}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-accent-red ml-1">*</span>}
          </label>
        )}

        <Input
          value={formatTimeRange()}
          placeholder={placeholder}
          disabled={disabled}
          error={error}
          size={size}
          icon={Clock}
          readOnly
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="cursor-pointer"
        />

        {isOpen && (
          <div className="absolute z-50 mt-1 p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="mb-3 text-sm text-gray-600">
              {selectingStart ? 'Heure de début' : 'Heure de fin'}
            </div>
            
            <TimePicker
              value={selectingStart ? startTime : endTime}
              onChange={handleTimeSelect}
              format={format}
              showSeconds={showSeconds}
              size={size}
            />
            
            <div className="mt-3 flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onChange?.(undefined, undefined);
                  setSelectingStart(true);
                  setIsOpen(false);
                }}
              >
                Effacer
              </Button>
              
              {!selectingStart && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Terminer
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

TimeRangePicker.displayName = 'TimeRangePicker';

// Hook pour gérer le time picker
const useTimePicker = (initialTime?: Date) => {
  const [time, setTime] = useState<Date | undefined>(initialTime);

  const selectTime = (newTime: Date | undefined) => {
    setTime(newTime);
  };

  const selectNow = () => {
    setTime(new Date());
  };

  const clear = () => {
    setTime(undefined);
  };

  const setHour = (hour: number) => {
    if (time) {
      const newTime = new Date(time);
      newTime.setHours(hour);
      setTime(newTime);
    }
  };

  const setMinute = (minute: number) => {
    if (time) {
      const newTime = new Date(time);
      newTime.setMinutes(minute);
      setTime(newTime);
    }
  };

  return {
    time,
    setTime: selectTime,
    selectNow,
    clear,
    setHour,
    setMinute,
    hasTime: !!time,
  };
};

export { TimePicker, TimeRangePicker, useTimePicker };
export default TimePicker;