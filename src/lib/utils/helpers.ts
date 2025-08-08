// ==============================================
// FONCTIONS D'AIDE - TOUS STATISTICIEN ACADEMY
// ==============================================
// Fonctions utilitaires spécialisées pour la logique métier

import { Role, PaymentStatus, LectureType, EvaluationType } from '@/types';
import { REGEX_PATTERNS, LIMITS } from './constants';

// ==============================================
// HELPERS POUR LES UTILISATEURS ET RÔLES
// ==============================================

/**
 * Vérifie si un utilisateur a un rôle spécifique
 */
export function hasRole(userRole: Role, requiredRole: Role | Role[]): boolean {
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  return userRole === requiredRole;
}

/**
 * Vérifie si un utilisateur est admin ou formateur
 */
export function isAdminOrFormateur(role: Role): boolean {
  return role === Role.ADMIN || role === Role.FORMATEUR;
}

/**
 * Vérifie si un utilisateur est étudiant
 */
export function isStudent(role: Role): boolean {
  return role === Role.STUDENT;
}

/**
 * Retourne le label d'un rôle en français
 */
export function getRoleLabel(role: Role): string {
  const labels = {
    [Role.ADMIN]: 'Administrateur',
    [Role.FORMATEUR]: 'Formateur',
    [Role.STUDENT]: 'Étudiant',
  };
  return labels[role] || role;
}

/**
 * Génère un nom d'affichage à partir du prénom et nom
 */
export function getDisplayName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

/**
 * Génère les initiales d'un utilisateur
 */
export function getUserInitials(firstName: string, lastName: string): string {
  const firstInitial = firstName?.charAt(0)?.toUpperCase() || '';
  const lastInitial = lastName?.charAt(0)?.toUpperCase() || '';
  return `${firstInitial}${lastInitial}`;
}

// ==============================================
// HELPERS POUR LES PAIEMENTS
// ==============================================

/**
 * Vérifie si un paiement est en cours
 */
export function isPaymentPending(status: PaymentStatus): boolean {
  return status === PaymentStatus.PENDING;
}

/**
 * Vérifie si un paiement est réussi
 */
export function isPaymentSuccessful(status: PaymentStatus): boolean {
  return status === PaymentStatus.COMPLETED;
}

/**
 * Vérifie si un paiement a échoué
 */
export function isPaymentFailed(status: PaymentStatus): boolean {
  return [PaymentStatus.FAILED, PaymentStatus.CANCELLED].includes(status);
}

/**
 * Retourne le label d'un statut de paiement en français
 */
export function getPaymentStatusLabel(status: PaymentStatus): string {
  const labels = {
    [PaymentStatus.PENDING]: 'En attente',
    [PaymentStatus.COMPLETED]: 'Terminé',
    [PaymentStatus.FAILED]: 'Échoué',
    [PaymentStatus.CANCELLED]: 'Annulé',
    [PaymentStatus.REFUNDED]: 'Remboursé',
  };
  return labels[status] || status;
}

/**
 * Retourne la couleur associée à un statut de paiement
 */
export function getPaymentStatusColor(status: PaymentStatus): string {
  const colors = {
    [PaymentStatus.PENDING]: 'warning',
    [PaymentStatus.COMPLETED]: 'success',
    [PaymentStatus.FAILED]: 'danger',
    [PaymentStatus.CANCELLED]: 'secondary',
    [PaymentStatus.REFUNDED]: 'info',
  };
  return colors[status] || 'secondary';
}

/**
 * Calcule le montant avec réduction (55% si plus d'un concours)
 */
export function calculateDiscountedAmount(baseAmount: number, quantity: number): number {
  if (quantity <= 1) return baseAmount;
  const discount = 0.55; // 55% de réduction
  return Math.round(baseAmount * quantity * (1 - discount));
}

/**
 * Formate un numéro de téléphone pour Freemopay
 */
