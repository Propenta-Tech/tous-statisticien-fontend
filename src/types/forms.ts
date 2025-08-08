// ==============================================
// TYPES FORMULAIRES - TOUS STATISTICIEN ACADEMY
// ==============================================
// Types pour la validation et gestion des formulaires

import { Role, LectureType, EvaluationType, ResourceType, PaymentStatus } from './index';

// ==============================================
// TYPES DE BASE POUR LES FORMULAIRES
// ==============================================

export interface FormField<T = any> {
  value: T;
  error?: string;
  touched?: boolean;
  dirty?: boolean;
  valid?: boolean;
}

export interface FormState<T extends Record<string, any>> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  dirty: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  submitCount: number;
}

export interface FormConfig<T> {
  initialValues: T;
  validationSchema?: ValidationSchema<T>;
  onSubmit: (values: T) => void | Promise<void>;
  onValidate?: (values: T) => Partial<Record<keyof T, string>>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
}

export interface ValidationRule<T = any> {
  required?: boolean | string;
  minLength?: number | string;
  maxLength?: number | string;
  min?: number | string;
  max?: number | string;
  pattern?: RegExp | string;
  email?: boolean | string;
  url?: boolean | string;
  phone?: boolean | string;
  custom?: (value: T) => string | undefined;
}

export type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule<T[K]>;
};

// ==============================================
// FORMULAIRES D'AUTHENTIFICATION
// ==============================================

// Formulaire de connexion
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

// Formulaire d'inscription - Étape 1
export interface RegisterStep1FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
}

export interface RegisterStep1FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  country?: string;
}

// Formulaire d'inscription - Étape 2
export interface RegisterStep2FormData {
  code: string;
}

export interface RegisterStep2FormErrors {
  code?: string;
}

// Formulaire d'inscription - Étape 3
export interface RegisterStep3FormData {
  password: string;
  confirmPassword: string;
}

export interface RegisterStep3FormErrors {
  password?: string;
  confirmPassword?: string;
}

// Formulaire de mot de passe oublié
export interface ForgotPasswordFormData {
  email: string;
}

export interface ForgotPasswordFormErrors {
  email?: string;
}

// Formulaire de réinitialisation de mot de passe
export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordFormErrors {
  password?: string;
  confirmPassword?: string;
}

// ==============================================
// FORMULAIRES DE GESTION DES ENTITÉS
// ==============================================

// Formulaire de création/modification de classe virtuelle
export interface VirtualClassFormData {
  name: string;
  level: string;
  description: string;
}

export interface VirtualClassFormErrors {
  name?: string;
  level?: string;
  description?: string;
}

// Formulaire de création/modification de module
export interface ModuleFormData {
  title: string;
  order: number;
  virtualClassId: string;
}

export interface ModuleFormErrors {
  title?: string;
  order?: string;
  virtualClassId?: string;
}

// Formulaire de création/modification de lecture
export interface LectureFormData {
  title: string;
  type: LectureType;
  moduleId: string;
  file?: File | null;
}

export interface LectureFormErrors {
  title?: string;
  type?: string;
  moduleId?: string;
  file?: string;
}

// Formulaire de création/modification d'évaluation
export interface EvaluationFormData {
  title: string;
  type: EvaluationType;
  startDate: string;
  endDate: string;
  moduleId: string;
}

export interface EvaluationFormErrors {
  title?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  moduleId?: string;
}

// Formulaire de soumission d'évaluation
export interface SubmissionFormData {
  evaluationId: string;
  files: File[];
  notes?: string;
}

export interface SubmissionFormErrors {
  evaluationId?: string;
  files?: string;
  notes?: string;
}

// Formulaire de notation
export interface GradingFormData {
  grade: number;
  feedback: string;
}

export interface GradingFormErrors {
  grade?: string;
  feedback?: string;
}

// Formulaire de création/modification de ressource
export interface ResourceFormData {
  title: string;
  type: ResourceType;
  description: string;
  file?: File | null;
}

export interface ResourceFormErrors {
  title?: string;
  type?: string;
  description?: string;
  file?: string;
}

// ==============================================
// FORMULAIRES DE GESTION UTILISATEUR
// ==============================================

// Formulaire de création d'utilisateur (admin)
export interface CreateUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  phone?: string;
  country?: string;
  password: string;
  confirmPassword: string;
}

export interface CreateUserFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  phone?: string;
  country?: string;
  password?: string;
  confirmPassword?: string;
}

// Formulaire de modification de profil
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
}

export interface ProfileFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  country?: string;
}

// Formulaire de changement de mot de passe
export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordFormErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// ==============================================
// FORMULAIRES DE PAIEMENT
// ==============================================

// Formulaire de paiement
export interface PaymentFormData {
  amount: number;
  phoneNumber: string;
  paymentMethod: 'orange_money' | 'mtn_mobile_money';
  acceptTerms: boolean;
}

export interface PaymentFormErrors {
  amount?: string;
  phoneNumber?: string;
  paymentMethod?: string;
  acceptTerms?: string;
}

