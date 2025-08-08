// ==============================================
// UTILITAIRES DE FICHIERS - TOUS STATISTICIEN ACADEMY
// ==============================================
// Fonctions pour la gestion et manipulation des fichiers

import { ALLOWED_FILE_TYPES, LIMITS } from './constants';

// ==============================================
// TYPES POUR LES FICHIERS
// ==============================================

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  extension: string;
  category: 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';
}

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed: number; // bytes per second
  remainingTime: number; // seconds
}

// ==============================================
// UTILITAIRES DE BASE
// ==============================================

/**
 * Extrait l'extension d'un fichier
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
}

/**
 * Obtient le nom de fichier sans extension
 */
export function getFileNameWithoutExtension(filename: string): string {
  const extension = getFileExtension(filename);
  return extension ? filename.slice(0, -(extension.length + 1)) : filename;
}

/**
 * Formate la taille d'un fichier en unités lisibles
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Convertit une taille lisible en bytes
 */
export function parseFileSize(sizeStr: string): number {
  const units: Record<string, number> = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024,
    'TB': 1024 * 1024 * 1024 * 1024,
  };

  const match = sizeStr.toUpperCase().match(/^(\d+(?:\.\d+)?)\s*([A-Z]+)$/);
  if (!match) return 0;

  const [, value, unit] = match;
  return parseFloat(value) * (units[unit] || 1);
}

// ==============================================
// ANALYSE DES FICHIERS
// ==============================================

/**
 * Analyse les informations d'un fichier
 */
export function analyzeFile(file: File): FileInfo {
  const extension = getFileExtension(file.name);
  const category = getFileCategory(file.type);

  return {
    name: file.name,
    size: file.size,
    type: file.type,
    extension,
    category,
  };
}

/**
 * Détermine la catégorie d'un fichier basée sur son type MIME
 */
export function getFileCategory(mimeType: string): 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other' {
  if (ALLOWED_FILE_TYPES.IMAGES.includes(mimeType)) return 'image';
  if (ALLOWED_FILE_TYPES.VIDEOS.includes(mimeType)) return 'video';
  if (ALLOWED_FILE_TYPES.AUDIO.includes(mimeType)) return 'audio';
  if (ALLOWED_FILE_TYPES.DOCUMENTS.includes(mimeType)) return 'document';
  if (ALLOWED_FILE_TYPES.ARCHIVES.includes(mimeType)) return 'archive';
  return 'other';
}

/**
 * Vérifie si un fichier est une image
 */
export function isImageFile(file: File | string): boolean {
  const mimeType = typeof file === 'string' ? file : file.type;
  return ALLOWED_FILE_TYPES.IMAGES.includes(mimeType);
}

/**
 * Vérifie si un fichier est une vidéo
 */
export function isVideoFile(file: File | string): boolean {
  const mimeType = typeof file === 'string' ? file : file.type;
  return ALLOWED_FILE_TYPES.VIDEOS.includes(mimeType);
}

/**
 * Vérifie si un fichier est un audio
 */
export function isAudioFile(file: File | string): boolean {
  const mimeType = typeof file === 'string' ? file : file.type;
  return ALLOWED_FILE_TYPES.AUDIO.includes(mimeType);
}

/**
 * Vérifie si un fichier est un document
 */
export function isDocumentFile(file: File | string): boolean {
  const mimeType = typeof file === 'string' ? file : file.type;
  return ALLOWED_FILE_TYPES.DOCUMENTS.includes(mimeType);
}

// ==============================================
// VALIDATION DES FICHIERS
// ==============================================

/**
 * Valide un fichier selon les critères de l'application
 */
