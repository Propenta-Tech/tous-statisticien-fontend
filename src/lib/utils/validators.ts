// ==============================================
// VALIDATORS - TOUS STATISTICIEN ACADEMY
// ==============================================
// Fonctions de validation pour les formulaires et données

import { REGEX_PATTERNS, LIMITS, ALLOWED_FILE_TYPES } from './constants';

// ==============================================
// TYPES POUR LA VALIDATION
// ==============================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface PasswordValidationResult extends ValidationResult {
  strength: 'weak' | 'medium' | 'strong';
  score: number;
}

// ==============================================
// VALIDATEURS DE BASE
// ==============================================

export function isRequired(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export function minLength(value: string, min: number): boolean {
  return value.length >= min;
}

export function maxLength(value: string, max: number): boolean {
  return value.length <= max;
}

export function minValue(value: number, min: number): boolean {
  return value >= min;
}

export function maxValue(value: number, max: number): boolean {
  return value <= max;
}

export function pattern(value: string, regex: RegExp): boolean {
  return regex.test(value);
}

// ==============================================
// VALIDATEURS SPÉCIALISÉS
// ==============================================

export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (!isRequired(email)) {
    errors.push('L\'email est obligatoire');
  } else {
    if (!pattern(email, REGEX_PATTERNS.EMAIL)) {
      errors.push('Format d\'email invalide');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validatePhone(phone: string): ValidationResult {
  const errors: string[] = [];

  if (!isRequired(phone)) {
    errors.push('Le numéro de téléphone est obligatoire');
  } else {
    if (!pattern(phone, REGEX_PATTERNS.PHONE_CAMEROON)) {
      errors.push('Format de numéro de téléphone invalide (ex: +237694282767)');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let score = 0;

  if (!isRequired(password)) {
    errors.push('Le mot de passe est obligatoire');
    return { isValid: false, errors, strength: 'weak', score: 0 };
  }

  // Longueur minimale
  if (!minLength(password, LIMITS.MIN_PASSWORD_LENGTH)) {
    errors.push(`Le mot de passe doit contenir au moins ${LIMITS.MIN_PASSWORD_LENGTH} caractères`);
  } else {
    score += 1;
  }

  // Minuscule
  if (!/[a-z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une minuscule');
  } else {
    score += 1;
  }

  // Majuscule
  if (!/[A-Z]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  } else {
    score += 1;
  }

  // Chiffre
  if (!/\d/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  } else {
    score += 1;
  }

  // Caractère spécial
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Le mot de passe doit contenir au moins un caractère spécial');
  } else {
    score += 1;
  }

  // Déterminer la force
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 4) strength = 'strong';
  else if (score >= 3) strength = 'medium';

  return {
    isValid: errors.length === 0,
    errors,
    strength,
    score,
  };
}

export function validatePasswordConfirmation(password: string, confirmation: string): ValidationResult {
  const errors: string[] = [];

  if (!isRequired(confirmation)) {
    errors.push('La confirmation du mot de passe est obligatoire');
  } else if (password !== confirmation) {
    errors.push('Les mots de passe ne correspondent pas');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateName(name: string): ValidationResult {
  const errors: string[] = [];

  if (!isRequired(name)) {
    errors.push('Le nom est obligatoire');
  } else {
    if (!minLength(name, LIMITS.MIN_NAME_LENGTH)) {
      errors.push(`Le nom doit contenir au moins ${LIMITS.MIN_NAME_LENGTH} caractères`);
    }
    if (!maxLength(name, LIMITS.MAX_NAME_LENGTH)) {
      errors.push(`Le nom ne peut pas dépasser ${LIMITS.MAX_NAME_LENGTH} caractères`);
    }
    if (!pattern(name, REGEX_PATTERNS.NAME)) {
      errors.push('Le nom ne peut contenir que des lettres, espaces, apostrophes et tirets');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ==============================================
// VALIDATEURS DE FICHIERS
// ==============================================

export function validateFile(file: File): ValidationResult {
  const errors: string[] = [];

  // Taille du fichier
  if (file.size > LIMITS.MAX_FILE_SIZE) {
    errors.push(`Le fichier est trop volumineux (max ${LIMITS.MAX_FILE_SIZE / 1024 / 1024}MB)`);
  }

  // Type de fichier
  const allAllowedTypes = [
    ...ALLOWED_FILE_TYPES.IMAGES,
    ...ALLOWED_FILE_TYPES.DOCUMENTS,
    ...ALLOWED_FILE_TYPES.VIDEOS,
    ...ALLOWED_FILE_TYPES.AUDIO,
    ...ALLOWED_FILE_TYPES.ARCHIVES,
  ];

  if (!allAllowedTypes.includes(file.type)) {
    errors.push('Type de fichier non autorisé');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateImageFile(file: File): ValidationResult {
  const errors: string[] = [];

  // Vérifier que c'est une image
  if (!ALLOWED_FILE_TYPES.IMAGES.includes(file.type)) {
    errors.push('Le fichier doit être une image (JPEG, PNG, GIF, WebP)');
  }

  // Taille max pour les images (plus petite)
  const maxImageSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxImageSize) {
    errors.push('L\'image est trop volumineuse (max 5MB)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateVideoFile(file: File): ValidationResult {
  const errors: string[] = [];

  if (!ALLOWED_FILE_TYPES.VIDEOS.includes(file.type)) {
    errors.push('Le fichier doit être une vidéo (MP4, AVI, MOV, WMV, WebM)');
  }

  // Taille max pour les vidéos
  const maxVideoSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxVideoSize) {
    errors.push('La vidéo est trop volumineuse (max 100MB)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateDocumentFile(file: File): ValidationResult {
  const errors: string[] = [];

  if (!ALLOWED_FILE_TYPES.DOCUMENTS.includes(file.type)) {
    errors.push('Le fichier doit être un document (PDF, Word, Excel, PowerPoint)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ==============================================
// VALIDATEURS DE DATES
// ==============================================

export function validateDate(dateString: string): ValidationResult {
  const errors: string[] = [];

  if (!isRequired(dateString)) {
    errors.push('La date est obligatoire');
  } else {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      errors.push('Format de date invalide');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateDateRange(startDate: string, endDate: string): ValidationResult {
  const errors: string[] = [];

  const startValidation = validateDate(startDate);
  const endValidation = validateDate(endDate);

  if (!startValidation.isValid) {
    errors.push(...startValidation.errors.map(err => `Date de début: ${err}`));
  }

  if (!endValidation.isValid) {
    errors.push(...endValidation.errors.map(err => `Date de fin: ${err}`));
  }

  if (startValidation.isValid && endValidation.isValid) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      errors.push('La date de fin doit être postérieure à la date de début');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateFutureDate(dateString: string): ValidationResult {
  const dateValidation = validateDate(dateString);
  
  if (!dateValidation.isValid) {
    return dateValidation;
  }

  const errors: string[] = [];
  const date = new Date(dateString);
  const now = new Date();

  if (date <= now) {
    errors.push('La date doit être dans le futur');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ==============================================
// VALIDATEURS NUMÉRIQUES
// ==============================================

export function validateGrade(grade: number): ValidationResult {
  const errors: string[] = [];

  if (grade < LIMITS.MIN_GRADE) {
    errors.push(`La note ne peut pas être inférieure à ${LIMITS.MIN_GRADE}`);
  }

  if (grade > LIMITS.MAX_GRADE) {
    errors.push(`La note ne peut pas être supérieure à ${LIMITS.MAX_GRADE}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateProgression(progression: number): ValidationResult {
  const errors: string[] = [];

  if (progression < LIMITS.MIN_PROGRESSION) {
    errors.push(`La progression ne peut pas être inférieure à ${LIMITS.MIN_PROGRESSION}%`);
  }

  if (progression > LIMITS.MAX_PROGRESSION) {
    errors.push(`La progression ne peut pas être supérieure à ${LIMITS.MAX_PROGRESSION}%`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateAmount(amount: number): ValidationResult {
  const errors: string[] = [];

  if (amount <= 0) {
    errors.push('Le montant doit être positif');
  }

  if (amount > 1000000) {
    errors.push('Le montant ne peut pas dépasser 1,000,000 FCFA');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ==============================================
// VALIDATEURS DE TEXTE
// ==============================================

export function validateTitle(title: string): ValidationResult {
  const errors: string[] = [];

  if (!isRequired(title)) {
    errors.push('Le titre est obligatoire');
  } else {
    if (!minLength(title, 3)) {
      errors.push('Le titre doit contenir au moins 3 caractères');
    }
    if (!maxLength(title, LIMITS.MAX_TITLE_LENGTH)) {
      errors.push(`Le titre ne peut pas dépasser ${LIMITS.MAX_TITLE_LENGTH} caractères`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateDescription(description: string): ValidationResult {
  const errors: string[] = [];

  if (description && !maxLength(description, LIMITS.MAX_DESCRIPTION_LENGTH)) {
    errors.push(`La description ne peut pas dépasser ${LIMITS.MAX_DESCRIPTION_LENGTH} caractères`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateMessage(message: string): ValidationResult {
  const errors: string[] = [];

  if (!isRequired(message)) {
    errors.push('Le message est obligatoire');
  } else {
    if (!minLength(message, 10)) {
      errors.push('Le message doit contenir au moins 10 caractères');
    }
    if (!maxLength(message, LIMITS.MAX_MESSAGE_LENGTH)) {
      errors.push(`Le message ne peut pas dépasser ${LIMITS.MAX_MESSAGE_LENGTH} caractères`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ==============================================
// VALIDATEURS D'URL
// ==============================================

export function validateUrl(url: string): ValidationResult {
  const errors: string[] = [];

  if (!isRequired(url)) {
    errors.push('L\'URL est obligatoire');
  } else {
    if (!pattern(url, REGEX_PATTERNS.URL)) {
      errors.push('Format d\'URL invalide');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ==============================================
// VALIDATEURS DE CODES
// ==============================================

export function validateVerificationCode(code: string): ValidationResult {
  const errors: string[] = [];

  if (!isRequired(code)) {
    errors.push('Le code de vérification est obligatoire');
  } else {
    if (!/^\d{6}$/.test(code)) {
      errors.push('Le code de vérification doit contenir 6 chiffres');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ==============================================
// VALIDATEURS COMPOSÉS
// ==============================================

export function validateLoginForm(data: { email: string; password: string }): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.errors;
  }

  if (!isRequired(data.password)) {
    errors.password = ['Le mot de passe est obligatoire'];
  }

  return errors;
}

export function validateRegistrationForm(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  const firstNameValidation = validateName(data.firstName);
  if (!firstNameValidation.isValid) {
    errors.firstName = firstNameValidation.errors;
  }

  const lastNameValidation = validateName(data.lastName);
  if (!lastNameValidation.isValid) {
    errors.lastName = lastNameValidation.errors;
  }

  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.errors;
  }

  const phoneValidation = validatePhone(data.phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.errors;
  }

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors;
  }

  const confirmPasswordValidation = validatePasswordConfirmation(data.password, data.confirmPassword);
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.errors;
  }

  return errors;
}

export function validateEvaluationForm(data: {
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  moduleId: string;
}): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  const titleValidation = validateTitle(data.title);
  if (!titleValidation.isValid) {
    errors.title = titleValidation.errors;
  }

  if (!isRequired(data.type)) {
    errors.type = ['Le type d\'évaluation est obligatoire'];
  }

  if (!isRequired(data.moduleId)) {
    errors.moduleId = ['Le module est obligatoire'];
  }

  const dateRangeValidation = validateDateRange(data.startDate, data.endDate);
  if (!dateRangeValidation.isValid) {
    errors.dates = dateRangeValidation.errors;
  }

  return errors;
}

export function validatePaymentForm(data: {
  amount: number;
  phoneNumber: string;
  paymentMethod: string;
}): Record<string, string[]> {
  const errors: Record<string, string[]> = {};

  const amountValidation = validateAmount(data.amount);
  if (!amountValidation.isValid) {
    errors.amount = amountValidation.errors;
  }

  const phoneValidation = validatePhone(data.phoneNumber);
  if (!phoneValidation.isValid) {
    errors.phoneNumber = phoneValidation.errors;
  }

  if (!isRequired(data.paymentMethod)) {
    errors.paymentMethod = ['La méthode de paiement est obligatoire'];
  }

  return errors;
}

// ==============================================
// VALIDATEURS AVANCÉS
// ==============================================

export function validateFileArray(files: File[], maxFiles: number = LIMITS.MAX_FILES_PER_UPLOAD): ValidationResult {
  const errors: string[] = [];

  if (files.length === 0) {
    errors.push('Aucun fichier sélectionné');
  }

  if (files.length > maxFiles) {
    errors.push(`Vous ne pouvez pas sélectionner plus de ${maxFiles} fichiers`);
  }

  // Valider chaque fichier
  files.forEach((file, index) => {
    const fileValidation = validateFile(file);
    if (!fileValidation.isValid) {
      errors.push(`Fichier ${index + 1}: ${fileValidation.errors.join(', ')}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateFormData<T extends Record<string, any>>(
  data: T,
  rules: Record<keyof T, (value: any) => ValidationResult>
): Record<keyof T, string[]> {
  const errors: Record<keyof T, string[]> = {} as Record<keyof T, string[]>;

  Object.entries(rules).forEach(([field, validator]) => {
    const fieldKey = field as keyof T;
    const validation = validator(data[fieldKey]);
    if (!validation.isValid) {
      errors[fieldKey] = validation.errors;
    }
  });

  return errors;
}

// ==============================================
// VALIDATEURS CONDITIONNELS
// ==============================================

export function validateConditional<T>(
  condition: boolean,
  value: T,
  validator: (value: T) => ValidationResult
): ValidationResult {
  if (!condition) {
    return { isValid: true, errors: [] };
  }
  return validator(value);
}

export function validateOneOf<T>(
  value: T,
  validators: Array<(value: T) => ValidationResult>
): ValidationResult {
  for (const validator of validators) {
    const result = validator(value);
    if (result.isValid) {
      return result;
    }
  }

  // Si aucun validateur n'a réussi, retourner les erreurs du premier
  return validators[0] ? validators[0](value) : { isValid: false, errors: ['Validation échouée'] };
}

export function validateAllOf<T>(
  value: T,
  validators: Array<(value: T) => ValidationResult>
): ValidationResult {
  const allErrors: string[] = [];

  for (const validator of validators) {
    const result = validator(value);
    if (!result.isValid) {
      allErrors.push(...result.errors);
    }
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}

// ==============================================
// VALIDATEURS ASYNCHRONES
// ==============================================

export async function validateEmailAvailability(email: string): Promise<ValidationResult> {
  // Simulation d'une vérification API
  // En réalité, cela ferait un appel à l'API pour vérifier si l'email existe
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulation: emails se terminant par "test.com" sont considérés comme pris
      const isUnavailable = email.endsWith('@test.com');
      resolve({
        isValid: !isUnavailable,
        errors: isUnavailable ? ['Cette adresse email est déjà utilisée'] : [],
      });
    }, 500);
  });
}

// ==============================================
// UTILITAIRES DE VALIDATION
// ==============================================

export function hasValidationErrors(errors: Record<string, string[]>): boolean {
  return Object.values(errors).some(fieldErrors => fieldErrors.length > 0);
}

export function getFirstError(errors: Record<string, string[]>): string | null {
  for (const fieldErrors of Object.values(errors)) {
    if (fieldErrors.length > 0) {
      return fieldErrors[0];
    }
  }
  return null;
}

export function getAllErrors(errors: Record<string, string[]>): string[] {
  return Object.values(errors).flat();
}

export function clearFieldError(
  errors: Record<string, string[]>,
  field: string
): Record<string, string[]> {
  const newErrors = { ...errors };
  delete newErrors[field];
  return newErrors;
}

export function setFieldError(
  errors: Record<string, string[]>,
  field: string,
  error: string | string[]
): Record<string, string[]> {
  return {
    ...errors,
    [field]: Array.isArray(error) ? error : [error],
  };
}

// ==============================================
// VALIDATEURS DE SÉCURITÉ
// ==============================================

export function validateNoXSS(input: string): ValidationResult {
  const errors: string[] = [];
  
  // Détection basique de tentatives XSS
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ];

  for (const pattern of xssPatterns) {
    if (pattern.test(input)) {
      errors.push('Contenu potentiellement dangereux détecté');
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateNoSQL(input: string): ValidationResult {
  const errors: string[] = [];
  
  // Détection basique de tentatives d'injection SQL
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
    /(\b(OR|AND)\b.*[=<>].*[\'\"])/gi,
    /([\'\"];?\s*(OR|AND))/gi,
  ];

  for (const pattern of sqlPatterns) {
    if (pattern.test(input)) {
      errors.push('Contenu potentiellement dangereux détecté');
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ==============================================
// VALIDATEURS MÉTIER SPÉCIFIQUES
// ==============================================

export function validateClassLevel(level: string): ValidationResult {
  const errors: string[] = [];
  const validLevels = ['seconde', 'premiere', 'terminale', 'licence', 'master'];

  if (!isRequired(level)) {
    errors.push('Le niveau de classe est obligatoire');
  } else if (!validLevels.includes(level.toLowerCase())) {
    errors.push('Niveau de classe invalide');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateModuleOrder(order: number, existingOrders: number[]): ValidationResult {
  const errors: string[] = [];

  if (order < 1) {
    errors.push('L\'ordre du module doit être supérieur à 0');
  }

  if (existingOrders.includes(order)) {
    errors.push('Cet ordre est déjà utilisé par un autre module');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateEvaluationTime(startDate: string, endDate: string): ValidationResult {
  const errors: string[] = [];

  const dateRangeValidation = validateDateRange(startDate, endDate);
  if (!dateRangeValidation.isValid) {
    return dateRangeValidation;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationMs = end.getTime() - start.getTime();
  const durationMinutes = durationMs / (1000 * 60);

  // Durée minimale de 5 minutes
  if (durationMinutes < 5) {
    errors.push('La durée de l\'évaluation doit être d\'au moins 5 minutes');
  }

  // Durée maximale de 8 heures
  if (durationMinutes > 480) {
    errors.push('La durée de l\'évaluation ne peut pas dépasser 8 heures');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}