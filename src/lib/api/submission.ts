/**
 * Service pour la gestion des soumissions
 * Tous Statisticien Academy
 */

import { apiClient } from './client';
import { Submission, CreateSubmissionRequest, UpdateSubmissionRequest } from '@/types';
import { ApiResponse, PaginatedResponse } from '@/types/api';

/**
 * Interface pour les détails de correction
 */
interface GradingDetails {
  score: number;
  maxScore: number;
  feedback: string;
  rubric?: Array<{
    criteria: string;
    score: number;
    maxScore: number;
    feedback: string;
  }>;
}

/**
 * Service pour les soumissions
 */
export class SubmissionService {
  /**
   * Récupère toutes les soumissions
   * GET /api/submissions/all
   */
  async getAllSubmissions(): Promise<Submission[]> {
    try {
      const response = await apiClient.get<Submission[]>('/submissions/all');
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des soumissions:', error);
      throw error;
    }
  }

  /**
   * Récupère les soumissions avec pagination
   * GET /api/submissions
   */
  async getSubmissions(
    page: number = 1,
    limit: number = 10,
    filters?: {
      evaluationId?: string;
      studentId?: string;
      status?: 'pending' | 'graded' | 'returned';
      dateFrom?: string;
      dateTo?: string;
    }
  ): Promise<PaginatedResponse<Submission>> {
    try {
      const params: Record<string, string | number | boolean> = { page, limit };
      
      if (filters?.evaluationId) params.evaluationId = filters.evaluationId;
      if (filters?.studentId) params.studentId = filters.studentId;
      if (filters?.status) params.status = filters.status;
      if (filters?.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters?.dateTo) params.dateTo = filters.dateTo;

      return await apiClient.getPaginated<Submission>('/submissions', page, limit, params);
    } catch (error) {
      console.error('Erreur lors de la récupération des soumissions paginées:', error);
      throw error;
    }
  }