export function formatPhoneForPayment(phone: string): string {
  // Supprime tous les espaces et caractères non numériques sauf +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Si ça commence par +237 ou 237, on garde tel quel
  if (cleaned.startsWith('+237')) {
    return cleaned;
  }
  if (cleaned.startsWith('237')) {
    return `+${cleaned}`;
  }
  
  // Sinon on ajoute +237
  if (cleaned.length === 9) {
    return `+237${cleaned}`;
  }
  
  return cleaned;
}

// ==============================================
// HELPERS POUR LES ÉVALUATIONS
// ==============================================

/**
 * Vérifie si une évaluation est active
 */
export function isEvaluationActive(startDate: string, endDate: string): boolean {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  return now >= start && now <= end;
}

/**
 * Vérifie si une évaluation est à venir
 */
export function isEvaluationUpcoming(startDate: string): boolean {
  const now = new Date();
  const start = new Date(startDate);
  return now < start;
}

/**
 * Vérifie si une évaluation est terminée
 */
export function isEvaluationEnded(endDate: string): boolean {
  const now = new Date();
  const end = new Date(endDate);
  return now > end;
}

/**
 * Retourne le statut d'une évaluation
 */
export function getEvaluationStatus(startDate: string, endDate: string): 'upcoming' | 'active' | 'ended' {
  if (isEvaluationUpcoming(startDate)) return 'upcoming';
  if (isEvaluationActive(startDate, endDate)) return 'active';
  return 'ended';
}

/**
 * Retourne le label d'un type d'évaluation en français
 */
export function getEvaluationTypeLabel(type: EvaluationType): string {
  const labels = {
    [EvaluationType.QUIZ]: 'Quiz',
    [EvaluationType.EXAM]: 'Examen',
    [EvaluationType.ASSIGNMENT]: 'Devoir',
    [EvaluationType.PROJECT]: 'Projet',
    [EvaluationType.PRESENTATION]: 'Présentation',
  };
  return labels[type] || type;
}

/**
 * Calcule le temps restant pour une évaluation
 */
export function getTimeRemainingForEvaluation(endDate: string): {
  days: number;
  hours: number;
  minutes: number;
  isExpired: boolean;
} {
  const now = new Date();
  const end = new Date(endDate);
  const diffMs = end.getTime() - now.getTime();
  
  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, isExpired: true };
  }
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes, isExpired: false };
}

// ==============================================
// HELPERS POUR LES LECTURES
// ==============================================

/**
 * Retourne le label d'un type de lecture en français
 */
export function getLectureTypeLabel(type: LectureType): string {
  const labels = {
    [LectureType.VIDEO]: 'Vidéo',
    [LectureType.PDF]: 'PDF',
    [LectureType.AUDIO]: 'Audio',
    [LectureType.DOCUMENT]: 'Document',
    [LectureType.PRESENTATION]: 'Présentation',
  };
  return labels[type] || type;
}

/**
 * Retourne l'icône associée à un type de lecture
 */
export function getLectureTypeIcon(type: LectureType): string {
  const icons = {
    [LectureType.VIDEO]: 'Play',
    [LectureType.PDF]: 'FileText',
    [LectureType.AUDIO]: 'Headphones',
    [LectureType.DOCUMENT]: 'File',
    [LectureType.PRESENTATION]: 'Presentation',
  };
  return icons[type] || 'File';
}

/**
 * Vérifie si un type de lecture est streamable
 */
export function isStreamableLecture(type: LectureType): boolean {
  return [LectureType.VIDEO, LectureType.AUDIO].includes(type);
}

// ==============================================
// HELPERS POUR LES NOTES ET ÉVALUATIONS
// ==============================================

/**
 * Calcule la mention d'une note
 */
export function getGradeMention(grade: number, maxGrade: number = 20): string {
  const percentage = (grade / maxGrade) * 100;
  
  if (percentage >= 90) return 'Excellent';
  if (percentage >= 80) return 'Très bien';
  if (percentage >= 70) return 'Bien';
  if (percentage >= 60) return 'Assez bien';
  if (percentage >= 50) return 'Passable';
  return 'Insuffisant';
}

/**
 * Retourne la couleur associée à une note
 */
