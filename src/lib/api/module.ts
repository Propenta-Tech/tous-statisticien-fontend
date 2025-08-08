/**
 * Service pour la gestion des modules
 * Tous Statisticien Academy
 */

import { apiClient } from './client';
import { Module, CreateModuleRequest, UpdateModuleRequest } from '@/types';
import { ApiResponse, PaginatedResponse } from '@/types/api';

/**
 * Service pour les modules
 */
export class ModuleService {
  /**
   * Récupère tous les modules
   * GET /api/modules/all
   */
  async getAllModules(): Promise<Module[]> {
    try {
      const response = await apiClient.get<Module[]>('/modules/all');
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des modules:', error);
      throw error;
    }
  }

  /**
   * Récupère les modules avec pagination
   * GET /api/modules
   */
  async getModules(
    page: number = 1,
    limit: number = 10,
    filters?: {
      search?: string;
      classId?: string;
      status?: string;
    }
  ): Promise<PaginatedResponse<Module>> {
    try {
      const params: Record<string, string | number | boolean> = { page, limit };
      
      if (filters?.search) params.search = filters.search;
      if (filters?.classId) params.classId = filters.classId;
      if (filters?.status) params.status = filters.status;

      return await apiClient.getPaginated<Module>('/modules', page, limit, params);
    } catch (error) {
      console.error('Erreur lors de la récupération des modules paginés:', error);
      throw error;
    }
  }

  /**
   * Récupère un module par ID
   * GET /api/modules/{id}
   */
  async getModuleById(id: string): Promise<Module | null> {
    try {
      const response = await apiClient.get<Module>(`/modules/${id}`);
      return response.data || null;
    } catch (error) {
      console.error(`Erreur lors de la récupération du module ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les modules d'une classe virtuelle
   * GET /api/modules/class/{classId}
   */
  async getModulesByClassId(classId: string): Promise<Module[]> {
    try {
      const response = await apiClient.get<Module[]>(`/modules/class/${classId}`);
      return response.data || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des modules de la classe ${classId}:`, error);
      throw error;
    }
  }

  /**
   * Crée un nouveau module
   * POST /api/modules/create
   */
  async createModule(data: CreateModuleRequest): Promise<Module> {
    try {
      const response = await apiClient.post<Module>('/modules/create', data);
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la création du module:', error);
      throw error;
    }
  }

