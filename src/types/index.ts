// ==============================================
// TYPES PRINCIPAUX - TOUS STATISTICIEN ACADEMY
// ==============================================
// Types correspondants aux modèles Java du backend

import React from 'react';

// ==============================================
// ENUMS - Correspondant aux enums Java
// ==============================================

export enum Role {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  FORMATEUR = 'FORMATEUR'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export enum LectureType {
  VIDEO = 'VIDEO',
  PDF = 'PDF',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
  PRESENTATION = 'PRESENTATION',
  TEXT = 'TEXT',
  QUIZ = 'QUIZ',
  INTERACTIVE = 'INTERACTIVE',
}

export enum EvaluationType {
  QUIZ = 'QUIZ',
  EXAM = 'EXAM',
  ASSIGNMENT = 'ASSIGNMENT',
  PROJECT = 'PROJECT',
  PRESENTATION = 'PRESENTATION',
  SURVEY = 'SURVEY'  
}

export enum ResourceType {
  PDF = 'PDF',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  IMAGE = 'IMAGE',
  DOCUMENT = 'DOCUMENT',
  ARCHIVE = 'ARCHIVE',
  LINK = 'LINK',
  
  OTHER = 'OTHER'
}

// ==============================================
// INTERFACES DE BASE
// ==============================================

// Interface de base pour tous les modèles avec ID UUID et timestamps
export interface BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Interface pour les modèles avec créateur/modificateur
export interface AuditableModel extends BaseModel {
  createdBy?: Person;
  updatedBy?: Person;
}

// ==============================================
// MODÈLES PRINCIPAUX (basés sur les entités Java)
// ==============================================

// Modèle Person (utilisateurs) - Table "person"
export interface Person extends BaseModel {
  lastName: string;
  firstName: string;
  email: string;
  role: Role;
  hasPaid: boolean;
  phone?: string;
  country?: string;
  lastLogin?: string;
  // Relations
  createdClasses?: VirtualClass[];
  payments?: Payment[];
  submissions?: Submission[];
  userStatistics?: UserStatistic[];
  virtualClassUsers?: VirtualClassUser[];
}

// Modèle VirtualClass (classes virtuelles) - Table "virtual_class"
export interface VirtualClass extends AuditableModel {
  name: string;
  level: string;
  description: string;
  // Relations
  modules?: Module[];
  virtualClassUsers?: VirtualClassUser[];
  // Statistiques calculées
  studentsCount?: number;
  modulesCount?: number;
}

// Modèle Module - Table "module"
export interface Module extends AuditableModel {
  id: string;
  title: string;
  virtualClass: VirtualClass;
  order: number;
  description?: string;
  
  // Statuts et dates
  isPublished: boolean;
  isArchived: boolean;
  publishedAt?: string;
  archivedAt?: string;
  
  // Métadonnées
  createdAt: string;
  updatedAt: string;
  createdBy: Person;
  updatedBy?: Person;
  
  // Relations
  lectures?: Lecture[];
  evaluations?: Evaluation[];
  userStatistics?: UserStatistic[];
  
  // Statistiques (optionnelles)
  totalLectures?: number;
  totalEvaluations?: number;
  enrolledStudents?: number;
}

// Modèle Lecture - Table "lecture"
export interface Lecture extends AuditableModel {
  title: string;
  type: LectureType;
  url: string; // max 500 chars
  module?: Module;
  moduleId: string; // FK vers module
  // Métadonnées calculées
  duration?: number; // en secondes
  size?: number; // taille fichier en bytes
  completed?: boolean; // pour un utilisateur spécifique
}

// Modèle Evaluation - Table "evaluation"
export interface Evaluation extends AuditableModel {
  title: string;
  type: EvaluationType;
  startDate: string;
  endDate: string;
  module?: Module;
  moduleId: string; // FK vers module
  // Relations
  submissions?: Submission[];
  // Statistiques calculées
  submissionsCount?: number;
  maxScore?: number;
  averageScore?: number;
  status?: 'upcoming' | 'active' | 'ended'; // calculé selon les dates
}

// Modèle Submission (soumissions d'étudiants) - Table "submission"
export interface Submission extends BaseModel {
  fileUrl: string;
  grade: number; // float
  feedback?: string;
  evaluation?: Evaluation;
  evaluationId: string; // FK vers evaluation
  person?: Person;
  personId: string; // FK vers person
  updatedBy?: Person; // FK vers person (correcteur)
  updatedById?: string;
  // Métadonnées
  submitted?: boolean;
  graded?: boolean;
}

// Modèle Payment (paiements) - Table "payment"
export interface Payment extends BaseModel {
  amount: number; // decimal(10,2)
  status: PaymentStatus;
  person?: Person;
  personId: string; // FK vers person
  // Métadonnées Freemopay
  transactionId?: string;
  reference?: string;
  phoneNumber?: string;
  paymentMethod?: 'orange_money' | 'mtn_mobile_money';
}

// Modèle Resource (ressources) - Table "resource"
export interface Resource extends AuditableModel {
  title: string;
  type: ResourceType;
  fileUrl: string;
  description?: string;
  isPublic: boolean; 
  // Métadonnées fichier
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  link: string; 

}

// Modèle UserStatistic (statistiques utilisateur) - Table "user_statistic"
export interface UserStatistic {
  id: string;
  progression: number; // float 0-100
  averageGrade: number; // float
  person?: Person;
  personId: string; // FK vers person
  module?: Module;
  moduleId: string; // FK vers module
}

// Modèle VirtualClassUser (association utilisateur-classe) - Table "virtual_class_user"
export interface VirtualClassUser extends BaseModel {
  person?: Person;
  personId: string; // FK vers person
  virtualClass?: VirtualClass;
  virtualClassId: string; // FK vers virtual_class
  // Métadonnées
  enrolledAt?: string; // alias pour createdAt
  isActive?: boolean;
}

// ==============================================
// TYPES D'UTILITAIRES API
// ==============================================

// Type pour les réponses d'API avec pagination (Spring Boot style)
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // page actuelle (0-indexed)
  first: boolean;
  last: boolean;
  empty: boolean;
  numberOfElements: number;
}

