// src/lib/validations/auth.ts
/**
 * Validation authentification - Tous Statisticien Academy
 * Schémas spécifiques pour l'authentification et la gestion des utilisateurs
 */

import { z } from 'zod';
import { emailSchema, passwordSchema, nameSchema, phoneSchema, countrySchema } from './index';

// ==============================================
// SCHÉMAS POUR L'INSCRIPTION (3 ÉTAPES)
// ==============================================

// Étape 1 : Informations personnelles
export const registrationStep1Schema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  country: countrySchema,
});

// Étape 2 : Vérification du code
export const registrationStep2Schema = z.object({
  verificationToken: z.string().min(1, 'Token de vérification requis'),
  code: z
    .string()
    .length(6, 'Le code doit contenir 6 chiffres')
    .regex(/^\d{6}$/, 'Le code doit contenir uniquement des chiffres'),
});

// Étape 3 : Mot de passe
export const registrationStep3Schema = z.object({
  verificationToken: z.string().min(1, 'Token de vérification requis'),
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirmation du mot de passe requise'),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  }
);

// Schéma complet d'inscription
export const completeRegistrationSchema = z.object({
  step1: registrationStep1Schema,
  step2: registrationStep2Schema,
  step3: registrationStep3Schema,
});

// ==============================================
// SCHÉMAS POUR LA CONNEXION
// ==============================================

// Connexion simple
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Mot de passe requis'),
  rememberMe: z.boolean().default(false),
});

// Validation avancée de connexion avec limite de tentatives
export const loginWithAttemptsSchema = loginSchema.extend({
  captcha: z.string().optional(),
}).superRefine((data, ctx) => {
  // Logique pour vérifier si un captcha est requis
  // (sera utilisé côté client pour les tentatives multiples)
});

// ==============================================
// SCHÉMAS POUR LA RÉCUPÉRATION DE MOT DE PASSE
// ==============================================

// Demande de réinitialisation
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Réinitialisation avec token
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token de réinitialisation requis'),
  newPassword: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirmation du mot de passe requise'),
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  }
);

// ==============================================
// SCHÉMAS POUR LA GESTION DU PROFIL
// ==============================================

// Modification du profil
export const updateProfileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  country: countrySchema,
});

// Changement de mot de passe
export const changePasswordSchema = z.object({
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

// Upload d'avatar
export const avatarUploadSchema = z.object({
  avatar: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'L\'avatar ne doit pas dépasser 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type),
      'Format d\'image non supporté (JPEG, PNG, GIF, WebP uniquement)'
    )
    .refine((file) => file.size > 0, 'Fichier vide'),
});

// ==============================================
// SCHÉMAS POUR LA VALIDATION DES TOKENS
// ==============================================

// Validation JWT
export const jwtTokenSchema = z.object({
  token: z
    .string()
    .min(1, 'Token requis')
    .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, 'Format de token invalide'),
});

// Payload JWT
export const jwtPayloadSchema = z.object({
  sub: z.string().uuid(), // User ID
  email: emailSchema,
  role: z.enum(['ADMIN', 'STUDENT', 'FORMATEUR']),
  firstName: nameSchema,
  lastName: nameSchema,
  hasPaid: z.boolean(),
  iat: z.number().int(),
  exp: z.number().int(),
});

// ==============================================
// SCHÉMAS POUR LES PERMISSIONS
// ==============================================

// Vérification des permissions
export const permissionCheckSchema = z.object({
  resource: z.string().min(1, 'Ressource requise'),
  action: z.string().min(1, 'Action requise'),
  context: z.record(z.any()).optional(),
});

// Définition d'un rôle
export const roleDefinitionSchema = z.object({
  name: z.enum(['ADMIN', 'STUDENT', 'FORMATEUR']),
  permissions: z.array(z.object({
    resource: z.string(),
    actions: z.array(z.string()),
  })),
  inherits: z.array(z.string()).optional(),
});

// ==============================================
// SCHÉMAS POUR LA SÉCURITÉ
// ==============================================

