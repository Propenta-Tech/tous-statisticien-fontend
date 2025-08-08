// ==============================================
// TYPES AUTHENTIFICATION - TOUS STATISTICIEN ACADEMY
// ==============================================
// Types pour la gestion de l'authentification et des sessions

import { Person, Role } from './index';

// ==============================================
// INTERFACES UTILISATEUR ET SESSION
// ==============================================

// Interface pour l'utilisateur connecté (version simplifiée)
export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  hasPaid: boolean;
  phone?: string;
  country?: string;
  lastLogin?: string;
}

// Interface pour les données en cache
export interface CachedUser extends AuthUser {
  token: string;
  expiresAt: number;
}

// Interface pour le contexte d'authentification
export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => void;
  register: (data: RegistrationData) => Promise<void>;
  updateUser: (data: Partial<AuthUser>) => void;
  checkAuthStatus: () => Promise<boolean>;
}

// ==============================================
// TYPES POUR L'INSCRIPTION (3 ÉTAPES)
// ==============================================

// Étape 1: Informations personnelles
export interface RegistrationStep1 {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country: string;
}

// Étape 2: Vérification du code
export interface RegistrationStep2 {
  verificationToken: string;
  code: string;
}

// Étape 3: Mot de passe
export interface RegistrationStep3 {
  verificationToken: string;
  password: string;
  confirmPassword: string;
}

// Données complètes d'inscription
export interface RegistrationData {
  step1: RegistrationStep1;
  step2: RegistrationStep2;
  step3: RegistrationStep3;
}

// ==============================================
// TYPES POUR LA CONNEXION
// ==============================================

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
  expiresIn: number;
}

// ==============================================
// TYPES POUR LA RÉCUPÉRATION DE MOT DE PASSE
// ==============================================

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// ==============================================
// TYPES POUR LA GESTION DES TOKENS
// ==============================================

export interface TokenData {
  token: string;
  expiresAt: number;
  refreshToken?: string;
}

export interface DecodedToken {
  sub: string; // User ID
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  iat: number; // Issued at
  exp: number; // Expiration
}

// ==============================================
// TYPES POUR LES PERMISSIONS
// ==============================================

export interface Permission {
  resource: string;
  actions: string[];
}

export interface RolePermissions {
  role: Role;
  permissions: Permission[];
}

// Types de permissions par ressource
export type ResourcePermissions = {
  users: 'read' | 'create' | 'update' | 'delete';
  classes: 'read' | 'create' | 'update' | 'delete' | 'enroll';
  modules: 'read' | 'create' | 'update' | 'delete';
  lectures: 'read' | 'create' | 'update' | 'delete' | 'view';
  evaluations: 'read' | 'create' | 'update' | 'delete' | 'submit' | 'grade';
  submissions: 'read' | 'create' | 'update' | 'delete' | 'view_all';
  payments: 'read' | 'create' | 'update' | 'delete' | 'view_all';
  resources: 'read' | 'create' | 'update' | 'delete' | 'download';
  statistics: 'read' | 'view_all' | 'view_own';
};

// ==============================================
// TYPES POUR LES GUARDS DE PROTECTION
// ==============================================

export interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: Role | Role[];
  requiredPermission?: keyof ResourcePermissions;
  fallbackComponent?: React.ComponentType;
  redirectTo?: string;
}

export interface ProtectedRouteConfig {
  path: string;
  roles: Role[];
  permissions?: string[];
  exact?: boolean;
}

// ==============================================
// TYPES POUR LES ERREURS D'AUTHENTIFICATION
// ==============================================

export interface AuthError {
  code: AuthErrorCode;
  message: string;
  details?: any;
}

export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  ACCOUNT_DISABLED = 'ACCOUNT_DISABLED',
  VERIFICATION_CODE_INVALID = 'VERIFICATION_CODE_INVALID',
  VERIFICATION_CODE_EXPIRED = 'VERIFICATION_CODE_EXPIRED',
  PASSWORD_TOO_WEAK = 'PASSWORD_TOO_WEAK',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}

// ==============================================
// TYPES POUR LA VALIDATION
// ==============================================

export interface PasswordValidation {
  isValid: boolean;
  errors: PasswordError[];
  strength: 'weak' | 'medium' | 'strong';
}