export function getGradeColor(grade: number, maxGrade: number = 20): string {
  const percentage = (grade / maxGrade) * 100;
  
  if (percentage >= 80) return 'success';
  if (percentage >= 60) return 'info';
  if (percentage >= 50) return 'warning';
  return 'danger';
}

/**
 * Calcule la moyenne d'un tableau de notes
 */
export function calculateAverage(grades: number[]): number {
  if (grades.length === 0) return 0;
  const sum = grades.reduce((acc, grade) => acc + grade, 0);
  return Math.round((sum / grades.length) * 100) / 100;
}

/**
 * Calcule la progression en pourcentage
 */
export function calculateProgression(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

// ==============================================
// HELPERS POUR LES FICHIERS
// ==============================================

/**
 * Extrait l'extension d'un fichier
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Vérifie si un fichier est une image
 */
export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

/**
 * Vérifie si un fichier est une vidéo
 */
export function isVideoFile(mimeType: string): boolean {
  return mimeType.startsWith('video/');
}

/**
 * Vérifie si un fichier est un audio
 */
export function isAudioFile(mimeType: string): boolean {
  return mimeType.startsWith('audio/');
}

/**
 * Vérifie si un fichier est un PDF
 */
export function isPdfFile(mimeType: string): boolean {
  return mimeType === 'application/pdf';
}

/**
 * Génère un nom de fichier unique
 */
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = getFileExtension(originalName);
  const nameWithoutExt = originalName.replace(`.${extension}`, '');
  const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
  
  return `${cleanName}_${timestamp}_${random}.${extension}`;
}

// ==============================================
// HELPERS POUR LES URLS ET NAVIGATION
// ==============================================

/**
 * Construit une URL de breadcrumb à partir d'un chemin
 */
export function buildBreadcrumbFromPath(pathname: string): Array<{ label: string; href?: string }> {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: Array<{ label: string; href?: string }> = [];
  
  // Ajouter l'accueil
  breadcrumbs.push({ label: 'Accueil', href: '/' });
  
  // Construire les breadcrumbs
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    // Convertir le segment en label lisible
    const label = segment
      .replace(/-/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
    });
  });
  
  return breadcrumbs;
}

/**
 * Vérifie si une URL est externe
 */
export function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.origin !== window.location.origin;
  } catch {
    return false;
  }
}

/**
 * Ajoute des paramètres à une URL existante
 */
export function addParamsToUrl(url: string, params: Record<string, any>): string {
  const urlObj = new URL(url, window.location.origin);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      urlObj.searchParams.set(key, String(value));
    }
  });
  
  return urlObj.toString();
}

// ==============================================
// HELPERS POUR LES DONNÉES MÉTIER
// ==============================================

/**
 * Calcule les statistiques d'un ensemble de soumissions
 */
export function calculateSubmissionStats(submissions: Array<{ grade: number }>) {
  if (submissions.length === 0) {
    return {
      count: 0,
      average: 0,
      min: 0,
      max: 0,
      distribution: [],
    };
  }
  
  const grades = submissions.map(s => s.grade);
  const average = calculateAverage(grades);
  const min = Math.min(...grades);
  const max = Math.max(...grades);
  
  // Distribution par tranches
  const distribution = [
    { range: '0-5', count: grades.filter(g => g >= 0 && g < 5).length },
    { range: '5-10', count: grades.filter(g => g >= 5 && g < 10).length },
    { range: '10-15', count: grades.filter(g => g >= 10 && g < 15).length },
    { range: '15-20', count: grades.filter(g => g >= 15 && g <= 20).length },
  ];
  
  return {
    count: submissions.length,
    average,
    min,
    max,
    distribution,
  };
}

/**
 * Génère des données de test pour le développement
 */
export function generateMockData<T>(
  factory: () => T,
  count: number = 10
): T[] {
  return Array.from({ length: count }, factory);
}

/**
 * Simule un délai asynchrone (pour les mocks)
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retourne une couleur basée sur un hash de chaîne
 */
export function getColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
}

/**
 * Convertit un rang en position ordinale
 */