  /**
   * Met à jour un module
   * PUT /api/modules/update/{id}
   */
  async updateModule(id: string, data: UpdateModuleRequest): Promise<Module> {
    try {
      const response = await apiClient.put<Module>(`/modules/update/${id}`, data);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du module ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprime un module
   * DELETE /api/modules/delete/{id}
   */
  async deleteModule(id: string): Promise<void> {
    try {
      await apiClient.delete(`/modules/delete/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression du module ${id}:`, error);
      throw error;
    }
  }

  /**
   * Réorganise l'ordre des modules dans une classe
   * PUT /api/modules/reorder
   */
  async reorderModules(classId: string, moduleOrders: Array<{ id: string; order: number }>): Promise<{ message: string }> {
    try {
      const response = await apiClient.put<{ message: string }>('/modules/reorder', {
        classId,
        moduleOrders,
      });
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la réorganisation des modules:', error);
      throw error;
    }
  }

  /**
   * Duplique un module
   * POST /api/modules/{id}/duplicate
   */
  async duplicateModule(id: string, newTitle: string, targetClassId?: string): Promise<Module> {
    try {
      const response = await apiClient.post<Module>(`/modules/${id}/duplicate`, {
        title: newTitle,
        targetClassId,
      });
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la duplication du module ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques d'un module
   * GET /api/modules/{id}/stats
   */
  async getModuleStats(id: string): Promise<{
    totalLectures: number;
    totalEvaluations: number;
    completionRate: number;
    averageGrade: number;
    studentsCount: number;
  }> {
    try {
      const response = await apiClient.get<{
        totalLectures: number;
        totalEvaluations: number;
        completionRate: number;
        averageGrade: number;
        studentsCount: number;
      }>(`/modules/${id}/stats`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la récupération des statistiques du module ${id}:`, error);
      throw error;
    }
  }

  /**
   * Marque un module comme terminé pour un utilisateur
   * POST /api/modules/{id}/complete
   */
  async markModuleAsCompleted(id: string, userId?: string): Promise<{ message: string }> {
    try {
      const data = userId ? { userId } : {};
      const response = await apiClient.post<{ message: string }>(`/modules/${id}/complete`, data);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors du marquage du module ${id} comme terminé:`, error);
      throw error;
    }
  }

/**
 * Récupère la progression d'un utilisateur dans un module
 * GET /api/modules/{id}/progress
 */
async getModuleProgress(id: string, userId?: string): Promise<{
  completed: boolean;
  progress: number;
  completedLectures: number;
  totalLectures: number;
  lastAccessedAt: string | null;
}> {
  try {
    const params: Record<string, string> = {};
    if (userId) {
      params.userId = userId;
    }
    const response = await apiClient.get<{
      completed: boolean;
      progress: number;
      completedLectures: number;
      totalLectures: number;
      lastAccessedAt: string | null;
    }>(`/modules/${id}/progress`, params);
    return response.data!;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la progression du module ${id}:`, error);
    throw error;
  }
}

  /**
   * Recherche des modules
   * GET /api/modules/search
   */
  async searchModules(query: string, filters?: {
    classId?: string;
    status?: string;
    limit?: number;
  }): Promise<Module[]> {
    try {
      const params: Record<string, string | number> = { q: query };
      
      if (filters?.classId) params.classId = filters.classId;
      if (filters?.status) params.status = filters.status;
      if (filters?.limit) params.limit = filters.limit;

      const response = await apiClient.get<Module[]>('/modules/search', params);
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la recherche de modules:', error);
      throw error;
    }
  }

  /**
   * Exporte un module
   * GET /api/modules/{id}/export
   */
  async exportModule(id: string, format: 'json' | 'pdf' = 'json'): Promise<Blob> {
    try {
      const response = await fetch(`${apiClient['baseUrl']}/modules/${id}/export?format=${format}`, {
        method: 'GET',
        headers: apiClient['prepareHeaders'](),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error(`Erreur lors de l'export du module ${id}:`, error);
      throw error;
    }
  }

  /**
   * Importe un module depuis un fichier
   * POST /api/modules/import
   */
  async importModule(file: File, classId: string): Promise<Module> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('classId', classId);

      const response = await apiClient.uploadFile<Module>('/modules/import', formData);
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de l\'import du module:', error);
      throw error;
    }
  }

  /**
   * Publie ou dépublie un module
   * PUT /api/modules/{id}/publish
   */
  async toggleModulePublish(id: string, published: boolean): Promise<Module> {
    try {
      const response = await apiClient.put<Module>(`/modules/${id}/publish`, { published });
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la publication/dépublication du module ${id}:`, error);
      throw error;
    }
  }
}

/**
 * Instance par défaut du service des modules
 */
export const moduleService = new ModuleService();

/**
 * Helper pour calculer la progression d'un module
 */
export const calculateModuleProgress = (
  completedLectures: number,
  totalLectures: number
): number => {
  if (totalLectures === 0) return 0;
  return Math.round((completedLectures / totalLectures) * 100);
};

/**
 * Helper pour formater la durée estimée d'un module
 */
export const formatModuleDuration = (lectures: number, avgLectureDuration: number = 30): string => {
  const totalMinutes = lectures * avgLectureDuration;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours === 0) {
    return `${minutes} min`;
  }
  
  return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
};

/**
 * Helper pour obtenir le statut d'un module
 */
export const getModuleStatus = (module: Module): 'draft' | 'published' | 'archived' => {
  // Logique basée sur les propriétés du module
  if (module.archivedAt) return 'archived';
  if (module.publishedAt) return 'published';
  return 'draft';
};

/**
 * Helper pour vérifier si un module est accessible
 */
export const isModuleAccessible = (
  module: Module,
  userProgress?: { completed: boolean; progress: number }
): boolean => {
  const status = getModuleStatus(module);
  return status === 'published' && (userProgress?.progress ?? 0) >= 0;
};