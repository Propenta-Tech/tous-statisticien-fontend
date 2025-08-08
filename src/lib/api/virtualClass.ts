/**
 * Service pour la gestion des classes virtuelles
 * Tous Statisticien Academy
 */

import { apiClient } from './client';
import { VirtualClass, CreateVirtualClassRequest, UpdateVirtualClassRequest } from '@/types';
import { ApiResponse, PaginatedResponse } from '@/types/api';

/**
 * Service pour les classes virtuelles
 */
export class VirtualClassService {
  /**
   * Récupère toutes les classes virtuelles
   * GET /api/virtual-classes/all
   */
  async getAllVirtualClasses(): Promise<VirtualClass[]> {
    try {
      const response = await apiClient.get<VirtualClass[]>('/virtual-classes/all');
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des classes virtuelles:', error);
      throw error;
    }
  }

  /**
   * Récupère les classes virtuelles avec pagination
   * GET /api/virtual-classes
   */
  async getVirtualClasses(
    page: number = 1,
    limit: number = 10,
    filters?: {
      search?: string;
      level?: string;
      status?: string;
    }
  ): Promise<PaginatedResponse<VirtualClass>> {
    try {
      const params: Record<string, string | number | boolean> = { page, limit };
      
      if (filters?.search) params.search = filters.search;
      if (filters?.level) params.level = filters.level;
      if (filters?.status) params.status = filters.status;

      return await apiClient.getPaginated<VirtualClass>('/virtual-classes', page, limit, params);
    } catch (error) {
      console.error('Erreur lors de la récupération des classes virtuelles paginées:', error);
      throw error;
    }
  }