export function getRankLabel(rank: number): string {
  if (rank === 1) return '1er';
  if (rank === 2) return '2ème';
  return `${rank}ème`;
}

/**
 * Vérifie si un objet a toutes les propriétés requises
 */
export function hasRequiredProperties<T extends Record<string, any>>(
  obj: T,
  requiredProps: (keyof T)[]
): boolean {
  return requiredProps.every(prop => 
    obj[prop] !== undefined && obj[prop] !== null && obj[prop] !== ''
  );
}

/**
 * Filtre et nettoie les paramètres de requête
 */
export function cleanQueryParams(params: Record<string, any>): Record<string, string> {
  const cleaned: Record<string, string> = {};
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = String(value);
    }
  });
  
  return cleaned;
}

/**
 * Convertit un objet en FormData pour les uploads
 */
export function objectToFormData(obj: Record<string, any>): FormData {
  const formData = new FormData();
  
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item instanceof File) {
            formData.append(`${key}[${index}]`, item);
          } else {
            formData.append(`${key}[${index}]`, String(item));
          }
        });
      } else {
        formData.append(key, String(value));
      }
    }
  });
  
  return formData;
}

// ==============================================
// HELPERS POUR LES ERREURS
// ==============================================

/**
 * Extrait un message d'erreur lisible d'une erreur
 */
export function getErrorMessage(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.data?.message) return error.data.message;
  if (error?.response?.data?.message) return error.response.data.message;
  return 'Une erreur est survenue';
}

/**
 * Vérifie si une erreur est due à un problème réseau
 */
export function isNetworkError(error: any): boolean {
  return (
    !navigator.onLine ||
    error?.code === 'NETWORK_ERROR' ||
    error?.message?.includes('Network Error') ||
    error?.message?.includes('fetch')
  );
}

/**
 * Vérifie si une erreur est due à une autorisation
 */
export function isAuthError(error: any): boolean {
  return (
    error?.status === 401 ||
    error?.response?.status === 401 ||
    error?.code === 'UNAUTHORIZED'
  );
}// ==============================================
// FONCTIONS D'AIDE - TOUS STATISTICIEN ACADEMY
// ==============================================
// Fonctions utilitaires spécialisées pour la logique métier

import { Role, PaymentStatus, LectureType, EvaluationType } from '@/types';
import { REGEX_PATTERNS, LIMITS } from './constants';

// ==============================================
// HELPERS POUR LES UTILISATEURS ET RÔLES
// ==============================================

/**
 * Vérifie si un utilisateur a un rôle spécifique
 */
export function hasRole(userRole: Role, requiredRole: Role | Role[]): boolean {
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  return userRole === requiredRole;
}

/**
 * Vérifie si un utilisateur est admin ou formateur
 */
export function isAdminOrFormateur(role: Role): boolean {
  return role === Role.ADMIN || role === Role.FORMATEUR;
}

/**
 * Vérifie si un utilisateur est étudiant
 */
export function isStudent(role: Role): boolean {
  return role === Role.STUDENT;
}

/**
 * Retourne le label d'un rôle en français
 */
export function getRoleLabel(role: Role): string {
  const labels = {
    [Role.ADMIN]: 'Administrateur',
    [Role.FORMATEUR]: 'Formateur',
    [Role.STUDENT]: 'Étudiant',
  };
  return labels[role] || role;
}

/**
 * Génère un nom d'affichage à partir du prénom et nom
 */
export function getDisplayName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

/**
 * Génère les initiales d'un utilisateur
 */
export function getUserInitials(firstName: string, lastName: string): string {
  const firstInitial = firstName?.charAt(0)?.toUpperCase() || '';
  const lastInitial = lastName?.charAt(0)?.toUpperCase() || '';
  return `${firstInitial}${lastInitial}`;
}

// ==============================================
// HELPERS POUR LES PAIEMENTS
// ==============================================

/**
 * Vérifie si un paiement est en cours
 */
export function isPaymentPending(status: PaymentStatus): boolean {
  return status === PaymentStatus.PENDING;
}