export interface PasswordError {
  code: 'MIN_LENGTH' | 'UPPERCASE' | 'LOWERCASE' | 'NUMBER' | 'SPECIAL_CHAR';
  message: string;
}

export interface EmailValidation {
  isValid: boolean;
  isAvailable?: boolean;
  errors: string[];
}

// ==============================================
// TYPES POUR L'AUDIT ET LES LOGS
// ==============================================

export interface AuthAuditLog {
  id: string;
  userId: string;
  action: AuthAction;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  errorCode?: string;
  metadata?: any;
}

export enum AuthAction {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  REGISTER = 'REGISTER',
  PASSWORD_RESET = 'PASSWORD_RESET',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  TOKEN_REFRESH = 'TOKEN_REFRESH',
  ACCOUNT_LOCK = 'ACCOUNT_LOCK',
  ACCOUNT_UNLOCK = 'ACCOUNT_UNLOCK'
}

// ==============================================
// TYPES POUR LES PRÉFÉRENCES UTILISATEUR
// ==============================================

export interface UserPreferences {
  language: 'fr' | 'en';
  timezone: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
  evaluationReminders: boolean;
  gradeNotifications: boolean;
  classAnnouncements: boolean;
}

export interface PrivacyPreferences {
  profileVisibility: 'public' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  allowAnalytics: boolean;
}

// ==============================================
// TYPES POUR LES SESSIONS
// ==============================================

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  lastActivity: string;
  isActive: boolean;
  expiresAt: string;
}

export interface SessionManager {
  currentSession: UserSession | null;
  activeSessions: UserSession[];
  createSession: (user: AuthUser, token: string) => UserSession;
  refreshSession: (sessionId: string) => Promise<UserSession>;
  terminateSession: (sessionId: string) => Promise<void>;
  terminateAllSessions: () => Promise<void>;
}

// ==============================================
// TYPES POUR L'AUTHENTIFICATION SOCIALE (FUTUR)
// ==============================================

export interface SocialAuthProvider {
  id: 'google' | 'facebook' | 'microsoft';
  name: string;
  clientId: string;
  redirectUri: string;
  scopes: string[];
}

export interface SocialAuthResponse {
  provider: string;
  accessToken: string;
  profile: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    picture?: string;
  };
}

// ==============================================
// TYPES POUR LA CONFIGURATION D'AUTHENTIFICATION
// ==============================================

export interface AuthConfig {
  tokenStorage: 'localStorage' | 'sessionStorage' | 'cookie';
  tokenExpiration: number; // en millisecondes
  refreshThreshold: number; // seuil pour refresh automatique (en millisecondes avant expiration)
  maxRetries: number;
  apiBaseUrl: string;
  endpoints: {
    login: string;
    register: string;
    logout: string;
    refresh: string;
    profile: string;
    forgotPassword: string;
    resetPassword: string;
    verifyEmail: string;
  };
}

// ==============================================
// TYPES UTILITAIRES
// ==============================================

// Type pour vérifier si l'utilisateur a un rôle spécifique
export type HasRole<T extends Role> = (user: AuthUser | null, role: T) => boolean;

// Type pour vérifier si l'utilisateur a une permission
export type HasPermission = (user: AuthUser | null, resource: keyof ResourcePermissions, action: string) => boolean;

// Type pour les hooks d'authentification
export interface UseAuthReturn extends AuthContextValue {
  hasRole: (role: Role) => boolean;
  hasPermission: (resource: keyof ResourcePermissions, action: string) => boolean;
  canAccess: (route: string) => boolean;
}

// ==============================================
// CONSTANTES D'AUTHENTIFICATION
// ==============================================

export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER_STEP_1: '/auth/register/step-1',
  REGISTER_STEP_2: '/auth/register/step-2',
  REGISTER_STEP_3: '/auth/register/step-3',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
} as const;

export const DASHBOARD_ROUTES = {
  STUDENT: '/dashboard/student',
  ADMIN: '/dashboard/admin',
} as const;

// Durées par défaut
export const AUTH_TIMEOUTS = {
  TOKEN_EXPIRATION: 24 * 60 * 60 * 1000, // 24 heures
  REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes d'inactivité
} as const;