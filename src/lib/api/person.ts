/**
 * Service pour la gestion des personnes (utilisateurs)
 * Tous Statisticien Academy
 */

import { apiClient } from './client';
import { Person, CreatePersonRequest, UpdatePersonRequest, Role } from '@/types';
import { ApiResponse, PaginatedResponse } from '@/types/api';

/**
 * Interface pour les filtres de recherche
 */
interface PersonFilters {
  search?: string;
  role?: Role;
  hasPaid?: boolean;
  country?: string;
  dateFrom?: string;
  dateTo?: string;
  isActive?: boolean;
}

/**
 * Service pour les personnes
 */
export class PersonService {
  /**
   * Récupère toutes les personnes
   * GET /api/persons/all
   */
  async getAllPersons(): Promise<Person[]> {
    try {
      const response = await apiClient.get<Person[]>('/persons/all');
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des personnes:', error);
      throw error;
    }
  }

  /**
   * Récupère les personnes avec pagination
   * GET /api/persons
   */
  async getPersons(
    page: number = 1,
    limit: number = 10,
    filters?: PersonFilters
  ): Promise<PaginatedResponse<Person>> {
    try {
      const params: Record<string, string | number | boolean> = { page, limit };
      
      if (filters?.search) params.search = filters.search;
      if (filters?.role) params.role = filters.role;
      if (filters?.hasPaid !== undefined) params.hasPaid = filters.hasPaid;
      if (filters?.country) params.country = filters.country;
      if (filters?.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters?.dateTo) params.dateTo = filters.dateTo;
      if (filters?.isActive !== undefined) params.isActive = filters.isActive;

      return await apiClient.getPaginated<Person>('/persons', page, limit, params);
    } catch (error) {
      console.error('Erreur lors de la récupération des personnes paginées:', error);
      throw error;
    }
  }