/**
 * Vérifie si un paiement est réussi
 */
export function isPaymentSuccessful(status: PaymentStatus): boolean {
  return status === PaymentStatus.COMPLETED;
}

/**
 * Vérifie si un paiement a échoué
 */
export function isPaymentFailed(status: PaymentStatus): boolean {
  return [PaymentStatus.FAILED, PaymentStatus.CANCELLED].includes(status);
}

/**
 * Retourne le label d'un statut de paiement en français
 */
export function getPaymentStatusLabel(status: PaymentStatus): string {
  const labels = {
    [PaymentStatus.PENDING]: 'En attente',
    [PaymentStatus.COMPLETED]: 'Terminé',
    [PaymentStatus.FAILED]: 'Échoué',
    [PaymentStatus.CANCELLED]: 'Annulé',
    [PaymentStatus.REFUNDED]: 'Remboursé',
  };
  return labels[status] || status;
}

/**
 * Retourne la couleur associée à un statut de paiement
 */
export function getPaymentStatusColor(status: PaymentStatus): string {
  const colors = {
    [PaymentStatus.PENDING]: 'warning',
    [PaymentStatus.COMPLETED]: 'success',
    [PaymentStatus.FAILED]: 'danger',
    [PaymentStatus.CANCELLED]: 'secondary',
    [PaymentStatus.REFUNDED]: 'info',
  };
  return colors[status] || 'secondary';
}

/**
 * Calcule le montant avec réduction (55% si plus d'un concours)
 */
export function calculateDiscountedAmount(baseAmount: number, quantity: number): number {
  if (quantity <= 1) return baseAmount;
  const discount = 0.55; // 55% de réduction
  return Math.round(baseAmount * quantity * (1 - discount));
}

/**
 * Formate un numéro de téléphone pour Freemopay
 */
export function formatPhoneForPayment(phone: string): string {
  // Supprime tous les espaces et caractères non numériques sauf +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Si ça commence par +237 ou 237, on garde tel quel
  if (cleaned.startsWith('+237')) {
    return cleaned;
  }
  if (cleaned.startsWith('237')) {
    return `+${cleaned}`;
  }
  
  // Sinon on ajoute +237
  if (cleaned.length === 9) {
    return `+237${cleaned}`;
  }
  
  return cleaned;
}

// ==============================================
// HELPERS POUR LES ÉVALUATIONS
// ==============================================

/**
 * Vérifie si une évaluation est active
 */
export function isEvaluationActive(startDate: string, endDate: string): boolean {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  return now >= start && now <= end;
}

/**
 * Vérifie si une évaluation est à venir
 */
export function isEvaluationUpcoming(startDate: string): boolean {
  const now = new Date();
  const start = new Date(startDate);
  return now < start;
}

/**
 * Vérifie si une évaluation est terminée
 */
export function isEvaluationEnded(endDate: string): boolean {
  const now = new Date();
  const end = new Date(endDate);
  return now > end;
}

/**
 * Retourne le statut d'une évaluation
 */
export function getEvaluationStatus(startDate: string, endDate: string): 'upcoming' | 'active' | 'ended' {
  if (isEvaluationUpcoming(startDate)) return 'upcoming';
  if (isEvaluationActive(startDate, endDate)) return 'active';
  return 'ended';
}

/**
 * Retourne le label d'un type d'évaluation en français
 */
export function getEvaluationTypeLabel(type: EvaluationType): string {
  const labels = {
    [EvaluationType.QUIZ]: 'Quiz',
    [EvaluationType.EXAM]: 'Examen',
    [EvaluationType.ASSIGNMENT]: 'Devoir',
    [EvaluationType.PROJECT]: 'Projet',
    [EvaluationType.PRESENTATION]: 'Présentation',
  };
  return labels[type] || type;
}

/**
 * Calcule le temps restant pour une évaluation
 */
export function getTimeRemainingForEvaluation(endDate: string): {
  days: number;
  hours: number;
  minutes: number;
  isExpired: boolean;
} {
  const now = new Date();
  const end = new Date(endDate);
  const diffMs = end.getTime() - now.getTime();
  
  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, isExpired: true };
  }
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes, isExpired: false };
}