  /**
   * Récupère une classe virtuelle par ID
   * GET /api/virtual-classes/{id}
   */
  async getVirtualClassById(id: string): Promise<VirtualClass | null> {
    try {
      const response = await apiClient.get<VirtualClass>(`/virtual-classes/${id}`);
      return response.data || null;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la classe virtuelle ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle classe virtuelle
   * POST /api/virtual-classes/create
   */
  async createVirtualClass(data: CreateVirtualClassRequest): Promise<VirtualClass> {
    try {
      const response = await apiClient.post<VirtualClass>('/virtual-classes/create', data);
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la création de la classe virtuelle:', error);
      throw error;
    }
  }

  /**
   * Met à jour une classe virtuelle
   * PUT /api/virtual-classes/update/{id}
   */
  async updateVirtualClass(id: string, data: UpdateVirtualClassRequest): Promise<VirtualClass> {
    try {
      const response = await apiClient.put<VirtualClass>(`/virtual-classes/update/${id}`, data);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la classe virtuelle ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprime une classe virtuelle
   * DELETE /api/virtual-classes/delete/{id}
   */
  async deleteVirtualClass(id: string): Promise<void> {
    try {
      await apiClient.delete(`/virtual-classes/delete/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la classe virtuelle ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les classes virtuelles d'un utilisateur
   * GET /api/virtual-classes/user/{userId}
   */
  async getUserVirtualClasses(userId: string): Promise<VirtualClass[]> {
    try {
      const response = await apiClient.get<VirtualClass[]>(`/virtual-classes/user/${userId}`);
      return response.data || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des classes de l'utilisateur ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Inscrit un utilisateur à une classe virtuelle
   * POST /api/virtual-classes/{classId}/enroll
   */
  async enrollInVirtualClass(classId: string, userId?: string): Promise<{ message: string }> {
    try {
      const data = userId ? { userId } : {};
      const response = await apiClient.post<{ message: string }>(`/virtual-classes/${classId}/enroll`, data);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de l'inscription à la classe ${classId}:`, error);
      throw error;
    }
  }

  /**
   * Désinscrit un utilisateur d'une classe virtuelle
   * DELETE /api/virtual-classes/{classId}/unenroll
   */
  async unenrollFromVirtualClass(classId: string, userId?: string): Promise<{ message: string }> {
    try {
      const params = userId ? { userId } : {};
      const response = await apiClient.delete<{ message: string }>(`/virtual-classes/${classId}/unenroll`, {
        headers: userId ? { 'X-User-ID': userId } : {},
      });
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la désinscription de la classe ${classId}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les étudiants inscrits à une classe virtuelle
   * GET /api/virtual-classes/{classId}/students
   */
  async getVirtualClassStudents(classId: string): Promise<Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    enrolledAt: string;
  }>> {
    try {
      const response = await apiClient.get<Array<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        enrolledAt: string;
      }>>(`/virtual-classes/${classId}/students`);
      return response.data || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des étudiants de la classe ${classId}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques d'une classe virtuelle
   * GET /api/virtual-classes/{classId}/stats
   */
  async getVirtualClassStats(classId: string): Promise<{
    totalStudents: number;
    totalModules: number;
    totalLectures: number;
    averageProgress: number;
    completionRate: number;
  }> {
    try {
      const response = await apiClient.get<{
        totalStudents: number;
        totalModules: number;
        totalLectures: number;
        averageProgress: number;
        completionRate: number;
      }>(`/virtual-classes/${classId}/stats`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la récupération des statistiques de la classe ${classId}:`, error);
      throw error;
    }
  }

  /**
   * Vérifie si un utilisateur est inscrit à une classe
   * GET /api/virtual-classes/{classId}/is-enrolled
   */
  async isUserEnrolled(classId: string, userId?: string): Promise<boolean> {
    try {
      const params = userId ? { userId } : {};
      const response = await apiClient.get<{ enrolled: boolean }>(`/virtual-classes/${classId}/is-enrolled`);
      return response.data?.enrolled || false;
    } catch (error) {
      console.error(`Erreur lors de la vérification d'inscription à la classe ${classId}:`, error);
      return false;
    }
  }

  /**
   * Duplique une classe virtuelle
   * POST /api/virtual-classes/{classId}/duplicate
   */
  async duplicateVirtualClass(classId: string, newName: string): Promise<VirtualClass> {
    try {
      const response = await apiClient.post<VirtualClass>(`/virtual-classes/${classId}/duplicate`, {
        name: newName,
      });
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la duplication de la classe ${classId}:`, error);
      throw error;
    }
  }

  /**
   * Archive une classe virtuelle
   * PUT /api/virtual-classes/{classId}/archive
   */
  async archiveVirtualClass(classId: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.put<{ message: string }>(`/virtual-classes/${classId}/archive`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de l'archivage de la classe ${classId}:`, error);
      throw error;
    }
  }

  /**
   * Restaure une classe virtuelle archivée
   * PUT /api/virtual-classes/{classId}/restore
   */
  async restoreVirtualClass(classId: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.put<{ message: string }>(`/virtual-classes/${classId}/restore`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la restauration de la classe ${classId}:`, error);
      throw error;
    }
  }

  /**
   * Recherche des classes virtuelles
   * GET /api/virtual-classes/search
   */
  async searchVirtualClasses(query: string, filters?: {
    level?: string;
    status?: string;
    limit?: number;
  }): Promise<VirtualClass[]> {
    try {
      const params: Record<string, string | number> = { q: query };
      
      if (filters?.level) params.level = filters.level;
      if (filters?.status) params.status = filters.status;
      if (filters?.limit) params.limit = filters.limit;

      const response = await apiClient.get<VirtualClass[]>('/virtual-classes/search', params);
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la recherche de classes virtuelles:', error);
      throw error;
    }
  }
}

/**
 * Instance par défaut du service des classes virtuelles
 */
export const virtualClassService = new VirtualClassService();

/**
 * Helper pour formater le niveau d'une classe
 */
export const formatClassLevel = (level: string): string => {
  const levelMap: Record<string, string> = {
    'BEGINNER': 'Débutant',
    'INTERMEDIATE': 'Intermédiaire',
    'ADVANCED': 'Avancé',
    'EXPERT': 'Expert',
  };
  return levelMap[level] || level;
};

/**
 * Helper pour obtenir la couleur associée à un niveau
 */
export const getClassLevelColor = (level: string): string => {
  const colorMap: Record<string, string> = {
    'BEGINNER': 'green',
    'INTERMEDIATE': 'blue',
    'ADVANCED': 'orange',
    'EXPERT': 'red',
  };
  return colorMap[level] || 'gray';
};

/**
 * Helper pour calculer la progression d'une classe
 */
export const calculateClassProgress = (
  completedModules: number,
  totalModules: number
): number => {
  if (totalModules === 0) return 0;
  return Math.round((completedModules / totalModules) * 100);
};

/**
 * Helper pour vérifier si une classe est accessible
 */
export const isClassAccessible = (virtualClass: VirtualClass, userHasPaid: boolean): boolean => {
  // Logique d'accès basée sur le paiement ou autres critères
  return userHasPaid || virtualClass.level === 'BEGINNER';
};