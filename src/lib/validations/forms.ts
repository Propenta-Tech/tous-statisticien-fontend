// src/lib/validations/forms.ts
/**
 * Validation formulaires - Tous Statisticien Academy
 * Schémas de validation pour tous les formulaires de l'application
 */

import { z } from 'zod';
import { 
  emailSchema, 
  passwordSchema, 
  nameSchema, 
  phoneSchema, 
  countrySchema,
  titleSchema,
  descriptionSchema,
  fileSchema,
  imageFileSchema,
  videoFileSchema,
  documentFileSchema,
  uuidSchema,
  lectureTypeSchema,
  evaluationTypeSchema,
  resourceTypeSchema
} from './index';

// ==============================================
// FORMULAIRES D'AUTHENTIFICATION
// ==============================================

// Formulaire de connexion
export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Mot de passe requis'),
  rememberMe: z.boolean().default(false),
});

// Formulaire d'inscription - Étape 1
export const registerStep1FormSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  country: countrySchema,
});

// Formulaire d'inscription - Étape 2
export const registerStep2FormSchema = z.object({
  code: z
    .string()
    .length(6, 'Le code doit contenir 6 chiffres')
    .regex(/^\d{6}$/, 'Le code doit contenir uniquement des chiffres'),
});

// Formulaire d'inscription - Étape 3
export const registerStep3FormSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirmation du mot de passe requise'),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  }
);

// Formulaire de mot de passe oublié
export const forgotPasswordFormSchema = z.object({
  email: emailSchema,
});

// Formulaire de réinitialisation de mot de passe
export const resetPasswordFormSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirmation du mot de passe requise'),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  }
);

// ==============================================
// FORMULAIRES DE GESTION DES ENTITÉS
// ==============================================

// Formulaire de classe virtuelle
export const virtualClassFormSchema = z.object({
  name: titleSchema,
  level: z
    .string()
    .min(1, 'Niveau requis')
    .max(50, 'Niveau trop long'),
  description: descriptionSchema.default(''),
});

// Formulaire de module
export const moduleFormSchema = z.object({
  title: titleSchema,
  order: z
    .number({ invalid_type_error: 'L\'ordre doit être un nombre' })
    .int('L\'ordre doit être un entier')
    .min(1, 'L\'ordre doit être positif'),
  virtualClassId: uuidSchema,
});

// Formulaire de lecture
export const lectureFormSchema = z.object({
  title: titleSchema,
  type: lectureTypeSchema,
  moduleId: uuidSchema,
  description: descriptionSchema,
  file: fileSchema.optional(),
});

// Formulaire d'évaluation
export const evaluationFormSchema = z.object({
  title: titleSchema,
  type: evaluationTypeSchema,
  moduleId: uuidSchema,
  startDate: z
    .string()
    .min(1, 'Date de début requise')
    .datetime('Format de date invalide'),
  endDate: z
    .string()
    .min(1, 'Date de fin requise')
    .datetime('Format de date invalide'),
  duration: z
    .number()
    .int()
    .min(5, 'Durée minimum 5 minutes')
    .max(480, 'Durée maximum 8 heures')
    .optional(),
  maxScore: z
    .number()
    .min(1, 'Score maximum minimum 1')
    .max(100, 'Score maximum 100')
    .default(20),
  instructions: z
    .string()
    .max(2000, 'Instructions trop longues')
    .optional(),
}).refine(
  (data) => new Date(data.startDate) < new Date(data.endDate),
  {
    message: 'La date de fin doit être après la date de début',
    path: ['endDate'],
  }
).refine(
  (data) => new Date(data.startDate) > new Date(),
  {
    message: 'La date de début doit être dans le futur',
    path: ['startDate'],
  }
);

// Formulaire de soumission d'évaluation
export const submissionFormSchema = z.object({
  evaluationId: uuidSchema,
  textResponse: z
    .string()
    .max(5000, 'Réponse textuelle trop longue')
    .optional(),
  files: z
    .array(fileSchema)
    .max(5, 'Maximum 5 fichiers autorisés')
    .optional(),
  notes: z
    .string()
    .max(500, 'Notes trop longues')
    .optional(),
});

