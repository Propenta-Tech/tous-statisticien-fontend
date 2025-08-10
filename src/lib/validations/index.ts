/**
 * Schémas de validation principaux - Tous Statisticien Academy
 * Utilise Zod pour la validation TypeScript-first
 */

import { z } from 'zod';
import { Role, LectureType, EvaluationType, ResourceType, PaymentStatus } from '@/types';

// ==============================================
// SCHÉMAS DE BASE
// ==============================================

// Schéma pour UUID
export const uuidSchema = z.string().uuid('ID invalide');

// Schéma pour email
export const emailSchema = z
  .string()
  .min(1, 'Email requis')
  .email('Format email invalide')
  .max(255, 'Email trop long')
  .toLowerCase()
  .trim();

// Schéma pour mot de passe
export const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .max(128, 'Mot de passe trop long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
  );

// Schéma pour nom/prénom
export const nameSchema = z
  .string()
  .min(2, 'Minimum 2 caractères')
  .max(50, 'Maximum 50 caractères')
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Caractères invalides')
  .trim();

// Schéma pour téléphone camerounais
export const phoneSchema = z
  .string()
  .optional()
  .refine((phone) => {
    if (!phone) return true;
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return /^(\+237|237)?[679]\d{8}$/.test(cleaned);
  }, 'Numéro de téléphone camerounais invalide');

// Schéma pour pays
export const countrySchema = z
  .string()
  .min(2, 'Code pays requis')
  .max(3, 'Code pays invalide')
  .toUpperCase();

// Schéma pour URL
export const urlSchema = z
  .string()
  .url('URL invalide')
  .max(500, 'URL trop longue');

// Schéma pour description
export const descriptionSchema = z
  .string()
  .max(1000, 'Description trop longue')
  .optional();

// Schéma pour titre
export const titleSchema = z
  .string()
  .min(1, 'Titre requis')
  .max(100, 'Titre trop long')
  .trim();

// ==============================================
// SCHÉMAS POUR LES ENUMS
// ==============================================

export const roleSchema = z.nativeEnum(Role);
export const paymentStatusSchema = z.nativeEnum(PaymentStatus);
export const lectureTypeSchema = z.nativeEnum(LectureType);
export const evaluationTypeSchema = z.nativeEnum(EvaluationType);
export const resourceTypeSchema = z.nativeEnum(ResourceType);

// ==============================================
// SCHÉMAS POUR LES DATES
// ==============================================

export const dateStringSchema = z
  .string()
  .datetime('Format de date invalide')
  .or(z.string().date('Format de date invalide'));

export const futureDateSchema = z
  .string()
  .datetime()
  .refine((date) => new Date(date) > new Date(), 'La date doit être dans le futur');

export const pastDateSchema = z
  .string()
  .datetime()
  .refine((date) => new Date(date) < new Date(), 'La date doit être dans le passé');

// Schéma pour validation de plage de dates
export const dateRangeSchema = z
  .object({
    startDate: dateStringSchema,
    endDate: dateStringSchema,
  })
  .refine(
    (data) => new Date(data.startDate) < new Date(data.endDate),
    'La date de fin doit être après la date de début'
  );

// ==============================================
// SCHÉMAS POUR LES FICHIERS
// ==============================================

export const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 10 * 1024 * 1024, 'Fichier trop volumineux (max 10MB)')
  .refine((file) => file.size > 0, 'Fichier vide');

export const imageFileSchema = fileSchema
  .refine(
    (file) => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type),
    'Format d\'image non supporté (JPEG, PNG, GIF, WebP uniquement)'
  );

export const videoFileSchema = fileSchema
  .refine(
    (file) => ['video/mp4', 'video/webm', 'video/quicktime'].includes(file.type),
    'Format vidéo non supporté (MP4, WebM, QuickTime uniquement)'
  )
  .refine((file) => file.size <= 500 * 1024 * 1024, 'Vidéo trop volumineuse (max 500MB)');

export const documentFileSchema = fileSchema
  .refine(
    (file) => [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ].includes(file.type),
    'Format de document non supporté (PDF, DOC, DOCX, TXT uniquement)'
  );

// ==============================================
// SCHÉMAS POUR LES ENTITÉS PRINCIPALES
// ==============================================

// Schéma Person
export const personSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  role: roleSchema,
  hasPaid: z.boolean().default(false),
  phone: phoneSchema,
  country: countrySchema,
});

