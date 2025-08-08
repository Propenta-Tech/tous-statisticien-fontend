/**
 * Service pour la gestion des uploads de fichiers
 * Tous Statisticien Academy
 */

import { apiClient } from './client';
import { ApiResponse } from '@/types/api';

/**
 * Interface pour les options d'upload
 */
interface UploadOptions {
  onProgress?: (progress: number) => void;
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: Error) => void;
  maxSize?: number; // en bytes
  allowedTypes?: string[];
  compress?: boolean;
  generateThumbnail?: boolean;
}

/**
 * Interface pour le résultat d'upload
 */
interface UploadResult {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
  thumbnailUrl?: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    fps?: number;
  };
  uploadedAt: string;
}

/**
 * Interface pour l'upload par chunks
 */
interface ChunkUploadSession {
  sessionId: string;
  chunkSize: number;
  totalChunks: number;
  uploadedChunks: number;
  filename: string;
  totalSize: number;
}

/**
 * Service pour les uploads
 */
export class UploadService {
  private activeUploads = new Map<string, AbortController>();

  /**
   * Upload simple d'un fichier
   * POST /api/upload/single
   */
  async uploadSingleFile(
    file: File,
    category: 'avatar' | 'lecture' | 'resource' | 'evaluation' | 'other' = 'other',
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    try {
      // Validation de la taille
      if (options.maxSize && file.size > options.maxSize) {
        throw new Error(`Le fichier est trop volumineux. Taille maximum : ${this.formatFileSize(options.maxSize)}`);
      }

      // Validation du type
      if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
        throw new Error(`Type de fichier non autorisé. Types acceptés : ${options.allowedTypes.join(', ')}`);
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);

      if (options.compress) {
        formData.append('compress', 'true');
      }

      if (options.generateThumbnail) {
        formData.append('generateThumbnail', 'true');
      }

      const uploadId = this.generateUploadId();
      const controller = new AbortController();
      this.activeUploads.set(uploadId, controller);

      try {
        const response = await apiClient.uploadFile<UploadResult>('/upload/single', formData, {
          onProgress: options.onProgress,
          signal: controller.signal,
        });

        const result = response.data!;
        options.onSuccess?.(result);
        return result;
      } finally {
        this.activeUploads.delete(uploadId);
      }
    } catch (error) {
      const uploadError = error instanceof Error ? error : new Error('Erreur d\'upload inconnue');
      options.onError?.(uploadError);
      console.error('Erreur lors de l\'upload du fichier:', uploadError);
      throw uploadError;
    }
  }

  /**
   * Upload multiple de fichiers
   * POST /api/upload/multiple
   */
  async uploadMultipleFiles(
    files: FileList | File[],
    category: string = 'other',
    options: UploadOptions = {}
  ): Promise<UploadResult[]> {
    try {
      const fileArray = Array.from(files);
      const formData = new FormData();

      fileArray.forEach((file, index) => {
        // Validation de chaque fichier
        if (options.maxSize && file.size > options.maxSize) {
          throw new Error(`Le fichier "${file.name}" est trop volumineux`);
        }

        if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
          throw new Error(`Type de fichier non autorisé pour "${file.name}"`);
        }

        formData.append(`files`, file);
      });

      formData.append('category', category);

      if (options.compress) {
        formData.append('compress', 'true');
      }

      if (options.generateThumbnail) {
        formData.append('generateThumbnail', 'true');
      }

      const uploadId = this.generateUploadId();
      const controller = new AbortController();
      this.activeUploads.set(uploadId, controller);

      try {
        const response = await apiClient.uploadFile<UploadResult[]>('/upload/multiple', formData, {
          onProgress: options.onProgress,
          signal: controller.signal,
        });

        const results = response.data!;
        options.onSuccess?.(results as unknown as UploadResult);
        return results;
      } finally {
        this.activeUploads.delete(uploadId);
      }
    } catch (error) {
      const uploadError = error instanceof Error ? error : new Error('Erreur d\'upload multiple inconnue');
      options.onError?.(uploadError);
      console.error('Erreur lors de l\'upload multiple:', uploadError);
      throw uploadError;
    }
  }

  /**
   * Initie un upload par chunks pour les gros fichiers
   * POST /api/upload/chunks/init
   */
  async initChunkUpload(
    file: File,
    category: string = 'other',
    chunkSize: number = 5 * 1024 * 1024 // 5MB par défaut
  ): Promise<ChunkUploadSession> {
    try {
      const totalChunks = Math.ceil(file.size / chunkSize);

      const response = await apiClient.post<ChunkUploadSession>('/upload/chunks/init', {
        filename: file.name,
        totalSize: file.size,
        chunkSize,
        totalChunks,
        mimeType: file.type,
        category,
      });

      return response.data!;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'upload par chunks:', error);
      throw error;
    }
  }

  /**
   * Upload un chunk spécifique
   * POST /api/upload/chunks/{sessionId}/{chunkIndex}
   */
  async uploadChunk(
    sessionId: string,
    chunkIndex: number,
    chunk: Blob,
    options: { onProgress?: (progress: number) => void } = {}
  ): Promise<{ uploaded: boolean; nextChunk?: number }> {
    try {
      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('chunkIndex', chunkIndex.toString());

      const response = await apiClient.uploadFile<{ uploaded: boolean; nextChunk?: number }>(
        `/upload/chunks/${sessionId}/${chunkIndex}`,
        formData,
        {
          onProgress: options.onProgress,
        }
      );

      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de l'upload du chunk ${chunkIndex}:`, error);
      throw error;
    }
  }

  /**
   * Finalise l'upload par chunks
   * POST /api/upload/chunks/{sessionId}/complete
   */
  async completeChunkUpload(sessionId: string): Promise<UploadResult> {
    try {
      const response = await apiClient.post<UploadResult>(`/upload/chunks/${sessionId}/complete`);
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la finalisation de l\'upload par chunks:', error);
      throw error;
    }
  }

  /**
   * Upload d'un gros fichier avec gestion automatique des chunks
   */
  async uploadLargeFile(
    file: File,
    category: string = 'other',
    options: UploadOptions & { chunkSize?: number } = {}
  ): Promise<UploadResult> {
    try {
      const chunkSize = options.chunkSize || 5 * 1024 * 1024; // 5MB
      const session = await this.initChunkUpload(file, category, chunkSize);

      let uploadedBytes = 0;
      const totalBytes = file.size;

      for (let i = 0; i < session.totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);

        await this.uploadChunk(session.sessionId, i, chunk, {
          onProgress: (chunkProgress) => {
            const currentChunkBytes = (end - start) * (chunkProgress / 100);
            const totalProgress = ((uploadedBytes + currentChunkBytes) / totalBytes) * 100;
            options.onProgress?.(totalProgress);
          },
        });

        uploadedBytes = end;
        options.onProgress?.((uploadedBytes / totalBytes) * 100);
      }

      const result = await this.completeChunkUpload(session.sessionId);
      options.onSuccess?.(result);
      return result;
    } catch (error) {
      const uploadError = error instanceof Error ? error : new Error('Erreur d\'upload de gros fichier');
      options.onError?.(uploadError);
      throw uploadError;
    }
  }

  /**
   * Upload d'image avec redimensionnement
   * POST /api/upload/image
   */
  async uploadImage(
    file: File,
    options: UploadOptions & {
      resize?: {
        width?: number;
        height?: number;
        quality?: number;
      };
    } = {}
  ): Promise<UploadResult> {
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image');
      }

      const formData = new FormData();
      formData.append('image', file);

      if (options.resize) {
        formData.append('resize', JSON.stringify(options.resize));
      }

      if (options.generateThumbnail) {
        formData.append('generateThumbnail', 'true');
      }

      const response = await apiClient.uploadFile<UploadResult>('/upload/image', formData, {
        onProgress: options.onProgress,
      });

      const result = response.data!;
      options.onSuccess?.(result);
      return result;
    } catch (error) {
      const uploadError = error instanceof Error ? error : new Error('Erreur d\'upload d\'image');
      options.onError?.(uploadError);
      throw uploadError;
    }
  }

  /**
   * Upload de vidéo avec traitement
   * POST /api/upload/video
   */
  async uploadVideo(
    file: File,
    options: UploadOptions & {
      transcode?: {
        quality?: 'low' | 'medium' | 'high';
        format?: 'mp4' | 'webm';
      };
    } = {}
  ): Promise<UploadResult> {
    try {
      if (!file.type.startsWith('video/')) {
        throw new Error('Le fichier doit être une vidéo');
      }

      const formData = new FormData();
      formData.append('video', file);

      if (options.transcode) {
        formData.append('transcode', JSON.stringify(options.transcode));
      }

      if (options.generateThumbnail) {
        formData.append('generateThumbnail', 'true');
      }

      const response = await apiClient.uploadFile<UploadResult>('/upload/video', formData, {
        onProgress: options.onProgress,
      });

      const result = response.data!;
      options.onSuccess?.(result);
      return result;
    } catch (error) {
      const uploadError = error instanceof Error ? error : new Error('Erreur d\'upload de vidéo');
      options.onError?.(uploadError);
      throw uploadError;
    }
  }

  /**
   * Récupère les informations d'un fichier uploadé
   * GET /api/upload/{fileId}
   */
  async getFileInfo(fileId: string): Promise<UploadResult> {
    try {
      const response = await apiClient.get<UploadResult>(`/upload/${fileId}`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la récupération des informations du fichier ${fileId}:`, error);
      throw error;
    }
  }

  /**
   * Supprime un fichier uploadé
   * DELETE /api/upload/{fileId}
   */
  async deleteFile(fileId: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(`/upload/${fileId}`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la suppression du fichier ${fileId}:`, error);
      throw error;
    }
  }

  /**
   * Annule un upload en cours
   */
  cancelUpload(uploadId: string): boolean {
    const controller = this.activeUploads.get(uploadId);
    if (controller) {
      controller.abort();
      this.activeUploads.delete(uploadId);
      return true;
    }
    return false;
  }

  /**
   * Annule tous les uploads en cours
   */
  cancelAllUploads(): void {
    this.activeUploads.forEach(controller => controller.abort());
    this.activeUploads.clear();
  }

  /**
   * Vérifie si un type de fichier est autorisé
   */
  isFileTypeAllowed(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }

  /**
   * Vérifie si la taille du fichier est acceptable
   */
  isFileSizeValid(file: File, maxSize: number): boolean {
    return file.size <= maxSize;
  }

  /**
   * Compresse une image avant upload
   */
  async compressImage(
    file: File,
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    } = {}
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const { maxWidth = 1920, maxHeight = 1080, quality = 0.8 } = options;

        let { width, height } = img;

        // Calcul des nouvelles dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Erreur lors de la compression de l\'image'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Impossible de charger l\'image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Génère un ID unique pour l'upload
   */
  private generateUploadId(): string {
    return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Formate la taille d'un fichier
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
}

/**
 * Instance par défaut du service d'upload
 */
export const uploadService = new UploadService();

/**
 * Constantes pour les types de fichiers autorisés
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo', // AVI
];

export const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/mp3',
  'audio/aac',
];

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
];

/**
 * Tailles maximales par type de fichier
 */
export const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024, // 10MB
  video: 500 * 1024 * 1024, // 500MB
  audio: 50 * 1024 * 1024, // 50MB
  document: 25 * 1024 * 1024, // 25MB
  other: 100 * 1024 * 1024, // 100MB
};