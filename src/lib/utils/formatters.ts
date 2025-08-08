// ==============================================
// FORMATTERS - TOUS STATISTICIEN ACADEMY
// ==============================================
// Fonctions de formatage pour l'affichage des données

import { format, formatDistance, formatRelative, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

// ==============================================
// FORMATAGE DES DATES
// ==============================================

export function formatDate(date: string | Date, formatStr: string = 'dd/MM/yyyy'): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Date invalide';
    return format(dateObj, formatStr, { locale: fr });
  } catch {
    return 'Date invalide';
  }
}

export function formatDateTime(date: string | Date): string {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
}

export function formatTime(date: string | Date): string {
  return formatDate(date, 'HH:mm');
}

export function formatRelativeTime(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Date invalide';
    return formatDistance(dateObj, new Date(), { addSuffix: true, locale: fr });
  } catch {
    return 'Date invalide';
  }
}

export function formatDateRange(startDate: string | Date, endDate: string | Date): string {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  return `${start} - ${end}`;
}

// ==============================================
// FORMATAGE DES NOMBRES ET MONNAIE
// ==============================================

export function formatCurrency(amount: number, currency: string = 'XAF'): string {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number, decimals: number = 0): string {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatCompactNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
}

// ==============================================
// FORMATAGE DES TAILLES DE FICHIERS
// ==============================================

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// ==============================================
// FORMATAGE DES DURÉES
// ==============================================

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
}

export function formatLongDuration(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} jour${days > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} heure${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);

  return parts.join(', ') || '0 minute';
}

// ==============================================
// FORMATAGE DES TÉLÉPHONES
// ==============================================

export function formatPhoneNumber(phone: string): string {
  // Supprime tous les caractères non numériques sauf +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Format pour numéro camerounais
  if (cleaned.startsWith('+237')) {
    const number = cleaned.substring(4);
    if (number.length === 9) {
      return `+237 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
    }
  }
  
  // Format par défaut
  return phone;
}

// ==============================================
// FORMATAGE DES ADRESSES
// ==============================================

export function formatAddress(address: {
  street?: string;
  city?: string;
  country?: string;
}): string {
  const parts = [address.street, address.city, address.country].filter(Boolean);
  return parts.join(', ');
}

// ==============================================
// FORMATAGE DES NOMS
// ==============================================

export function formatFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

export function formatNameWithInitials(firstName: string, lastName: string): string {
  const firstInitial = firstName?.charAt(0)?.toUpperCase() || '';
  const lastInitial = lastName?.charAt(0)?.toUpperCase() || '';
  return `${firstName} ${lastInitial}.`;
}

// ==============================================
// FORMATAGE DES LISTES
// ==============================================

export function formatList(items: string[], conjunction: string = 'et'): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return items.join(` ${conjunction} `);
  
  const allButLast = items.slice(0, -1);
  const last = items[items.length - 1];
  return `${allButLast.join(', ')} ${conjunction} ${last}`;
}

// ==============================================
// FORMATAGE DES STATISTIQUES
// ==============================================

export function formatGradeWithMention(grade: number, maxGrade: number = 20): string {
  const percentage = (grade / maxGrade) * 100;
  let mention = '';
  
  if (percentage >= 90) mention = 'Excellent';
  else if (percentage >= 80) mention = 'Très bien';
  else if (percentage >= 70) mention = 'Bien';
  else if (percentage >= 60) mention = 'Assez bien';
  else if (percentage >= 50) mention = 'Passable';
  else mention = 'Insuffisant';
  
  return `${grade}/${maxGrade} (${mention})`;
}

export function formatProgress(current: number, total: number): string {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  return `${current}/${total} (${percentage}%)`;
}

export function formatRank(rank: number, total: number): string {
  let suffix = 'ème';
  if (rank === 1) suffix = 'er';
  return `${rank}${suffix} sur ${total}`;
}

// ==============================================
// FORMATAGE DES URLS
// ==============================================

export function formatUrl(url: string): string {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

export function getDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(formatUrl(url));
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

// ==============================================
// FORMATAGE DES DESCRIPTIONS
// ==============================================

export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

export function formatDescription(description: string, maxLength: number = 150): string {
  return truncateText(description, maxLength);
}

// ==============================================
// FORMATAGE DES CODES
// ==============================================

export function formatVerificationCode(code: string): string {
  // Formate un code de vérification (ex: 123456 -> 123 456)
  return code.replace(/(\d{3})(\d{3})/, '$1 $2');
}

export function formatReference(ref: string): string {
  // Formate une référence (ex: TSA20240101001 -> TSA-2024-0101-001)
  if (ref.length >= 12) {
    return ref.replace(/^(\w{3})(\d{4})(\d{4})(\d{3})$/, '$1-$2-$3-$4');
  }
  return ref;
}

// ==============================================
// FORMATAGE DES ERREURS
// ==============================================

export function formatErrorMessage(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.data?.message) return error.data.message;
  if (error?.response?.data?.message) return error.response.data.message;
  return 'Une erreur est survenue';
}

// ==============================================
// FORMATAGE POUR L'EXPORT
// ==============================================

export function formatForCSV(value: any): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') {
    // Échapper les guillemets et entourer de guillemets si nécessaire
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
  return String(value);
}

export function formatDataForExport<T extends Record<string, any>>(
  data: T[],
  columns: Array<{ key: keyof T; label: string; formatter?: (value: any) => string }>
): { headers: string[]; rows: string[][] } {
  const headers = columns.map(col => col.label);
  const rows = data.map(item =>
    columns.map(col => {
      const value = item[col.key];
      const formatted = col.formatter ? col.formatter(value) : String(value || '');
      return formatForCSV(formatted);
    })
  );
  
  return { headers, rows };
}

// ==============================================
// FORMATAGE SPÉCIALISÉ MÉTIER
// ==============================================

export function formatClassLevel(level: string): string {
  // Normalise les niveaux de classe
  const levelMap: Record<string, string> = {
    'terminale': 'Terminale',
    'premiere': 'Première',
    'seconde': 'Seconde',
    'troisieme': 'Troisième',
    'licence': 'Licence',
    'master': 'Master',
  };
  
  return levelMap[level.toLowerCase()] || level;
}

export function formatEvaluationDuration(startDate: string, endDate: string): string {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.floor(durationMs / (1000 * 60));
    
    if (durationMinutes < 60) {
      return `${durationMinutes} minutes`;
    } else {
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }
  } catch {
    return 'Durée inconnue';
  }
}

export function formatPaymentMethod(method: string): string {
  const methodMap: Record<string, string> = {
    'orange_money': 'Orange Money',
    'mtn_mobile_money': 'MTN Mobile Money',
    'card': 'Carte bancaire',
    'bank_transfer': 'Virement bancaire',
  };
  
  return methodMap[method] || method;
}

// ==============================================
// FORMATAGE POUR L'AFFICHAGE RESPONSIVE
// ==============================================

export function formatForMobile(
  text: string,
  mobileMaxLength: number = 20,
  desktopMaxLength: number = 50
): { mobile: string; desktop: string } {
  return {
    mobile: truncateText(text, mobileMaxLength),
    desktop: truncateText(text, desktopMaxLength),
  };
}

export function formatBreadcrumbForMobile(breadcrumbs: Array<{ label: string; href?: string }>): Array<{ label: string; href?: string }> {
  // Sur mobile, ne garder que les 2 derniers éléments
  if (breadcrumbs.length <= 2) return breadcrumbs;
  
  return [
    breadcrumbs[0], // Toujours garder l'accueil
    { label: '...', href: undefined },
    ...breadcrumbs.slice(-1), // Garder le dernier
  ];
}