export const createPersonSchema = personSchema.extend({
  password: passwordSchema,
});

export const updatePersonSchema = personSchema.partial().extend({
  id: uuidSchema,
});

// Schéma VirtualClass
export const virtualClassSchema = z.object({
  name: titleSchema,
  level: z.string().min(1, 'Niveau requis'),
  description: descriptionSchema.default(''),
});

export const createVirtualClassSchema = virtualClassSchema;
export const updateVirtualClassSchema = virtualClassSchema.partial().extend({
  id: uuidSchema,
});

// Schéma Module
export const moduleSchema = z.object({
  title: titleSchema,
  order: z.number().int().min(1, 'Ordre doit être positif'),
  virtualClassId: uuidSchema,
});

export const createModuleSchema = moduleSchema;
export const updateModuleSchema = moduleSchema.partial().extend({
  id: uuidSchema,
});

// Schéma Lecture
export const lectureSchema = z.object({
  title: titleSchema,
  type: lectureTypeSchema,
  moduleId: uuidSchema,
  description: descriptionSchema,
});

export const createLectureSchema = lectureSchema.extend({
  file: fileSchema.optional(),
});

export const updateLectureSchema = lectureSchema.partial().extend({
  id: uuidSchema,
  file: fileSchema.optional(),
});

// Schéma Evaluation
export const evaluationSchema = z.object({
  title: titleSchema,
  type: evaluationTypeSchema,
  moduleId: uuidSchema,
  startDate: dateStringSchema,
  endDate: dateStringSchema,
});

export const createEvaluationSchema = evaluationSchema.refine(
  (data) => new Date(data.startDate) < new Date(data.endDate),
  'La date de fin doit être après la date de début'
);

export const updateEvaluationSchema = evaluationSchema.partial().extend({
  id: uuidSchema,
});

// Schéma Submission
export const submissionSchema = z.object({
  evaluationId: uuidSchema,
  personId: uuidSchema,
  textResponse: z.string().max(5000, 'Réponse trop longue').optional(),
});

export const createSubmissionSchema = submissionSchema.extend({
  files: z.array(fileSchema).max(5, 'Maximum 5 fichiers').optional(),
});

export const gradeSubmissionSchema = z.object({
  id: uuidSchema,
  grade: z.number().min(0, 'Note minimum 0').max(20, 'Note maximum 20'),
  feedback: z.string().max(1000, 'Commentaire trop long').optional(),
});

// Schéma Payment
export const paymentSchema = z.object({
  amount: z.number().positive('Montant doit être positif'),
  personId: uuidSchema,
  phoneNumber: z.string().regex(/^[679]\d{8}$/, 'Numéro invalide'),
  paymentMethod: z.enum(['orange_money', 'mtn_mobile_money']),
});

export const createPaymentSchema = paymentSchema;

// Schéma Resource
export const resourceSchema = z.object({
  title: titleSchema,
  type: resourceTypeSchema,
  description: descriptionSchema,
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags').optional(),
});

export const createResourceSchema = resourceSchema.extend({
  file: fileSchema.optional(),
});

export const updateResourceSchema = resourceSchema.partial().extend({
  id: uuidSchema,
  file: fileSchema.optional(),
});

// ==============================================
// SCHÉMAS POUR LA PAGINATION ET RECHERCHE
// ==============================================

