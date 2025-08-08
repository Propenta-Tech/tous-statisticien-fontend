// ==============================================
// CONSTANTES GLOBALES - TOUS STATISTICIEN ACADEMY
// ==============================================
// Constantes utilisées dans toute l'application

// ==============================================
// INFORMATIONS DE L'APPLICATION
// ==============================================

export const APP_INFO = {
  NAME: 'Tous Statisticien Academy',
  SHORT_NAME: 'TSA',
  VERSION: '1.0.0',
  DESCRIPTION: 'Plateforme e-learning pour la préparation aux concours de bourses',
  AUTHOR: 'Tous Statisticien Academy',
  WEBSITE: 'https://www.tous-statisticien.net',
  SUPPORT_EMAIL: 'support@tous-statisticien.net',
  CONTACT_EMAIL: 'contact@tous-statisticien.net',
} as const;

// ==============================================
// INFORMATIONS DE CONTACT
// ==============================================

export const CONTACT_INFO = {
  PHONE: '+237694282767',
  EMAIL: 'contact@tous-statisticien.net',
  SUPPORT_EMAIL: 'support@tous-statisticien.net',
  ADDRESS: 'Damas, Total Ebom, Rue de l\'aéroport',
  CITY: 'Yaoundé',
  COUNTRY: 'Cameroun',
  BUSINESS_HOURS: 'Lundi - Vendredi: 8h00 - 18h00',
} as const;

// ==============================================
// URLS ET ENDPOINTS
// ==============================================

export const API_ENDPOINTS = {
  // Base
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  
  // Authentification
  AUTH: {
    REGISTER_START: '/api/auth/register/start',
    REGISTER_VERIFY: '/api/auth/register/verify',
    REGISTER_COMPLETE: '/api/auth/register/complete',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    REFRESH_TOKEN: '/api/auth/refresh',
    PROFILE: '/api/auth/profile',
  },
  
  // Utilisateurs
  USERS: {
    BASE: '/api/persons',
    ALL: '/api/persons/all',
    BY_ID: (id: string) => `/api/persons/${id}`,
    CREATE: '/api/persons/create',
    UPDATE: (id: string) => `/api/persons/update/${id}`,
    DELETE: (id: string) => `/api/persons/delete/${id}`,
  },
  
  // Classes virtuelles
  VIRTUAL_CLASSES: {
    BASE: '/api/virtual-classes',
    ALL: '/api/virtual-classes/all',
    BY_ID: (id: string) => `/api/virtual-classes/${id}`,
    CREATE: '/api/virtual-classes/create',
    UPDATE: (id: string) => `/api/virtual-classes/update/${id}`,
    DELETE: (id: string) => `/api/virtual-classes/delete/${id}`,
  },
  
  // Modules
  MODULES: {
    BASE: '/api/modules',
    ALL: '/api/modules/all',
    BY_ID: (id: string) => `/api/modules/${id}`,
    CREATE: '/api/modules/create',
    UPDATE: (id: string) => `/api/modules/update/${id}`,
    DELETE: (id: string) => `/api/modules/delete/${id}`,
  },
  
  // Lectures
  LECTURES: {
    BASE: '/api/lectures',
    ALL: '/api/lectures/all',
    BY_ID: (id: string) => `/api/lectures/${id}`,
    CREATE: '/api/lectures/create',
    UPDATE: (id: string) => `/api/lectures/update/${id}`,
    DELETE: (id: string) => `/api/lectures/delete/${id}`,
  },
  
  // Évaluations
  EVALUATIONS: {
    BASE: '/api/evaluations',
    ALL: '/api/evaluations/all',
    BY_ID: (id: string) => `/api/evaluations/${id}`,
    CREATE: '/api/evaluations/create',
    UPDATE: (id: string) => `/api/evaluations/update/${id}`,
    DELETE: (id: string) => `/api/evaluations/delete/${id}`,
  },
  
  // Soumissions
  SUBMISSIONS: {
    BASE: '/api/submissions',
    ALL: '/api/submissions/all',
    BY_ID: (id: string) => `/api/submissions/${id}`,
    CREATE: '/api/submissions/create',
    UPDATE: (id: string) => `/api/submissions/update/${id}`,
    DELETE: (id: string) => `/api/submissions/delete/${id}`,
  },
  
  // Paiements
  PAYMENTS: {
    BASE: '/api/payments',
    ALL: '/api/payments/all',
    BY_ID: (id: string) => `/api/payments/${id}`,
    CREATE: '/api/payments/create',
    UPDATE: (id: string) => `/api/payments/update/${id}`,
    DELETE: (id: string) => `/api/payments/delete/${id}`,
  },
  
  // Ressources
  RESOURCES: {
    BASE: '/api/resources',
    ALL: '/api/resources/all',
    BY_ID: (id: string) => `/api/resources/${id}`,
    CREATE: '/api/resources/create',
    UPDATE: (id: string) => `/api/resources/update/${id}`,
    DELETE: (id: string) => `/api/resources/delete/${id}`,
  },
  
  // Statistiques
  STATISTICS: {
    ADMIN: {
      USERS: '/api/statistics/admin/users',
      FINANCIAL: '/api/statistics/admin/financial',
      EDUCATIONAL: '/api/statistics/admin/educational',
      ENGAGEMENT: '/api/statistics/admin/engagement',
      DASHBOARD: '/api/statistics/admin/dashboard',
    },
    STUDENT: {
      PERSONAL: (id: string) => `/api/statistics/student/${id}/personal`,
      COMPARISON: (studentId: string, moduleId: string) => `/api/statistics/student/${studentId}/module/${moduleId}/comparison`,
      ACHIEVEMENTS: (id: string) => `/api/statistics/student/${id}/achievements`,
      DASHBOARD: (id: string) => `/api/statistics/student/${id}/dashboard`,
    },
  },
  
  // Classes utilisateurs
  VIRTUAL_CLASS_USERS: {
    BASE: '/api/virtual-class-users',
    ALL: '/api/virtual-class-users/all',
    BY_ID: (id: string) => `/api/virtual-class-users/${id}`,
    CREATE: '/api/virtual-class-users/create',
    DELETE: (id: string) => `/api/virtual-class-users/${id}`,
  },
} as const;