// ==============================================
// HELPERS POUR LES LECTURES
// ==============================================

/**
 * Retourne le label d'un type de lecture en français
 */
export function getLectureTypeLabel(type: LectureType): string {
  const labels = {
    [LectureType.VIDEO]: 'Vidéo',
    [LectureType.PDF]: 'PDF',
    [LectureType.AUDIO]: 'Audio',
    [LectureType.DOCUMENT]: 'Document',
    [LectureType.PRESENTATION]: 'Présentation',
  };
  return labels[type] || type;
}

/**
 * Retourne l'icône associée à un type de lecture
 */
export function getLectureTypeIcon(type: LectureType): string {
  const icons = {
    [LectureType.VIDEO]: 'Play',
    [LectureType.PDF]: 'FileText',
    [LectureType.AUDIO]: 'Headphones',
    [LectureType.DOCUMENT]: 'File',
    [LectureType.PRESENTATION]: 'Presentation',
  };
  return icons[type] || 'File';
}

/**
 * Vérifie si un type de lecture est streamable
 */
export function isStreamableLecture(type: LectureType): boolean {
  return [LectureType.VIDEO, LectureType.AUDIO].includes(type);
}

// ==============================================
// HELPERS POUR LES NOTES ET ÉVALUATIONS
// ==============================================

/**
 * Calcule la mention d'une note
 */
export function getGradeMention(grade: number, maxGrade: number = 20): string {
  const percentage = (grade / maxGrade) * 100;
  
  if (percentage >= 90) return 'Excellent';
  if (percentage >= 80) return 'Très bien';
  if (percentage >= 70) return 'Bien';
  if (percentage >= 60) return 'Assez bien';
  if (percentage >= 50) return 'Passable';
  return 'Insuffisant';
}

/**
 * Retourne la couleur associée à une note
 */
export function getGradeColor(grade: number, maxGrade: number = 20): string {
  const percentage = (grade / maxGrade) * 100;
  
  if (percentage >= 80) return 'success';
  if (percentage >= 60) return 'info';
  if (percentage >= 50) return 'warning';
  return 'danger';
}

/**
 * Calcule la moyenne d'un tableau de notes
 */
export function calculateAverage(grades: number[]): number {
  if (grades.length === 0) return 0;
  const sum = grades.reduce((acc, grade) => acc + grade, 0);
  return Math.round((sum / grades.length) * 100) / 100;
}

/**
 * Calcule la progression en pourcentage
 */
export function calculateProgression(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

// ==============================================
// HELPERS POUR LES FICHIERS
// ==============================================

/**
 * Extrait l'extension d'un fichier
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Vérifie si un fichier est une image
 */
export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

/**
 * Vérifie si un fichier est une vidéo
 */
export function isVideoFile(mimeType: string): boolean {
  return mimeType.startsWith('video/');
}

/**
 * Vérifie si un fichier est un audio
 */
export function isAudioFile(mimeType: string): boolean {
  return mimeType.startsWith('audio/');
}

/**
 * Vérifie si un fichier est un PDF
 */
export function isPdfFile(mimeType: string): boolean {
  return mimeType === 'application/pdf';
}

/**
 * Génère un nom de fichier unique
 */
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = getFileExtension(originalName);
  const nameWithoutExt = originalName.replace(`.${extension}`, '');
  const cleanName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
  
  return `${cleanName}_${timestamp}_${random}.${extension}`;
}

// ==============================================
// HELPERS POUR LES URLS ET NAVIGATION
// ==============================================

/**
 * Construit une URL de breadcrumb à partir d'un chemin
 */
export function buildBreadcrumbFromPath(pathname: string): Array<{ label: string; href?: string }> {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: Array<{ label: string; href?: string }> = [];
  
  // Ajouter l'accueil
  breadcrumbs.push({ label: 'Accueil', href: '/' });
  
  // Construire les breadcrumbs
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    // Convertir le segment en label lisible
    const label = segment
      .replace(/-/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
    });
  });
  
  return breadcrumbs;
}