// Type pour les réponses d'API simples
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

// Type pour les erreurs d'API
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, any>;
  timestamp?: string;
  path?: string;
}

// Type pour les options de requête HTTP
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
}

// Type pour les filtres de recherche génériques
export interface SearchFilters {
  query?: string;
  role?: Role;
  status?: PaymentStatus;
  type?: LectureType | EvaluationType | ResourceType;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// ==============================================
// TYPES POUR L'INTERFACE UTILISATEUR
// ==============================================

// Type pour les éléments de menu de navigation
export interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<any>;
  children?: MenuItem[];
  roles?: Role[];
  badge?: string | number;
  active?: boolean;
  disabled?: boolean;
}

// Type pour les notifications système
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  actionLabel?: string;
  dismissible?: boolean;
}

// Type pour les statistiques du dashboard
export interface DashboardStats {
  totalUsers: number;
  totalClasses: number;
  totalModules: number;
  totalEvaluations: number;
  totalRevenue: number;
  recentActivity: Activity[];
  userGrowth: GrowthData[];
  paymentStats: PaymentStats;
  topPerformers?: TopPerformer[];
}

// Type pour les activités récentes
export interface Activity {
  id: string;
  type: 'user_registered' | 'payment_completed' | 'evaluation_submitted' | 'class_created' | 'module_completed';
  message: string;
  timestamp: string;
  userId?: string;
  userName?: string;
  avatar?: string;
  metadata?: Record<string, any>;
}

// Type pour les données de croissance
export interface GrowthData {
  date: string;
  users: number;
  classes: number;
  revenue: number;
  submissions: number;
}

// Type pour les statistiques de paiement
export interface PaymentStats {
  totalRevenue: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
  successfulPayments: number;
  failedPayments: number;
  pendingPayments: number;
  refunds: number;
  averageOrderValue: number;
  conversionRate: number;
}

// Type pour les meilleurs performers
export interface TopPerformer {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  rank: number;
  change: number; // changement de position
}

// ==============================================
// TYPES POUR LES FORMULAIRES ET VALIDATION
// ==============================================

// Type pour les options de sélection
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: React.ComponentType<any>;
  description?: string;
  group?: string;
}

// Type pour les pays
export interface Country {
  code: string; // Code ISO (CM, FR, etc.)
  name: string;
  flag?: string;
  dialCode?: string; // +237, +33, etc.
  alpha3?: string; // CMR, FRA, etc.
}

// Type pour les erreurs de validation
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

// Type pour l'état de validation d'un champ
export interface FieldValidation {
  isValid: boolean;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

// ==============================================
// TYPES POUR LA NAVIGATION ET ROUTING
// ==============================================

// Type pour les breadcrumbs
export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
  icon?: React.ComponentType<any>;
}

// Type pour les liens de navigation
export interface NavLink {
  href: string;
  label: string;
  icon?: React.ComponentType<any>;
  badge?: string | number;
  active?: boolean;
  external?: boolean;
  target?: '_blank' | '_self';
}

// Type pour les routes protégées
export interface ProtectedRoute {
  path: string;
  component: React.ComponentType<any>;
  roles: Role[];
  exact?: boolean;
  redirect?: string;
}

// ==============================================
// TYPES POUR LES FICHIERS ET UPLOADS
// ==============================================

// Type pour les fichiers uploadés
export interface UploadedFile {
  id: string;
  name: string;
  originalName: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  uploadedBy?: string;
  metadata?: {
    duration?: number; // pour vidéos/audio
    dimensions?: { width: number; height: number }; // pour images
    pages?: number; // pour PDFs
  };
}