// ==============================================
// ROUTES FRONTEND
// ==============================================

export const ROUTES = {
  // Pages publiques
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRICING: '/pricing',
  FEATURES: '/features',
  
  // Authentification
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER_STEP_1: '/auth/register/step-1',
    REGISTER_STEP_2: '/auth/register/step-2',
    REGISTER_STEP_3: '/auth/register/step-3',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Dashboard étudiant
  STUDENT: {
    DASHBOARD: '/dashboard/student',
    CLASSES: '/dashboard/student/classes',
    CLASS_DETAIL: (id: string) => `/dashboard/student/classes/${id}`,
    MODULE_DETAIL: (classId: string, moduleId: string) => `/dashboard/student/classes/${classId}/modules/${moduleId}`,
    LECTURE_DETAIL: (classId: string, moduleId: string, lectureId: string) => 
      `/dashboard/student/classes/${classId}/modules/${moduleId}/lectures/${lectureId}`,
    EVALUATIONS: '/dashboard/student/evaluations',
    EVALUATION_DETAIL: (id: string) => `/dashboard/student/evaluations/${id}`,
    RESULTS: '/dashboard/student/results',
    PROFILE: '/dashboard/student/profile',
  },
  
  // Dashboard admin
  ADMIN: {
    DASHBOARD: '/dashboard/admin',
    USERS: '/dashboard/admin/users',
    CLASSES: '/dashboard/admin/classes',
    MODULES: '/dashboard/admin/modules',
    LECTURES: '/dashboard/admin/lectures',
    EVALUATIONS: '/dashboard/admin/evaluations',
    SUBMISSIONS: '/dashboard/admin/submissions',
    RESOURCES: '/dashboard/admin/resources',
    PAYMENTS: '/dashboard/admin/payments',
    STATISTICS: '/dashboard/admin/statistics',
    SETTINGS: '/dashboard/admin/settings',
  },
} as const;

// ==============================================
// PARAMÈTRES DE PAGINATION
// ==============================================

export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
  SIZE_OPTIONS: [5, 10, 20, 50, 100],
  MAX_SIZE: 100,
} as const;

// ==============================================
// LIMITES ET CONTRAINTES
// ==============================================