export const paginationSchema = z.object({
  page: z.number().int().min(1, 'Page minimum 1').default(1),
  limit: z.number().int().min(1, 'Limite minimum 1').max(100, 'Limite maximum 100').default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const searchSchema = z.object({
  search: z.string().max(100, 'Recherche trop longue').optional(),
  ...paginationSchema.shape,
});

// Filtres spécifiques par entité
export const personFiltersSchema = searchSchema.extend({
  role: roleSchema.optional(),
  hasPaid: z.boolean().optional(),
  country: countrySchema.optional(),
  dateFrom: dateStringSchema.optional(),
  dateTo: dateStringSchema.optional(),
});

export const classFiltersSchema = searchSchema.extend({
  level: z.string().optional(),
  createdBy: uuidSchema.optional(),
});

export const lectureFiltersSchema = searchSchema.extend({
  moduleId: uuidSchema.optional(),
  type: lectureTypeSchema.optional(),
});

export const evaluationFiltersSchema = searchSchema.extend({
  moduleId: uuidSchema.optional(),
  type: evaluationTypeSchema.optional(),
  status: z.enum(['upcoming', 'active', 'ended']).optional(),
  startDateAfter: dateStringSchema.optional(),
  endDateBefore: dateStringSchema.optional(),
});

export const paymentFiltersSchema = searchSchema.extend({
  personId: uuidSchema.optional(),
  status: paymentStatusSchema.optional(),
  amountMin: z.number().positive().optional(),
  amountMax: z.number().positive().optional(),
  dateFrom: dateStringSchema.optional(),
  dateTo: dateStringSchema.optional(),
});

// ==============================================
// SCHÉMAS POUR LES STATISTIQUES
// ==============================================

export const dateRangeFiltersSchema = z.object({
  dateFrom: dateStringSchema.optional(),
  dateTo: dateStringSchema.optional(),
});

export const statFiltersSchema = dateRangeFiltersSchema.extend({
  userId: uuidSchema.optional(),
  classId: uuidSchema.optional(),
  moduleId: uuidSchema.optional(),
});

// ==============================================
// UTILITAIRES DE VALIDATION
// ==============================================

/**
 * Valide un schéma et retourne un résultat typé
 */
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return {
      success: false,
      errors: ['Erreur de validation inconnue']
    };
  }
}

/**
 * Valide un schéma de façon asynchrone
 */
export async function validateSchemaAsync<T>(schema: z.ZodSchema<T>, data: unknown): Promise<{
  success: boolean;
  data?: T;
  errors?: string[];
}> {
  try {
    const result = await schema.parseAsync(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return {
      success: false,
      errors: ['Erreur de validation inconnue']
    };
  }
}

/**
 * Transforme les erreurs Zod en format utilisable par les formulaires
 */
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const formErrors: Record<string, string> = {};
  
  error.errors.forEach(err => {
    const path = err.path.join('.');
    if (!formErrors[path]) {
      formErrors[path] = err.message;
    }
  });
  
  return formErrors;
}

/**
 * Crée un schéma de validation conditionnel
 */
export function createConditionalSchema<T>(
  baseSchema: z.ZodSchema<T>,
  condition: (data: T) => boolean,
  conditionalSchema: z.ZodSchema<any>
) {
  return baseSchema.superRefine((data, ctx) => {
    if (condition(data)) {
      const result = conditionalSchema.safeParse(data);
      if (!result.success) {
        result.error.errors.forEach(err => {
          ctx.addIssue(err);
        });
      }
    }
  });
}

// ==============================================
// EXPORTS DE COMMODITÉ
// ==============================================

// Schémas groupés par fonctionnalité
export const authSchemas = {
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  phone: phoneSchema,
  country: countrySchema,
};

export const entitySchemas = {
  person: personSchema,
  virtualClass: virtualClassSchema,
  module: moduleSchema,
  lecture: lectureSchema,
  evaluation: evaluationSchema,
  submission: submissionSchema,
  payment: paymentSchema,
  resource: resourceSchema,
};

export const fileSchemas = {
  base: fileSchema,
  image: imageFileSchema,
  video: videoFileSchema,
  document: documentFileSchema,
};

export const searchSchemas = {
  pagination: paginationSchema,
  search: searchSchema,
  persons: personFiltersSchema,
  classes: classFiltersSchema,
  lectures: lectureFiltersSchema,
  evaluations: evaluationFiltersSchema,
  payments: paymentFiltersSchema,
};

// Types inférés des schémas
export type PersonValidation = z.infer<typeof personSchema>;
export type CreatePersonValidation = z.infer<typeof createPersonSchema>;
export type UpdatePersonValidation = z.infer<typeof updatePersonSchema>;
export type VirtualClassValidation = z.infer<typeof virtualClassSchema>;
export type ModuleValidation = z.infer<typeof moduleSchema>;
export type LectureValidation = z.infer<typeof lectureSchema>;
export type EvaluationValidation = z.infer<typeof evaluationSchema>;
export type SubmissionValidation = z.infer<typeof submissionSchema>;
export type PaymentValidation = z.infer<typeof paymentSchema>;
export type ResourceValidation = z.infer<typeof resourceSchema>;
export type PaginationValidation = z.infer<typeof paginationSchema>;
export type SearchValidation = z.infer<typeof searchSchema>;