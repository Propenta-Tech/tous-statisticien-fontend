// src/lib/validations/api.ts
/**
 * Validation API - Tous Statisticien Academy
 * Schémas de validation pour les requêtes et réponses API
 */

import { z } from 'zod';
import { 
  uuidSchema, 
  emailSchema, 
  passwordSchema, 
  nameSchema, 
  phoneSchema, 
  countrySchema,
  titleSchema,
  descriptionSchema,
  dateStringSchema,
  paginationSchema
} from './index';

// ==============================================
// SCHÉMAS POUR LES RÉPONSES API
// ==============================================

// Réponse API générique
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
  timestamp: z.string().datetime().optional(),
});

// Réponse d'erreur API
export const apiErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  status: z.number().int().min(400).max(599),
  details: z.record(z.any()).optional(),
  timestamp: z.string().datetime(),
  path: z.string().optional(),
});

// Réponse paginée
export const paginatedResponseSchema = z.object({
  content: z.array(z.any()),
  totalElements: z.number().int().min(0),
  totalPages: z.number().int().min(0),
  size: z.number().int().min(1),
  number: z.number().int().min(0),
  first: z.boolean(),
  last: z.boolean(),
  empty: z.boolean(),
  numberOfElements: z.number().int().min(0),
});

// ==============================================
// SCHÉMAS POUR L'AUTHENTIFICATION API
// ==============================================

// Requête de connexion
export const loginRequestSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Mot de passe requis'),
});

// Réponse de connexion
export const loginResponseSchema = z.object({
  token: z.string().min(1),
  type: z.string().default('Bearer'),
  id: uuidSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  role: z.enum(['ADMIN', 'STUDENT', 'FORMATEUR']),
});

// Requête d'inscription Phase 1
export const registerPhase1RequestSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  country: countrySchema,
});

// Réponse d'inscription Phase 1
export const startRegistrationResponseSchema = z.object({
  message: z.string(),
  verificationToken: z.string(),
});

// Requête de vérification de code
export const verifyCodeRequestSchema = z.object({
  verificationToken: z.string().min(1),
  code: z.string().length(6).regex(/^\d{6}$/),
});

// Requête de finalisation d'inscription
export const completeRegistrationRequestSchema = z.object({
  verificationToken: z.string().min(1),
  password: passwordSchema,
});

// Requête de mot de passe oublié
export const forgotPasswordRequestSchema = z.object({
  email: emailSchema,
});

// Requête de réinitialisation de mot de passe
export const resetPasswordRequestSchema = z.object({
  token: z.string().min(1),
  newPassword: passwordSchema,
});

// ==============================================
// SCHÉMAS POUR LES ENTITÉS API
// ==============================================

// Person API
export const personApiSchema = z.object({
  id: uuidSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  role: z.enum(['ADMIN', 'STUDENT', 'FORMATEUR']),
  hasPaid: z.boolean(),
  phone: phoneSchema,
  country: countrySchema,
  lastLogin: dateStringSchema.optional(),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
});

export const createPersonRequestSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(['ADMIN', 'STUDENT', 'FORMATEUR']),
  phone: phoneSchema,
  country: countrySchema,
});

export const updatePersonRequestSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  email: emailSchema.optional(),
  phone: phoneSchema,
  country: countrySchema.optional(),
  role: z.enum(['ADMIN', 'STUDENT', 'FORMATEUR']).optional(),
});

// VirtualClass API
export const virtualClassApiSchema = z.object({
  id: uuidSchema,
  name: titleSchema,
  level: z.string(),
  description: descriptionSchema.default(''),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
  createdBy: personApiSchema.optional(),
  modulesCount: z.number().int().min(0).optional(),
  studentsCount: z.number().int().min(0).optional(),
});

export const createVirtualClassRequestSchema = z.object({
  name: titleSchema,
  level: z.string().min(1, 'Niveau requis'),
  description: descriptionSchema.default(''),
});

export const updateVirtualClassRequestSchema = z.object({
  name: titleSchema.optional(),
  level: z.string().optional(),
  description: descriptionSchema.optional(),
});

