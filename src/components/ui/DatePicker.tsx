// ==============================================
// COMPOSANT DATEPICKER - TOUS STATISTICIEN ACADEMY
// ==============================================
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DatePickerProps } from '@/types/components';
import { useClickOutside } from '@/hooks/useClickOutside';
import Button from './Button';
import Input from './Input';

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      className,
      value,
      onChange,
      placeholder = 'Sélectionner une date',
      disabled = false,
      error,
      label,
      required = false,
      size = 'md',
      format = 'dd/MM/yyyy',
      minDate,
      maxDate,
      disabledDates = [],
      showTime = false,
      locale = 'fr',
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());
    const [selectedTime, setSelectedTime] = useState(
      value ? {
        hours: new Date(value).getHours(),
        minutes: new Date(value).getMinutes()
      } : { hours: 12, minutes: 0 }
    );

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Fermer au clic extérieur
    useClickOutside(containerRef, () => setIsOpen(false));

    // Noms des mois et jours en français
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    // Formater la date
    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      if (showTime) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      }
      
      return `${day}/${month}/${year}`;
    };

    // Obtenir les jours du mois
    const getDaysInMonth = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startDayOfWeek = firstDay.getDay();

      const days: Array<{
        date: Date;
        isCurrentMonth: boolean;
        isToday: boolean;
        isSelected: boolean;
        isDisabled: boolean;
      }> = [];

      // Jours du mois précédent
      for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const prevDate = new Date(year, month, -i);
        days.push({
          date: prevDate,
          isCurrentMonth: false,
          isToday: false,
          isSelected: false,
          isDisabled: true,
        });
      }

      // Jours du mois actuel
      const today = new Date();
      for (let i = 1; i <= daysInMonth; i++) {
        const currentDate = new Date(year, month, i);
        const isToday = 
          currentDate.getDate() === today.getDate() &&
          currentDate.getMonth() === today.getMonth() &&
          currentDate.getFullYear() === today.getFullYear();
        
        const isSelected = value && 
          currentDate.getDate() === new Date(value).getDate() &&
          currentDate.getMonth() === new Date(value).getMonth() &&
          currentDate.getFullYear() === new Date(value).getFullYear();

        const isDisabled = 
          (minDate && currentDate < minDate) ||
          (maxDate && currentDate > maxDate) ||
          disabledDates.some(disabledDate => 
            currentDate.getTime() === new Date(disabledDate).getTime()
          );

        days.push({
          date: currentDate,
          isCurrentMonth: true,
          isToday,
          isSelected: !!isSelected,
          isDisabled,
        });
      }

      // Compléter avec les jours du mois suivant
      const remainingCells = 42 - days.length; // 6 semaines * 7 jours
      for (let i = 1; i <= remainingCells; i++) {
        const nextDate = new Date(year, month + 1, i);
        days.push({
          date: nextDate,
          isCurrentMonth: false,
          isToday: false,
          isSelected: false,
          isDisabled: true,
        });
      }

      return days;
    };

    // Naviguer dans les mois
    const goToPreviousMonth = () => {
      setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
      setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    // Sélectionner une date
    const selectDate = (date: Date) => {
      if (showTime) {
        const newDate = new Date(date);
        newDate.setHours(selectedTime.hours, selectedTime.minutes, 0, 0);
        onChange?.(newDate);
      } else {
        onChange?.(date);
      }
      
      if (!showTime) {
        setIsOpen(false);
      }
    };

    // Gérer le changement d'heure
    const handleTimeChange = (type: 'hours' | 'minutes', value: number) => {
      const newTime = { ...selectedTime, [type]: value };
      setSelectedTime(newTime);
      
      if (value) {
        const newDate = new Date(value);
        newDate.setHours(newTime.hours, newTime.minutes, 0, 0);
        onChange?.(newDate);
      }
    };

    const days = getDaysInMonth(currentMonth);
    const displayValue = value ? formatDate(new Date(value)) : '';

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
        <div className="relative">
          <Input
            ref={inputRef}
            value={displayValue}
            placeholder={placeholder}
            disabled={disabled}
            error={error}
            size={size}
            icon={Calendar}
            readOnly
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className="cursor-pointer"
          />
        </div>

        {/* Calendrier */}
        {isOpen && (
          <div className="absolute z-50 mt-1 p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
            {/* En-tête du calendrier */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPreviousMonth}
                className="p-1"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <h3 className="text-sm font-semibold">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNextMonth}
                className="p-1"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Jours de la semaine */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div
                  key={day}
                  className="p-2 text-xs font-medium text-gray-500 text-center"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Grille des jours */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <button
                  key={index}
                  type="button"
                  disabled={day.isDisabled}
                  onClick={() => !day.isDisabled && selectDate(day.date)}
                  className={cn(
                    'p-2 text-sm text-center rounded transition-colors duration-150',
                    'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-navy/20',
                    day.isCurrentMonth
                      ? 'text-gray-900'
                      : 'text-gray-400',
                    day.isToday && 'font-bold text-primary-navy',
                    day.isSelected && 'bg-primary-navy text-white hover:bg-primary-navy',
                    day.isDisabled && 'cursor-not-allowed opacity-50 hover:bg-transparent'
                  )}
                >
                  {day.date.getDate()}
                </button>
              ))}
            </div>

            {/* Sélecteur d'heure */}
            {showTime && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Heure:</span>
                  
                  {/* Heures */}
                  <select
                    value={selectedTime.hours}
                    onChange={(e) => handleTimeChange('hours', parseInt(e.target.value))}
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-primary-navy"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  
                  <span className="text-gray-500">:</span>
                  
                  {/* Minutes */}
                  <select
                    value={selectedTime.minutes}
                    onChange={(e) => handleTimeChange('minutes', parseInt(e.target.value))}
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-primary-navy"
                  >
                    {Array.from({ length: 60 }, (_, i) => (
                      <option key={i} value={i}>
                        {i.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-end space-x-2 mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Confirmer
                  </Button>
                </div>
              </div>
            )}

            {/* Boutons rapides */}
            <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const today = new Date();
                  selectDate(today);
                  setCurrentMonth(today);
                }}
              >
                Aujourd'hui
              </Button>
              
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
            </div>
          </div>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

// Composant DateRangePicker
const DateRangePicker = React.forwardRef<HTMLDivElement, {
  className?: string;
  startDate?: Date;
  endDate?: Date;
  onChange?: (startDate?: Date, endDate?: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  size?: 'sm' | 'md' | 'lg';
  minDate?: Date;
  maxDate?: Date;
}>(
  (
    {
      className,
      startDate,
      endDate,
      onChange,
      placeholder = 'Sélectionner une période',
      disabled = false,
      error,
      label,
      required = false,
      size = 'md',
      minDate,
      maxDate,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectingStart, setSelectingStart] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    useClickOutside(containerRef, () => setIsOpen(false));

    const formatDateRange = () => {
      if (!startDate && !endDate) return '';
      if (startDate && !endDate) return `Du ${startDate.toLocaleDateString('fr-FR')}`;
      if (!startDate && endDate) return `Jusqu'au ${endDate.toLocaleDateString('fr-FR')}`;
      return `Du ${startDate?.toLocaleDateString('fr-FR')} au ${endDate?.toLocaleDateString('fr-FR')}`;
    };

    const handleDateSelect = (date: Date) => {
      if (selectingStart) {
        onChange?.(date, endDate);
        setSelectingStart(false);
      } else {
        if (startDate && date < startDate) {
          onChange?.(date, startDate);
        } else {
          onChange?.(startDate, date);
        }
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
          value={formatDateRange()}
          placeholder={placeholder}
          disabled={disabled}
          error={error}
          size={size}
          icon={Calendar}
          readOnly
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className="cursor-pointer"
        />

        {isOpen && (
          <div className="absolute z-50 mt-1 p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="mb-3 text-sm text-gray-600">
              {selectingStart ? 'Sélectionnez la date de début' : 'Sélectionnez la date de fin'}
            </div>
            
            <DatePicker
              value={selectingStart ? startDate : endDate}
              onChange={handleDateSelect}
              minDate={selectingStart ? minDate : startDate}
              maxDate={maxDate}
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

DateRangePicker.displayName = 'DateRangePicker';

// Hook pour gérer les dates
const useDatePicker = (initialDate?: Date) => {
  const [date, setDate] = useState<Date | undefined>(initialDate);

  const selectDate = (newDate: Date | undefined) => {
    setDate(newDate);
  };

  const selectToday = () => {
    setDate(new Date());
  };

  const clear = () => {
    setDate(undefined);
  };

  const isToday = (checkDate: Date) => {
    const today = new Date();
    return checkDate.toDateString() === today.toDateString();
  };

  return {
    date,
    setDate: selectDate,
    selectToday,
    clear,
    isToday,
    hasDate: !!date,
  };
};

export { DatePicker, DateRangePicker, useDatePicker };
export default DatePicker;