// Type pour la progression d'upload
export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  speed?: number; // bytes/sec
  remainingTime?: number; // seconds
}

// Type pour les contraintes d'upload
export interface UploadConstraints {
  maxSize: number; // bytes
  allowedTypes: string[]; // MIME types
  maxFiles?: number;
  quality?: number; // pour compression d'images (0-1)
}

// ==============================================
// TYPES POUR LES COMPOSANTS UI
// ==============================================

// Type pour les variantes de boutons
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'ghost' | 'link' | 'outline';

// Type pour les tailles de composants
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Type pour les positions
export type Position = 'top' | 'bottom' | 'left' | 'right' | 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

// Type pour les couleurs du thème
export type ThemeColor = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light' | 'navy' | 'gold';

// Type pour les états de chargement
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Type pour les orientations
export type Orientation = 'horizontal' | 'vertical';

// ==============================================
// TYPES POUR LES ÉVÉNEMENTS ET INTERACTIONS
// ==============================================

// Type pour les gestionnaires d'événements
export interface EventHandlers<T = any> {
  onClick?: (event: React.MouseEvent<T>) => void;
  onDoubleClick?: (event: React.MouseEvent<T>) => void;
  onMouseEnter?: (event: React.MouseEvent<T>) => void;
  onMouseLeave?: (event: React.MouseEvent<T>) => void;
  onFocus?: (event: React.FocusEvent<T>) => void;
  onBlur?: (event: React.FocusEvent<T>) => void;
  onKeyDown?: (event: React.KeyboardEvent<T>) => void;
  onKeyUp?: (event: React.KeyboardEvent<T>) => void;
}

// Type pour les interactions drag and drop
export interface DragDropHandlers {
  onDragStart?: (event: React.DragEvent) => void;
  onDragOver?: (event: React.DragEvent) => void;
  onDragLeave?: (event: React.DragEvent) => void;
  onDrop?: (event: React.DragEvent) => void;
  onDragEnd?: (event: React.DragEvent) => void;
}

// ==============================================
// TYPES POUR LES DONNÉES MÉTIER SPÉCIFIQUES
// ==============================================

// Type pour les sessions d'apprentissage
export interface LearningSession {
  id: string;
  userId: string;
  moduleId: string;
  startTime: string;
  endTime?: string;
  duration?: number; // en secondes
  lecturesViewed: string[]; // IDs des lectures vues
  progress: number; // 0-100
  completed: boolean;
}

// Type pour les achievements/badges
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'progress' | 'score' | 'streak' | 'completion' | 'participation';
  criteria: {
    target: number;
    metric: string; // 'modules_completed', 'average_score', etc.
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedBy?: string[]; // IDs des utilisateurs qui l'ont débloqué
}

// Type pour les classements
export interface Leaderboard {
  id: string;
  name: string;
  type: 'global' | 'class' | 'module';
  period: 'daily' | 'weekly' | 'monthly' | 'all-time';
  entries: LeaderboardEntry[];
  lastUpdated: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  score: number;
  change: number; // changement de position
  badge?: string;
}

// ==============================================
// TYPES UTILITAIRES GÉNÉRIQUES
// ==============================================

// Rend toutes les propriétés optionnelles
export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

// Type pour les entités sans ID (pour la création)
export type CreateEntity<T extends BaseModel> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

// Type pour les entités de mise à jour (ID requis, autres propriétés optionnelles)
export type UpdateEntity<T extends BaseModel> = { 
  id: string 
} & Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;

// Type pour extraire les clés d'un type qui sont des strings
export type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

// Type pour extraire les clés d'un type qui sont des nombres
export type NumberKeys<T> = {
  [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];

// Type pour les réponses async
export type AsyncResponse<T> = {
  data?: T;
  error?: string;
  loading: boolean;
};

// Type pour les actions Redux-like
export interface Action<T = any> {
  type: string;
  payload?: T;
  meta?: any;
  error?: boolean;
}

// ==============================================
// TYPES POUR LA CONFIGURATION
// ==============================================

// Configuration de l'application
export interface AppConfig {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
  features: {
    enableAnalytics: boolean;
    enableNotifications: boolean;
    enableOfflineMode: boolean;
    enableDarkMode: boolean;
  };
  limits: {
    maxFileSize: number;
    maxFilesPerUpload: number;
    sessionTimeout: number;
  };
}

// Configuration des thèmes
export interface ThemeConfig {
  name: string;
  colors: {
    primary: Record<string, string>;
    secondary: Record<string, string>;
    success: Record<string, string>;
    warning: Record<string, string>;
    danger: Record<string, string>;
    info: Record<string, string>;
    gray: Record<string, string>;
  };
  fonts: {
    sans: string[];
    serif: string[];
    mono: string[];
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
}

// ==============================================
// EXPORTS DE TOUS LES TYPES
// ==============================================

// Réexporter tous les types des autres modules
export * from './api';
export * from './components';
export * from './forms';
export * from './database';