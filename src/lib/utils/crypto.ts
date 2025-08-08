/**
 * Utilitaires de cryptographie pour Tous Statisticien Academy
 * Fonctions de hachage, chiffrement et génération de tokens
 */

import { createHash, randomBytes } from 'crypto';

/**
 * Interface pour les options de hachage
 */
interface HashOptions {
  algorithm?: 'sha256' | 'sha512' | 'md5';
  encoding?: 'hex' | 'base64';
}

/**
 * Interface pour la génération de token
 */
interface TokenOptions {
  length?: number;
  includeSpecialChars?: boolean;
  includeNumbers?: boolean;
  includeUppercase?: boolean;
  includeLowercase?: boolean;
}

/**
 * Interface pour le résultat de validation de mot de passe
 */
interface PasswordValidation {
  isValid: boolean;
  score: number;
  feedback: string[];
}

/**
 * Hache une chaîne de caractères avec l'algorithme spécifié
 */
export function hashString(
  input: string, 
  options: HashOptions = {}
): string {
  const { algorithm = 'sha256', encoding = 'hex' } = options;
  
  return createHash(algorithm)
    .update(input, 'utf8')
    .digest(encoding);
}

/**
 * Génère un token aléatoire sécurisé
 */
export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

/**
 * Génère un mot de passe aléatoire
 */
export function generateRandomPassword(options: TokenOptions = {}): string {
  const {
    length = 12,
    includeSpecialChars = true,
    includeNumbers = true,
    includeUppercase = true,
    includeLowercase = true
  } = options;

  let charset = '';
  
  if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
  if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (includeNumbers) charset += '0123456789';
  if (includeSpecialChars) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (charset === '') {
    throw new Error('Au moins un type de caractère doit être inclus');
  }

  let password = '';
  const bytes = randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    password += charset[bytes[i] % charset.length];
  }
  
  return password;
}

/**
 * Génère un code de vérification numérique
 */
export function generateVerificationCode(length: number = 6): string {
  const bytes = randomBytes(length);
  let code = '';
  
  for (let i = 0; i < length; i++) {
    code += (bytes[i] % 10).toString();
  }
  
  return code;
}

/**
 * Génère un UUID simple (non cryptographiquement sécurisé)
 */
export function generateSimpleUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Valide la force d'un mot de passe
 */
export function validatePasswordStrength(password: string): PasswordValidation {
  const feedback: string[] = [];
  let score = 0;

  // Longueur
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Le mot de passe doit contenir au moins 8 caractères');
  }

  if (password.length >= 12) {
    score += 1;
  }

  // Majuscules
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Ajoutez au moins une lettre majuscule');
  }

  // Minuscules
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Ajoutez au moins une lettre minuscule');
  }

  // Chiffres
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Ajoutez au moins un chiffre');
  }

  // Caractères spéciaux
  if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Ajoutez au moins un caractère spécial');
  }

  // Pas de répétitions
  if (!/(.)\1{2,}/.test(password)) {
    score += 1;
  } else {
    feedback.push('Évitez les répétitions de caractères');
  }

  return {
    isValid: score >= 4,
    score,
    feedback
  };
}

/**
 * Chiffre une chaîne simple (pour usage non critique)
 * ATTENTION: Ne pas utiliser pour des données sensibles
 */
export function simpleEncrypt(text: string, key: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const textChar = text.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    result += String.fromCharCode(textChar ^ keyChar);
  }
  return btoa(result);
}

/**
 * Déchiffre une chaîne simple
 */
export function simpleDecrypt(encryptedText: string, key: string): string {
  try {
    const decoded = atob(encryptedText);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      const textChar = decoded.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      result += String.fromCharCode(textChar ^ keyChar);
    }
    return result;
  } catch {
    throw new Error('Impossible de déchiffrer le texte');
  }
}

/**
 * Génère une clé de session
 */
export function generateSessionKey(): string {
  return generateSecureToken(64);
}

/**
 * Crée un hash pour vérification d'intégrité
 */
export function createIntegrityHash(data: Record<string, unknown>): string {
  const sortedData = JSON.stringify(data, Object.keys(data).sort());
  return hashString(sortedData, { algorithm: 'sha256' });
}

/**
 * Vérifie l'intégrité des données
 */
export function verifyIntegrity(
  data: Record<string, unknown>, 
  expectedHash: string
): boolean {
  const actualHash = createIntegrityHash(data);
  return actualHash === expectedHash;
}

/**
 * Masque partiellement une chaîne (pour affichage sécurisé)
 */
export function maskString(
  input: string, 
  visibleStart: number = 2, 
  visibleEnd: number = 2,
  maskChar: string = '*'
): string {
  if (input.length <= visibleStart + visibleEnd) {
    return maskChar.repeat(input.length);
  }
  
  const start = input.substring(0, visibleStart);
  const end = input.substring(input.length - visibleEnd);
  const middle = maskChar.repeat(input.length - visibleStart - visibleEnd);
  
  return start + middle + end;
}

/**
 * Masque un email
 */
export function maskEmail(email: string): string {
  const [username, domain] = email.split('@');
  if (!username || !domain) return maskString(email);
  
  const maskedUsername = maskString(username, 1, 1);
  return `${maskedUsername}@${domain}`;
}

/**
 * Masque un numéro de téléphone
 */
export function maskPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  return maskString(cleaned, 2, 2);
}