// ==============================================
// FORMULAIRES DE RECHERCHE ET FILTRES
// ==============================================

// Formulaire de recherche utilisateurs
export interface UserSearchFormData {
  search: string;
  role?: Role;
  hasPaid?: boolean;
  country?: string;
  sortBy: 'firstName' | 'lastName' | 'email' | 'createdAt' | 'lastLogin';
  sortOrder: 'asc' | 'desc';
}

// Formulaire de recherche classes
export interface ClassSearchFormData {
  search: string;
  level?: string;
  sortBy: 'name' | 'level' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

// Formulaire de recherche évaluations
export interface EvaluationSearchFormData {
  search: string;
  type?: EvaluationType;
  status?: 'upcoming' | 'active' | 'ended';
  moduleId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy: 'title' | 'startDate' | 'endDate' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

// ==============================================
// FORMULAIRES DE CONTACT ET SUPPORT
// ==============================================

// Formulaire de contact
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  category: 'general' | 'technical' | 'billing' | 'course';
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  category?: string;
}

// Formulaire de feedback
export interface FeedbackFormData {
  rating: number;
  title: string;
  message: string;
  category: 'course' | 'platform' | 'instructor' | 'technical';
  anonymous: boolean;
}

export interface FeedbackFormErrors {
  rating?: string;
  title?: string;
  message?: string;
  category?: string;
}

// ==============================================
// TYPES POUR LA VALIDATION
// ==============================================

// Messages d'erreur de validation
export interface ValidationMessages {
  required: string;
  email: string;
  minLength: string;
  maxLength: string;
  min: string;
  max: string;
  pattern: string;
  phone: string;
  url: string;
  passwordMismatch: string;
  passwordWeak: string;
  fileSize: string;
  fileType: string;
  dateInvalid: string;
  dateRange: string;
}

// Configuration de validation par champ
export interface FieldValidationConfig {
  email: {
    pattern: RegExp;
    message: string;
  };
  phone: {
    pattern: RegExp;
    message: string;
  };
  password: {
    minLength: number;
    pattern: RegExp;
    message: string;
  };
  name: {
    minLength: number;
    maxLength: number;
    pattern: RegExp;
    message: string;
  };
  file: {
    maxSize: number; // en bytes
    allowedTypes: string[];
    message: string;
  };
}

// ==============================================
// TYPES POUR LES COMPOSANTS DE FORMULAIRE
// ==============================================

// Props pour FormProvider
export interface FormProviderProps<T> {
  children: React.ReactNode;
  config: FormConfig<T>;
}

// Props pour Field component
export interface FieldProps {
  name: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file' | 'date';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ value: any; label: string }>;
  validate?: ValidationRule;
  hint?: string;
  [key: string]: any;
}

// Props pour ErrorMessage component
export interface ErrorMessageProps {
  name: string;
  className?: string;
}

// Props pour FieldArray component
export interface FieldArrayProps {
  name: string;
  children: (helpers: FieldArrayHelpers) => React.ReactNode;
}

export interface FieldArrayHelpers {
  push: (value: any) => void;
  pop: () => any;
  remove: (index: number) => void;
  insert: (index: number, value: any) => void;
  move: (from: number, to: number) => void;
  swap: (indexA: number, indexB: number) => void;
  replace: (index: number, value: any) => void;
}

// ==============================================
// HOOKS POUR LES FORMULAIRES
// ==============================================

export interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  dirty: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  submitCount: number;
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  setFieldTouched: (field: keyof T, touched?: boolean) => void;
  validateField: (field: keyof T) => Promise<string | undefined>;
  validateForm: () => Promise<Partial<Record<keyof T, string>>>;
  resetForm: (values?: Partial<T>) => void;
  submitForm: () => Promise<void>;
  handleChange: (field: keyof T) => (value: any) => void;
  handleBlur: (field: keyof T) => () => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export interface UseFieldReturn {
  value: any;
  error?: string;
  touched: boolean;
  dirty: boolean;
  setValue: (value: any) => void;
  setError: (error: string) => void;
  setTouched: (touched?: boolean) => void;
  validate: () => Promise<string | undefined>;
  handleChange: (value: any) => void;
  handleBlur: () => void;
}

// ==============================================
// CONSTANTES POUR LA VALIDATION
// ==============================================

export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^(\+237|237)?\s?[679]\d{8}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  NAME: /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/,
} as const;

export const VALIDATION_LIMITS = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PASSWORD_MIN_LENGTH: 8,
  PHONE_LENGTH: 9,
  FILE_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  MESSAGE_MAX_LENGTH: 1000,
  DESCRIPTION_MAX_LENGTH: 500,
  TITLE_MAX_LENGTH: 100,
} as const;

export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  VIDEOS: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'],
  AUDIO: ['audio/mp3', 'audio/wav', 'audio/ogg'],
  ARCHIVES: ['application/zip', 'application/rar', 'application/7z'],
} as const;