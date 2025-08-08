// ==============================================
// UTILITAIRES DE DATE - TOUS STATISTICIEN ACADEMY
// ==============================================
// Fonctions pour la manipulation et le formatage des dates

import { 
  format, 
  parseISO, 
  addDays, 
  addWeeks, 
  addMonths, 
  subDays, 
  subWeeks, 
  subMonths, 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  isToday, 
  isTomorrow, 
  isYesterday, 
  isSameDay, 
  isSameWeek, 
  isSameMonth, 
  isAfter, 
  isBefore, 
  differenceInDays, 
  differenceInHours, 
  differenceInMinutes, 
  differenceInSeconds,
  isValid
} from 'date-fns';
import { fr } from 'date-fns/locale';

// ==============================================
// CONSTANTES DE DATE
// ==============================================

export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',
  LONG: 'dd MMMM yyyy',
  WITH_TIME: 'dd/MM/yyyy HH:mm',
  TIME_ONLY: 'HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss",
  API: 'yyyy-MM-dd',
  DISPLAY: 'EEEE dd MMMM yyyy',
} as const;

export const TIME_UNITS = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
} as const;

// ==============================================
// UTILITAIRES DE BASE
// ==============================================

/**
 * Convertit une chaîne de date en objet Date
 */
export function parseDate(dateString: string): Date | null {
  try {
    const parsed = parseISO(dateString);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Formate une date selon le format spécifié
 */
export function formatDate(date: Date | string, formatStr: string = DATE_FORMATS.SHORT): string {
  try {
    const dateObj = typeof date === 'string' ? parseDate(date) : date;
    if (!dateObj || !isValid(dateObj)) return '';
    return format(dateObj, formatStr, { locale: fr });
  } catch {
    return '';
  }
}

/**
 * Retourne la date actuelle
 */
export function now(): Date {
  return new Date();
}

/**
 * Retourne la date du jour à minuit
 */
export function today(): Date {
  return startOfDay(now());
}

/**
 * Retourne la date de demain à minuit
 */
export function tomorrow(): Date {
  return startOfDay(addDays(now(), 1));
}

/**
 * Retourne la date d'hier à minuit
 */
export function yesterday(): Date {
  return startOfDay(subDays(now(), 1));
}

// ==============================================
// FORMATAGE SPÉCIALISÉ
// ==============================================

/**
 * Formate une date de manière relative (il y a 2 jours, dans 3 heures, etc.)
 */
export function formatRelative(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? parseDate(date) : date;
    if (!dateObj) return '';

    const nowDate = now();
    const diffMs = dateObj.getTime() - nowDate.getTime();
    const diffMinutes = Math.abs(Math.floor(diffMs / TIME_UNITS.MINUTE));
    const diffHours = Math.abs(Math.floor(diffMs / TIME_UNITS.HOUR));
    const diffDays = Math.abs(Math.floor(diffMs / TIME_UNITS.DAY));

    const isPast = diffMs < 0;
    const prefix = isPast ? 'Il y a' : 'Dans';
    const suffix = isPast ? '' : '';

    if (diffMinutes < 1) {
      return isPast ? 'À l\'instant' : 'Maintenant';
    } else if (diffMinutes < 60) {
      return `${prefix} ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      return `${prefix} ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    } else if (diffDays < 7) {
      return `${prefix} ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } else {
      return formatDate(dateObj, DATE_FORMATS.SHORT);
    }
  } catch {
    return '';
  }
}

/**
 * Formate une date pour l'affichage contextuel
 */
export function formatContextual(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? parseDate(date) : date;
    if (!dateObj) return '';

    if (isToday(dateObj)) {
      return `Aujourd'hui à ${formatDate(dateObj, DATE_FORMATS.TIME_ONLY)}`;
    } else if (isTomorrow(dateObj)) {
      return `Demain à ${formatDate(dateObj, DATE_FORMATS.TIME_ONLY)}`;
    } else if (isYesterday(dateObj)) {
      return `Hier à ${formatDate(dateObj, DATE_FORMATS.TIME_ONLY)}`;
    } else {
      return formatDate(dateObj, DATE_FORMATS.WITH_TIME);
    }
  } catch {
    return '';
  }
}

/**
 * Formate une plage de dates
 */
export function formatDateRange(startDate: Date | string, endDate: Date | string): string {
  try {
    const start = typeof startDate === 'string' ? parseDate(startDate) : startDate;
    const end = typeof endDate === 'string' ? parseDate(endDate) : endDate;
    
    if (!start || !end) return '';

    if (isSameDay(start, end)) {
      return `${formatDate(start, DATE_FORMATS.SHORT)} de ${formatDate(start, DATE_FORMATS.TIME_ONLY)} à ${formatDate(end, DATE_FORMATS.TIME_ONLY)}`;
    } else {
      return `Du ${formatDate(start, DATE_FORMATS.WITH_TIME)} au ${formatDate(end, DATE_FORMATS.WITH_TIME)}`;
    }
  } catch {
    return '';
  }
}

// ==============================================
// CALCULS DE DATES
// ==============================================

/**
 * Ajoute des jours à une date
 */
export function addDaysToDate(date: Date | string, days: number): Date {
  const dateObj = typeof date === 'string' ? parseDate(date) : date;
  if (!dateObj) throw new Error('Date invalide');
  return addDays(dateObj, days);
}

/**
 * Soustrait des jours à une date
 */
export function subtractDaysFromDate(date: Date | string, days: number): Date {
  const dateObj = typeof date === 'string' ? parseDate(date) : date;
  if (!dateObj) throw new Error('Date invalide');
  return subDays(dateObj, days);
}

/**
 * Calcule la différence entre deux dates
 */
export function getDateDifference(
  date1: Date | string, 
  date2: Date | string,
  unit: 'days' | 'hours' | 'minutes' | 'seconds' = 'days'
): number {
  const d1 = typeof date1 === 'string' ? parseDate(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseDate(date2) : date2;
  
  if (!d1 || !d2) return 0;

  switch (unit) {
    case 'seconds':
      return differenceInSeconds(d1, d2);
    case 'minutes':
      return differenceInMinutes(d1, d2);
    case 'hours':
      return differenceInHours(d1, d2);
    case 'days':
    default:
      return differenceInDays(d1, d2);
  }
}

/**
 * Calcule l'âge en années
 */
export function calculateAge(birthDate: Date | string): number {
  const birth = typeof birthDate === 'string' ? parseDate(birthDate) : birthDate;
  if (!birth) return 0;
  
  const today = now();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

// ==============================================
// VALIDATION DE DATES
// ==============================================

/**
 * Vérifie si une date est valide
 */
export function isValidDate(date: any): date is Date {
  return date instanceof Date && isValid(date);
}

/**
 * Vérifie si une date est dans le futur
 */
export function isFutureDate(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseDate(date) : date;
  if (!dateObj) return false;
  return isAfter(dateObj, now());
}

/**
 * Vérifie si une date est dans le passé
 */
export function isPastDate(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseDate(date) : date;
  if (!dateObj) return false;
  return isBefore(dateObj, now());
}

/**
 * Vérifie si une date est dans une plage
 */
export function isDateInRange(
  date: Date | string,
  startDate: Date | string,
  endDate: Date | string
): boolean {
  const d = typeof date === 'string' ? parseDate(date) : date;
  const start = typeof startDate === 'string' ? parseDate(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseDate(endDate) : endDate;
  
  if (!d || !start || !end) return false;
  
  return (isAfter(d, start) || isSameDay(d, start)) && 
         (isBefore(d, end) || isSameDay(d, end));
}

// ==============================================
// GÉNÉRATION DE PLAGES DE DATES
// ==============================================

/**
 * Génère une plage de dates
 */
export function generateDateRange(
  startDate: Date | string,
  endDate: Date | string,
  step: number = 1
): Date[] {
  const start = typeof startDate === 'string' ? parseDate(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseDate(endDate) : endDate;
  
  if (!start || !end) return [];
  
  const dates: Date[] = [];
  let current = start;
  
  while (isBefore(current, end) || isSameDay(current, end)) {
    dates.push(new Date(current));
    current = addDays(current, step);
  }
  
  return dates;
}

/**
 * Retourne les dates d'une semaine
 */
export function getWeekDates(date: Date | string = now()): Date[] {
  const d = typeof date === 'string' ? parseDate(date) : date;
  if (!d) return [];
  
  const start = startOfWeek(d, { weekStartsOn: 1 }); // Lundi
  return generateDateRange(start, endOfWeek(d, { weekStartsOn: 1 }));
}

/**
 * Retourne les dates d'un mois
 */
export function getMonthDates(date: Date | string = now()): Date[] {
  const d = typeof date === 'string' ? parseDate(date) : date;
  if (!d) return [];
  
  return generateDateRange(startOfMonth(d), endOfMonth(d));
}

// ==============================================
// UTILITAIRES POUR L'INTERFACE
// ==============================================

/**
 * Retourne une date formatée pour un input datetime-local
 */
export function toInputDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? parseDate(date) : date;
  if (!d) return '';
  
  return format(d, "yyyy-MM-dd'T'HH:mm");
}

/**
 * Retourne une date formatée pour un input date
 */
export function toInputDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseDate(date) : date;
  if (!d) return '';
  
  return format(d, 'yyyy-MM-dd');
}

/**
 * Convertit une valeur d'input datetime-local en Date
 */
export function fromInputDateTime(value: string): Date | null {
  if (!value) return null;
  return parseDate(value);
}

// ==============================================
// UTILITAIRES POUR L'API
// ==============================================

/**
 * Formate une date pour l'envoi à l'API
 */
export function toApiDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseDate(date) : date;
  if (!d) return '';
  
  return format(d, DATE_FORMATS.ISO);
}

/**
 * Parse une date reçue de l'API
 */
export function fromApiDate(dateString: string): Date | null {
  return parseDate(dateString);
}

// ==============================================
// UTILITAIRES POUR LES ÉVALUATIONS
// ==============================================

/**
 * Calcule le temps restant pour une évaluation
 */
export function getTimeRemaining(endDate: Date | string): {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} {
  const end = typeof endDate === 'string' ? parseDate(endDate) : endDate;
  if (!end) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const total = end.getTime() - now().getTime();
  
  if (total <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(total / TIME_UNITS.DAY);
  const hours = Math.floor((total % TIME_UNITS.DAY) / TIME_UNITS.HOUR);
  const minutes = Math.floor((total % TIME_UNITS.HOUR) / TIME_UNITS.MINUTE);
  const seconds = Math.floor((total % TIME_UNITS.MINUTE) / TIME_UNITS.SECOND);

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
  };
}

/**
 * Vérifie si une évaluation est active
 */
export function isEvaluationActive(startDate: Date | string, endDate: Date | string): boolean {
  const start = typeof startDate === 'string' ? parseDate(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseDate(endDate) : endDate;
  
  if (!start || !end) return false;
  
  const currentDate = now();
  return (isAfter(currentDate, start) || isSameDay(currentDate, start)) && 
         (isBefore(currentDate, end) || isSameDay(currentDate, end));
}

// ==============================================
// UTILITAIRES POUR LES STATISTIQUES
// ==============================================

/**
 * Groupe des dates par période
 */
export function groupDatesByPeriod(
  dates: (Date | string)[],
  period: 'day' | 'week' | 'month'
): Record<string, number> {
  const groups: Record<string, number> = {};

  dates.forEach(date => {
    const d = typeof date === 'string' ? parseDate(date) : date;
    if (!d) return;

    let key: string;
    switch (period) {
      case 'day':
        key = format(d, 'yyyy-MM-dd');
        break;
      case 'week':
        key = format(startOfWeek(d), 'yyyy-MM-dd');
        break;
      case 'month':
        key = format(d, 'yyyy-MM');
        break;
    }

    groups[key] = (groups[key] || 0) + 1;
  });

  return groups;
}

/**
 * Génère des labels pour un graphique selon la période
 */
export function generateChartLabels(
  startDate: Date | string,
  endDate: Date | string,
  period: 'day' | 'week' | 'month'
): string[] {
  const start = typeof startDate === 'string' ? parseDate(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseDate(endDate) : endDate;
  
  if (!start || !end) return [];

  const labels: string[] = [];
  let current = start;

  while (isBefore(current, end) || isSameDay(current, end)) {
    switch (period) {
      case 'day':
        labels.push(format(current, 'dd/MM'));
        current = addDays(current, 1);
        break;
      case 'week':
        labels.push(`Semaine du ${format(current, 'dd/MM')}`);
        current = addWeeks(current, 1);
        break;
      case 'month':
        labels.push(format(current, 'MMMM yyyy', { locale: fr }));
        current = addMonths(current, 1);
        break;
    }
  }

  return labels;
}

// ==============================================
// UTILITAIRES POUR LES HORAIRES
// ==============================================

/**
 * Vérifie si l'heure actuelle est dans les heures d'ouverture
 */
export function isBusinessHours(
  openTime: string = '08:00',
  closeTime: string = '18:00'
): boolean {
  const now = new Date();
  const currentTime = format(now, 'HH:mm');
  
  return currentTime >= openTime && currentTime <= closeTime;
}

/**
 * Calcule la durée entre deux heures
 */
export function getTimeDuration(startTime: string, endTime: string): string {
  try {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    const durationMinutes = endMinutes - startMinutes;
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}min`;
    }
  } catch {
    return '';
  }
}