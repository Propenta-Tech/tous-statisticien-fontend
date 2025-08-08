/**
 * Service pour la gestion des lectures (cours)
 * Tous Statisticien Academy
 */

import { apiClient } from './client';
import { Lecture, CreateLectureRequest, UpdateLectureRequest, LectureType } from '@/types';
import { ApiResponse, PaginatedResponse } from '@/types/api';

/**
 * Service pour les lectures
 */
export class LectureService {
  /**
   * Récupère toutes les lectures
   * GET /api/lectures/all
   */
  async getAllLectures(): Promise<Lecture[]> {
    try {
      const response = await apiClient.get<Lecture[]>('/lectures/all');
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des lectures:', error);
      throw error;
    }
  }

  /**
   * Récupère les lectures avec pagination
   * GET /api/lectures
   */
  async getLectures(
    page: number = 1,
    limit: number = 10,
    filters?: {
      search?: string;
      moduleId?: string;
      type?: LectureType;
      status?: string;
    }
  ): Promise<PaginatedResponse<Lecture>> {
    try {
      const params: Record<string, string | number | boolean> = { page, limit };
      
      if (filters?.search) params.search = filters.search;
      if (filters?.moduleId) params.moduleId = filters.moduleId;
      if (filters?.type) params.type = filters.type;
      if (filters?.status) params.status = filters.status;

      return await apiClient.getPaginated<Lecture>('/lectures', page, limit, params);
    } catch (error) {
      console.error('Erreur lors de la récupération des lectures paginées:', error);
      throw error;
    }
  }

  /**
   * Récupère une lecture par ID
   * GET /api/lectures/{id}
   */
  async getLectureById(id: string): Promise<Lecture | null> {
    try {
      const response = await apiClient.get<Lecture>(`/lectures/${id}`);
      return response.data || null;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la lecture ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les lectures d'un module
   * GET /api/lectures/module/{moduleId}
   */
  async getLecturesByModuleId(moduleId: string): Promise<Lecture[]> {
    try {
      const response = await apiClient.get<Lecture[]>(`/lectures/module/${moduleId}`);
      return response.data || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des lectures du module ${moduleId}:`, error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle lecture avec fichier
   * POST /api/lectures/create
   */
  async createLectureWithFile(
    data: CreateLectureRequest,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<Lecture> {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('type', data.type);
      formData.append('moduleId', data.moduleId);
      formData.append('file', file);

      if (data.description) {
        formData.append('description', data.description);
      }

      const response = await apiClient.uploadFile<Lecture>('/lectures/create', formData, {
        onProgress,
      });
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la création de la lecture:', error);
      throw error;
    }
  }

  /**
   * Met à jour une lecture avec fichier
   * PUT /api/lectures/update/{id}
   */
  async updateLectureWithFile(
    id: string,
    data: UpdateLectureRequest,
    file?: File,
    onProgress?: (progress: number) => void
  ): Promise<Lecture> {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('type', data.type);
      formData.append('moduleId', data.moduleId);

      if (file) {
        formData.append('file', file);
      }

      if (data.description) {
        formData.append('description', data.description);
      }

      const response = await apiClient.uploadFile<Lecture>(`/lectures/update/${id}`, formData, {
        onProgress,
      });
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la lecture ${id}:`, error);
      throw error;
    }
  }

  /**
   * Met à jour une lecture sans fichier
   * PUT /api/lectures/update-info/{id}
   */
  async updateLectureInfo(id: string, data: Partial<UpdateLectureRequest>): Promise<Lecture> {
    try {
      const response = await apiClient.put<Lecture>(`/lectures/update-info/${id}`, data);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour des informations de la lecture ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprime une lecture
   * DELETE /api/lectures/delete/{id}
   */
  async deleteLecture(id: string): Promise<void> {
    try {
      await apiClient.delete(`/lectures/delete/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la lecture ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère l'URL de streaming sécurisée pour une vidéo
   * GET /api/lectures/{id}/stream-url
   */
  async getStreamingUrl(id: string): Promise<{ url: string; expiresAt: string }> {
    try {
      const response = await apiClient.get<{ url: string; expiresAt: string }>(`/lectures/${id}/stream-url`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'URL de streaming pour la lecture ${id}:`, error);
      throw error;
    }
  }

  /**
   * Marque une lecture comme vue/terminée
   * POST /api/lectures/{id}/mark-viewed
   */
  async markLectureAsViewed(
    id: string,
    data: {
      watchedDuration: number;
      totalDuration: number;
      completed: boolean;
      userId?: string;
    }
  ): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>(`/lectures/${id}/mark-viewed`, data);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors du marquage de la lecture ${id} comme vue:`, error);
      throw error;
    }
  }

  /**
   * Récupère la progression de visionnage d'une lecture
   * GET /api/lectures/{id}/progress
   */
  async getLectureProgress(id: string, userId?: string): Promise<{
    watchedDuration: number;
    totalDuration: number;
    progress: number;
    completed: boolean;
    lastPosition: number;
    viewCount: number;
  }> {
    try {
      const params: Record<string, string> | undefined = userId ? { userId } : undefined;
      
      const response = await apiClient.get<{
        watchedDuration: number;
        totalDuration: number;
        progress: number;
        completed: boolean;
        lastPosition: number;
        viewCount: number;
      }>(`/lectures/${id}/progress`, params);
      
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la progression de la lecture ${id}:`, error);
      throw error;
    }
  }