// Module API
export const moduleApiSchema = z.object({
  id: uuidSchema,
  title: titleSchema,
  order: z.number().int().min(1),
  virtualClassId: uuidSchema,
  virtualClass: virtualClassApiSchema.optional(),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
  createdBy: personApiSchema.optional(),
  lecturesCount: z.number().int().min(0).optional(),
  evaluationsCount: z.number().int().min(0).optional(),
});

export const moduleRequestSchema = z.object({
  title: titleSchema,
  order: z.number().int().min(1),
  virtualClassId: uuidSchema,
});

// Lecture API
export const lectureApiSchema = z.object({
  id: uuidSchema,
  title: titleSchema,
  type: z.enum(['VIDEO', 'PDF', 'AUDIO', 'DOCUMENT', 'PRESENTATION', 'TEXT', 'QUIZ', 'INTERACTIVE']),
  url: z.string().url(),
  moduleId: uuidSchema,
  module: moduleApiSchema.optional(),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
  createdBy: personApiSchema.optional(),
  duration: z.number().int().min(0).optional(),
  size: z.number().int().min(0).optional(),
  completed: z.boolean().optional(),
});

export const lectureRequestSchema = z.object({
  title: titleSchema,
  type: z.enum(['VIDEO', 'PDF', 'AUDIO', 'DOCUMENT', 'PRESENTATION', 'TEXT', 'QUIZ', 'INTERACTIVE']),
  moduleId: uuidSchema,
});

// Evaluation API
export const evaluationApiSchema = z.object({
  id: uuidSchema,
  title: titleSchema,
  type: z.enum(['QUIZ', 'EXAM', 'ASSIGNMENT', 'PROJECT', 'PRESENTATION', 'SURVEY']),
  moduleId: uuidSchema,
  module: moduleApiSchema.optional(),
  startDate: dateStringSchema,
  endDate: dateStringSchema,
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
  createdBy: personApiSchema.optional(),
  submissionsCount: z.number().int().min(0).optional(),
  maxScore: z.number().min(0).optional(),
  averageScore: z.number().min(0).optional(),
  status: z.enum(['upcoming', 'active', 'ended']).optional(),
});

export const evaluationRequestSchema = z.object({
  title: titleSchema,
  type: z.enum(['QUIZ', 'EXAM', 'ASSIGNMENT', 'PROJECT', 'PRESENTATION', 'SURVEY']),
  moduleId: uuidSchema,
  startDate: dateStringSchema,
  endDate: dateStringSchema,
}).refine(
  (data) => new Date(data.startDate) < new Date(data.endDate),
  'La date de fin doit être après la date de début'
);

// Submission API
export const submissionApiSchema = z.object({
  id: uuidSchema,
  fileUrl: z.string().url(),
  grade: z.number().min(0).max(20),
  feedback: z.string().optional(),
  evaluationId: uuidSchema,
  evaluation: evaluationApiSchema.optional(),
  personId: uuidSchema,
  person: personApiSchema.optional(),
  updatedById: uuidSchema.optional(),
  updatedBy: personApiSchema.optional(),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
  submitted: z.boolean().optional(),
  graded: z.boolean().optional(),
});

export const submissionRequestSchema = z.object({
  evaluationId: uuidSchema,
  files: z.array(z.string()).max(5, 'Maximum 5 fichiers'),
});

export const gradeSubmissionRequestSchema = z.object({
  grade: z.number().min(0).max(20),
  feedback: z.string().max(1000).optional(),
});

// Payment API
export const paymentApiSchema = z.object({
  id: uuidSchema,
  amount: z.number().positive(),
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED']),
  personId: uuidSchema,
  person: personApiSchema.optional(),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
  transactionId: z.string().optional(),
  reference: z.string().optional(),
  phoneNumber: z.string().optional(),
  paymentMethod: z.enum(['orange_money', 'mtn_mobile_money']).optional(),
});

export const paymentRequestSchema = z.object({
  amount: z.number().positive(),
  personId: uuidSchema,
  phoneNumber: z.string().regex(/^[679]\d{8}$/),
  paymentMethod: z.enum(['orange_money', 'mtn_mobile_money']),
});