export const LIMITS = {
  // Fichiers
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_FILES_PER_UPLOAD: 5,
  
  // Texte
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_MESSAGE_LENGTH: 1000,
  MAX_FEEDBACK_LENGTH: 500,
  
  // Mots de passe
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  
  // Noms
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  
  // Téléphones
  PHONE_LENGTH: 9,
  
  // Notes
  MIN_GRADE: 0,
  MAX_GRADE: 20,
  
  // Progression
  MIN_PROGRESSION: 0,
  MAX_PROGRESSION: 100,
} as const;

// ==============================================
// TYPES DE FICHIERS AUTORISÉS
// ==============================================

export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
  ],
  VIDEOS: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'],
  AUDIO: ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a'],
  ARCHIVES: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'],
} as const;

// ==============================================
// EXPRESSIONS RÉGULIÈRES
// ==============================================

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_CAMEROON: /^(\+237|237)?\s?[679]\d{8}$/,
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  NAME: /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
} as const;

// ==============================================
// MESSAGES D'ERREUR
// ==============================================

export const ERROR_MESSAGES = {
  // Génériques
  GENERIC: 'Une erreur est survenue. Veuillez réessayer.',
  NETWORK: 'Erreur de connexion. Vérifiez votre connexion internet.',
  UNAUTHORIZED: 'Vous n\'êtes pas autorisé à effectuer cette action.',
  FORBIDDEN: 'Accès refusé.',
  NOT_FOUND: 'Ressource non trouvée.',
  VALIDATION: 'Veuillez corriger les erreurs dans le formulaire.',
  
  // Authentification
  INVALID_CREDENTIALS: 'Email ou mot de passe incorrect.',
  TOKEN_EXPIRED: 'Votre session a expiré. Veuillez vous reconnecter.',
  EMAIL_ALREADY_EXISTS: 'Cette adresse email est déjà utilisée.',
  VERIFICATION_CODE_INVALID: 'Code de vérification invalide.',
  VERIFICATION_CODE_EXPIRED: 'Code de vérification expiré.',
  
  // Validation
  REQUIRED_FIELD: 'Ce champ est obligatoire.',
  INVALID_EMAIL: 'Adresse email invalide.',
  INVALID_PHONE: 'Numéro de téléphone invalide.',
  PASSWORD_TOO_WEAK: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.',
  PASSWORDS_NOT_MATCH: 'Les mots de passe ne correspondent pas.',
  FILE_TOO_LARGE: 'Le fichier est trop volumineux.',
  FILE_TYPE_NOT_ALLOWED: 'Type de fichier non autorisé.',
  
  // Métier
  PAYMENT_FAILED: 'Le paiement a échoué. Veuillez réessayer.',
  EVALUATION_NOT_AVAILABLE: 'Cette évaluation n\'est pas encore disponible.',
  EVALUATION_EXPIRED: 'Cette évaluation a expiré.',
  SUBMISSION_ALREADY_EXISTS: 'Vous avez déjà soumis un travail pour cette évaluation.',
} as const;

// ==============================================
// MESSAGES DE SUCCÈS
// ==============================================

export const SUCCESS_MESSAGES = {
  // Génériques
  SAVED: 'Enregistré avec succès.',
  UPDATED: 'Mis à jour avec succès.',
  DELETED: 'Supprimé avec succès.',
  CREATED: 'Créé avec succès.',
  
  // Authentification
  LOGIN_SUCCESS: 'Connexion réussie.',
  LOGOUT_SUCCESS: 'Déconnexion réussie.',
  REGISTRATION_SUCCESS: 'Inscription réussie.',
  PASSWORD_RESET_EMAIL_SENT: 'Email de réinitialisation envoyé.',
  PASSWORD_CHANGED: 'Mot de passe modifié avec succès.',
  EMAIL_VERIFIED: 'Email vérifié avec succès.',
  
  // Paiements
  PAYMENT_SUCCESS: 'Paiement effectué avec succès.',
  
  // Soumissions
  SUBMISSION_SUCCESS: 'Travail soumis avec succès.',
  GRADE_ASSIGNED: 'Note attribuée avec succès.',
  
  // Uploads
  FILE_UPLOADED: 'Fichier téléchargé avec succès.',
  FILES_UPLOADED: 'Fichiers téléchargés avec succès.',
} as const;

// ==============================================
// DURÉES ET TIMEOUTS
// ==============================================