// Formulaire de notation
export const gradingFormSchema = z.object({
  submissionId: uuidSchema,
  grade: z
    .number({ invalid_type_error: 'La note doit être un nombre' })
    .min(0, 'Note minimum 0')
    .max(20, 'Note maximum 20'),
  feedback: z
    .string()
    .max(1000, 'Commentaire trop long')
    .optional(),
  rubric: z
    .array(z.object({
      criteria: z.string().min(1, 'Critère requis'),
      score: z.number().min(0),
      maxScore: z.number().min(1),
      feedback: z.string().optional(),
    }))
    .optional(),
});

// Formulaire de ressource
export const resourceFormSchema = z.object({
  title: titleSchema,
  type: resourceTypeSchema,
  description: descriptionSchema,
  isPublic: z.boolean().default(false),
  tags: z
    .array(z.string().min(1).max(30))
    .max(10, 'Maximum 10 tags')
    .optional(),
  file: fileSchema.optional(),
  link: z
    .string()
    .url('URL invalide')
    .optional(),
}).refine(
  (data) => data.file || data.link,
  {
    message: 'Un fichier ou un lien est requis',
    path: ['file'],
  }
);

// ==============================================
// FORMULAIRES DE GESTION UTILISATEUR
// ==============================================

// Formulaire de création d'utilisateur (admin)
export const createUserFormSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  role: z.enum(['ADMIN', 'STUDENT', 'FORMATEUR']),
  phone: phoneSchema,
  country: countrySchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirmation du mot de passe requise'),
  sendWelcomeEmail: z.boolean().default(true),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  }
);

// Formulaire de modification de profil
export const profileFormSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  country: countrySchema,
  bio: z
    .string()
    .max(500, 'Biographie trop longue')
    .optional(),
  website: z
    .string()
    .url('URL invalide')
    .optional(),
  linkedin: z
    .string()
    .url('URL LinkedIn invalide')
    .optional(),
});

// Formulaire de changement de mot de passe
export const changePasswordFormSchema = z.object({
  currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirmation du mot de passe requise'),
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  }
).refine(
  (data) => data.currentPassword !== data.newPassword,
  {
    message: 'Le nouveau mot de passe doit être différent de l\'ancien',
    path: ['newPassword'],
  }
);

// ==============================================
// FORMULAIRES DE PAIEMENT
// ==============================================

// Formulaire de paiement
export const paymentFormSchema = z.object({
  amount: z
    .number({ invalid_type_error: 'Le montant doit être un nombre' })
    .positive('Le montant doit être positif')
    .min(500, 'Montant minimum 500 FCFA')
    .max(1000000, 'Montant maximum 1,000,000 FCFA'),
  phoneNumber: z
    .string()
    .min(1, 'Numéro de téléphone requis')
    .regex(/^[679]\d{8}$/, 'Numéro de téléphone camerounais invalide (ex: 694282767)'),
  paymentMethod: z.enum(['orange_money', 'mtn_mobile_money'], {
    errorMap: () => ({ message: 'Méthode de paiement requise' })
  }),
  acceptTerms: z
    .boolean()
    .refine(val => val === true, 'Vous devez accepter les conditions d\'utilisation'),
});

// Formulaire de remboursement
export const refundFormSchema = z.object({
  paymentId: uuidSchema,
  amount: z
    .number()
    .positive('Le montant doit être positif')
    .optional(),
  reason: z
    .string()
    .min(10, 'Raison du remboursement requise (minimum 10 caractères)')
    .max(500, 'Raison trop longue'),
  refundMethod: z
    .enum(['original', 'manual'])
    .default('original'),
});

// ==============================================
// FORMULAIRES DE RECHERCHE ET FILTRES
// ==============================================

// Formulaire de recherche utilisateurs
export const userSearchFormSchema = z.object({
  search: z
    .string()
    .max(100, 'Recherche trop longue')
    .optional(),
  role: z
    .enum(['ADMIN', 'STUDENT', 'FORMATEUR'])
    .optional(),
  hasPaid: z
    .boolean()
    .optional(),
  country: countrySchema.optional(),
  dateFrom: z
    .string()
    .datetime()
    .optional(),
  dateTo: z
    .string()
    .datetime()
    .optional(),
  sortBy: z
    .enum(['firstName', 'lastName', 'email', 'createdAt', 'lastLogin'])
    .default('createdAt'),
  sortOrder: z
    .enum(['asc', 'desc'])
    .default('desc'),
});