// Resource API
export const resourceApiSchema = z.object({
  id: uuidSchema,
  title: titleSchema,
  type: z.enum(['PDF', 'VIDEO', 'AUDIO', 'IMAGE', 'DOCUMENT', 'ARCHIVE', 'LINK', 'OTHER']),
  fileUrl: z.string().url(),
  description: descriptionSchema,
  isPublic: z.boolean(),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
  createdBy: personApiSchema.optional(),
  fileName: z.string().optional(),
  fileSize: z.number().int().min(0).optional(),
  mimeType: z.string().optional(),
  link: z.string().url(),
});

export const resourceRequestSchema = z.object({
  title: titleSchema,
  type: z.enum(['PDF', 'VIDEO', 'AUDIO', 'IMAGE', 'DOCUMENT', 'ARCHIVE', 'LINK', 'OTHER']),
  description: descriptionSchema,
});

// ==============================================
// SCHÉMAS POUR LES STATISTIQUES API
// ==============================================

export const userStatisticApiSchema = z.object({
  id: uuidSchema,
  progression: z.number().min(0).max(100),
  averageGrade: z.number().min(0).max(20),
  personId: uuidSchema,
  person: personApiSchema.optional(),
  moduleId: uuidSchema,
  module: moduleApiSchema.optional(),
});

export const dashboardStatsSchema = z.object({
  totalUsers: z.number().int().min(0),
  totalClasses: z.number().int().min(0),
  totalModules: z.number().int().min(0),
  totalEvaluations: z.number().int().min(0),
  totalRevenue: z.number().min(0),
  recentActivity: z.array(z.object({
    id: uuidSchema,
    type: z.string(),
    message: z.string(),
    timestamp: dateStringSchema,
    userId: uuidSchema.optional(),
    userName: z.string().optional(),
    avatar: z.string().optional(),
  })),
  userGrowth: z.array(z.object({
    date: z.string(),
    users: z.number().int().min(0),
    classes: z.number().int().min(0),
    revenue: z.number().min(0),
    submissions: z.number().int().min(0),
  })),
});

// ==============================================
// SCHÉMAS POUR LES FILTRES ET RECHERCHES API
// ==============================================

export const personFiltersApiSchema = z.object({
  search: z.string().max(100).optional(),
  role: z.enum(['ADMIN', 'STUDENT', 'FORMATEUR']).optional(),
  hasPaid: z.boolean().optional(),
  country: countrySchema.optional(),
  dateFrom: dateStringSchema.optional(),
  dateTo: dateStringSchema.optional(),
  page: z.number().int().min(1).default(1),
  size: z.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['firstName', 'lastName', 'email', 'createdAt', 'lastLogin']).default('createdAt'),
  sortDirection: z.enum(['asc', 'desc']).default('desc'),
});

export const classFiltersApiSchema = z.object({
  search: z.string().max(100).optional(),
  level: z.string().optional(),
  createdBy: uuidSchema.optional(),
  page: z.number().int().min(1).default(1),
  size: z.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['name', 'level', 'createdAt']).default('createdAt'),
  sortDirection: z.enum(['asc', 'desc']).default('desc'),
});

export const lectureFiltersApiSchema = z.object({
  search: z.string().max(100).optional(),
  moduleId: uuidSchema.optional(),
  type: z.enum(['VIDEO', 'PDF', 'AUDIO', 'DOCUMENT', 'PRESENTATION', 'TEXT', 'QUIZ', 'INTERACTIVE']).optional(),
  page: z.number().int().min(1).default(1),
  size: z.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['title', 'createdAt']).default('createdAt'),
  sortDirection: z.enum(['asc', 'desc']).default('desc'),
});

export const evaluationFiltersApiSchema = z.object({
  search: z.string().max(100).optional(),
  moduleId: uuidSchema.optional(),
  type: z.enum(['QUIZ', 'EXAM', 'ASSIGNMENT', 'PROJECT', 'PRESENTATION', 'SURVEY']).optional(),
  status: z.enum(['upcoming', 'active', 'ended']).optional(),
  startDateAfter: dateStringSchema.optional(),
  endDateBefore: dateStringSchema.optional(),
  page: z.number().int().min(1).default(1),
  size: z.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['title', 'startDate', 'endDate', 'createdAt']).default('startDate'),
  sortDirection: z.enum(['asc', 'desc']).default('asc'),
});