  /**
   * Sauvegarde la position de lecture
   * POST /api/lectures/{id}/save-position
   */
  async saveLecturePosition(
    id: string,
    position: number,
    userId?: string
  ): Promise<{ message: string }> {
    try {
      const data = { position, userId };
      const response = await apiClient.post<{ message: string }>(`/lectures/${id}/save-position`, data);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde de la position de la lecture ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les commentaires d'une lecture
   * GET /api/lectures/{id}/comments
   */
  async getLectureComments(id: string): Promise<Array<{
    id: string;
    userId: string;
    userName: string;
    comment: string;
    timestamp: number;
    createdAt: string;
  }>> {
    try {
      const response = await apiClient.get<Array<{
        id: string;
        userId: string;
        userName: string;
        comment: string;
        timestamp: number;
        createdAt: string;
      }>>(`/lectures/${id}/comments`);
      return response.data || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des commentaires de la lecture ${id}:`, error);
      throw error;
    }
  }

  /**
   * Ajoute un commentaire à une lecture
   * POST /api/lectures/{id}/comments
   */
  async addLectureComment(
    id: string,
    data: {
      comment: string;
      timestamp: number;
    }
  ): Promise<{
    id: string;
    userId: string;
    userName: string;
    comment: string;
    timestamp: number;
    createdAt: string;
  }> {
    try {
      const response = await apiClient.post<{
        id: string;
        userId: string;
        userName: string;
        comment: string;
        timestamp: number;
        createdAt: string;
      }>(`/lectures/${id}/comments`, data);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de l'ajout d'un commentaire à la lecture ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprime un commentaire d'une lecture
   * DELETE /api/lectures/{lectureId}/comments/{commentId}
   */
  async deleteLectureComment(lectureId: string, commentId: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(`/lectures/${lectureId}/comments/${commentId}`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la suppression du commentaire ${commentId}:`, error);
      throw error;
    }
  }

  /**
   * Télécharge une lecture (si autorisé)
   * GET /api/lectures/{id}/download
   */
  async downloadLecture(id: string): Promise<Blob> {
    try {
      const response = await fetch(`${apiClient['baseUrl']}/lectures/${id}/download`, {
        method: 'GET',
        headers: apiClient['prepareHeaders'](),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error(`Erreur lors du téléchargement de la lecture ${id}:`, error);
      throw error;
    }
  }

  /**
   * Génère les sous-titres automatiques pour une vidéo
   * POST /api/lectures/{id}/generate-subtitles
   */
  async generateSubtitles(id: string, language: string = 'fr'): Promise<{ message: string; jobId: string }> {
    try {
      const response = await apiClient.post<{ message: string; jobId: string }>(`/lectures/${id}/generate-subtitles`, {
        language,
      });
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la génération des sous-titres pour la lecture ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les sous-titres d'une lecture
   * GET /api/lectures/{id}/subtitles
   */
  async getLectureSubtitles(id: string, language: string = 'fr'): Promise<string> {
    try {
      const response = await apiClient.get<string>(`/lectures/${id}/subtitles`, { language });
      return response.data || '';
    } catch (error) {
      console.error(`Erreur lors de la récupération des sous-titres de la lecture ${id}:`, error);
      throw error;
    }
  }

  /**
   * Recherche des lectures
   * GET /api/lectures/search
   */
  async searchLectures(query: string, filters?: {
    moduleId?: string;
    type?: LectureType;
    status?: string;
    limit?: number;
  }): Promise<Lecture[]> {
    try {
      const params: Record<string, string | number> = { q: query };
      
      if (filters?.moduleId) params.moduleId = filters.moduleId;
      if (filters?.type) params.type = filters.type;
      if (filters?.status) params.status = filters.status;
      if (filters?.limit) params.limit = filters.limit;

      const response = await apiClient.get<Lecture[]>('/lectures/search', params);
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la recherche de lectures:', error);
      throw error;
    }
  }

  /**
   * Duplique une lecture
   * POST /api/lectures/{id}/duplicate
   */
  async duplicateLecture(id: string, newTitle: string, targetModuleId?: string): Promise<Lecture> {
    try {
      const response = await apiClient.post<Lecture>(`/lectures/${id}/duplicate`, {
        title: newTitle,
        targetModuleId,
      });
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la duplication de la lecture ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques d'une lecture
   * GET /api/lectures/{id}/stats
   */
  async getLectureStats(id: string): Promise<{
    totalViews: number;
    uniqueViewers: number;
    averageWatchTime: number;
    completionRate: number;
    commentsCount: number;
    averageRating: number;
  }> {
    try {
      const response = await apiClient.get<{
        totalViews: number;
        uniqueViewers: number;
        averageWatchTime: number;
        completionRate: number;
        commentsCount: number;
        averageRating: number;
      }>(`/lectures/${id}/stats`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la récupération des statistiques de la lecture ${id}:`, error);
      throw error;
    }
  }
}

/**
 * Instance par défaut du service des lectures
 */
export const lectureService = new LectureService();

/**
 * Helper pour formater le type de lecture
 */
export const formatLectureType = (type: LectureType): string => {
  const typeMap: Record<LectureType, string> = {
    VIDEO: 'Vidéo',
    PDF: 'Document PDF',
    AUDIO: 'Audio',
    TEXT: 'Texte',
    INTERACTIVE: 'Interactif',
    DOCUMENT: 'Document',
    PRESENTATION: 'Présentation',
    QUIZ: 'Quiz',
  };
  return typeMap[type] || type;
};

/**
 * Helper pour obtenir l'icône associée à un type de lecture
 */
export const getLectureTypeIcon = (type: LectureType): string => {
  const iconMap: Record<LectureType, string> = {
    VIDEO: 'video',
    PDF: 'file-text',
    AUDIO: 'volume-2',
    TEXT: 'file-text',
    INTERACTIVE: 'monitor',
    DOCUMENT: 'file',
    PRESENTATION: 'presentation',
    QUIZ: 'help-circle',
  };
  return iconMap[type] || 'file';
};

// For the AP

/**
 * Helper pour formater la durée d'une lecture
 */
export const formatLectureDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Helper pour calculer le pourcentage de progression
 */
export const calculateLectureProgress = (watchedDuration: number, totalDuration: number): number => {
  if (totalDuration === 0) return 0;
  return Math.round((watchedDuration / totalDuration) * 100);
};

/**
 * Helper pour vérifier si une lecture est complétée
 */
export const isLectureCompleted = (watchedDuration: number, totalDuration: number, threshold: number = 0.9): boolean => {
  if (totalDuration === 0) return false;
  return (watchedDuration / totalDuration) >= threshold;
};

/**
 * Helper pour obtenir la couleur de progression
 */
export const getProgressColor = (progress: number): string => {
  if (progress >= 90) return 'green';
  if (progress >= 70) return 'blue';
  if (progress >= 50) return 'yellow';
  if (progress >= 25) return 'orange';
  return 'red';
};

/**
 * Helper pour vérifier si une lecture est accessible
 */
export const isLectureAccessible = (
  lecture: Lecture,
  userHasPaid: boolean,
  moduleProgress?: { completed: boolean }
): boolean => {
  // Logique d'accès basée sur le paiement et la progression
  return userHasPaid || lecture.type === 'TEXT' || moduleProgress?.completed === true;
};