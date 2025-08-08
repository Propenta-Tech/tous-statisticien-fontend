/**
 * Service pour la gestion des ressources
 * Tous Statisticien Academy
 */

import { apiClient } from './client';
import { Resource, CreateResourceRequest, UpdateResourceRequest, ResourceType } from '@/types';
import { ApiResponse, PaginatedResponse } from '@/types/api';

/**
 * Service pour les ressources
 */
export class ResourceService {
  /**
   * Récupère toutes les ressources
   * GET /api/resources/all
   */
  async getAllResources(): Promise<Resource[]> {
    try {
      const response = await apiClient.get<Resource[]>('/resources/all');
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des ressources:', error);
      throw error;
    }
  }

  /**
   * Récupère les ressources avec pagination
   * GET /api/resources
   */
  async getResources(
    page: number = 1,
    limit: number = 10,
    filters?: {
      search?: string;
      type?: ResourceType;
      status?: string;
      dateFrom?: string;
      dateTo?: string;
    }
  ): Promise<PaginatedResponse<Resource>> {
    try {
      const params: Record<string, string | number | boolean> = { page, limit };
      
      if (filters?.search) params.search = filters.search;
      if (filters?.type) params.type = filters.type;
      if (filters?.status) params.status = filters.status;
      if (filters?.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters?.dateTo) params.dateTo = filters.dateTo;

      return await apiClient.getPaginated<Resource>('/resources', page, limit, params);
    } catch (error) {
      console.error('Erreur lors de la récupération des ressources paginées:', error);
      throw error;
    }
  }