export const TIMEOUTS = {
  API_REQUEST: 30000, // 30 secondes
  FILE_UPLOAD: 300000, // 5 minutes
  TOKEN_REFRESH: 5 * 60 * 1000, // 5 minutes avant expiration
  SESSION_WARNING: 5 * 60 * 1000, // Avertir 5 minutes avant expiration
  DEBOUNCE_SEARCH: 300, // 300ms
  TOAST_DURATION: 5000, // 5 secondes
  LOADING_DELAY: 200, // Délai avant d'afficher le loader
} as const;

// ==============================================
// FREEMOPAY CONFIGURATION
// ==============================================

export const FREEMOPAY = {
  API_URL: 'https://api-v2.freemopay.com',
  APP_KEY: process.env.NEXT_PUBLIC_FREEMOPAY_APP_KEY,
  SUPPORTED_METHODS: ['orange_money', 'mtn_mobile_money'],
  CURRENCY: 'XAF',
  MIN_AMOUNT: 500, // FCFA
  MAX_AMOUNT: 1000000, // FCFA
} as const;

// ==============================================
// PAYS SUPPORTÉS
// ==============================================

export const SUPPORTED_COUNTRIES = [
  { code: 'CM', name: 'Cameroun', flag: '🇨🇲', dialCode: '+237' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
  { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮', dialCode: '+225' },
  { code: 'SN', name: 'Sénégal', flag: '🇸🇳', dialCode: '+221' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', dialCode: '+226' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', dialCode: '+223' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', dialCode: '+228' },
  { code: 'BJ', name: 'Bénin', flag: '🇧🇯', dialCode: '+229' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', dialCode: '+227' },
  { code: 'TD', name: 'Tchad', flag: '🇹🇩', dialCode: '+235' },
  { code: 'CF', name: 'République Centrafricaine', flag: '🇨🇫', dialCode: '+236' },
  { code: 'CG', name: 'Congo', flag: '🇨🇬', dialCode: '+242' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦', dialCode: '+241' },
  { code: 'GQ', name: 'Guinée Équatoriale', flag: '🇬🇶', dialCode: '+240' },
] as const;

// ==============================================
// CONFIGURATION DES THÈMES
// ==============================================

export const THEME_CONFIG = {
  DEFAULT_THEME: 'light',
  THEMES: ['light', 'dark'],
  STORAGE_KEY: 'tsa_theme',
} as const;

// ==============================================
// CONFIGURATION DES LANGUES
// ==============================================

export const LANGUAGE_CONFIG = {
  DEFAULT_LANGUAGE: 'fr',
  SUPPORTED_LANGUAGES: [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ],
  STORAGE_KEY: 'tsa_language',
} as const;

// ==============================================
// STOCKAGE LOCAL
// ==============================================

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'tsa_auth_token',
  USER_DATA: 'tsa_user_data',
  THEME: 'tsa_theme',
  LANGUAGE: 'tsa_language',
  PREFERENCES: 'tsa_preferences',
  CACHE_PREFIX: 'tsa_cache_',
  TEMP_DATA: 'tsa_temp_data',
} as const;

// ==============================================
// NIVEAUX DE LOG
// ==============================================

export const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
} as const;

// ==============================================
// ENVIRONNEMENTS
// ==============================================

export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production',
} as const;

// ==============================================
// MÉTRIQUES ET ANALYTICS
// ==============================================

export const ANALYTICS_EVENTS = {
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_REGISTER: 'user_register',
  PAYMENT_INITIATED: 'payment_initiated',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
  EVALUATION_STARTED: 'evaluation_started',
  EVALUATION_SUBMITTED: 'evaluation_submitted',
  LECTURE_VIEWED: 'lecture_viewed',
  MODULE_COMPLETED: 'module_completed',
  CLASS_ENROLLED: 'class_enrolled',
} as const;

// ==============================================
// EXPORT DE TOUTES LES CONSTANTES
// ==============================================

export default {
  APP_INFO,
  CONTACT_INFO,
  API_ENDPOINTS,
  ROUTES,
  PAGINATION,
  LIMITS,
  ALLOWED_FILE_TYPES,
  REGEX_PATTERNS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  TIMEOUTS,
  FREEMOPAY,
  SUPPORTED_COUNTRIES,
  THEME_CONFIG,
  LANGUAGE_CONFIG,
  STORAGE_KEYS,
  LOG_LEVELS,
  ENVIRONMENTS,
  ANALYTICS_EVENTS,
};