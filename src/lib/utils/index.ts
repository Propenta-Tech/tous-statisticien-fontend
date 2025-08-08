// ==============================================
// UTILITAIRES PRINCIPAUX - TOUS STATISTICIEN ACADEMY
// ==============================================
// Fonctions utilitaires communes pour toute l'application

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ==============================================
// UTILITAIRES TAILWIND ET CLASSES CSS
// ==============================================

/**
 * Combine les classes CSS avec clsx et tailwind-merge
 * pour éviter les conflits entre classes Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ==============================================
// UTILITAIRES DE MANIPULATION DE CHAÎNES
// ==============================================

/**
 * Capitalise la première lettre d'une chaîne
 */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convertit une chaîne en title case
 */
export function titleCase(str: string): string {
  if (!str) return str;
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Tronque une chaîne à la longueur spécifiée avec des points de suspension
 */
export function truncate(str: string, length: number, suffix = '...'): string {
  if (!str || str.length <= length) return str;
  return str.slice(0, length) + suffix;
}

/**
 * Convertit une chaîne en slug (URL-friendly)
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9\s-]/g, '') // Supprime les caractères spéciaux
    .trim()
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/-+/g, '-'); // Supprime les tirets multiples
}

/**
 * Génère un nom d'utilisateur à partir du prénom et nom
 */
export function generateUsername(firstName: string, lastName: string): string {
  const cleanFirst = firstName.toLowerCase().replace(/[^a-z]/g, '');
  const cleanLast = lastName.toLowerCase().replace(/[^a-z]/g, '');
  const random = Math.floor(Math.random() * 1000);
  return `${cleanFirst}${cleanLast}${random}`;
}

// ==============================================
// UTILITAIRES DE VALIDATION
// ==============================================

/**
 * Valide une adresse email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valide un numéro de téléphone camerounais
 */
export function isValidCameroonPhone(phone: string): boolean {
  const phoneRegex = /^(\+237|237)?\s?[679]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Valide la force d'un mot de passe
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('Au moins 8 caractères');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Au moins une minuscule');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Au moins une majuscule');

  if (/\d/.test(password)) score += 1;
  else feedback.push('Au moins un chiffre');

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else feedback.push('Au moins un caractère spécial');

  return {
    isValid: score >= 4,
    score,
    feedback,
  };
}

// ==============================================
// UTILITAIRES DE FORMATAGE
// ==============================================

/**
 * Formate un montant en FCFA
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-CM', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formate un nombre avec des séparateurs de milliers
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR').format(num);
}

/**
 * Formate un pourcentage
 */
export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Formate une taille de fichier en unités lisibles
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Formate une durée en format lisible
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
}

// ==============================================
// UTILITAIRES DE MANIPULATION D'ARRAYS
// ==============================================

/**
 * Supprime les doublons d'un tableau
 */
export function removeDuplicates<T>(array: T[], key?: keyof T): T[] {
  if (!key) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * Groupe un tableau par une clé
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const value = String(item[key]);
    (groups[value] = groups[value] || []).push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Mélange un tableau (algorithme Fisher-Yates)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Divise un tableau en chunks de taille spécifiée
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// ==============================================
// UTILITAIRES D'OBJETS
// ==============================================

/**
 * Vérifie si un objet est vide
 */
export function isEmpty(obj: any): boolean {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  if (obj instanceof Map || obj instanceof Set) return obj.size === 0;
  return Object.keys(obj).length === 0;
}

/**
 * Supprime les propriétés undefined/null d'un objet
 */
export function cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
  const cleaned: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      cleaned[key as keyof T] = value;
    }
  }
  return cleaned;
}

/**
 * Fait une copie profonde d'un objet
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T;
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
}

/**
 * Fusionne deux objets de manière profonde
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = result[key];
      
      if (
        typeof sourceValue === 'object' && 
        sourceValue !== null && 
        !Array.isArray(sourceValue) &&
        typeof targetValue === 'object' && 
        targetValue !== null && 
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else {
        result[key] = sourceValue as T[Extract<keyof T, string>];
      }
    }
  }
  
  return result;
}

// ==============================================
// UTILITAIRES DE GÉNÉRATION
// ==============================================

/**
 * Génère un ID unique
 */
export function generateId(prefix = ''): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return prefix ? `${prefix}_${timestamp}_${randomPart}` : `${timestamp}_${randomPart}`;
}

/**
 * Génère une couleur aléatoire en hexadécimal
 */
export function generateRandomColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

/**
 * Génère un mot de passe aléatoire
 */
export function generatePassword(length = 12): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = lowercase + uppercase + numbers + symbols;
  let password = '';
  
  // Assurer qu'il y a au moins un caractère de chaque type
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Remplir le reste
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Mélanger le mot de passe
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

// ==============================================
// UTILITAIRES DE DÉBOUNCE ET THROTTLE
// ==============================================

/**
 * Débounce une fonction
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle une fonction
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// ==============================================
// UTILITAIRES DE PERFORMANCE
// ==============================================

/**
 * Mesure le temps d'exécution d'une fonction
 */
export async function measureTime<T>(
  func: () => T | Promise<T>,
  label?: string
): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  const result = await func();
  const duration = performance.now() - start;
  
  if (label) {
    console.log(`${label}: ${duration.toFixed(2)}ms`);
  }
  
  return { result, duration };
}

/**
 * Crée une fonction memoized
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  getKey?: (...args: Parameters<T>) => string
): T {
  const cache = new Map();
  
  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// ==============================================
// UTILITAIRES D'URL ET NAVIGATION
// ==============================================

/**
 * Extrait les paramètres d'une URL
 */
export function getUrlParams(url: string): Record<string, string> {
  const params: Record<string, string> = {};
  const urlObj = new URL(url);
  
  urlObj.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}

/**
 * Construit une URL avec des paramètres
 */
export function buildUrl(baseUrl: string, params: Record<string, any>): string {
  const url = new URL(baseUrl);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });
  
  return url.toString();
}

/**
 * Vérifie si on est côté client
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Scroll en douceur vers un élément
 */
export function scrollToElement(elementId: string, offset = 0): void {
  if (!isClient()) return;
  
  const element = document.getElementById(elementId);
  if (element) {
    const top = element.offsetTop - offset;
    window.scrollTo({
      top,
      behavior: 'smooth',
    });
  }
}

// ==============================================
// UTILITAIRES DE STOCKAGE LOCAL
// ==============================================

/**
 * Stockage local sécurisé avec gestion d'erreurs
 */
export const storage = {
  get<T>(key: string, defaultValue?: T): T | null {
    if (!isClient()) return defaultValue || null;
    
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue || null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue || null;
    }
  },
  
  set(key: string, value: any): void {
    if (!isClient()) return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },
  
  remove(key: string): void {
    if (!isClient()) return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  
  clear(): void {
    if (!isClient()) return;
    
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

// ==============================================
// EXPORTS DE TOUS LES UTILITAIRES
// ==============================================

// Réexporter toutes les fonctions utilitaires des autres modules
export * from './constants';
export * from './helpers';
export * from './formatters';
export * from './validators';
// export * from './date';
// export * from './file';
// export * from './url';