export function validateFile(file: File, options?: {
  maxSize?: number;
  allowedTypes?: string[];
  allowedCategories?: Array<'image' | 'video' | 'audio' | 'document' | 'archive'>;
}): FileValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const maxSize = options?.maxSize || LIMITS.MAX_FILE_SIZE;
  const allowedTypes = options?.allowedTypes || [
    ...ALLOWED_FILE_TYPES.IMAGES,
    ...ALLOWED_FILE_TYPES.VIDEOS,
    ...ALLOWED_FILE_TYPES.AUDIO,
    ...ALLOWED_FILE_TYPES.DOCUMENTS,
    ...ALLOWED_FILE_TYPES.ARCHIVES,
  ];

  // Validation de la taille
  if (file.size > maxSize) {
    errors.push(`Le fichier est trop volumineux (max ${formatFileSize(maxSize)})`);
  }

  // Validation du type
  if (!allowedTypes.includes(file.type)) {
    errors.push('Type de fichier non autorisé');
  }

  // Validation de la catégorie si spécifiée
  if (options?.allowedCategories) {
    const category = getFileCategory(file.type);
    if (!options.allowedCategories.includes(category)) {
      errors.push(`Catégorie de fichier non autorisée: ${category}`);
    }
  }

  // Avertissements
  if (file.size > maxSize * 0.8) {
    warnings.push('Fichier volumineux, l\'upload pourrait prendre du temps');
  }

  if (file.name.length > 100) {
    warnings.push('Nom de fichier très long');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Valide plusieurs fichiers
 */
export function validateFiles(files: File[], options?: {
  maxFiles?: number;
  maxTotalSize?: number;
  maxSize?: number;
  allowedTypes?: string[];
}): FileValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const maxFiles = options?.maxFiles || LIMITS.MAX_FILES_PER_UPLOAD;
  const maxTotalSize = options?.maxTotalSize || LIMITS.MAX_FILE_SIZE * 5;

  // Validation du nombre de fichiers
  if (files.length > maxFiles) {
    errors.push(`Trop de fichiers sélectionnés (max ${maxFiles})`);
  }

  // Validation de la taille totale
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  if (totalSize > maxTotalSize) {
    errors.push(`Taille totale des fichiers trop importante (max ${formatFileSize(maxTotalSize)})`);
  }

  // Validation individuelle
  files.forEach((file, index) => {
    const validation = validateFile(file, options);
    if (!validation.isValid) {
      errors.push(`Fichier ${index + 1} (${file.name}): ${validation.errors.join(', ')}`);
    }
    if (validation.warnings.length > 0) {
      warnings.push(`Fichier ${index + 1} (${file.name}): ${validation.warnings.join(', ')}`);
    }
  });

  // Vérification des doublons
  const duplicates = findDuplicateFiles(files);
  if (duplicates.length > 0) {
    warnings.push(`Fichiers en double détectés: ${duplicates.map(d => d.name).join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// ==============================================
// UTILITAIRES DE MANIPULATION
// ==============================================

/**
 * Génère un nom de fichier unique
 */
export function generateUniqueFileName(originalName: string, existingNames: string[] = []): string {
  const nameWithoutExt = getFileNameWithoutExtension(originalName);
  const extension = getFileExtension(originalName);
  
  let counter = 1;
  let newName = originalName;
  
  while (existingNames.includes(newName)) {
    newName = `${nameWithoutExt} (${counter}).${extension}`;
    counter++;
  }
  
  return newName;
}

/**
 * Nettoie un nom de fichier (supprime les caractères invalides)
 */
export function sanitizeFileName(fileName: string): string {
  // Supprime ou remplace les caractères interdits
  return fileName
    .replace(/[<>:"/\\|?*]/g, '_') // Caractères interdits Windows
    .replace(/\s+/g, '_') // Remplace les espaces par des underscores
    .replace(/[^\w\-_.]/g, '') // Garde seulement alphanumériques, tirets, underscores et points
    .replace(/_{2,}/g, '_') // Supprime les underscores multiples
    .replace(/^_+|_+$/g, '') // Supprime les underscores en début et fin
    .substring(0, 100); // Limite la longueur
}

/**
 * Trouve les fichiers en double dans une liste
 */
export function findDuplicateFiles(files: File[]): File[] {
  const seen = new Map<string, File>();
  const duplicates: File[] = [];

  files.forEach(file => {
    const key = `${file.name}-${file.size}-${file.lastModified}`;
    if (seen.has(key)) {
      duplicates.push(file);
    } else {
      seen.set(key, file);
    }
  });

  return duplicates;
}

/**
 * Groupe les fichiers par catégorie
 */
export function groupFilesByCategory(files: File[]): Record<string, File[]> {
  const groups: Record<string, File[]> = {
    image: [],
    video: [],
    audio: [],
    document: [],
    archive: [],
    other: [],
  };

  files.forEach(file => {
    const category = getFileCategory(file.type);
    groups[category].push(file);
  });

  return groups;
}

// ==============================================
// LECTURE ET CONVERSION
// ==============================================

/**
 * Lit un fichier comme Data URL (base64)
 */
export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
    reader.readAsDataURL(file);
  });
}

/**
 * Lit un fichier comme texte
 */
export function readFileAsText(file: File, encoding: string = 'UTF-8'): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
    reader.readAsText(file, encoding);
  });
}

/**
 * Lit un fichier comme ArrayBuffer
 */
export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Crée une URL d'objet pour un fichier
 */
export function createFileObjectURL(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Libère une URL d'objet
 */
export function revokeFileObjectURL(url: string): void {
  URL.revokeObjectURL(url);
}

// ==============================================
// COMPRESSION ET REDIMENSIONNEMENT
// ==============================================

/**
 * Compresse une image
 */
export function compressImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    outputFormat?: string;
  } = {}
): Promise<File> {
  return new Promise((resolve, reject) => {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      outputFormat = 'image/jpeg'
    } = options;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calcul des nouvelles dimensions
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      // Redimensionnement
      canvas.width = width;
      canvas.height = height;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: outputFormat,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Erreur lors de la compression'));
          }
        }, outputFormat, quality);
      } else {
        reject(new Error('Impossible de créer le contexte canvas'));
      }
    };

    img.onerror = () => reject(new Error('Erreur lors du chargement de l\'image'));
    img.src = createFileObjectURL(file);
  });
}

// ==============================================
// UTILITAIRES D'UPLOAD
// ==============================================

/**
 * Crée un FormData pour l'upload de fichiers
 */
export function createUploadFormData(
  files: File[],
  additionalData: Record<string, any> = {}
): FormData {
  const formData = new FormData();

  // Ajouter les fichiers
  files.forEach((file, index) => {
    formData.append(`files[${index}]`, file);
  });

  // Ajouter les données additionnelles
  Object.entries(additionalData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });

  return formData;
}

/**
 * Calcule la progression d'upload
 */
export function calculateUploadProgress(
  loaded: number,
  total: number,
  startTime: number
): FileUploadProgress {
  const elapsed = (Date.now() - startTime) / 1000; // en secondes
  const percentage = Math.round((loaded / total) * 100);
  const speed = elapsed > 0 ? loaded / elapsed : 0;
  const remainingBytes = total - loaded;
  const remainingTime = speed > 0 ? remainingBytes / speed : Infinity;

  return {
    loaded,
    total,
    percentage,
    speed,
    remainingTime: isFinite(remainingTime) ? remainingTime : 0,
  };
}

// ==============================================
// TÉLÉCHARGEMENT DE FICHIERS
// ==============================================

/**
 * Télécharge un fichier depuis une URL
 */
export function downloadFile(url: string, filename?: string): void {
  const link = document.createElement('a');
  link.href = url;
  if (filename) {
    link.download = filename;
  }
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Télécharge du contenu comme fichier
 */
export function downloadContent(
  content: string | Blob,
  filename: string,
  mimeType: string = 'text/plain'
): void {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  downloadFile(url, filename);
  URL.revokeObjectURL(url);
}

/**
 * Exporte des données en CSV
 */
export function exportToCSV(
  data: any[],
  headers: string[],
  filename: string = 'export.csv'
): void {
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header] || '';
      return typeof value === 'string' && (value.includes(',') || value.includes('"'))
        ? `"${value.replace(/"/g, '""')}"` 
        : value;
    }).join(','))
  ].join('\n');

  downloadContent(csvContent, filename, 'text/csv;charset=utf-8;');
}

