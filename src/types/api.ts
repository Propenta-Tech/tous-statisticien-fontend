export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// Réponse de démarrage d'inscription
export interface StartRegistrationResponse {
  message: string;
  verificationToken: string;
}// ==============================================
// TYPES API - TOUS STATISTICIEN ACADEMY
// ==============================================
// Types pour les requêtes et réponses API basés sur les controllers Java

import {
  Person,
  VirtualClass,
  Module,
  Lecture,
  Evaluation,
  Submission,
  Payment,
  Resource,
  Role,
  PaymentStatus,
  LectureType,
  EvaluationType,
  ResourceType
} from './index';

// ==============================================
// TYPES DE RÉPONSES COMMUNES
// ==============================================

export interface SuccessResponse {
  message: string;
}

export interface ErrorResponse {
  message: string;
  code?: string;
  details?: any;
}

export interface JwtResponse {
  token: string;
  type: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

// ==============================================
// TYPES D'AUTHENTIFICATION (AuthController)
// ==============================================

export interface RegisterPhase1Request {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country: string;
}

export interface VerifyCodeRequest {
  verificationToken: string;
  code: string;
}

export interface CompleteRegistrationRequest {
  verificationToken: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// Réponse de démarrage d'inscription
export interface StartRegistrationResponse {
  message: string;
  verificationToken: string;
}

// ==============================================
// TYPES POUR LES CLASSES VIRTUELLES (VirtualClassController)
// ==============================================

export interface CreateVirtualClassRequest {
  name: string;
  level: string;
  description: string;
}

export interface UpdateVirtualClassRequest {
  name: string;
  level: string;
  description: string;
}

// ==============================================
// TYPES POUR LES MODULES (ModuleController)
// ==============================================

export interface ModuleRequest {
  title: string;
  order: number;
  virtualClassId: string;
}

// ==============================================
// TYPES POUR LES LECTURES (LectureController)
// ==============================================

export interface LectureRequest {
  title: string;
  type: LectureType;
  moduleId: string;
}

// Requête pour créer une lecture avec fichier (multipart/form-data)
export interface CreateLectureWithFileData {
  title: string;
  type: string; // Sera converti en LectureType
  moduleId: string;
  file: File;
}

// ==============================================
// TYPES POUR LES ÉVALUATIONS (EvaluationController - implicite)
// ==============================================

export interface EvaluationRequest {
  title: string;
  type: EvaluationType;
  startDate: string;
  endDate: string;
  moduleId: string;
}

// ==============================================
// TYPES POUR LES SOUMISSIONS (SubmissionController - implicite)
// ==============================================

export interface SubmissionRequest {
  evaluationId: string;
  files: File[];
}

export interface GradeSubmissionRequest {
  grade: number;
  feedback?: string;
}

// ==============================================
// TYPES POUR LES PAIEMENTS (PaymentController)
// ==============================================

export interface PaymentRequest {
  amount: number;
  personId: string;
  // Autres champs pour Freemopay
  phoneNumber?: string;
  paymentMethod?: 'orange_money' | 'mtn_mobile_money';
}

// ==============================================
// TYPES POUR LES PERSONNES (PersonController)
// ==============================================

export interface CreatePersonRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  country?: string;
}

// ==============================================
// TYPES POUR LES RESSOURCES (ResourceController)
// ==============================================

export interface ResourceRequest {
  title: string;
  type: ResourceType;
  description?: string;
}

// Requête pour créer une ressource avec fichier
export interface CreateResourceWithFileData {
  title: string;
  type: string; // Sera converti en ResourceType
  description: string;
  file: File;
}

// ==============================================
// TYPES DE RÉPONSES API GÉNÉRIQUES
// ==============================================

/**
 * Réponse générique de l'API
 */
export interface ApiResponse<T = unknown> {
  data?: T;
  success: boolean;
  message?: string;
  statusCode?: number;
}

/**
 * Erreur API
 */
export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, unknown>;
}

/**
 * Réponse paginée
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  success: boolean;
  message?: string;
}

/**
 * Paramètres de pagination
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Filtres de recherche génériques
 */
export interface SearchFilters {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Options de requête
 */
export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
}

/**
 * Réponse de validation
 */
export interface ValidationResponse {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * Métadonnées de fichier
 */
export interface FileMetadata {
  filename: string;
  size: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
}


// Type User pour l'authentification
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  hasPaid: boolean;
  phone?: string;
  country?: string;
}

// Types pour l'authentification
export interface LoginResponse {
  token: string;
  type: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

// Types pour les évaluations
export interface CreateEvaluationRequest {
  title: string;
  type: EvaluationType;
  startDate: string;
  endDate: string;
  moduleId: string;
}

export interface UpdateEvaluationRequest {
  title: string;
  type: EvaluationType;
  startDate: string;
  endDate: string;
  moduleId: string;
}

// Types pour les modules
export interface CreateModuleRequest {
  title: string;
  order: number;
  virtualClassId: string;
}

export interface UpdateModuleRequest {
  title: string;
  order: number;
  virtualClassId: string;
}

// Types pour les lectures
export interface CreateLectureRequest {
  title: string;
  type: LectureType;
  moduleId: string;
  description?: string;
}

export interface UpdateLectureRequest {
  title: string;
  type: LectureType;
  moduleId: string;
  description?: string;
}

// Types pour les soumissions
export interface CreateSubmissionRequest {
  evaluationId: string;
  personId: string;
  textResponse?: string;
}

export interface UpdateSubmissionRequest {
  textResponse?: string;
}

// Types pour les paiements
export interface CreatePaymentRequest {
  amount: number;
  personId: string;
  phoneNumber?: string;
  paymentMethod?: 'orange_money' | 'mtn_mobile_money';
}

export interface UpdatePaymentRequest {
  amount?: number;
  status?: PaymentStatus;
}

// Types pour les personnes
export interface UpdatePersonRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  country?: string;
  role?: Role;
}

// Types pour les ressources
export interface CreateResourceRequest {
  title: string;
  type: ResourceType;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
}

export interface UpdateResourceRequest {
  title: string;
  type: ResourceType;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
}