export const paymentFiltersApiSchema = z.object({
  personId: uuidSchema.optional(),
  status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED']).optional(),
  amountMin: z.number().positive().optional(),
  amountMax: z.number().positive().optional(),
  dateFrom: dateStringSchema.optional(),
  dateTo: dateStringSchema.optional(),
  page: z.number().int().min(1).default(1),
  size: z.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['amount', 'createdAt', 'status']).default('createdAt'),
  sortDirection: z.enum(['asc', 'desc']).default('desc'),
});

// ==============================================
// SCHÉMAS POUR FREEMOPAY API
// ==============================================

export const freemopayInitRequestSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3).default('XAF'),
  phoneNumber: z.string().regex(/^[679]\d{8}$/),
  operator: z.enum(['ORANGE', 'MTN']),
  description: z.string().min(1).max(255),
  customerName: z.string().optional(),
  customerEmail: emailSchema.optional(),
  notificationUrl: z.string().url().optional(),
  returnUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
  customData: z.record(z.any()).optional(),
});

export const freemopayInitResponseSchema = z.object({
  success: z.boolean(),
  reference: z.string(),
  transactionId: z.string(),
  status: z.enum(['PENDING', 'PROCESSING']),
  message: z.string(),
  paymentUrl: z.string().url().optional(),
  expiresAt: dateStringSchema,
});

export const freemopayStatusResponseSchema = z.object({
  success: z.boolean(),
  reference: z.string(),
  transactionId: z.string(),
  status: z.enum(['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'EXPIRED', 'CANCELLED']),
  amount: z.number().positive(),
  currency: z.string(),
  operator: z.string(),
  phoneNumber: z.string(),
  customerName: z.string().optional(),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
  completedAt: dateStringSchema.optional(),
  failureReason: z.string().optional(),
  operatorTransactionId: z.string().optional(),
});

// ==============================================
// SCHÉMAS POUR LES UPLOADS API
// ==============================================

export const uploadRequestSchema = z.object({
  category: z.enum(['avatar', 'lecture', 'resource', 'evaluation', 'other']).default('other'),
  compress: z.boolean().default(false),
  generateThumbnail: z.boolean().default(false),
});

export const uploadResponseSchema = z.object({
  id: uuidSchema,
  filename: z.string(),
  originalName: z.string(),
  url: z.string().url(),
  size: z.number().int().min(0),
  mimeType: z.string(),
  thumbnailUrl: z.string().url().optional(),
  metadata: z.object({
    width: z.number().int().optional(),
    height: z.number().int().optional(),
    duration: z.number().optional(),
    fps: z.number().optional(),
  }).optional(),
  uploadedAt: dateStringSchema,
});

// ==============================================
// UTILITAIRES DE VALIDATION API
// ==============================================

/**
 * Valide les paramètres de requête HTTP
 */
export function validateQueryParams<T>(
  schema: z.ZodSchema<T>,
  params: URLSearchParams | Record<string, string>
): { success: boolean; data?: T; errors?: string[] } {
  try {
    let data: Record<string, any> = {};
    
    if (params instanceof URLSearchParams) {
      for (const [key, value] of params.entries()) {
        // Conversion automatique des types
        if (value === 'true') data[key] = true;
        else if (value === 'false') data[key] = false;
        else if (!isNaN(Number(value)) && value !== '') data[key] = Number(value);
        else data[key] = value;
      }
    } else {
      data = params;
    }
    
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return { success: false, errors: ['Erreur de validation des paramètres'] };
  }
}

/**
 * Valide le body d'une requête API
 */
export function validateRequestBody<T>(
  schema: z.ZodSchema<T>,
  body: unknown
): { success: boolean; data?: T; errors?: Record<string, string> } {
  try {
    const result = schema.parse(body);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formErrors: Record<string, string> = {};
      error.errors.forEach(err => {
        const path = err.path.join('.');
        formErrors[path] = err.message;
      });
      return { success: false, errors: formErrors };
    }
    return { success: false, errors: { general: 'Erreur de validation du body' } };
  }
}

/**
 * Valide une réponse API
 */
export function validateApiResponse<T>(
  schema: z.ZodSchema<T>,
  response: unknown
): { success: boolean; data?: T; error?: string } {
  try {
    const result = schema.parse(response);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: `Réponse API invalide: ${error.errors.map(e => e.message).join(', ')}`
      };
    }
    return { success: false, error: 'Format de réponse API invalide' };
  }
}