// Formulaire de recherche classes
export const classSearchFormSchema = z.object({
  search: z
    .string()
    .max(100, 'Recherche trop longue')
    .optional(),
  level: z
    .string()
    .optional(),
  status: z
    .enum(['active', 'archived', 'draft'])
    .optional(),
  sortBy: z
    .enum(['name', 'level', 'createdAt', 'studentsCount'])
    .default('createdAt'),
  sortOrder: z
    .enum(['asc', 'desc'])
    .default('desc'),
});

// Formulaire de recherche évaluations
export const evaluationSearchFormSchema = z.object({
  search: z
    .string()
    .max(100, 'Recherche trop longue')
    .optional(),
  type: evaluationTypeSchema.optional(),
  status: z
    .enum(['upcoming', 'active', 'ended'])
    .optional(),
  moduleId: uuidSchema.optional(),
  dateFrom: z
    .string()
    .datetime()
    .optional(),
  dateTo: z
    .string()
    .datetime()
    .optional(),
  sortBy: z
    .enum(['title', 'startDate', 'endDate', 'createdAt'])
    .default('startDate'),
  sortOrder: z
    .enum(['asc', 'desc'])
    .default('asc'),
});

// ==============================================
// FORMULAIRES DE CONTACT ET SUPPORT
// ==============================================

// Formulaire de contact
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  subject: z
    .string()
    .min(5, 'Sujet trop court (minimum 5 caractères)')
    .max(100, 'Sujet trop long (maximum 100 caractères)'),
  message: z
    .string()
    .min(20, 'Message trop court (minimum 20 caractères)')
    .max(1000, 'Message trop long (maximum 1000 caractères)'),
  category: z
    .enum(['general', 'technical', 'billing', 'course', 'complaint'])
    .default('general'),
  urgent: z
    .boolean()
    .default(false),
});

// Formulaire de feedback
export const feedbackFormSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, 'Note minimum 1')
    .max(5, 'Note maximum 5'),
  title: z
    .string()
    .min(5, 'Titre trop court')
    .max(100, 'Titre trop long'),
  message: z
    .string()
    .min(10, 'Message trop court')
    .max(1000, 'Message trop long'),
  category: z
    .enum(['course', 'platform', 'instructor', 'technical', 'suggestion'])
    .default('course'),
  anonymous: z
    .boolean()
    .default(false),
  courseId: uuidSchema.optional(),
  moduleId: uuidSchema.optional(),
});

// Formulaire de signalement
export const reportFormSchema = z.object({
  type: z
    .enum(['inappropriate_content', 'spam', 'copyright', 'harassment', 'other'])
    .default('other'),
  resourceType: z
    .enum(['lecture', 'comment', 'submission', 'message', 'profile'])
    .default('lecture'),
  resourceId: uuidSchema,
  reason: z
    .string()
    .min(20, 'Raison du signalement requise (minimum 20 caractères)')
    .max(500, 'Raison trop longue'),
  evidence: z
    .array(imageFileSchema)
    .max(3, 'Maximum 3 captures d\'écran')
    .optional(),
});

// ==============================================
// FORMULAIRES D'IMPORT/EXPORT
// ==============================================

// Formulaire d'import utilisateurs
export const importUsersFormSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(file.type),
      'Format de fichier non supporté (CSV ou Excel uniquement)'
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Fichier trop volumineux (max 5MB)'),
  skipFirstRow: z
    .boolean()
    .default(true),
  updateExisting: z
    .boolean()
    .default(false),
  sendWelcomeEmails: z
    .boolean()
    .default(false),
});

// Formulaire d'export
export const exportFormSchema = z.object({
  entityType: z
    .enum(['users', 'classes', 'submissions', 'payments'])
    .default('users'),
  format: z
    .enum(['csv', 'excel', 'pdf'])
    .default('csv'),
  dateFrom: z
    .string()
    .datetime()
    .optional(),
  dateTo: z
    .string()
    .datetime()
    .optional(),
  filters: z
    .record(z.any())
    .optional(),
  includePersonalData: z
    .boolean()
    .default(false),
});

// ==============================================
// UTILITAIRES DE VALIDATION POUR FORMULAIRES
// ==============================================