  /**
   * Récupère une soumission par ID
   * GET /api/submissions/{id}
   */
  async getSubmissionById(id: string): Promise<Submission | null> {
    try {
      const response = await apiClient.get<Submission>(`/submissions/${id}`);
      return response.data || null;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la soumission ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les soumissions d'une évaluation
   * GET /api/submissions/evaluation/{evaluationId}
   */
  async getSubmissionsByEvaluationId(evaluationId: string): Promise<Submission[]> {
    try {
      const response = await apiClient.get<Submission[]>(`/submissions/evaluation/${evaluationId}`);
      return response.data || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des soumissions de l'évaluation ${evaluationId}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les soumissions d'un étudiant
   * GET /api/submissions/student/{studentId}
   */
  async getSubmissionsByStudentId(studentId: string): Promise<Submission[]> {
    try {
      const response = await apiClient.get<Submission[]>(`/submissions/student/${studentId}`);
      return response.data || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des soumissions de l'étudiant ${studentId}:`, error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle soumission
   * POST /api/submissions/create
   */
  async createSubmission(
    data: CreateSubmissionRequest,
    files?: FileList,
    onProgress?: (progress: number) => void
  ): Promise<Submission> {
    try {
      const formData = new FormData();
      formData.append('evaluationId', data.evaluationId);
      formData.append('personId', data.personId);
      
      if (data.textResponse) {
        formData.append('textResponse', data.textResponse);
      }

      if (files && files.length > 0) {
        Array.from(files).forEach((file, index) => {
          formData.append(`file_${index}`, file);
        });
      }

      const response = await apiClient.uploadFile<Submission>('/submissions/create', formData, {
        onProgress,
      });
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la création de la soumission:', error);
      throw error;
    }
  }

  /**
   * Met à jour une soumission
   * PUT /api/submissions/update/{id}
   */
  async updateSubmission(
    id: string,
    data: UpdateSubmissionRequest,
    files?: FileList,
    onProgress?: (progress: number) => void
  ): Promise<Submission> {
    try {
      const formData = new FormData();
      
      if (data.textResponse) {
        formData.append('textResponse', data.textResponse);
      }

      if (files && files.length > 0) {
        Array.from(files).forEach((file, index) => {
          formData.append(`file_${index}`, file);
        });
      }

      const response = await apiClient.uploadFile<Submission>(`/submissions/update/${id}`, formData, {
        onProgress,
      });
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la soumission ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprime une soumission
   * DELETE /api/submissions/delete/{id}
   */
  async deleteSubmission(id: string): Promise<void> {
    try {
      await apiClient.delete(`/submissions/delete/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la soumission ${id}:`, error);
      throw error;
    }
  }

  /**
   * Note une soumission
   * PUT /api/submissions/{id}/grade
   */
  async gradeSubmission(id: string, gradingData: GradingDetails): Promise<Submission> {
    try {
      const response = await apiClient.put<Submission>(`/submissions/${id}/grade`, gradingData);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la notation de la soumission ${id}:`, error);
      throw error;
    }
  }

  /**
   * Retourne une soumission à l'étudiant pour révision
   * PUT /api/submissions/{id}/return
   */
  async returnSubmission(id: string, feedback: string): Promise<Submission> {
    try {
      const response = await apiClient.put<Submission>(`/submissions/${id}/return`, { feedback });
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors du retour de la soumission ${id}:`, error);
      throw error;
    }
  }

  /**
   * Télécharge les fichiers d'une soumission
   * GET /api/submissions/{id}/download
   */
  async downloadSubmissionFiles(id: string): Promise<Blob> {
    try {
      const response = await fetch(`${apiClient['baseUrl']}/submissions/${id}/download`, {
        method: 'GET',
        headers: apiClient['prepareHeaders'](),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error(`Erreur lors du téléchargement des fichiers de la soumission ${id}:`, error);
      throw error;
    }
  }

  /**
   * Vérifie le plagiat d'une soumission
   * POST /api/submissions/{id}/check-plagiarism
   */
  async checkPlagiarism(id: string): Promise<{
    plagiarismScore: number;
    matches: Array<{
      source: string;
      similarity: number;
      matchedText: string;
    }>;
    report: string;
  }> {
    try {
      const response = await apiClient.post<{
        plagiarismScore: number;
        matches: Array<{
          source: string;
          similarity: number;
          matchedText: string;
        }>;
        report: string;
      }>(`/submissions/${id}/check-plagiarism`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la vérification du plagiat pour la soumission ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère l'historique des versions d'une soumission
   * GET /api/submissions/{id}/versions
   */
  async getSubmissionVersions(id: string): Promise<Array<{
    version: number;
    submittedAt: string;
    fileUrl?: string;
    textResponse?: string;
    changes: string;
  }>> {
    try {
      const response = await apiClient.get<Array<{
        version: number;
        submittedAt: string;
        fileUrl?: string;
        textResponse?: string;
        changes: string;
      }>>(`/submissions/${id}/versions`);
      return response.data || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des versions de la soumission ${id}:`, error);
      throw error;
    }
  }

  /**
   * Ajoute un commentaire à une soumission
   * POST /api/submissions/{id}/comments
   */
  async addComment(id: string, comment: string, isPrivate: boolean = false): Promise<{
    id: string;
    comment: string;
    authorName: string;
    createdAt: string;
    isPrivate: boolean;
  }> {
    try {
      const response = await apiClient.post<{
        id: string;
        comment: string;
        authorName: string;
        createdAt: string;
        isPrivate: boolean;
      }>(`/submissions/${id}/comments`, { comment, isPrivate });
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de l'ajout d'un commentaire à la soumission ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les commentaires d'une soumission
   * GET /api/submissions/{id}/comments
   */
  async getComments(id: string): Promise<Array<{
    id: string;
    comment: string;
    authorName: string;
    createdAt: string;
    isPrivate: boolean;
  }>> {
    try {
      const response = await apiClient.get<Array<{
        id: string;
        comment: string;
        authorName: string;
        createdAt: string;
        isPrivate: boolean;
      }>>(`/submissions/${id}/comments`);
      return response.data || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des commentaires de la soumission ${id}:`, error);
      throw error;
    }
  }

  /**
   * Effectue une notation en lot
   * POST /api/submissions/bulk-grade
   */
  async bulkGradeSubmissions(grades: Array<{
    submissionId: string;
    score: number;
    feedback?: string;
  }>): Promise<{ message: string; processedCount: number }> {
    try {
      const response = await apiClient.post<{ message: string; processedCount: number }>('/submissions/bulk-grade', {
        grades,
      });
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la notation en lot:', error);
      throw error;
    }
  }

  /**
   * Exporte les soumissions d'une évaluation
   * GET /api/submissions/evaluation/{evaluationId}/export
   */
  async exportSubmissions(evaluationId: string, format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
    try {
      const response = await fetch(`${apiClient['baseUrl']}/submissions/evaluation/${evaluationId}/export?format=${format}`, {
        method: 'GET',
        headers: apiClient['prepareHeaders'](),
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error(`Erreur lors de l'export des soumissions de l'évaluation ${evaluationId}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques des soumissions d'une évaluation
   * GET /api/submissions/evaluation/{evaluationId}/stats
   */
  async getSubmissionStats(evaluationId: string): Promise<{
    totalSubmissions: number;
    gradedSubmissions: number;
    pendingSubmissions: number;
    averageScore: number;
    averageGradingTime: number;
    submissionTrend: Array<{
      date: string;
      count: number;
    }>;
  }> {
    try {
      const response = await apiClient.get<{
        totalSubmissions: number;
        gradedSubmissions: number;
        pendingSubmissions: number;
        averageScore: number;
        averageGradingTime: number;
        submissionTrend: Array<{
          date: string;
          count: number;
        }>;
      }>(`/submissions/evaluation/${evaluationId}/stats`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la récupération des statistiques des soumissions:`, error);
      throw error;
    }
  }

  /**
   * Assigne une soumission à un correcteur
   * PUT /api/submissions/{id}/assign
   */
  async assignSubmission(id: string, graderId: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.put<{ message: string }>(`/submissions/${id}/assign`, { graderId });
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de l'assignation de la soumission ${id}:`, error);
      throw error;
    }
  }
}

/**
 * Instance par défaut du service des soumissions
 */
export const submissionService = new SubmissionService();

/**
 * Helper pour formater le statut d'une soumission
 */
export const formatSubmissionStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': 'En attente',
    'graded': 'Notée',
    'returned': 'Retournée',
    'late': 'En retard',
    'draft': 'Brouillon',
  };
  return statusMap[status] || status;
};

/**
 * Helper pour obtenir la couleur du statut
 */
export const getSubmissionStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'pending': 'yellow',
    'graded': 'green',
    'returned': 'blue',
    'late': 'red',
    'draft': 'gray',
  };
  return colorMap[status] || 'gray';
};

/**
 * Helper pour calculer le score en pourcentage
 */
export const calculateSubmissionPercentage = (score: number, maxScore: number): number => {
  if (maxScore === 0) return 0;
  return Math.round((score / maxScore) * 100);
};

/**
 * Helper pour obtenir la note littérale
 */
export const getLetterGrade = (percentage: number): string => {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

/**
 * Helper pour vérifier si une soumission est en retard
 */
export const isSubmissionLate = (submittedAt: string, dueDate: string): boolean => {
  const submitDate = new Date(submittedAt);
  const due = new Date(dueDate);
  return submitDate > due;
};

/**
 * Helper pour calculer le temps de retard
 */
export const calculateLateness = (submittedAt: string, dueDate: string): number => {
  const submitDate = new Date(submittedAt).getTime();
  const due = new Date(dueDate).getTime();
  return Math.max(0, submitDate - due);
};

/**
 * Helper pour formater le temps de retard
 */
export const formatLateness = (milliseconds: number): string => {
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
  const hours = Math.floor((milliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}j ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};