  /**
   * Récupère une personne par ID
   * GET /api/persons/{id}
   */
  async getPersonById(id: string): Promise<Person | null> {
    try {
      const response = await apiClient.get<Person>(`/persons/${id}`);
      return response.data || null;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la personne ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle personne (admin uniquement)
   * POST /api/persons/create
   */
  async createPerson(data: CreatePersonRequest): Promise<Person> {
    try {
      const response = await apiClient.post<Person>('/persons/create', data);
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la création de la personne:', error);
      throw error;
    }
  }

  /**
   * Met à jour une personne
   * PUT /api/persons/update/{id}
   */
  async updatePerson(id: string, data: UpdatePersonRequest): Promise<Person> {
    try {
      const response = await apiClient.put<Person>(`/persons/update/${id}`, data);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la personne ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprime une personne
   * DELETE /api/persons/delete/{id}
   */
  async deletePerson(id: string): Promise<void> {
    try {
      await apiClient.delete(`/persons/delete/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la personne ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère le profil d'une personne avec ses statistiques
   * GET /api/persons/{id}/profile
   */
  async getPersonProfile(id: string): Promise<{
    person: Person;
    stats: {
      totalClasses: number;
      completedModules: number;
      averageGrade: number;
      totalWatchTime: number;
      lastActivity: string;
      achievements: Array<{
        id: string;
        title: string;
        description: string;
        earnedAt: string;
        icon: string;
      }>;
    };
  }> {
    try {
      const response = await apiClient.get<{
        person: Person;
        stats: {
          totalClasses: number;
          completedModules: number;
          averageGrade: number;
          totalWatchTime: number;
          lastActivity: string;
          achievements: Array<{
            id: string;
            title: string;
            description: string;
            earnedAt: string;
            icon: string;
          }>;
        };
      }>(`/persons/${id}/profile`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la récupération du profil de la personne ${id}:`, error);
      throw error;
    }
  }

  /**
   * Met à jour l'avatar d'une personne
   * PUT /api/persons/{id}/avatar
   */
  async updatePersonAvatar(
    id: string,
    avatarFile: File,
    onProgress?: (progress: number) => void
  ): Promise<{ avatarUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await apiClient.uploadFile<{ avatarUrl: string }>(`/persons/${id}/avatar`, formData, {
        onProgress,
      });
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'avatar de la personne ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprime l'avatar d'une personne
   * DELETE /api/persons/{id}/avatar
   */
  async deletePersonAvatar(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(`/persons/${id}/avatar`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'avatar de la personne ${id}:`, error);
      throw error;
    }
  }

  /**
   * Change le rôle d'une personne (admin uniquement)
   * PUT /api/persons/{id}/role
   */
  async changePersonRole(id: string, newRole: Role): Promise<Person> {
    try {
      const response = await apiClient.put<Person>(`/persons/${id}/role`, { role: newRole });
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors du changement de rôle de la personne ${id}:`, error);
      throw error;
    }
  }

  /**
   * Active ou désactive une personne
   * PUT /api/persons/{id}/toggle-status
   */
  async togglePersonStatus(id: string, isActive: boolean): Promise<Person> {
    try {
      const response = await apiClient.put<Person>(`/persons/${id}/toggle-status`, { isActive });
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors du changement de statut de la personne ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère l'historique des activités d'une personne
   * GET /api/persons/{id}/activity-log
   */
  async getPersonActivityLog(
    id: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<{
    id: string;
    action: string;
    description: string;
    createdAt: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, unknown>;
  }>> {
    try {
      return await apiClient.getPaginated(`/persons/${id}/activity-log`, page, limit);
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'historique d'activité de la personne ${id}:`, error);
      throw error;
    }
  }

  /**
   * Envoie un email de bienvenue à une personne
   * POST /api/persons/{id}/send-welcome-email
   */
  async sendWelcomeEmail(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>(`/persons/${id}/send-welcome-email`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de l'envoi de l'email de bienvenue à la personne ${id}:`, error);
      throw error;
    }
  }

  /**
   * Réinitialise le mot de passe d'une personne (admin uniquement)
   * POST /api/persons/{id}/reset-password
   */
  async resetPersonPassword(id: string): Promise<{ temporaryPassword: string }> {
    try {
      const response = await apiClient.post<{ temporaryPassword: string }>(`/persons/${id}/reset-password`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la réinitialisation du mot de passe de la personne ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les classes d'une personne
   * GET /api/persons/{id}/classes
   */
  async getPersonClasses(id: string): Promise<Array<{
    id: string;
    name: string;
    level: string;
    progress: number;
    enrolledAt: string;
    lastAccessedAt?: string;
    isCompleted: boolean;
  }>> {
    try {
      const response = await apiClient.get<Array<{
        id: string;
        name: string;
        level: string;
        progress: number;
        enrolledAt: string;
        lastAccessedAt?: string;
        isCompleted: boolean;
      }>>(`/persons/${id}/classes`);
      return response.data || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des classes de la personne ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les notes d'une personne
   * GET /api/persons/{id}/grades
   */
  async getPersonGrades(id: string): Promise<Array<{
    evaluationId: string;
    evaluationTitle: string;
    moduleTitle: string;
    score: number;
    maxScore: number;
    percentage: number;
    grade: string;
    submittedAt: string;
    gradedAt: string;
  }>> {
    try {
      const response = await apiClient.get<Array<{
        evaluationId: string;
        evaluationTitle: string;
        moduleTitle: string;
        score: number;
        maxScore: number;
        percentage: number;
        grade: string;
        submittedAt: string;
        gradedAt: string;
      }>>(`/persons/${id}/grades`);
      return response.data || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des notes de la personne ${id}:`, error);
      throw error;
    }
  }

  /**
   * Exporte les données d'une personne
   * GET /api/persons/{id}/export
   */
  async exportPersonData(id: string, format: 'json' | 'pdf' = 'json'): Promise<Blob> {
    try {
      const response = await fetch(`${apiClient['baseUrl']}/persons/${id}/export?format=${format}`, {
        method: 'GET',
        headers: apiClient['prepareHeaders'](),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error(`Erreur lors de l'export des données de la personne ${id}:`, error);
      throw error;
    }
  }

  /**
   * Recherche des personnes
   * GET /api/persons/search
   */
  async searchPersons(
    query: string,
    filters?: PersonFilters & { limit?: number }
  ): Promise<Person[]> {
    try {
      const params: Record<string, string | number | boolean> = { q: query };
      
      if (filters?.role) params.role = filters.role;
      if (filters?.hasPaid !== undefined) params.hasPaid = filters.hasPaid;
      if (filters?.country) params.country = filters.country;
      if (filters?.isActive !== undefined) params.isActive = filters.isActive;
      if (filters?.limit) params.limit = filters.limit;

      const response = await apiClient.get<Person[]>('/persons/search', params);
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la recherche de personnes:', error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques globales des personnes
   * GET /api/persons/stats
   */
  async getPersonsStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    newUsersThisMonth: number;
    usersByRole: Record<Role, number>;
    usersByCountry: Record<string, number>;
    averageGrade: number;
    completionRate: number;
  }> {
    try {
      const response = await apiClient.get<{
        totalUsers: number;
        activeUsers: number;
        newUsersThisMonth: number;
        usersByRole: Record<Role, number>;
        usersByCountry: Record<string, number>;
        averageGrade: number;
        completionRate: number;
      }>('/persons/stats');
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques des personnes:', error);
      throw error;
    }
  }
}

/**
 * Instance par défaut du service des personnes
 */
export const personService = new PersonService();

/**
 * Helper pour formater le rôle d'une personne
 */
export const formatPersonRole = (role: Role): string => {
  const roleMap: Record<Role, string> = {
    STUDENT: 'Étudiant',
    FORMATEUR: 'Formateur',
    ADMIN: 'Administrateur',
  };
  return roleMap[role] || role;
};

/**
 * Helper pour obtenir la couleur du rôle
 */
export const getPersonRoleColor = (role: Role): string => {
  const colorMap: Record<Role, string> = {
    STUDENT: 'blue',
    FORMATEUR: 'green',
    ADMIN: 'red',
  };
  return colorMap[role] || 'gray';
};

/**
 * Helper pour formater le nom complet d'une personne
 */
export const getPersonFullName = (person: Person): string => {
  return `${person.firstName} ${person.lastName}`.trim();
};

/**
 * Helper pour obtenir les initiales d'une personne
 */
export const getPersonInitials = (person: Person): string => {
  const firstInitial = person.firstName?.charAt(0).toUpperCase() || '';
  const lastInitial = person.lastName?.charAt(0).toUpperCase() || '';
  return `${firstInitial}${lastInitial}`;
};

/**
 * Helper pour vérifier si une personne est active
 */
export const isPersonActive = (person: Person): boolean => {
  // Considérer qu'une personne est active si elle s'est connectée dans les 30 derniers jours
  if (!person.lastLogin) return false;
  
  const lastLogin = new Date(person.lastLogin);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return lastLogin > thirtyDaysAgo;
};

/**
 * Helper pour formater la dernière connexion
 */
export const formatLastLogin = (lastLogin: string | null): string => {
  if (!lastLogin) return 'Jamais connecté';
  
  const date = new Date(lastLogin);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Aujourd\'hui';
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
  
  return date.toLocaleDateString('fr-FR');
};