/**
 * Valide un formulaire et retourne les erreurs formatées
 */
export function validateForm<T>(
  schema: z.ZodSchema<T>, 
  data: unknown
): { 
  success: boolean; 
  data?: T; 
  errors?: Record<string, string> 
} {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formErrors: Record<string, string> = {};
      
      error.errors.forEach(err => {
        const path = err.path.join('.');
        if (!formErrors[path]) {
          formErrors[path] = err.message;
        }
      });
      
      return { success: false, errors: formErrors };
    }
    return { 
      success: false, 
      errors: { general: 'Erreur de validation inconnue' } 
    };
  }
}

/**
 * Valide un champ spécifique d'un formulaire
 */
export function validateField<T>(
  schema: z.ZodSchema<T>,
  fieldName: string,
  value: unknown
): { isValid: boolean; error?: string } {
  try {
    const fieldSchema = (schema as any).shape[fieldName];
    if (!fieldSchema) {
      return { isValid: true };
    }
    
    fieldSchema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        isValid: false, 
        error: error.errors[0]?.message || 'Valeur invalide' 
      };
    }
    return { isValid: false, error: 'Erreur de validation' };
  }
}

/**
 * Crée un schéma de validation dynamique basé sur les conditions
 */
export function createConditionalFormSchema<T>(
  baseSchema: z.ZodSchema<T>,
  conditions: Array<{
    condition: (data: T) => boolean;
    schema: z.ZodSchema<any>;
  }>
) {
  return baseSchema.superRefine((data, ctx) => {
    conditions.forEach(({ condition, schema }) => {
      if (condition(data)) {
        const result = schema.safeParse(data);
        if (!result.success) {
          result.error.errors.forEach(err => {
            ctx.addIssue(err);
          });
        }
      }
    });
  });
}

// ==============================================
// EXPORTS GROUPÉS PAR FONCTIONNALITÉ
// ==============================================

// Schémas d'authentification
export const authFormSchemas = {
  login: loginFormSchema,
  registerStep1: registerStep1FormSchema,
  registerStep2: registerStep2FormSchema,
  registerStep3: registerStep3FormSchema,
  forgotPassword: forgotPasswordFormSchema,
  resetPassword: resetPasswordFormSchema,
  profile: profileFormSchema,
  changePassword: changePasswordFormSchema,
};

// Schémas d'entités
export const entityFormSchemas = {
  virtualClass: virtualClassFormSchema,
  module: moduleFormSchema,
  lecture: lectureFormSchema,
  evaluation: evaluationFormSchema,
  submission: submissionFormSchema,
  grading: gradingFormSchema,
  resource: resourceFormSchema,
};

// Schémas de gestion utilisateur
export const userFormSchemas = {
  createUser: createUserFormSchema,
  profile: profileFormSchema,
  changePassword: changePasswordFormSchema,
};

// Schémas de paiement
export const paymentFormSchemas = {
  payment: paymentFormSchema,
  refund: refundFormSchema,
};

// Schémas de recherche
export const searchFormSchemas = {
  users: userSearchFormSchema,
  classes: classSearchFormSchema,
  evaluations: evaluationSearchFormSchema,
};

// Schémas de contact et support
export const supportFormSchemas = {
  contact: contactFormSchema,
  feedback: feedbackFormSchema,
  report: reportFormSchema,
};

// Schémas d'import/export
export const dataFormSchemas = {
  importUsers: importUsersFormSchema,
  export: exportFormSchema,
};

// Types TypeScript inférés
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type RegisterStep1FormData = z.infer<typeof registerStep1FormSchema>;
export type RegisterStep2FormData = z.infer<typeof registerStep2FormSchema>;
export type RegisterStep3FormData = z.infer<typeof registerStep3FormSchema>;
export type VirtualClassFormData = z.infer<typeof virtualClassFormSchema>;
export type ModuleFormData = z.infer<typeof moduleFormSchema>;
export type LectureFormData = z.infer<typeof lectureFormSchema>;
export type EvaluationFormData = z.infer<typeof evaluationFormSchema>;
export type SubmissionFormData = z.infer<typeof submissionFormSchema>;
export type PaymentFormData = z.infer<typeof paymentFormSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type FeedbackFormData = z.infer<typeof feedbackFormSchema>;