// Validation de la force du mot de passe
export const passwordStrengthSchema = z.object({
  password: z.string(),
}).transform((data) => {
  const { password } = data;
  let score = 0;
  let feedback: string[] = [];

  // Longueur
  if (password.length >= 8) score += 1;
  else feedback.push('Au moins 8 caractères');

  if (password.length >= 12) score += 1;
  else if (password.length >= 8) feedback.push('12 caractères ou plus recommandés');

  // Complexité
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Au moins une minuscule');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Au moins une majuscule');

  if (/\d/.test(password)) score += 1;
  else feedback.push('Au moins un chiffre');

  if (/[@$!%*?&]/.test(password)) score += 1;
  else feedback.push('Au moins un caractère spécial');

  // Patterns communs
  const commonPatterns = [
    /123456/, /password/, /azerty/, /qwerty/, /admin/,
    /motdepasse/, /secret/, /user/
  ];
  
  if (commonPatterns.some(pattern => pattern.test(password.toLowerCase()))) {
    score = Math.max(0, score - 2);
    feedback.push('Évitez les mots de passe courants');
  }

  const strength = score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong';

  return {
    score,
    strength,
    feedback,
    isValid: score >= 4
  };
});

// Validation de l'email avec vérification de domaine
export const emailWithDomainSchema = emailSchema.superRefine(async (email, ctx) => {
  // Liste des domaines temporaires/jetables à bloquer
  const blockedDomains = [
    '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
    'mailinator.com', 'trash-mail.com', 'yopmail.com'
  ];

  const domain = email.split('@')[1];
  if (blockedDomains.includes(domain)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Les adresses email temporaires ne sont pas autorisées',
    });
  }
});

// ==============================================
// SCHÉMAS POUR L'AUDIT ET LES LOGS
// ==============================================

// Log d'authentification
export const authLogSchema = z.object({
  userId: z.string().uuid().optional(),
  action: z.enum([
    'LOGIN_SUCCESS', 'LOGIN_FAILED', 'LOGOUT',
    'REGISTER_START', 'REGISTER_COMPLETE',
    'PASSWORD_RESET_REQUEST', 'PASSWORD_RESET_COMPLETE',
    'PASSWORD_CHANGE', 'PROFILE_UPDATE',
    'TOKEN_REFRESH', 'TOKEN_REVOKE'
  ]),
  ipAddress: z.string().ip(),
  userAgent: z.string(),
  metadata: z.record(z.any()).optional(),
  timestamp: z.string().datetime(),
});

// Tentative de connexion
export const loginAttemptSchema = z.object({
  email: emailSchema,
  success: z.boolean(),
  ipAddress: z.string().ip(),
  userAgent: z.string(),
  timestamp: z.string().datetime(),
  errorCode: z.string().optional(),
});

// ==============================================
// SCHÉMAS POUR LA CONFIGURATION
// ==============================================

// Configuration de sécurité
export const securityConfigSchema = z.object({
  maxLoginAttempts: z.number().int().min(3).max(10).default(5),
  lockoutDuration: z.number().int().min(300).max(3600).default(900), // 15 minutes
  tokenExpiration: z.number().int().min(900).max(86400).default(3600), // 1 heure
  refreshTokenExpiration: z.number().int().min(86400).max(2592000).default(604800), // 7 jours
  passwordMinLength: z.number().int().min(6).max(20).default(8),
  requireEmailVerification: z.boolean().default(true),
  requirePhoneVerification: z.boolean().default(false),
  allowSocialLogin: z.boolean().default(false),
});

// ==============================================
// UTILITAIRES DE VALIDATION SPÉCIFIQUES
// ==============================================

/**
 * Valide un numéro de téléphone camerounais spécifiquement
 */
export function validateCameroonianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Formats acceptés:
  // 694282767, +237694282767, 237694282767
  const patterns = [
    /^[679]\d{8}$/, // 9 chiffres
    /^\+237[679]\d{8}$/, // +237 + 9 chiffres
    /^237[679]\d{8}$/, // 237 + 9 chiffres
  ];
  
  return patterns.some(pattern => pattern.test(cleaned));
}

/**
 * Valide l'unicité d'un email (à utiliser côté client pour feedback instantané)
 */