/**
 * Vérifie si une URL est externe
 */
export function isExternalUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.origin !== window.location.origin;
  } catch {
    return false;
  }
}

/**
 * Ajoute des paramètres à une URL existante
 */
export function addParamsToUrl(url: string, params: Record<string, any>): string {
  const urlObj = new URL(url, window.location.origin);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      urlObj.searchParams.set(key, String(value));
    }
  });
  
  return urlObj.toString();
}

// ==============================================
// HELPERS POUR LES DONNÉES MÉTIER
// ==============================================

/**
 * Calcule les statistiques d'un ensemble de soumissions
 */
export function calculateSubmissionStats(submissions: Array<{ grade: number }>) {
  if (submissions.length === 0) {
    return {
      count: 0,
      average: 0,
      min: 0,
      max: 0,
      distribution: [],
    };
  }
  
  const grades = submissions.map(s => s.grade);
  const average = calculateAverage(grades);
  const min = Math.min(...grades);
  const max = Math.max(...grades);
  
  // Distribution par tranches
  const distribution = [
    { range: '0-5', count: grades.filter(g => g >= 0 && g < 5).length },
    { range: '5-10', count: grades.filter(g => g >= 5 && g < 10).length },
    { range: '10-15', count: grades.filter(g => g >= 10 && g < 15).length },
    { range: '15-20', count: grades.filter(g => g >= 15 && g <= 20).length },
  ];
  
  return {
    count: submissions.length,
    average,
    min,
    max,
    distribution,
  };
}

/**
 * Génère des données de test pour le développement
 */
export function generateMockData<T>(
  factory: () => T,
  count: number = 10
): T[] {
  return Array.from({ length: count }, factory);
}

/**
 * Simule un délai asynchrone (pour les mocks)
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retourne une couleur basée sur un hash de chaîne
 */
export function getColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
}

/**
 * Convertit un rang en position ordinale
 */
export function getRankLabel(rank: number): string {
  if (rank === 1) return '1er';
  if (rank === 2) return '2ème';
  return `${rank}ème`;
}

/**
 * Vérifie si un objet a toutes les propriétés requises
 */
export function hasRequiredProperties<T extends Record<string, any>>(
  obj: T,
  requiredProps: (keyof T)[]
): boolean {
  return requiredProps.every(prop => 
    obj[prop] !== undefined && obj[prop] !== null && obj[prop] !== ''
  );
}

/**
 * Filtre et nettoie les paramètres de requête
 */
export function cleanQueryParams(params: Record<string, any>): Record<string, string> {
  const cleaned: Record<string, string> = {};
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key] = String(value);
    }
  });
  
  return cleaned;
}

/**
 * Convertit un objet en FormData pour les uploads
 */
export function objectToFormData(obj: Record<string, any>): FormData {
  const formData = new FormData();
  
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item instanceof File) {
            formData.append(`${key}[${index}]`, item);
          } else {
            formData.append(`${key}[${index}]`, String(item));
          }
        });
      } else {
        formData.append(key, String(value));
      }
    }
  });
  
  return formData;
}

// ==============================================
// HELPERS POUR LES ERREURS
// ==============================================

/**
 * Extrait un message d'erreur lisible d'une erreur
 */
export function getErrorMessage(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.data?.message) return error.data.message;
  if (error?.response?.data?.message) return error.response.data.message;
  return 'Une erreur est survenue';
}

/**
 * Vérifie si une erreur est due à un problème réseau
 */
export function isNetworkError(error: any): boolean {
  return (
    !navigator.onLine ||
    error?.code === 'NETWORK_ERROR' ||
    error?.message?.includes('Network Error') ||
    error?.message?.includes('fetch')
  );
}

/**
 * Vérifie si une erreur est due à une autorisation
 */
export function isAuthError(error: any): boolean {
  return (
    error?.status === 401 ||
    error?.response?.status === 401 ||
    error?.code === 'UNAUTHORIZED'
  );
}