/**
 * Service pour la gestion des évaluations
 * Tous Statisticien Academy
 */

import { apiClient } from './client';
import { Evaluation, CreateEvaluationRequest, UpdateEvaluationRequest, EvaluationType } from '@/types';
import { ApiResponse, PaginatedResponse } from '@/types/api';

/**
 * Interface pour les réponses d'évaluation
 */
interface EvaluationResponse {
  id: string;
  answers: Record<string, unknown>;
  files?: File[];
  submittedAt: string;
}

/**
 * Service pour les évaluations
 */
export class EvaluationService {
  /**
   * Récupère toutes les évaluations
   * GET /api/evaluations/all
   */
  async getAllEvaluations(): Promise<Evaluation[]> {
    try {
      const response = await apiClient.get<Evaluation[]>('/evaluations/all');
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des évaluations:', error);
      throw error;
    }
  }

  /**
   * Récupère les évaluations avec pagination
   * GET /api/evaluations
   */
  async getEvaluations(
    page: number = 1,
    limit: number = 10,
    filters?: {
      search?: string;
      moduleId?: string;
      type?: EvaluationType;
      status?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<PaginatedResponse<Evaluation>> {
    try {
      const params: Record<string, string | number | boolean> = { page, limit };
      
      if (filters?.search) params.search = filters.search;
      if (filters?.moduleId) params.moduleId = filters.moduleId;
      if (filters?.type) params.type = filters.type;
      if (filters?.status) params.status = filters.status;
      if (filters?.startDate) params.startDate = filters.startDate;
      if (filters?.endDate) params.endDate = filters.endDate;

      return await apiClient.getPaginated<Evaluation>('/evaluations', page, limit, params);
    } catch (error) {
      console.error('Erreur lors de la récupération des évaluations paginées:', error);
      throw error;
    }
  }

  /**
   * Récupère une évaluation par ID
   * GET /api/evaluations/{id}
   */
  async getEvaluationById(id: string): Promise<Evaluation | null> {
    try {
      const response = await apiClient.get<Evaluation>(`/evaluations/${id}`);
      return response.data || null;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'évaluation ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les évaluations d'un module
   * GET /api/evaluations/module/{moduleId}
   */
  async getEvaluationsByModuleId(moduleId: string): Promise<Evaluation[]> {
    try {
      const response = await apiClient.get<Evaluation[]>(`/evaluations/module/${moduleId}`);
      return response.data || [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des évaluations du module ${moduleId}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les évaluations disponibles pour un étudiant
   * GET /api/evaluations/student/available
   */
  async getAvailableEvaluations(studentId?: string): Promise<Evaluation[]> {
    try {
      const params = studentId ? { studentId } : {};
      const response = await apiClient.get<Evaluation[]>('/evaluations/student/available');
      return response.data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des évaluations disponibles:', error);
      throw error;
    }
  }

  /**
   * Crée une nouvelle évaluation
   * POST /api/evaluations/create
   */
  async createEvaluation(data: CreateEvaluationRequest): Promise<Evaluation> {
    try {
      const response = await apiClient.post<Evaluation>('/evaluations/create', data);
      return response.data!;
    } catch (error) {
      console.error('Erreur lors de la création de l\'évaluation:', error);
      throw error;
    }
  }

  /**
   * Met à jour une évaluation
   * PUT /api/evaluations/update/{id}
   */
  async updateEvaluation(id: string, data: UpdateEvaluationRequest): Promise<Evaluation> {
    try {
      const response = await apiClient.put<Evaluation>(`/evaluations/update/${id}`, data);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'évaluation ${id}:`, error);
      throw error;
    }
  }

  /**
   * Supprime une évaluation
   * DELETE /api/evaluations/delete/{id}
   */
  async deleteEvaluation(id: string): Promise<void> {
    try {
      await apiClient.delete(`/evaluations/delete/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'évaluation ${id}:`, error);
      throw error;
    }
  }

  /**
   * Démarre une session d'évaluation
   * POST /api/evaluations/{id}/start
   */
  async startEvaluation(id: string): Promise<{
    sessionId: string;
    startedAt: string;
    timeLimit: number;
    questions: Array<{
      id: string;
      question: string;
      type: string;
      options?: string[];
      required: boolean;
    }>;
  }> {
    try {
      const response = await apiClient.post<{
        sessionId: string;
        startedAt: string;
        timeLimit: number;
        questions: Array<{
          id: string;
          question: string;
          type: string;
          options?: string[];
          required: boolean;
        }>;
      }>(`/evaluations/${id}/start`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors du démarrage de l'évaluation ${id}:`, error);
      throw error;
    }
  }

  /**
   * Sauvegarde une réponse temporaire
   * POST /api/evaluations/{id}/save-draft
   */
  async saveDraftResponse(
    id: string,
    sessionId: string,
    questionId: string,
    answer: unknown
  ): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>(`/evaluations/${id}/save-draft`, {
        sessionId,
        questionId,
        answer,
      });
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde du brouillon pour l'évaluation ${id}:`, error);
      throw error;
    }
  }

  /**
   * Soumet une évaluation
   * POST /api/evaluations/{id}/submit
   */
  async submitEvaluation(
    id: string,
    sessionId: string,
    answers: Record<string, unknown>,
    files?: FileList
  ): Promise<{
    submissionId: string;
    submittedAt: string;
    message: string;
  }> {
    try {
      const formData = new FormData();
      formData.append('sessionId', sessionId);
      formData.append('answers', JSON.stringify(answers));

      if (files) {
        Array.from(files).forEach((file, index) => {
          formData.append(`file_${index}`, file);
        });
      }

      const response = await apiClient.uploadFile<{
        submissionId: string;
        submittedAt: string;
        message: string;
      }>(`/evaluations/${id}/submit`, formData);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la soumission de l'évaluation ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les réponses sauvegardées d'une évaluation
   * GET /api/evaluations/{id}/draft/{sessionId}
   */
  async getDraftResponses(id: string, sessionId: string): Promise<Record<string, unknown>> {
    try {
      const response = await apiClient.get<Record<string, unknown>>(`/evaluations/${id}/draft/${sessionId}`);
      return response.data || {};
    } catch (error) {
      console.error(`Erreur lors de la récupération du brouillon de l'évaluation ${id}:`, error);
      throw error;
    }
  }

  /**
   * Vérifie le statut d'une session d'évaluation
   * GET /api/evaluations/{id}/session/{sessionId}/status
   */
  async getEvaluationSessionStatus(id: string, sessionId: string): Promise<{
    status: 'active' | 'expired' | 'submitted';
    timeRemaining: number;
    startedAt: string;
    lastActivity: string;
  }> {
    try {
      const response = await apiClient.get<{
        status: 'active' | 'expired' | 'submitted';
        timeRemaining: number;
        startedAt: string;
        lastActivity: string;
      }>(`/evaluations/${id}/session/${sessionId}/status`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la vérification du statut de la session ${sessionId}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les résultats d'une évaluation pour un étudiant
   * GET /api/evaluations/{id}/results
   */
  async getEvaluationResults(id: string, studentId?: string): Promise<{
    score: number;
    maxScore: number;
    percentage: number;
    grade: string;
    feedback: string;
    submittedAt: string;
    correctedAt?: string;
    details: Array<{
      questionId: string;
      question: string;
      answer: unknown;
      correctAnswer?: unknown;
      score: number;
      maxScore: number;
      feedback?: string;
    }>;
  }> {
    try {
      const params = studentId ? { studentId } : {};
      const response = await apiClient.get<{
        score: number;
        maxScore: number;
        percentage: number;
        grade: string;
        feedback: string;
        submittedAt: string;
        correctedAt?: string;
        details: Array<{
          questionId: string;
          question: string;
          answer: unknown;
          correctAnswer?: unknown;
          score: number;
          maxScore: number;
          feedback?: string;
        }>;
      }>(`/evaluations/${id}/results`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la récupération des résultats de l'évaluation ${id}:`, error);
      throw error;
    }
  }

  /**
   * Récupère les statistiques d'une évaluation
   * GET /api/evaluations/{id}/stats
   */
  async getEvaluationStats(id: string): Promise<{
    totalSubmissions: number;
    averageScore: number;
    averageTime: number;
    passRate: number;
    distribution: Record<string, number>;
    topPerformers: Array<{
      studentId: string;
      studentName: string;
      score: number;
      percentage: number;
    }>;
  }> {
    try {
      const response = await apiClient.get<{
        totalSubmissions: number;
        averageScore: number;
        averageTime: number;
        passRate: number;
        distribution: Record<string, number>;
        topPerformers: Array<{
          studentId: string;
          studentName: string;
          score: number;
          percentage: number;
        }>;
      }>(`/evaluations/${id}/stats`);
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la récupération des statistiques de l'évaluation ${id}:`, error);
      throw error;
    }
  }

  /**
   * Duplique une évaluation
   * POST /api/evaluations/{id}/duplicate
   */
  async duplicateEvaluation(id: string, newTitle: string, targetModuleId?: string): Promise<Evaluation> {
    try {
      const response = await apiClient.post<Evaluation>(`/evaluations/${id}/duplicate`, {
        title: newTitle,
        targetModuleId,
      });
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la duplication de l'évaluation ${id}:`, error);
      throw error;
    }
  }

  /**
   * Publie ou dépublie une évaluation
   * PUT /api/evaluations/{id}/publish
   */
  async toggleEvaluationPublish(id: string, published: boolean): Promise<Evaluation> {
    try {
      const response = await apiClient.put<Evaluation>(`/evaluations/${id}/publish`, { published });
      return response.data!;
    } catch (error) {
      console.error(`Erreur lors de la publication/dépublication de l'évaluation ${id}:`, error);
      throw error;
    }
  }
}

/**
 * Instance par défaut du service des évaluations
 */
export const evaluationService = new EvaluationService();

/**
 * Helper pour formater le type d'évaluation
 */
export const formatEvaluationType = (type: EvaluationType): string => {
  const typeMap: Partial<Record<EvaluationType, string>> = {
    QUIZ: 'Quiz',
    EXAM: 'Examen',
    ASSIGNMENT: 'Devoir',
    PROJECT: 'Projet',
    SURVEY: 'Sondage',
    PRESENTATION: 'Présentation',
  };
  return typeMap[type] || type;
};

/**
 * Helper pour calculer le temps restant
 */
export const calculateTimeRemaining = (startedAt: string, timeLimit: number): number => {
  const startTime = new Date(startedAt).getTime();
  const currentTime = Date.now();
  const elapsedTime = Math.floor((currentTime - startTime) / 1000);
  return Math.max(0, timeLimit - elapsedTime);
};

/**
 * Helper pour formater le temps restant
 */
export const formatTimeRemaining = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
};

/**
 * Helper pour obtenir la couleur du score
 */
export const getScoreColor = (percentage: number): string => {
  if (percentage >= 90) return 'green';
  if (percentage >= 80) return 'blue';
  if (percentage >= 70) return 'yellow';
  if (percentage >= 60) return 'orange';
  return 'red';
};

/**
 * Helper pour vérifier si une évaluation est disponible
 */
export const isEvaluationAvailable = (evaluation: Evaluation): boolean => {
  const now = new Date();
  const startDate = new Date(evaluation.startDate);
  const endDate = new Date(evaluation.endDate);
  
  return now >= startDate && now <= endDate;
};