export const checkEmailUniqueness = async (email: string): Promise<boolean> => {
  // Cette fonction sera implémentée côté client pour vérifier
  // l'unicité de l'email via l'API
  try {
    const response = await fetch(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
    const data = await response.json();
    return !data.exists;
  } catch {
    return true; // En cas d'erreur, on assume que l'email est disponible
  }
};

/**
 * Valide la force d'un mot de passe et retourne des suggestions
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  strength: 'weak' | 'medium' | 'strong';
  suggestions: string[];
} {
  const result = passwordStrengthSchema.parse({ password });
  
  const suggestions: string[] = [];
  
  if (result.strength === 'weak') {
    suggestions.push(
      'Utilisez au moins 8 caractères',
      'Mélangez majuscules et minuscules',
      'Ajoutez des chiffres et symboles'
    );
  } else if (result.strength === 'medium') {
    suggestions.push(
      'Utilisez 12 caractères ou plus pour une sécurité optimale',
      'Évitez les mots de passe prévisibles'
    );
  }
  
  return {
    isValid: result.isValid,
    score: result.score,
    strength: result.strength as 'weak' | 'medium' | 'strong',
    suggestions
  };
}

/**
 * Valide un token de session côté client
 */
export function validateSessionToken(token: string): boolean {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp > now;
  } catch {
    return false;
  }
}

/**
 * Génère un code de vérification à 6 chiffres
 */
export function generateVerificationCode(): string {
  return Math.random().toString().slice(2, 8).padStart(6, '0');
}

/**
 * Valide un nom d'utilisateur personnalisé pour les formateurs
 */
export const usernameSchema = z
  .string()
  .min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères')
  .max(20, 'Le nom d\'utilisateur ne peut pas dépasser 20 caractères')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Seuls les lettres, chiffres, tirets et underscores sont autorisés')
  .refine((username) => !username.startsWith('_'), 'Ne peut pas commencer par un underscore')
  .refine((username) => !username.endsWith('_'), 'Ne peut pas finir par un underscore')
  .refine((username) => !/_{2,}/.test(username), 'Pas plus d\'un underscore consécutif');

/**
 * Schéma pour la création d'un compte formateur (plus complet)
 */
export const formateurRegistrationSchema = registrationStep1Schema.extend({
  username: usernameSchema,
  specialization: z.string().min(2, 'Spécialisation requise'),
  experience: z.number().int().min(0).max(50, 'Expérience invalide'),
  bio: z.string().max(500, 'La biographie ne peut pas dépasser 500 caractères').optional(),
  linkedinProfile: z.string().url('URL LinkedIn invalide').optional(),
  certification: z.string().optional(),
});

/**
 * Types exportés pour TypeScript
 */
export type RegistrationStep1 = z.infer<typeof registrationStep1Schema>;
export type RegistrationStep2 = z.infer<typeof registrationStep2Schema>;
export type RegistrationStep3 = z.infer<typeof registrationStep3Schema>;
export type LoginData = z.infer<typeof loginSchema>;
export type ProfileUpdate = z.infer<typeof updateProfileSchema>;
export type PasswordChange = z.infer<typeof changePasswordSchema>;
export type JWTPayload = z.infer<typeof jwtPayloadSchema>;
export type AuthLog = z.infer<typeof authLogSchema>;
export type SecurityConfig = z.infer<typeof securityConfigSchema>;
export type FormateurRegistration = z.infer<typeof formateurRegistrationSchema>;

// ==============================================
// CONSTANTES ET CONFIGURATIONS
// ==============================================

/**
 * Messages d'erreur standardisés
 */
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Email ou mot de passe incorrect',
  ACCOUNT_LOCKED: 'Compte temporairement verrouillé. Réessayez plus tard',
  EMAIL_NOT_VERIFIED: 'Veuillez vérifier votre adresse email',
  INVALID_TOKEN: 'Token invalide ou expiré',
  WEAK_PASSWORD: 'Mot de passe trop faible',
  EMAIL_ALREADY_EXISTS: 'Cette adresse email est déjà utilisée',
  PHONE_ALREADY_EXISTS: 'Ce numéro de téléphone est déjà utilisé',
  USERNAME_TAKEN: 'Ce nom d\'utilisateur est déjà pris',
  VERIFICATION_CODE_EXPIRED: 'Code de vérification expiré',
  TOO_MANY_ATTEMPTS: 'Trop de tentatives. Veuillez patienter',
} as const;

/**
 * Configuration par défaut pour l'authentification
 */
export const DEFAULT_AUTH_CONFIG = {
  verificationCodeExpiry: 10 * 60 * 1000, // 10 minutes
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  tokenExpiry: 60 * 60 * 1000, // 1 heure
  refreshTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 jours
  passwordMinLength: 8,
} as const;