  /**
   * Récupère une ressource par ID
   * GET /api/resources/{id}
   */
  async getResourceById(id: string): Promise<Resource | null> {
    try {
      const response = await apiClient.get<Resource>(`/resources/${id}`);
      return response.data || null;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la ressource ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle ressource avec fichier
   * POST /api/resources/create
   */
  async createResourceWithFile(
    data: CreateResourceRequest,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<Resource> {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('type', data.type);
      formData.append('description', data.description || '');
      formData.append('file', file);

      if (data.tags) {
        formData.append('tags', JSON.stringify(data.tags));
      }

      if (data.isPublic !== undefined) {
        formData.append('isPublic', String(data.isPublic));
      }

      const response = await apiClient.uploadFile<Resource>('/resources/create', formData, {
        onProgress,
      });
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la création de la ressource:', error);
      throw error;
    }
  }

  /**
   * Met à jour une ressource avec fichier
   * PUT /api/resources/update/{id}
   */
  async updateResourceWithFile(
    id: string,
    data: UpdateResourceRequest,
    file?: File,
    onProgress?: (progress: number) => void
  ): Promise<Resource> {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('type', data.type);
      formData.append('description', data.description || '');

      if (file) {
        formData.append('file', file);
      }

      if (data.tags) {
        formData.append('tags', JSON.stringify(data.tags));
      }

      if (data.isPublic !== undefined) {
        formData.append('isPublic', String(data.isPublic));
      }

      const response = await apiClient.uploadFile<Resource>(`/resources/update/${id}`, formData, {
        onProgress,
      });
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la ressource ${id}:`, error);
      throw error;
    }
  }

  /**
   * Met à jour les informations d'une ressource sans fichier
   * PUT /api/resources/update-info/{id}
   */
  async updateResourceInfo(id: string, data: Partial<UpdateResourceRequest>): Promise<Resource> {
    try {
      const response = await apiClient.put<Resource>(`/resources/update-info/${id}`, data);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour des informations de la ressource ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprime une ressource
   * DELETE /api/resources/delete/{id}
   */
  async deleteResource(id: string): Promise<void> {
    try {
      await apiClient.delete(`/resources/delete/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la ressource ${id}:`, error);
      throw error;
    }
  }

  /**
   * Télécharge une ressource
   * GET /api/resources/{id}/download
   */
  async downloadResource(id: string): Promise<Blob> {
    try {
      const response = await fetch(`${apiClient['baseUrl']}/resources/${id}/download`, {
        method: 'GET',
        headers: apiClient['prepareHeaders'](),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error(`Erreur lors du téléchargement de la ressource ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère l'URL de téléchargement sécurisée
   * GET /api/resources/{id}/download-url
   */
  async getResourceDownloadUrl(id: string): Promise<{ url: string; expiresAt: string }> {
    try {
      const response = await apiClient.get<{ url: string; expiresAt: string }>(`/resources/${id}/download-url`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'URL de téléchargement pour la ressource ${id}:`, error);
      throw error;
    }
  }

  /**
   * Recherche des ressources
   * GET /api/resources/search
   */
  async searchResources(query: string, filters?: {
    type?: ResourceType;
    tags?: string[];
    isPublic?: boolean;
    limit?: number;
  }): Promise<Resource[]> {
    try {
      const params: Record<string, string | number | boolean> = { q: query };
      
      if (filters?.type) params.type = filters.type;
      if (filters?.isPublic !== undefined) params.isPublic = filters.isPublic;
      if (filters?.limit) params.limit = filters.limit;
      if (filters?.tags) params.tags = filters.tags.join(',');

      const response = await apiClient.get<Resource[]>('/resources/search', params);
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la recherche de ressources:', error);
      throw error;
    }
  }

  /**
   * Récupère les ressources par type
   * GET /api/resources/by-type/{type}
   */
  async getResourcesByType(type: ResourceType): Promise<Resource[]> {
    try {
      const response = await apiClient.get<Resource[]>(`/resources/by-type/${type}`);
      return response.data || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des ressources de type ${type}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les ressources populaires
   * GET /api/resources/popular
   */
  async getPopularResources(limit: number = 10): Promise<Resource[]> {
    try {
      const response = await apiClient.get<Resource[]>('/resources/popular', { limit });
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des ressources populaires:', error);
      throw error;
    }
  }

  /**
   * Récupère les ressources récentes
   * GET /api/resources/recent
   */
  async getRecentResources(limit: number = 10): Promise<Resource[]> {
    try {
      const response = await apiClient.get<Resource[]>('/resources/recent', { limit });
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des ressources récentes:', error);
      throw error;
    }
  }

  /**
   * Duplique une ressource
   * POST /api/resources/{id}/duplicate
   */
  async duplicateResource(id: string, newTitle: string): Promise<Resource> {
    try {
      const response = await apiClient.post<Resource>(`/resources/${id}/duplicate`, {
        title: newTitle,
      });
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la duplication de la ressource ${id}:`, error);
      throw error;
    }
  }

  /**
   * Ajoute une ressource aux favoris
   * POST /api/resources/{id}/favorite
   */
  async addToFavorites(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>(`/resources/${id}/favorite`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de l'ajout de la ressource ${id} aux favoris:`, error);
      throw error;
    }
  }

  /**
   * Supprime une ressource des favoris
   * DELETE /api/resources/{id}/favorite
   */
  async removeFromFavorites(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.delete<{ message: string }>(`/resources/${id}/favorite`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la ressource ${id} des favoris:`, error);
      throw error;
    }
  }

  /**
   * Récupère les ressources favorites de l'utilisateur
   * GET /api/resources/favorites
   */
  async getFavoriteResources(): Promise<Resource[]> {
    try {
      const response = await apiClient.get<Resource[]>('/resources/favorites');
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des ressources favorites:', error);
      throw error;
    }
  }

  /**
   * Note une ressource
   * POST /api/resources/{id}/rate
   */
  async rateResource(id: string, rating: number, comment?: string): Promise<{
    averageRating: number;
    totalRatings: number;
    userRating: number;
  }> {
    try {
      const response = await apiClient.post<{
        averageRating: number;
        totalRatings: number;
        userRating: number;
      }>(`/resources/${id}/rate`, { rating, comment });
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la notation de la ressource ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les évaluations d'une ressource
   * GET /api/resources/{id}/ratings
   */
  async getResourceRatings(id: string): Promise<{
    averageRating: number;
    totalRatings: number;
    ratings: Array<{
      id: string;
      rating: number;
      comment?: string;
      userName: string;
      createdAt: string;
    }>;
  }> {
    try {
      const response = await apiClient.get<{
        averageRating: number;
        totalRatings: number;
        ratings: Array<{
          id: string;
          rating: number;
          comment?: string;
          userName: string;
          createdAt: string;
        }>;
      }>(`/resources/${id}/ratings`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la récupération des évaluations de la ressource ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques d'une ressource
   * GET /api/resources/{id}/stats
   */
  async getResourceStats(id: string): Promise<{
    totalViews: number;
    totalDownloads: number;
    averageRating: number;
    totalRatings: number;
    totalFavorites: number;
    viewsThisMonth: number;
    downloadsThisMonth: number;
  }> {
    try {
      const response = await apiClient.get<{
        totalViews: number;
        totalDownloads: number;
        averageRating: number;
        totalRatings: number;
        totalFavorites: number;
        viewsThisMonth: number;
        downloadsThisMonth: number;
      }>(`/resources/${id}/stats`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la récupération des statistiques de la ressource ${id}:`, error);
      throw error;
    }
  }

  /**
   * Enregistre une vue de ressource
   * POST /api/resources/{id}/view
   */
  async recordResourceView(id: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>(`/resources/${id}/view`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de l'enregistrement de la vue pour la ressource ${id}:`, error);
      throw error;
    }
  }

  /**
   * Publie ou dépublie une ressource
   * PUT /api/resources/{id}/publish
   */
  async toggleResourcePublish(id: string, isPublic: boolean): Promise<Resource> {
    try {
      const response = await apiClient.put<Resource>(`/resources/${id}/publish`, { isPublic });
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la publication/dépublication de la ressource ${id}:`, error);
      throw error;
    }
  }
}

/**
 * Instance par défaut du service des ressources
 */
export const resourceService = new ResourceService();
/**
 * Helper pour formater le type de ressource
 */
export const formatResourceType = (type: ResourceType): string => {
  const typeMap: Record<ResourceType, string> = {
    DOCUMENT: 'Document',
    VIDEO: 'Vidéo',
    AUDIO: 'Audio',
    IMAGE: 'Image',
    ARCHIVE: 'Archive',
    LINK: 'Lien',
    PDF: 'PDF',        // ← Ajouter cette ligne
    OTHER: 'Autre',
  };
  return typeMap[type] || type;
};

/**
 * Helper pour obtenir l'icône du type de ressource
 */
export const getResourceTypeIcon = (type: ResourceType): string => {
  const iconMap: Record<ResourceType, string> = {
    DOCUMENT: 'file-text',
    VIDEO: 'video',
    AUDIO: 'volume-2',
    IMAGE: 'image',
    ARCHIVE: 'archive',
    LINK: 'link',
    PDF: 'file-text',  // ← Ajouter cette ligne (même icône que DOCUMENT)
    OTHER: 'file',
  };
  return iconMap[type] || 'file';
};

/**
 * Helper pour obtenir la couleur du type de ressource
 */
export const getResourceTypeColor = (type: ResourceType): string => {
  const colorMap: Record<ResourceType, string> = {
    DOCUMENT: 'blue',
    VIDEO: 'red',
    AUDIO: 'green',
    IMAGE: 'purple',
    ARCHIVE: 'orange',
    LINK: 'cyan',
    PDF: 'red',        // ← Ajouter cette ligne (couleur distincte pour PDF)
    OTHER: 'gray',
  };
  return colorMap[type] || 'gray';
};
/**
 * Helper pour formater la taille d'un fichier
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Helper pour vérifier si une ressource est accessible
 */
export const isResourceAccessible = (resource: Resource, userHasPaid: boolean): boolean => {
  return resource.isPublic || userHasPaid;
};

/**
 * Helper pour obtenir l'extension d'un fichier
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Helper pour vérifier si un fichier est une image
 */
export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
  const extension = getFileExtension(filename);
  return imageExtensions.includes(extension);
};