// ==============================================
// UTILITAIRES SPÉCIALISÉS
// ==============================================

/**
 * Obtient les métadonnées d'une image
 */
export function getImageMetadata(file: File): Promise<{
  width: number;
  height: number;
  aspectRatio: number;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: img.naturalWidth / img.naturalHeight,
      });
      URL.revokeObjectURL(img.src);
    };
    
    img.onerror = () => {
      reject(new Error('Impossible de charger l\'image'));
      URL.revokeObjectURL(img.src);
    };
    
    img.src = createFileObjectURL(file);
  });
}

/**
 * Obtient la durée d'un fichier vidéo/audio
 */
export function getMediaDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const media = document.createElement(isVideoFile(file) ? 'video' : 'audio');
    
    media.onloadedmetadata = () => {
      resolve(media.duration);
      URL.revokeObjectURL(media.src);
    };
    
    media.onerror = () => {
      reject(new Error('Impossible de charger le fichier média'));
      URL.revokeObjectURL(media.src);
    };
    
    media.src = createFileObjectURL(file);
  });
}

/**
 * Génère une miniature pour une vidéo
 */
export function generateVideoThumbnail(
  file: File,
  timeInSeconds: number = 1
): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      video.currentTime = Math.min(timeInSeconds, video.duration);
    };
    
    video.onseeked = () => {
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const thumbnailDataURL = canvas.toDataURL('image/jpeg', 0.8);
        resolve(thumbnailDataURL);
        URL.revokeObjectURL(video.src);
      } else {
        reject(new Error('Impossible de créer le contexte canvas'));
      }
    };
    
    video.onerror = () => {
      reject(new Error('Erreur lors du chargement de la vidéo'));
      URL.revokeObjectURL(video.src);
    };
    
    video.src = createFileObjectURL(file);
  });
}