/**
 * Crée un middleware de validation pour les routes API
 */
export function createApiValidator<T>(schema: z.ZodSchema<T>) {
  return (data: unknown) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      throw new Error(`Validation failed: ${result.error.errors.map(e => e.message).join(', ')}`);
    }
    return result.data;
  };
}

// ==============================================
// EXPORTS GROUPÉS PAR FONCTIONNALITÉ
// ==============================================

// Schémas d'authentification API
export const authApiSchemas = {
  loginRequest: loginRequestSchema,
  loginResponse: loginResponseSchema,
  registerPhase1Request: registerPhase1RequestSchema,
  startRegistrationResponse: startRegistrationResponseSchema,
  verifyCodeRequest: verifyCodeRequestSchema,
  completeRegistrationRequest: completeRegistrationRequestSchema,
  forgotPasswordRequest: forgotPasswordRequestSchema,
  resetPasswordRequest: resetPasswordRequestSchema,
};

// Schémas d'entités API
export const entityApiSchemas = {
  person: personApiSchema,
  virtualClass: virtualClassApiSchema,
  module: moduleApiSchema,
  lecture: lectureApiSchema,
  evaluation: evaluationApiSchema,
  submission: submissionApiSchema,
  payment: paymentApiSchema,
  resource: resourceApiSchema,
  userStatistic: userStatisticApiSchema,
};

// Schémas de requêtes d'entités
export const entityRequestSchemas = {
  createPerson: createPersonRequestSchema,
  updatePerson: updatePersonRequestSchema,
  createVirtualClass: createVirtualClassRequestSchema,
  updateVirtualClass: updateVirtualClassRequestSchema,
  module: moduleRequestSchema,
  lecture: lectureRequestSchema,
  evaluation: evaluationRequestSchema,
  submission: submissionRequestSchema,
  gradeSubmission: gradeSubmissionRequestSchema,
  payment: paymentRequestSchema,
  resource: resourceRequestSchema,
};

// Schémas de filtres API
export const filterApiSchemas = {
  persons: personFiltersApiSchema,
  classes: classFiltersApiSchema,
  lectures: lectureFiltersApiSchema,
  evaluations: evaluationFiltersApiSchema,
  payments: paymentFiltersApiSchema,
};

// Schémas Freemopay
export const freemopayApiSchemas = {
  initRequest: freemopayInitRequestSchema,
  initResponse: freemopayInitResponseSchema,
  statusResponse: freemopayStatusResponseSchema,
};

// Schémas d'upload
export const uploadApiSchemas = {
  request: uploadRequestSchema,
  response: uploadResponseSchema,
};

// Types TypeScript inférés
export type ApiResponse<T = any> = z.infer<typeof apiResponseSchema> & { data?: T };
export type ApiError = z.infer<typeof apiErrorSchema>;
export type PaginatedResponse<T = any> = z.infer<typeof paginatedResponseSchema> & { content: T[] };

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type RegisterPhase1Request = z.infer<typeof registerPhase1RequestSchema>;
export type PersonApi = z.infer<typeof personApiSchema>;
export type VirtualClassApi = z.infer<typeof virtualClassApiSchema>;
export type ModuleApi = z.infer<typeof moduleApiSchema>;
export type LectureApi = z.infer<typeof lectureApiSchema>;
export type EvaluationApi = z.infer<typeof evaluationApiSchema>;
export type SubmissionApi = z.infer<typeof submissionApiSchema>;
export type PaymentApi = z.infer<typeof paymentApiSchema>;
export type ResourceApi = z.infer<typeof resourceApiSchema>;
export type PersonFiltersApi = z.infer<typeof personFiltersApiSchema>;
export type FreemopayInitRequest = z.infer<typeof freemopayInitRequestSchema>;
export type FreemopayStatusResponse = z.infer<typeof freemopayStatusResponseSchema>;
export type UploadResponse = z.infer<typeof uploadResponseSchema>;